import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  copy?: string
  children?: ReactNode
}

export function Card({ title, copy, children }: CardProps) {
  return (
    <section className="station-card">
      {title ? <h2 className="section-title">{title}</h2> : null}
      {copy ? <p className="section-copy">{copy}</p> : null}
      {children}
    </section>
  )
}
