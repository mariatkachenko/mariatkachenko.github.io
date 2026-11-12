type PortfolioCardProps = {
  title: string
  href: string
  variant: 'works' | 'hackathons'
  note: string
}

import { navigateWithTransition, type RoutePath } from '../router'
import { loadModelViewer } from './ModelBackground'

const HOME_CARD_SOURCES = {
  works: '/assets/maria/home-card-works-640.webp 640w, /assets/maria/home-card-works-960.webp 960w, /assets/maria/home-card-works-1239.webp 1239w',
  hackathons: '/assets/maria/home-card-about-640.webp 640w, /assets/maria/home-card-about-960.webp 960w, /assets/maria/home-card-about-1242.webp 1242w',
} as const

export default function PortfolioCard({ title, href, variant, note }: PortfolioCardProps) {
  return <a
    className={`maria-card maria-card--${variant}`}
    data-interaction-sound="navigate"
    href={href}
    aria-label={title}
    onPointerEnter={variant === 'hackathons' ? loadModelViewer : undefined}
    onPointerDown={variant === 'hackathons' ? loadModelViewer : undefined}
    onFocus={variant === 'hackathons' ? loadModelViewer : undefined}
    onClick={(event) => {
      event.preventDefault()
      navigateWithTransition(href as RoutePath)
    }}
  >
    <img
      className="maria-card__art"
      src={variant === 'works' ? '/assets/maria/home-card-works-1239.webp' : '/assets/maria/home-card-about-1242.webp'}
      srcSet={HOME_CARD_SOURCES[variant]}
      sizes="(max-width: 600px) 49vw, 25vw"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
    <span className="maria-card__label" aria-hidden="true">{title}</span>
    <span className="maria-visually-hidden">{note}</span>
  </a>
}
