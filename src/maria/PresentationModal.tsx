import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { copyFor, type Language } from './i18n'
import MtsPresentation from './MtsPresentation'
import MtsGamePresentation from './MtsGamePresentation'
import RariblePresentation from './RariblePresentation'
import AliExpressPresentation from './AliExpressPresentation'
import AutopayPresentation from './AutopayPresentation'
import SbpPresentation from './SbpPresentation'

export type PresentationKind = 'mts' | 'mts-game' | 'rarible' | 'aliexpress' | 'sbp' | 'autopay'

type PresentationModalProps = {
  project: PresentationKind | null
  onClose: () => void
  language: Language
}

export default function PresentationModal({ project, onClose, language }: PresentationModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const copy = copyFor(language)
  const presentationLabel = project === 'rarible'
    ? 'Rarible Charity Program'
    : project === 'aliexpress'
      ? 'Collections Prototype - AliExpress DAU Hackathon'
      : project === 'sbp'
        ? (language === 'ru' ? 'Оплата по QR' : 'QR Payment')
      : project === 'autopay'
        ? (language === 'ru' ? 'Автоплатежи МТС' : 'MTS Autopay')
      : project === 'mts-game'
        ? (language === 'ru' ? 'Страницы игр на сайте МТС Оплата' : 'Game pages on the MTS Payment website')
        : copy.presentation

  useEffect(() => {
    if (!project) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const app = document.querySelector<HTMLElement>('.maria-app')
    const previousAriaHidden = app?.getAttribute('aria-hidden')
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    app?.classList.add('maria-app--presentation-open')
    app?.setAttribute('inert', '')
    app?.setAttribute('aria-hidden', 'true')
    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      app?.classList.remove('maria-app--presentation-open')
      app?.removeAttribute('inert')
      if (previousAriaHidden === null || previousAriaHidden === undefined) app?.removeAttribute('aria-hidden')
      else app?.setAttribute('aria-hidden', previousAriaHidden)
      previousFocus?.focus()
    }
  }, [project, onClose])

  if (!project) return null

  return createPortal(<div
    className="presentation-modal presentation-modal--dimmed"
    role="dialog"
    aria-modal="true"
    aria-label={presentationLabel}
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}
  >
    <button ref={closeRef} className="presentation-modal__close" type="button" onClick={onClose} aria-label={copy.closePresentation}>×</button>
    {project === 'mts'
      ? <MtsPresentation language={language} />
      : project === 'mts-game'
        ? <MtsGamePresentation language={language} />
        : project === 'rarible'
          ? <RariblePresentation language={language} />
          : project === 'aliexpress'
            ? <AliExpressPresentation language={language} />
            : project === 'autopay'
              ? <AutopayPresentation language={language} />
              : <SbpPresentation language={language} />}
  </div>, document.body)
}
