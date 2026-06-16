import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { gateMessages } from '../constants/messages'

export function Gate({ onPassed }: { onPassed: () => void }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  function handleEnter() {
    if (passcode.trim() === gateMessages.passcode) {
      onPassed()
      return
    }

    setError(gateMessages.error)
  }

  return (
    <main className="gate">
      <div className="gate-mark" aria-hidden="true">
        ☕
      </div>
      <Card title={gateMessages.title} copy={gateMessages.subtitle}>
        <div className="mt-5">
          <input
            className="field"
            value={passcode}
            placeholder={gateMessages.inputPlaceholder}
            onChange={(event) => {
              setPasscode(event.target.value)
              setError('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleEnter()
              }
            }}
          />
          {error ? <p className="hint">{error}</p> : null}
        </div>
        <div className="button-row">
          <Button full onClick={handleEnter}>
            {gateMessages.enter}
          </Button>
        </div>
        <p className="section-copy whitespace-pre-line">{gateMessages.footnote}</p>
      </Card>
    </main>
  )
}
