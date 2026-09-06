import { useEffect } from 'react'

export type InteractionSoundKind = 'navigate' | 'toggle' | 'open' | 'close'

const soundSelector = '[data-interaction-sound]'
export const INTERACTION_SOUND_STYLE = 'soft-spray' as const

function findSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const interactive = target.closest<HTMLElement>(soundSelector)
  if (!interactive || interactive.getAttribute('aria-disabled') === 'true') return null
  if (interactive.hasAttribute('disabled') || interactive.getAttribute('aria-pressed') === 'true') return null
  return interactive
}

export function interactionSoundKind(target: EventTarget | null): InteractionSoundKind | null {
  const interactive = findSoundTarget(target)
  const kind = interactive?.dataset.interactionSound
  return kind === 'navigate' || kind === 'toggle' || kind === 'open' || kind === 'close' ? kind : null
}

export function isInteractiveSoundTarget(target: EventTarget | null) {
  return interactionSoundKind(target) !== null
}

export default function InteractionSounds() {
  useEffect(() => {
    type AudioContextConstructor = new () => AudioContext
    const audioWindow = window as typeof window & { webkitAudioContext?: AudioContextConstructor }
    const AudioContextClass = window.AudioContext ?? audioWindow.webkitAudioContext
    if (!AudioContextClass) return

    let audioContext: AudioContext | null = null

    const ensureContext = () => {
      audioContext ??= new AudioContextClass()
      return audioContext
    }

    const playSpray = (kind: InteractionSoundKind) => {
      const context = ensureContext()
      const sound = () => {
        const now = context.currentTime
        const duration = kind === 'navigate' ? 0.12 : kind === 'open' ? 0.1 : 0.065
        const peak = kind === 'navigate' || kind === 'open' ? 0.014 : 0.009
        const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
        const noise = buffer.getChannelData(0)

        for (let index = 0; index < noise.length; index += 1) {
          const fade = 1 - index / noise.length
          noise[index] = (Math.random() * 2 - 1) * fade
        }

        const source = context.createBufferSource()
        const filter = context.createBiquadFilter()
        const gain = context.createGain()
        source.buffer = buffer
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(kind === 'close' ? 1050 : 1450, now)
        filter.Q.setValueAtTime(0.7, now)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(peak, now + 0.008)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
        source.connect(filter)
        filter.connect(gain)
        gain.connect(context.destination)
        source.start(now)
        source.stop(now + duration)
      }

      if (context.state === 'suspended') void context.resume().then(sound).catch(() => undefined)
      else sound()
    }

    const handleClick = (event: MouseEvent) => {
      const kind = interactionSoundKind(event.target)
      if (kind) playSpray(kind)
    }

    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
      if (audioContext) void audioContext.close()
    }
  }, [])

  return null
}
