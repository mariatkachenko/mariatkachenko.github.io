import { useEffect, useRef } from 'react'
import { copyFor, type Language } from './i18n'

type PresentationModalProps = {
  open: boolean
  onClose: () => void
  language: Language
}

const FIGMA_EMBED_URL = 'https://embed.figma.com/proto/X679nLVF8CfbUmiLVRreSP/Концепт-v3?node-id=40007012-21703&p=f&t=n4fciFNHirxhrr8W-1&scaling=contain&content-scaling=fixed&page-id=40006247%3A22563&starting-point-node-id=40007012%3A21703&show-proto-sidebar=0&hide-ui=1&device-frame=false&footer=false&viewport-controls=false&hotspot-hints=false&embed-host=share'

export default function PresentationModal({ open, onClose, language }: PresentationModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const copy = copyFor(language)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return <div
    className="presentation-modal presentation-modal--dimmed"
    role="dialog"
    aria-modal="true"
    aria-label={copy.presentation}
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}
  >
    <button ref={closeRef} className="presentation-modal__close" type="button" onClick={onClose} aria-label={copy.closePresentation}>×</button>
    <iframe
      src={FIGMA_EMBED_URL}
      title={copy.presentation}
      width="1920"
      height="1080"
      allowFullScreen
      loading="lazy"
    />
  </div>
}
