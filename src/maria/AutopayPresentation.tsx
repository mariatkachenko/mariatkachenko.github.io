import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from './i18n'

const SLIDE_IDS = ['29', '30', '31', '32', '33', '34', 'End'] as const
const slideSource = (id: string) => `/assets/maria/autopay-presentation/${id}.jpg`

type AutopayPresentationProps = {
  language: Language
}

export default function AutopayPresentation({ language }: AutopayPresentationProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const clearTransitionRef = useRef<number | null>(null)
  const copy = language === 'ru'
    ? { previous: 'Предыдущий слайд', next: 'Следующий слайд', slide: 'Слайд', of: 'из' }
    : { previous: 'Previous slide', next: 'Next slide', slide: 'Slide', of: 'of' }

  const goToSlide = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= SLIDE_IDS.length || nextIndex === slideIndex) return
    if (clearTransitionRef.current !== null) window.clearTimeout(clearTransitionRef.current)

    setDirection(nextIndex > slideIndex ? 'forward' : 'back')
    setOutgoingIndex(slideIndex)
    setSlideIndex(nextIndex)
    clearTransitionRef.current = window.setTimeout(() => setOutgoingIndex(null), 460)
  }, [slideIndex])

  useEffect(() => () => {
    if (clearTransitionRef.current !== null) window.clearTimeout(clearTransitionRef.current)
  }, [])

  useEffect(() => {
    ;[-1, 1, 2].forEach((offset) => {
      const id = SLIDE_IDS[slideIndex + offset]
      if (!id) return
      const image = new Image()
      image.src = slideSource(id)
      void image.decode?.().catch(() => undefined)
    })
  }, [slideIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToSlide(slideIndex - 1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToSlide(slideIndex + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToSlide, slideIndex])

  const handleSlideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    goToSlide(event.clientX < bounds.left + bounds.width / 2 ? slideIndex - 1 : slideIndex + 1)
  }

  const activeId = SLIDE_IDS[slideIndex]
  const outgoingId = outgoingIndex === null ? null : SLIDE_IDS[outgoingIndex]

  return <section className="mts-presentation mts-presentation--light" aria-label={copy.slide}>
    <div className="mts-presentation__frame">
      <div className="mts-presentation__slides" aria-live="polite" onClick={handleSlideClick}>
        {outgoingId && <img
          className={`mts-presentation__slide mts-presentation__slide--outgoing is-${direction}`}
          src={slideSource(outgoingId)}
          alt=""
          aria-hidden="true"
          decoding="async"
        />}
        <img
          className={`mts-presentation__slide mts-presentation__slide--active ${outgoingId ? `is-${direction}` : ''}`}
          src={slideSource(activeId)}
          alt={`${copy.slide} ${slideIndex + 1} ${copy.of} ${SLIDE_IDS.length}`}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </div>
    <div className="mts-presentation__controls">
      <button type="button" aria-label={copy.previous} disabled={slideIndex === 0} onClick={() => goToSlide(slideIndex - 1)}>←</button>
      <span>{slideIndex + 1} / {SLIDE_IDS.length}</span>
      <button type="button" aria-label={copy.next} disabled={slideIndex === SLIDE_IDS.length - 1} onClick={() => goToSlide(slideIndex + 1)}>→</button>
    </div>
  </section>
}
