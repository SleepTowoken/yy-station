import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PillSelector } from '../components/PillSelector'
import { TextArea } from '../components/TextArea'
import { useToast } from '../hooks/useToast'
import { rhythmMessages, sendMessages } from '../constants/messages'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { createRhythmLog } from '../services/rhythmService'
import type { EnergySource } from '../types/app'

type OwnRhythmProps = {
  awardEnergy: (source: EnergySource) => { awarded: boolean; message: string }
}

const randomFrom = (items: string[]) => items[Math.floor(Math.random() * items.length)]

export function OwnRhythm({ awardEnergy }: OwnRhythmProps) {
  const { showToast } = useToast()
  const [status, setStatus] = useState('')
  const [reminder, setReminder] = useState(randomFrom(rhythmMessages.reminders))
  const [restStatus, setRestStatus] = useState('')
  const [note, setNote] = useLocalStorage('station_rhythm_notes', '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleReminder() {
    setReminder(randomFrom(rhythmMessages.reminders))
    showToast(awardEnergy('rhythm').message)
  }

  function handleRest(nextStatus: string) {
    setRestStatus(nextStatus)
    showToast(awardEnergy('rhythm').message)
  }

  async function handleSend() {
    if (!note.trim() && !status && !restStatus) {
      showToast(sendMessages.missing)
      setConfirmOpen(false)
      return
    }

    const result = await createRhythmLog({
      currentStatus: status,
      softReminder: reminder,
      restStatus,
      note,
    })
    showToast(result.ok ? '已经告诉垚总啦，不用多解释。' : sendMessages.fail)
    setConfirmOpen(false)
  }

  return (
    <>
      <Card title="自己的节奏" copy={rhythmMessages.subtitle}>
        <p className="hint">现在的状态</p>
        <PillSelector options={rhythmMessages.statuses} value={status} onChange={setStatus} />
        {status ? <div className="result-box whitespace-pre-line">{rhythmMessages.statusReplies[status]}</div> : null}
      </Card>

      <Card title="今天轻轻提醒一下">
        <div className="result-box">{reminder}</div>
        <p className="hint">这句话只负责提醒你慢一点，不负责催你。</p>
        <div className="button-row">
          <Button variant="secondary" onClick={handleReminder}>
            换一句
          </Button>
        </div>
      </Card>

      <Card title="要不要缓一会儿">
        <PillSelector options={rhythmMessages.restOptions} value={restStatus} onChange={handleRest} />
        {restStatus ? <div className="result-box">{rhythmMessages.restReplies[restStatus]}</div> : null}
      </Card>

      <Card title="先放在这里" copy="想起什么就先写下来，不用现在立刻处理。">
        <TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder="想起什么就先写下来，不用现在立刻处理。" />
        <p className="hint">不点发送的话，就只存在你这里。</p>
        <div className="button-row">
          <Button variant="secondary" onClick={() => showToast('已经只存在这里啦。')}>
            只存在这里
          </Button>
          <Button onClick={() => setConfirmOpen(true)}>想让垚总知道一下</Button>
        </div>
      </Card>

      <ConfirmDialog open={confirmOpen} onConfirm={handleSend} onCancel={() => setConfirmOpen(false)} />
    </>
  )
}
