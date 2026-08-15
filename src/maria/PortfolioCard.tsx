type PortfolioCardProps = {
  title: string
  href: string
  variant: 'works' | 'hackathons'
  note: string
}

import { navigateWithTransition, type RoutePath } from '../router'

export default function PortfolioCard({ title, href, variant, note }: PortfolioCardProps) {
  return <a className={`maria-card maria-card--${variant}`} href={href} aria-label={title} onClick={(event) => {
    event.preventDefault()
    navigateWithTransition(href as RoutePath)
  }}>
    <img
      className="maria-card__art"
      src={variant === 'works' ? '/assets/maria/home-card-works.png' : '/assets/maria/home-card-about.png'}
      alt=""
      aria-hidden="true"
    />
    <span className="maria-card__label" aria-hidden="true">{title}</span>
    <span className="maria-visually-hidden">{note}</span>
  </a>
}
