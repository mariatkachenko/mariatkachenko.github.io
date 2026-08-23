import { copyFor, type Language } from './i18n'

type ConceptProjectProps = {
  onOpen: () => void
  language: Language
}

export default function ConceptProject({ onOpen, language }: ConceptProjectProps) {
  const copy = copyFor(language)
  return <button
    type="button"
    className="mts-project-card"
    aria-label={copy.openPresentation}
    onClick={(event) => {
      event.currentTarget.focus()
      onOpen()
    }}
  >
    <span className="mts-project-card__media" aria-hidden="true">
      <img
        className="mts-project-card__artwork"
        src="/assets/maria/mts-pay-card-composition.png"
        alt=""
        draggable="false"
      />
    </span>
    <span className="mts-project-card__footer">
      <span className="mts-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="mts-project-card__copy">
        <strong className="mts-project-card__title">
          {language === 'ru' ? 'Редизайн модуля оплаты МТС Pay' : 'MTS Pay payment module redesign'}
        </strong>
        <span className="mts-project-card__meta">
          {language === 'ru' ? 'МТС Финтех 2026' : 'MTS Fintech 2026'}
        </span>
      </span>
    </span>
  </button>
}
