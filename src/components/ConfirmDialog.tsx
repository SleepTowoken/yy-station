import { sendMessages } from '../constants/messages'
import { Button } from './Button'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  body?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, body, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="dialog-panel" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <h2 className="section-title">{title ?? sendMessages.confirmTitle}</h2>
        <p className="section-copy">{body ?? sendMessages.confirmBody}</p>
        <div className="button-row">
          <Button onClick={onConfirm}>{sendMessages.confirmAction}</Button>
          <Button variant="secondary" onClick={onCancel}>
            {sendMessages.cancelAction}
          </Button>
        </div>
      </div>
    </div>
  )
}
