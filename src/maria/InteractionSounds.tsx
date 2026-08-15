import { useEffect } from 'react'

const interactiveSelector = 'a[href],button:not([disabled]),[role="button"],[tabindex]:not([tabindex="-1"])'
export const INTERACTION_SOUND_STYLE = '8-bit-terminal' as const

function findInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const interactive = target.closest<HTMLElement>(interactiveSelector)
  return interactive?.getAttribute('aria-disabled') === 'true' ? null : interactive
}

export function isInteractiveSoundTarget(target: EventTarget | null) {
  return findInteractiveTarget(target) !== null
}

export default function InteractionSounds() {
  useEffect(() => {
    type AudioContextConstructor = new () => AudioContext
    const audioWindow = window as typeof window & { webkitAudioContext?: AudioContextConstructor }
    const AudioContextClass = window.AudioContext ?? audioWindow.webkitAudioContext
    if (!AudioContextClass) return

    let audioContext: AudioContext | null = null
    let lastHoverAt = 0

    const ensureContext = () => {
      audioContext ??= new AudioContextClass()
      return audioContext
    }

    const playTone = (kind: 'hover' | 'click') => {
      const context = ensureContext()
      const sound = () => {
        const now = context.currentTime
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const filter = context.createBiquadFilter()
        const duration = kind === 'hover' ? 0.038 : 0.088
        const volume = kind === 'hover' ? 0.012 : 0.019

        oscillator.type = 'square'
        if (kind === 'hover') {
          oscillator.frequency.setValueAtTime(980, now)
          oscillator.frequency.setValueAtTime(1240, now + 0.018)
        } else {
          oscillator.frequency.setValueAtTime(440, now)
          oscillator.frequency.setValueAtTime(660, now + 0.028)
          oscillator.frequency.setValueAtTime(880, now + 0.056)
        }
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2600, now)
        filter.Q.setValueAtTime(0.7, now)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.004)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
        oscillator.connect(filter)
        filter.connect(gain)
        gain.connect(context.destination)
        oscillator.start(now)
        oscillator.stop(now + duration)
      }

      if (context.state === 'suspended') void context.resume().then(sound).catch(() => undefined)
      else sound()
    }

    const unlockAudio = () => {
      const context = ensureContext()
      if (context.state === 'suspended') void context.resume().catch(() => undefined)
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target = findInteractiveTarget(event.target)
      if (!target) return
      const previous = findInteractiveTarget(event.relatedTarget)
      if (target === previous || performance.now() - lastHoverAt < 45) return
      lastHoverAt = performance.now()
      playTone('hover')
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (findInteractiveTarget(event.target)) playTone('hover')
    }

    const handleClick = (event: MouseEvent) => {
      if (findInteractiveTarget(event.target)) playTone('click')
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('click', handleClick)
      if (audioContext) void audioContext.close()
    }
  }, [])

  return null
}
