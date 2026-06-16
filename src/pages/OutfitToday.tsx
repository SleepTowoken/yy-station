import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PillSelector } from '../components/PillSelector'
import { TextArea } from '../components/TextArea'
import { useToast } from '../hooks/useToast'
import { outfitMessages, sendMessages } from '../constants/messages'
import { createOutfitLog } from '../services/outfitService'
import { uploadOutfitImage } from '../services/storageService'
import type { EnergySource } from '../types/app'

type OutfitTodayProps = {
  awardEnergy: (source: EnergySource) => { awarded: boolean; message: string }
}

const randomFrom = (items: string[]) => items[Math.floor(Math.random() * items.length)]

export function OutfitToday({ awardEnergy }: OutfitTodayProps) {
  const { showToast } = useToast()
  const [style, setStyle] = useState(outfitMessages.styles[0])
  const [mode, setMode] = useState(outfitMessages.modes[0])
  const [comment, setComment] = useState('')
  const [note, setNote] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [sendFeedback, setSendFeedback] = useState('')
  const sendLockRef = useRef(false)

  const imagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ''), [imageFile])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  function handleGenerate() {
    setComment(randomFrom(outfitMessages.comments))
    setSendFeedback('')
    showToast(awardEnergy('outfit').message)
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setImageFile(null)
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type)) {
      showToast('这张图片格式暂时不支持，换 jpg、png、webp 或手机照片试试。')
      event.target.value = ''
      setImageFile(null)
      return
    }

    setImageFile(file)
    setSendFeedback(`已选择图片：${file.name}`)
  }

  function clearImage() {
    setImageFile(null)
    setSendFeedback('已移除图片。')
  }

  async function handleSend() {
    if (sendLockRef.current) {
      return
    }

    if (!comment) {
      setSendFeedback(sendMessages.missing)
      showToast(sendMessages.missing)
      setConfirmOpen(false)
      return
    }

    sendLockRef.current = true
    setSending(true)
    setSendFeedback(imageFile ? '正在上传图片...' : '正在发送文字记录...')

    try {
      let imagePath: string | null = null

      if (imageFile) {
        const uploadResult = await uploadOutfitImage(imageFile)
        if (!uploadResult.ok || !uploadResult.path) {
          const message = uploadResult.error ?? '图片好像没发出去，换一张或者稍后再试试？'
          setSendFeedback(message)
          showToast(message)
          setConfirmOpen(false)
          return
        }
        imagePath = uploadResult.path
        setSendFeedback('图片已上传，正在提交记录...')
      }

      const result = await createOutfitLog({
        style,
        mode,
        generatedComment: comment,
        userNote: note,
        imagePath,
      })

      const message = result.ok ? '已经发给垚总啦，后台刷新后可以看到。' : sendMessages.fail
      setSendFeedback(message)
      showToast(message)
      if (result.ok) {
        setImageFile(null)
        setNote('')
      }
    } catch (error) {
      console.error('Failed to send outfit log:', error)
      const message = '好像没发出去，再试一下？'
      setSendFeedback(message)
      showToast(message)
    } finally {
      setConfirmOpen(false)
      setSending(false)
      sendLockRef.current = false
    }
  }

  function openConfirm() {
    if (!comment) {
      setSendFeedback(sendMessages.missing)
      showToast(sendMessages.missing)
      return
    }

    setConfirmOpen(true)
  }

  return (
    <>
      <Card title="今日穿搭营业中" copy="不一定要发照片，先自己玩一下也行。">
        <p className="hint">今天是什么风格</p>
        <PillSelector options={outfitMessages.styles} value={style} onChange={setStyle} />

        <p className="hint mt-4">今日点评模式</p>
        <PillSelector options={outfitMessages.modes} value={mode} onChange={setMode} />

        <div className="button-row">
          <Button onClick={handleGenerate}>生成今日营业反馈</Button>
        </div>
        {comment ? (
          <div className="result-box whitespace-pre-line">
            <strong>{style} · {mode}</strong>
            {'\n'}
            {comment}
          </div>
        ) : null}
      </Card>

      <Card title="发给垚总看看">
        <div className="image-picker">
          <label className="image-picker-control">
            <input accept="image/*" type="file" onChange={handleImageChange} />
            <span>{imageFile ? '换一张穿搭图' : '选一张穿搭图'}</span>
          </label>
          {imagePreview ? (
            <div className="outfit-preview">
              <img alt="已选择的穿搭预览" src={imagePreview} />
              <button type="button" onClick={clearImage}>
                移除
              </button>
            </div>
          ) : (
            <div className="result-box">图片只会在你点击发送后上传到私有空间，后台临时查看，不公开展示。</div>
          )}
        </div>
        <div className="mt-4">
          <TextArea value={note} placeholder="比如：帽子搭不搭 / 这套会不会太普通 / 今天这个风格咋样" onChange={(event) => setNote(event.target.value)} />
        </div>
        <p className="hint">{outfitMessages.sendHint}</p>
        <div className="button-row">
          <Button disabled={sending} onClick={openConfirm}>
            {sending ? '发送中...' : '发给垚总看看'}
          </Button>
        </div>
        {sendFeedback ? <p className="send-feedback">{sendFeedback}</p> : null}
      </Card>

      <ConfirmDialog
        body={imageFile ? '会把这张图片和文字一起发给垚总。图片存放在私有空间，后台只生成临时查看链接。' : undefined}
        open={confirmOpen}
        onConfirm={handleSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
