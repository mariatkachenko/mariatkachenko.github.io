import type { Language } from './i18n'

type TinnotechProjectCardProps = {
  language: Language
  loadArtwork: boolean
}

export default function TinnotechProjectCard({ language, loadArtwork }: TinnotechProjectCardProps) {
  return <div className="tinnotech-project-card">
    <span className="tinnotech-project-card__surface" aria-hidden="true" />
    <span className="tinnotech-project-card__artwork" aria-hidden="true">
      {loadArtwork && <>
        <img className="tinnotech-project-card__logo" src="/assets/maria/tinnotech-logo.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="tinnotech-project-card__phones" src="/assets/maria/tinnotech-phones.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="tinnotech-project-card__poll" src="/assets/maria/tinnotech-poll.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="tinnotech-project-card__chat" src="/assets/maria/tinnotech-chat.webp" alt="" draggable="false" loading="eager" decoding="sync" />
      </>}
    </span>
    <span className="tinnotech-project-card__footer">
      <span className="tinnotech-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="tinnotech-project-card__copy">
        <strong className="tinnotech-project-card__title">{language === 'ru' ? 'Платформа Mashroom' : 'Mashroom Platform'}</strong>
        <span className="tinnotech-project-card__meta">{language === 'ru' ? 'Наткрекер, Т1 Иннотех 2023' : 'Nutcracker, T1 Innotech 2023'}</span>
      </span>
    </span>
  </div>
}
