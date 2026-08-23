import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type UIEvent as ReactUIEvent } from 'react'
import type { Language } from './i18n'

const ALIEXPRESS_CANVAS_IMAGES = [
  { src: '01', width: 1449, height: 891 },
  { src: '02', width: 1449, height: 911 },
  { src: '03', width: 1449, height: 909 },
  { src: '04', width: 1449, height: 698 },
  { src: '05', width: 1449, height: 612 },
  { src: '06', width: 1449, height: 269 },
  { src: '07', width: 1449, height: 1036 },
  { src: '08', width: 2160, height: 2216 },
  { src: '09', width: 1449, height: 1569 },
  { src: '10', width: 1449, height: 891 },
  { src: '11', width: 1449, height: 1929 },
  { src: '12', width: 1449, height: 1049 },
] as const

export default function AliExpressPresentation({ language }: { language: Language }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; startY: number; scrollTop: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [hasMoreBelow, setHasMoreBelow] = useState(true)
  const label = language === 'ru'
    ? 'Collections Prototype — вертикальная презентация'
    : 'Collections Prototype — vertical presentation'

  useLayoutEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    const resetScroll = () => {
      scroll.scrollTop = 0
      scroll.scrollLeft = 0
      setHasMoreBelow(true)
    }
    resetScroll()
    const frame = requestAnimationFrame(resetScroll)
    return () => cancelAnimationFrame(frame)
  }, [])

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, scrollTop: event.currentTarget.scrollTop }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    event.currentTarget.scrollTop = drag.scrollTop - (event.clientY - drag.startY)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
  }

  const updateScrollHint = (event: ReactUIEvent<HTMLDivElement>) => {
    const scroll = event.currentTarget
    setHasMoreBelow(scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - 2)
  }

  const scrollFurther = () => scrollRef.current?.scrollBy({
    top: Math.round(scrollRef.current.clientHeight / 2),
    behavior: 'smooth',
  })

  return <section className={`rarible-presentation${hasMoreBelow ? '' : ' is-at-bottom'}`} aria-label={label}>
    <div
      ref={scrollRef}
      className={`rarible-presentation__scroll${dragging ? ' is-dragging' : ''}`}
      tabIndex={0}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onScroll={updateScrollHint}
    >
      {ALIEXPRESS_CANVAS_IMAGES.map((image, index) => <img
        key={image.src}
        src={`/assets/maria/aliexpress-presentation-numbered-webp/${image.src}.webp`}
        alt={index === 0 ? 'Collections Prototype - AliExpress DAU Hackathon' : ''}
        aria-hidden={index === 0 ? undefined : true}
        loading={index < 2 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : 'auto'}
        decoding="async"
        width={image.width}
        height={image.height}
        draggable="false"
      />)}
    </div>
    <button
      className="rarible-presentation__scroll-hint"
      type="button"
      onClick={scrollFurther}
      aria-label={language === 'ru' ? 'Прокрутить презентацию ниже' : 'Scroll presentation down'}
    >
      <svg viewBox="0 0 24 24" focusable="false"><path d="m5 7 7 7 7-7M5 13l7 7 7-7" /></svg>
    </button>
  </section>
}
