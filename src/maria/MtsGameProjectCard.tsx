import type { Language } from './i18n'

type MtsGameProjectCardProps = {
  language: Language
  loadArtwork: boolean
}

export default function MtsGameProjectCard({ language, loadArtwork }: MtsGameProjectCardProps) {
  return <div className="mts-game-card">
    <span className="mts-game-card__surface" aria-hidden="true" />
    <span className="mts-game-card__artwork" aria-hidden="true">
      {loadArtwork && <><img
        className="mts-game-card__statue"
        src="/assets/maria/mts-game-statue.webp"
        alt=""
        draggable="false"
      />
      <img
        className="mts-game-card__girl"
        src="/assets/maria/mts-game-girl.webp"
        alt=""
        draggable="false"
      />
      <img
        className="mts-game-card__phones"
        src="/assets/maria/mts-game-phones.webp"
        alt=""
        draggable="false"
      /></>}
    </span>
    <span className="mts-game-card__footer">
      <span className="mts-game-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="mts-game-card__copy">
        <strong className="mts-game-card__title">{language === 'ru' ? 'Страницы игр на сайте МТС Оплата' : 'Game pages on the MTS Payment website'}</strong>
        <span className="mts-game-card__meta">{language === 'ru' ? 'МТС Финтех 2024' : 'MTS Fintech 2024'}</span>
      </span>
    </span>
  </div>
}
