type PillSelectorProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function PillSelector({ options, value, onChange }: PillSelectorProps) {
  return (
    <div className="pill-grid">
      {options.map((option) => (
        <button
          className={`pill ${value === option ? 'is-active' : ''}`}
          key={option}
          type="button"
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
