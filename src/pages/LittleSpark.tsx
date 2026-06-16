import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PillSelector } from '../components/PillSelector'
import { TextArea } from '../components/TextArea'
import { useToast } from '../hooks/useToast'
import { sendMessages, sparkMessages } from '../constants/messages'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { createSparkLog } from '../services/sparkService'
import type { EnergySource } from '../types/app'

type LittleSparkProps = {
  awardEnergy: (source: EnergySource) => { awarded: boolean; message: string }
}

export function LittleSpark({ awardEnergy }: LittleSparkProps) {
  const { showToast } = useToast()
  const [sparkStatus, setSparkStatus] = useLocalStorage('station_spark_status', '')
  const [quickType, setQuickType] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [note, setNote] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleStatus(nextStatus: string) {
    setSparkStatus(nextStatus)
    showToast(awardEnergy('spark').message)
  }

  function handleQuick(nextType: string) {
    setQuickType(nextType)
    setGeneratedText(sparkMessages.quickReplies[nextType])
  }

  async function handleSend() {
    if (!sparkStatus && !generatedText && !note.trim()) {
      showToast(sendMessages.missing)
      setConfirmOpen(false)
      return
    }

    const result = await createSparkLog({
      fireStatus: sparkStatus,
      actionType: quickType,
      generatedText,
      note,
    })
    showToast(result.ok ? '已经发给垚总啦，今天可以慢慢收尾。' : sendMessages.fail)
    setConfirmOpen(false)
  }

  return (
    <>
      <Card title="小火花儿" copy="视频可以续火花，顺便也可以续一点点今天的能量。">
        <p className="hint">今晚火花状态</p>
        <PillSelector options={sparkMessages.statuses} value={sparkStatus} onChange={handleStatus} />
        {sparkStatus ? <div className="result-box">{sparkMessages.statusReplies[sparkStatus]}</div> : null}
      </Card>

      <Card title="顺手补一句">
        <PillSelector options={sparkMessages.quickTypes} value={quickType} onChange={handleQuick} />
        {generatedText ? <div className="result-box">{generatedText}</div> : null}
        <div className="mt-4">
          <TextArea value={note} placeholder="也可以自己补一句，想写就写。" onChange={(event) => setNote(event.target.value)} />
        </div>
        <p className="hint">{sparkMessages.sendHint}</p>
        <div className="button-row">
          <Button onClick={() => setConfirmOpen(true)}>发送给垚总</Button>
        </div>
      </Card>

      <ConfirmDialog open={confirmOpen} onConfirm={handleSend} onCancel={() => setConfirmOpen(false)} />
    </>
  )
}
