import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PillSelector } from '../components/PillSelector'
import { TextArea } from '../components/TextArea'
import { useToast } from '../hooks/useToast'
import { deliveryOptions, drinks, iceOptions, sugarOptions } from '../constants/drinks'
import { healMessages, sendMessages } from '../constants/messages'
import { createMoodLog } from '../services/moodService'
import { createSupplyRequest } from '../services/supplyService'
import type { EnergySource, SupplyRequestDraft } from '../types/app'

type TodayHealProps = {
  awardEnergy: (source: EnergySource) => { awarded: boolean; message: string }
}

const randomFrom = (items: string[]) => items[Math.floor(Math.random() * items.length)]

const initialSupply: SupplyRequestDraft = {
  drinkName: drinks[0].name,
  sugarPreference: sugarOptions[0],
  icePreference: iceOptions[0],
  deliveryMethod: deliveryOptions[2],
  address: '',
  phone: '',
  availableTime: '',
  note: '',
}

export function TodayHeal({ awardEnergy }: TodayHealProps) {
  const { showToast } = useToast()
  const [mood, setMood] = useState('')
  const [encouragement, setEncouragement] = useState(randomFrom(healMessages.encouragements))
  const [effect, setEffect] = useState('')
  const [moodNote, setMoodNote] = useState('')
  const [supply, setSupply] = useState(initialSupply)
  const [confirmType, setConfirmType] = useState<'mood' | 'supply' | null>(null)

  function handleHeal() {
    setEffect(randomFrom(healMessages.effects))
    setEncouragement(randomFrom(healMessages.encouragements))
    const result = awardEnergy('heal')
    showToast(result.message)
  }

  async function handleSendMood() {
    const result = await createMoodLog({
      mood,
      healResult: effect,
      note: moodNote,
    })
    showToast(result.ok ? '已经发给垚总啦，今天先慢慢回血。' : sendMessages.fail)
    setConfirmType(null)
  }

  async function handleSendSupply() {
    const hasSensitive = supply.address.trim() || supply.phone.trim()
    if (!supply.drinkName.trim()) {
      showToast(sendMessages.missing)
      return
    }

    if (hasSensitive && confirmType !== 'supply') {
      setConfirmType('supply')
      return
    }

    const result = await createSupplyRequest(supply)
    showToast(result.ok ? '补给请求已经发出啦，等垚总安排。' : sendMessages.fail)
    setConfirmType(null)
  }

  return (
    <>
      <Card title="今日回血" copy="累的时候，可以先在这里慢慢把自己捞回来。">
        <PillSelector options={healMessages.moods} value={mood} onChange={setMood} />
        {mood ? <div className="result-box">{healMessages.moodReplies[mood]}</div> : null}
        <div className="button-row">
          <Button onClick={handleHeal}>点我回血</Button>
          <Button variant="secondary" onClick={() => setEncouragement(randomFrom(healMessages.encouragements))}>
            随机鼓励
          </Button>
        </div>
        {effect ? <div className="result-box">{effect}</div> : null}
        <p className="section-copy">{encouragement}</p>
        <div className="mt-4">
          <TextArea value={moodNote} placeholder="想补一句什么，也可以先写在这里。" onChange={(event) => setMoodNote(event.target.value)} />
        </div>
        <p className="hint">{healMessages.sendHint}</p>
        <div className="button-row">
          <Button variant="secondary" onClick={() => setConfirmType('mood')}>
            发送给垚总
          </Button>
        </div>
      </Card>

      <Card title="能量补给站" copy={healMessages.supplyIntro}>
        <h3 className="mt-4 mb-0 text-base font-bold">无糖美式专区</h3>
        <p className="section-copy whitespace-pre-line">{healMessages.coffeeNote}</p>
        <PillSelector
          options={drinks.map((drink) => drink.name)}
          value={supply.drinkName}
          onChange={(drinkName) => setSupply((current) => ({ ...current, drinkName }))}
        />
        <ul className="tiny-list">
          {drinks
            .filter((drink) => drink.name === supply.drinkName)
            .map((drink) => (
              <li key={drink.name}>{drink.description}</li>
            ))}
        </ul>
        <p className="hint">{healMessages.nightNote}</p>

        <div className="mt-4">
          <p className="hint">糖度</p>
          <PillSelector
            options={sugarOptions}
            value={supply.sugarPreference}
            onChange={(sugarPreference) => setSupply((current) => ({ ...current, sugarPreference }))}
          />
        </div>
        <div className="mt-4">
          <p className="hint">冰量</p>
          <PillSelector
            options={iceOptions}
            value={supply.icePreference}
            onChange={(icePreference) => setSupply((current) => ({ ...current, icePreference }))}
          />
        </div>
        <div className="mt-4">
          <p className="hint">方式</p>
          <PillSelector
            options={deliveryOptions}
            value={supply.deliveryMethod}
            onChange={(deliveryMethod) => setSupply((current) => ({ ...current, deliveryMethod }))}
          />
        </div>
        <div className="mt-4 grid gap-3">
          <input className="field" value={supply.address} placeholder="位置或地址" onChange={(event) => setSupply((current) => ({ ...current, address: event.target.value }))} />
          <input className="field" value={supply.phone} placeholder="电话或备注" onChange={(event) => setSupply((current) => ({ ...current, phone: event.target.value }))} />
          <input className="field" value={supply.availableTime} placeholder="方便时间" onChange={(event) => setSupply((current) => ({ ...current, availableTime: event.target.value }))} />
          <TextArea value={supply.note} placeholder="其他备注" onChange={(event) => setSupply((current) => ({ ...current, note: event.target.value }))} />
        </div>
        <p className="hint">{healMessages.supplyHint}</p>
        <div className="button-row">
          <Button onClick={handleSendSupply}>发送补给请求给垚总</Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmType === 'mood'}
        onConfirm={handleSendMood}
        onCancel={() => setConfirmType(null)}
      />
      <ConfirmDialog
        open={confirmType === 'supply'}
        onConfirm={handleSendSupply}
        onCancel={() => setConfirmType(null)}
      />
    </>
  )
}
