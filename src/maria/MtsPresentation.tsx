import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from './i18n'
import useSlidePinchZoom from './useSlidePinchZoom'

const SLIDE_IDS = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '35', '36', '37', '38', '39', '48',
] as const

const DARK_SLIDES = new Set(['01', '29', '30', '31', '32', '36', '48'])
const slideSource = (id: string) => `/assets/maria/mts-presentation-webp/${id === '48' ? '48.jpg' : `${id}.webp`}`

type MtsPresentationProps = {
  language: Language
}

export default function MtsPresentation({ language }: MtsPresentationProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const clearTransitionRef = useRef<number | null>(null)
  const copy = language === 'ru'
    ? { previous: 'Предыдущий слайд', next: 'Следующий слайд', slide: 'Слайд', of: 'из' }
    : { previous: 'Previous slide', next: 'Next slide', slide: 'Slide', of: 'of' }

  const goToSlide = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= SLIDE_IDS.length || nextIndex === slideIndex) return

    const isPush = DARK_SLIDES.has(SLIDE_IDS[slideIndex]) !== DARK_SLIDES.has(SLIDE_IDS[nextIndex])
    const nextDirection = nextIndex > slideIndex ? 'forward' : 'back'
    if (clearTransitionRef.current !== null) window.clearTimeout(clearTransitionRef.current)

    setDirection(nextDirection)
    setOutgoingIndex(isPush ? slideIndex : null)
    setSlideIndex(nextIndex)

    if (isPush) {
      clearTransitionRef.current = window.setTimeout(() => setOutgoingIndex(null), 460)
    }
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
    if (event.clientX < bounds.left + bounds.width / 2) goToSlide(slideIndex - 1)
    else goToSlide(slideIndex + 1)
  }

  const activeId = SLIDE_IDS[slideIndex]
  const outgoingId = outgoingIndex === null ? null : SLIDE_IDS[outgoingIndex]
  const pinchZoom = useSlidePinchZoom(activeId)

  return <section className={`mts-presentation mts-presentation--${DARK_SLIDES.has(activeId) ? 'dark' : 'light'}`} aria-label={copy.slide}>
    <div className="mts-presentation__frame">
      <div
        className={`mts-presentation__slides${pinchZoom.isZoomed ? ' is-zoomed' : ''}`}
        aria-live="polite"
        onClick={(event) => {
          if (pinchZoom.consumeClick() || pinchZoom.isZoomed) return
          handleSlideClick(event)
        }}
        {...pinchZoom.pointerHandlers}
      >
      {outgoingId && <img
        className={`mts-presentation__slide mts-presentation__slide--outgoing is-${direction}`}
        src={slideSource(outgoingId)}
        alt=""
        aria-hidden="true"
        decoding="async"
      />}
      <div
        className={`mts-presentation__slide mts-presentation__slide--active ${outgoingId ? `is-${direction}` : ''}`}
      >
        <img
          className="mts-presentation__slide-image"
          src={slideSource(activeId)}
          alt={`${copy.slide} ${slideIndex + 1} ${copy.of} ${SLIDE_IDS.length}`}
          fetchPriority="high"
          decoding="async"
          style={pinchZoom.zoomStyle}
        />
      </div>
      </div>
    </div>
    <div className="mts-presentation__controls">
      <button type="button" aria-label={copy.previous} disabled={slideIndex === 0} onClick={() => goToSlide(slideIndex - 1)}>←</button>
      <span>{slideIndex + 1} / {SLIDE_IDS.length}</span>
      <button type="button" aria-label={copy.next} disabled={slideIndex === SLIDE_IDS.length - 1} onClick={() => goToSlide(slideIndex + 1)}>→</button>
    </div>
  </section>
}
