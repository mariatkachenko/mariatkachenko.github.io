import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App, { beginAtomicThemeSwitch } from './App'
import { frameIndexForProgress, frameIndexAfterDirection, nextFrameIndex, SCROLL_FRAME_URLS } from './maria/scrollFrames'
import { cameraOrbitForPointer } from './maria/ModelBackground'
import { MODEL_FLOAT_AMPLITUDE_PX, MODEL_FLOAT_DURATION_SECONDS, MODEL_POSE_SCALE, MODEL_POSE_TILT_DEGREES } from './maria/InteractiveBackground'
import { SHIMMER_MAX_PARTICLE_SIZE, SHIMMER_PARTICLE_SHAPE, shouldEmitShimmer } from './maria/ShimmerTrail'
import { INTERACTION_SOUND_STYLE, isInteractiveSoundTarget } from './maria/InteractionSounds'
import {
  activeIndexAfterSwipe,
  cardSizeScale,
  composedOrbitScale,
  orbitOffset,
  orbitPose,
} from './maria/HackathonOrbitCarousel'
import { handVariantForWorksPosition } from './maria/WorksCardCarousel'
import { routeTransitionDirection } from './router'

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  delete document.documentElement.dataset.transitionRoute
  delete document.documentElement.dataset.transitionDirection
  Object.defineProperty(document, 'startViewTransition', {
    value: undefined,
    writable: true,
    configurable: true,
  })
})

describe('Maria Tkachenko portfolio', () => {
  it('holds an atomic theme-switch guard for two animation frames', () => {
    const root = document.createElement('html')
    const frames: FrameRequestCallback[] = []
    const schedule = (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    }

    beginAtomicThemeSwitch(root, schedule)
    expect(root).toHaveAttribute('data-theme-switching', 'true')
    frames.shift()?.(0)
    expect(root).toHaveAttribute('data-theme-switching', 'true')
    frames.shift()?.(16)
    expect(root).not.toHaveAttribute('data-theme-switching')
  })

  it('switches the works hand artwork in repeating groups of three carousel positions', () => {
    expect(handVariantForWorksPosition(6)).toBe('primary')
    expect(handVariantForWorksPosition(8.49)).toBe('primary')
    expect(handVariantForWorksPosition(8.51)).toBe('alternate')
    expect(handVariantForWorksPosition(11.49)).toBe('alternate')
    expect(handVariantForWorksPosition(11.51)).toBe('primary')
  })

  it('renders the subpage home control as Comforter text with a decorative curved arrow', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))

    const homeControl = screen.getByRole('button', { name: 'На Главную' })
    expect(homeControl).toHaveClass('maria-back')
    expect(homeControl.querySelector('.maria-back__label')).toHaveTextContent('На Главную')
    expect(homeControl.querySelector('svg.maria-back__arrow[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('transitions only route content while fixed chrome stays stable', () => {
    expect(routeTransitionDirection('/', '/works')).toBe('forward')
    expect(routeTransitionDirection('/hackathons', '/')).toBe('back')
    expect(routeTransitionDirection('/', '/')).toBeNull()

    const { container } = render(<App />)
    const app = container.querySelector('.maria-app')!
    expect(app.querySelector('.maria-route-content')).not.toHaveClass('maria-route-content--forward')
    expect(app.querySelector('.maria-route-content')).not.toHaveClass('maria-route-content--back')
    expect(app.querySelector(':scope > .maria-header')).toBeInTheDocument()
    expect(app.querySelector(':scope > .maria-controls')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    expect(app.querySelector('.maria-route-content')).toHaveClass('maria-route-content--forward')
    expect(app.querySelector('.maria-works-card-transition')).not.toBeInTheDocument()
    expect(app.querySelector('.maria-route-content .maria-header')).not.toBeInTheDocument()
    expect(app.querySelector('.maria-route-content .maria-controls')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'На Главную' }))
    expect(app.querySelector('.maria-route-content')).toHaveClass('maria-route-content--back')
    expect(app.querySelector('.maria-works-card-transition')).not.toBeInTheDocument()
  })

  it('uses the portfolio title and favicon', () => {
    render(<App />)
    expect(document.title).toBe('Maria Tkachenko Portfolio')
    expect(document.querySelector('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg')
  })

  it('renders the identity and contact navigation', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Мария Ткаченко' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'mery.tkachenko@gmail.com' })).toHaveAttribute('href', 'mailto:mery.tkachenko@gmail.com')
    expect(screen.getByText('@marykllj')).toBeInTheDocument()
    expect(screen.getByText('Moscow')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Связаться/ })).toBeInTheDocument()
  })

  it('renders language controls and portfolio entries', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Русский' })).toHaveTextContent('RU')
    expect(screen.getByRole('button', { name: 'English' })).toHaveTextContent('EN')
    expect(screen.getByRole('link', { name: 'Работы' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Обо мне' })).toBeInTheDocument()
    expect(screen.getByText('Рабочие задачи, хакатоны и проекты')).toBeInTheDocument()
    expect(screen.getByText('Опыт работы, хобби и отзывы коллег')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Рабочие задачи' })).not.toBeInTheDocument()
    expect(document.querySelector('.maria-card__edge-blur')).not.toBeInTheDocument()
    expect(document.querySelector('.maria-card__motion-blur')).not.toBeInTheDocument()
    expect(document.querySelector('.maria-light-rays')).not.toBeInTheDocument()
    expect(isInteractiveSoundTarget(screen.getByRole('link', { name: 'Работы' }))).toBe(true)
    expect(isInteractiveSoundTarget(document.createElement('div'))).toBe(false)
    expect(INTERACTION_SOUND_STYLE).toBe('8-bit-terminal')
  })

  it('switches the complete interface to English and keeps it across pages', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Maria Tkachenko' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Works' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About Me' })).toBeInTheDocument()
    expect(screen.getByText('Work tasks, hackathons and projects')).toBeInTheDocument()
    expect(screen.getByText('Work experience, hobbies and colleague feedback')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('link', { name: 'Works' }))
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open presentation “MTS Fintech. Concept”' })).toBeInTheDocument()
  })

  it('switches between light and dark themes from the fixed bottom controls', () => {
    const { container } = render(<App />)
    const lightThemeButton = screen.getByRole('button', { name: 'Светлая тема' })
    const darkThemeButton = screen.getByRole('button', { name: 'Тёмная тема' })
    expect(lightThemeButton.querySelector('img')).toHaveAttribute('src', '/assets/maria/theme-sun.png')
    expect(lightThemeButton.querySelector('img')).toHaveAttribute('alt', '')
    expect(darkThemeButton.querySelector('img')).toHaveAttribute('src', '/assets/maria/theme-moon.png')
    expect(darkThemeButton.querySelector('img')).toHaveAttribute('alt', '')
    expect(container.querySelector('.maria-app')).toHaveClass('theme-light')
    fireEvent.click(darkThemeButton)
    expect(container.querySelector('.maria-app')).toHaveClass('theme-dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    fireEvent.click(lightThemeButton)
    expect(container.querySelector('.maria-app')).toHaveClass('theme-light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('keeps the cursor trail on the home page without the astronaut model', () => {
    const { container } = render(<App />)
    expect(container.querySelector('model-viewer.maria-model-viewer')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-model-float')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-home-portrait--light')).toHaveAttribute('src', '/assets/maria/home-portrait-light.png')
    expect(container.querySelector('.maria-home-portrait--dark')).toHaveAttribute('src', '/assets/maria/home-portrait-dark.png')
    expect(MODEL_FLOAT_DURATION_SECONDS).toBe(4.2)
    expect(MODEL_FLOAT_AMPLITUDE_PX).toBe(11)
    expect(MODEL_POSE_SCALE).toBe(1.06)
    expect(MODEL_POSE_TILT_DEGREES).toBe(0)
    const interactiveBackground = container.querySelector('.maria-interactive-background')
    expect(interactiveBackground).not.toHaveAttribute('data-background-mode')
    expect(interactiveBackground?.children[0]).toHaveClass('maria-shimmer-trail')
    expect(container.querySelector('.maria-light-rays')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-glass-field')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-glass-window-rim')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-glass-sphere')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-porthole')).not.toBeInTheDocument()
    expect(container.querySelector('img.maria-hover-portrait')).not.toBeInTheDocument()
    expect(container.querySelector('canvas.maria-shimmer-trail')).toBeInTheDocument()
    expect(shouldEmitShimmer(100, 1000)).toBe(true)
    expect(shouldEmitShimmer(900, 1000)).toBe(true)
    expect(SHIMMER_MAX_PARTICLE_SIZE).toBeLessThanOrEqual(3)
    expect(SHIMMER_PARTICLE_SHAPE).toBe('pixel')
    expect(container.querySelector('img.maria-cursor-companion')).not.toBeInTheDocument()
    expect(container.querySelector('video.maria-pointer-video')).not.toBeInTheDocument()
    expect(cameraOrbitForPointer(0, 0.5)).toBe('60deg 75deg 105%')
    expect(cameraOrbitForPointer(0.5, 0.5)).toBe('0deg 75deg 105%')
    expect(cameraOrbitForPointer(1, 0.5)).toBe('-60deg 75deg 105%')
    expect(cameraOrbitForPointer(0.5, 0)).toBe('0deg 60deg 85%')
    expect(cameraOrbitForPointer(0.5, 1)).toBe('0deg 90deg 125%')
    expect(SCROLL_FRAME_URLS).toHaveLength(31)
    expect(frameIndexForProgress(0, SCROLL_FRAME_URLS.length)).toBe(0)
    expect(frameIndexForProgress(1, SCROLL_FRAME_URLS.length)).toBe(30)
    expect(nextFrameIndex(0, SCROLL_FRAME_URLS.length)).toBe(1)
    expect(nextFrameIndex(30, SCROLL_FRAME_URLS.length)).toBe(0)
    expect(frameIndexAfterDirection(8, SCROLL_FRAME_URLS.length, 1)).toBe(9)
    expect(frameIndexAfterDirection(8, SCROLL_FRAME_URLS.length, -1)).toBe(7)
    expect(frameIndexAfterDirection(0, SCROLL_FRAME_URLS.length, -1)).toBe(30)
  })

  it('keeps the hackathons model in its original pose hierarchy', () => {
    window.history.replaceState({}, '', '/hackathons')
    const { container } = render(<App />)
    expect(container.querySelector('.maria-model-entry')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-model-float > .maria-model-pose')).toBeInTheDocument()
  })

  it('keeps the portrait sequence sticky while the interface content scrolls', () => {
    const { container } = render(<App />)
    const stickyPortrait = container.querySelector('.maria-viewport')
    const scrollingContent = container.querySelector('.maria-scroll-content')

    expect(stickyPortrait?.querySelector('.maria-model-viewer')).not.toBeInTheDocument()
    expect(stickyPortrait?.querySelector('.maria-card')).not.toBeInTheDocument()
    expect(scrollingContent?.querySelectorAll('.maria-card')).toHaveLength(2)
    expect(scrollingContent?.querySelector('.maria-header')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-app > .maria-header')).toBeInTheDocument()
  })

  it('keeps navigation fixed and links cards to consecutive scroll screens', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.maria-header')).toHaveClass('maria-fixed-top')
    expect(container.querySelector('.maria-controls')).toHaveClass('maria-fixed-bottom')
    expect(screen.getByRole('link', { name: 'Работы' })).toHaveAttribute('href', '/works')
    expect(screen.getByRole('link', { name: 'Обо мне' })).toHaveAttribute('href', '/hackathons')
    expect(container.querySelector('.maria-scroll-stop')).not.toBeInTheDocument()
  })

  it('starts the works scene immediately without the native snapshot transition', () => {
    vi.useFakeTimers()
    const startViewTransition = vi.fn((update: () => void | Promise<void>) => {
      void update()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      writable: true,
      configurable: true,
    })
    try {
      const { container } = render(<App />)
      fireEvent.click(screen.getByRole('link', { name: 'Работы' }))

      expect(startViewTransition).not.toHaveBeenCalled()
      expect(container.querySelector('.maria-works-page')).toHaveClass('is-scene-ready')
      expect(container.querySelector('.maria-works-carousel')).toHaveClass('is-entering')
      expect(container.querySelector('.maria-works-carousel')).toHaveClass('is-entry-active')
      expect(container.querySelector('.mts-flyout-overlay')).toBeInTheDocument()
      expect(container.querySelector('.mts-flyout-overlay')).not.toHaveClass('is-active')

      act(() => vi.advanceTimersByTime(600))
      expect(container.querySelector('.maria-works-carousel')).not.toHaveClass('is-entering')
      expect(container.querySelector('.mts-flyout-overlay')).toHaveClass('is-active')
    } finally {
      Object.defineProperty(document, 'startViewTransition', {
        value: undefined,
        writable: true,
        configurable: true,
      })
      vi.useRealTimers()
    }
  })

  it('opens Work Projects as a separate route with fixed navigation and a back action', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    const cover = screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })

    expect(window.location.pathname).toBe('/works')
    expect(container.querySelector('.maria-works-page')).toContainElement(cover)
    expect(cover).toHaveClass('mts-project-card')
    expect(cover.querySelector('.works-project-card')).toBeNull()
    expect(cover.querySelector('.concept-cover')).toBeNull()
    expect(cover.querySelector('.mts-project-card__artwork')).toHaveAttribute('src', '/assets/maria/mts-pay-card-composition.png')
    expect(cover.querySelector('.mts-project-card__media')).toContainElement(cover.querySelector('.mts-project-card__artwork'))
    expect(cover.querySelector('.mts-project-card__artwork')?.parentElement).toHaveClass('mts-project-card__media')
    expect(cover.querySelector('.mts-project-card__logo-flyout')).toBeNull()
    expect(cover.querySelector('.mts-project-card__butterfly-flyout')).toBeNull()
    expect(container.querySelector('.mts-flyout-overlay__logo')).toHaveAttribute('src', '/assets/maria/mts-pay-logo-flyout.png')
    expect(container.querySelector('.mts-flyout-overlay__butterfly')).toHaveAttribute('src', '/assets/maria/mts-pay-butterfly-flyout.png')
    expect(container.querySelector('.mts-flyout-overlay')).not.toHaveClass('is-active')
    expect(Array.from(cover.children).map((node) => node.className)).toEqual([
      'mts-project-card__media',
      'mts-project-card__footer',
    ])
    const hand = container.querySelector<HTMLImageElement>('.maria-works-hand img')
    expect(hand).toHaveAttribute('src', '/assets/maria/works-phone-hand.png')
    expect(hand).toHaveAttribute('alt', '')
    expect(hand).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.maria-works-hand img[src="/assets/maria/works-phone-hand-lock.png"]')).toBeInTheDocument()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    expect(container.querySelector('.maria-works-page')).toContainElement(carousel)
    expect(carousel.querySelectorAll('.maria-works-deck-card')).toHaveLength(14)
    expect(carousel.querySelectorAll('.maria-works-deck-card__empty[aria-hidden="true"]')).toHaveLength(11)
    expect(carousel).toContainElement(cover)
    expect(container.querySelector('.maria-works-grid')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'На Главную' })).toBeInTheDocument()
    expect(container.querySelector('.maria-header')).toHaveClass('maria-fixed-top')
    expect(container.querySelector('.maria-controls')).toHaveClass('maria-fixed-bottom')
  })

  it('opens Hackathons & Hobbies with an orbital project carousel and returns to the home screen', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Обо мне' }))
    expect(window.location.pathname).toBe('/hackathons')
    expect(screen.queryByRole('heading', { name: 'Хакатоны и хобби' })).not.toBeInTheDocument()
    expect(document.querySelector('.maria-hackathons-porthole')).toHaveAttribute('aria-hidden', 'true')
    expect(document.querySelector('.maria-hackathons-porthole')).toHaveAttribute('data-sphere-style', 'asymmetric-radial')
    const floatingModel = document.querySelector<HTMLElement>('.maria-hackathons-page .maria-model-float')
    expect(floatingModel?.querySelector('model-viewer.maria-model-viewer')).toHaveAttribute('src', '/assets/maria/astronaut-optimized.glb')
    expect(floatingModel).toHaveStyle({
      '--model-float-duration': '4.2s',
      '--model-float-amplitude': '11px',
    })
    expect(floatingModel?.querySelector('.maria-model-pose')).toHaveStyle({
      '--model-pose-scale': '1.06',
      '--model-pose-tilt': '0deg',
    })
    const projectCards = screen.getAllByRole('button', { name: /Проект хакатона/ })
    const carousel = screen.getByRole('region', { name: 'Карусель проектов хакатонов' })
    expect(projectCards).toHaveLength(7)
    expect(screen.getByText('Raible Charity Program — Phystech Business Solutions')).toBeInTheDocument()
    expect(screen.getByText('Weather Wizard Mobile App — Career Factory Contest')).toBeInTheDocument()
    expect(screen.getByText('Collections Prototype — AliExpress DAU Hackathon')).toBeInTheDocument()
    expect(screen.getByText('Web AR Platform — Indoor Navigation')).toBeInTheDocument()
    expect(screen.getByText('Редизайн карточки Avito')).toBeInTheDocument()
    expect(screen.getByText('Новогодние подарки Tele2')).toBeInTheDocument()
    expect(screen.getByText('Deal Done To Do App')).toBeInTheDocument()
    expect(within(carousel).getAllByText('Мария Ткаченко')).toHaveLength(7)
    expect(document.querySelectorAll('.maria-orbit-card__settings[aria-hidden="true"]')).toHaveLength(7)
    expect(document.querySelectorAll('.maria-orbit-card__line-art[aria-hidden="true"]')).toHaveLength(7)
    expect(document.querySelector('.maria-orbit-card__badge')).not.toBeInTheDocument()
    expect(document.querySelector('img[src="/assets/maria/hackathon-badges.png"]')).not.toBeInTheDocument()
    expect(projectCards[0]).toHaveAttribute('data-offset', '0')
    expect(projectCards[0]).toHaveAttribute('data-orbit-layer', 'front')
    expect(projectCards[3]).toHaveAttribute('data-orbit-layer', 'rear')
    expect(projectCards[4]).toHaveAttribute('data-orbit-layer', 'rear')
    expect(projectCards.map((card) => card.getAttribute('data-card-size'))).toEqual([
      'large',
      'compact',
      'medium',
      'large',
      'medium',
      'compact',
      'large',
    ])
    expect(projectCards[0]).toHaveStyle({
      '--orbit-position-scale': '1',
      '--orbit-card-size-scale': '1.14',
      '--orbit-active-scale': '1.12',
    })
    expect(projectCards[1]).toHaveStyle({
      '--orbit-card-size-scale': '0.88',
      '--orbit-active-scale': '1',
    })
    expect(orbitPose(0)).toMatchObject({ layer: 'front', scale: 1, opacity: 1 })
    expect(orbitPose(1).rotateY).toBe(-orbitPose(-1).rotateY)
    expect(orbitPose(1).rotateZ).toBe(-orbitPose(-1).rotateZ)
    expect(orbitPose(3)).toMatchObject({ layer: 'rear', scale: 0.5, opacity: 0.2 })
    expect(cardSizeScale('large')).toBe(1.14)
    expect(cardSizeScale('medium')).toBe(1)
    expect(cardSizeScale('compact')).toBe(0.88)
    expect(composedOrbitScale(0.86, 1.14, false)).toBeCloseTo(0.9804)
    expect(composedOrbitScale(1, 1.14, true)).toBeCloseTo(1.2768)
    fireEvent.click(projectCards[2])
    expect(projectCards[2]).toHaveAttribute('data-offset', '0')
    expect(projectCards[0]).toHaveAttribute('data-card-size', 'large')
    expect(projectCards[2]).toHaveAttribute('data-card-size', 'medium')
    expect(projectCards[2]).toHaveStyle({ '--orbit-active-scale': '1.12' })
    expect(carousel).not.toHaveClass('is-moving')
    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 200 })
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: -20 })
    expect(projectCards[3]).toHaveAttribute('data-offset', '0')
    expect(orbitOffset(0, 6, 7)).toBe(1)
    expect(orbitOffset(6, 0, 7)).toBe(-1)
    expect(activeIndexAfterSwipe(0, -60, 7)).toBe(1)
    expect(activeIndexAfterSwipe(0, 60, 7)).toBe(6)
    expect(activeIndexAfterSwipe(3, 41, 7)).toBe(3)
    expect(document.querySelector('.maria-hackathons-page')).toHaveStyle({
      '--mobile-model-scale': '1.25',
      '--mobile-porthole-size': 'min(188vw, 148vh)',
      '--mobile-card-bottom': '28vh',
    })
    expect(screen.queryByText('Проекты скоро появятся здесь.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByText('Avito Card Redesign')).toBeInTheDocument()
    expect(screen.getByText('Tele2 New Year Gifts')).toBeInTheDocument()
    expect(screen.getByText('Deal Done To Do App')).toBeInTheDocument()
    expect(within(carousel).getAllByText('Maria Tkachenko')).toHaveLength(7)
    fireEvent.click(screen.getByRole('button', { name: 'Русский' }))
    fireEvent.click(screen.getByRole('button', { name: 'На Главную' }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('link', { name: 'Работы' })).toBeInTheDocument()
  })

  it('opens the local MTS presentation in a modal viewer', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    fireEvent.click(screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' }))

    expect(screen.getByRole('dialog', { name: 'Презентация «МТС Финтех. Концепт»' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Слайд 1 из 39' })).toHaveAttribute('src', '/assets/maria/mts-presentation/01.png')
    expect(screen.getByRole('button', { name: 'Предыдущий слайд' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Следующий слайд' }))
    expect(screen.getByRole('img', { name: 'Слайд 2 из 39' })).toHaveAttribute('src', '/assets/maria/mts-presentation/02.png')
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByRole('img', { name: 'Слайд 3 из 39' })).toHaveAttribute('src', '/assets/maria/mts-presentation/03.png')
    const slideArea = screen.getByRole('dialog').querySelector('.mts-presentation__slides') as HTMLDivElement
    Object.defineProperty(slideArea, 'getBoundingClientRect', { value: () => ({ left: 0, width: 100 }) })
    fireEvent.click(slideArea, { clientX: 1 })
    expect(screen.getByRole('img', { name: 'Слайд 2 из 39' })).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveClass('presentation-modal', 'presentation-modal--dimmed')
    expect(screen.getByRole('dialog')).not.toHaveClass('presentation-modal--transparent')
    expect(screen.getByRole('dialog')).not.toHaveClass('presentation-modal--cropped')
    expect(container.querySelector('.presentation-modal__dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog').querySelector(':scope > .mts-presentation')).toBeInTheDocument()
    expect(container.querySelector('.presentation-modal__stage')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Закрыть презентацию' })).toHaveClass('presentation-modal__close')
    expect(screen.getByRole('dialog').querySelector(':scope > .presentation-modal__close')).toBeInTheDocument()
    expect(screen.queryByTitle('Презентация «МТС Финтех. Концепт»')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('opens Rarible as one vertically scrolling canvas in the same modal viewer', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    fireEvent.click(screen.getByRole('button', { name: 'Открыть презентацию «Rarible Charity Program»' }))

    const dialog = screen.getByRole('dialog', { name: 'Rarible Charity Program' })
    expect(dialog).toHaveClass('presentation-modal', 'presentation-modal--dimmed')
    expect(dialog.querySelector(':scope > .rarible-presentation')).toBeInTheDocument()
    expect(dialog.querySelector('.rarible-presentation__scroll')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rarible Charity Program' })).toHaveAttribute(
      'src',
      '/assets/maria/rarible-presentation-numbered/00.png',
    )
    expect(dialog.querySelector('.mts-presentation')).not.toBeInTheDocument()
    expect(dialog.querySelectorAll('.rarible-presentation__scroll img')).toHaveLength(13)
    expect(screen.getByRole('button', { name: 'Закрыть презентацию' })).toBeInTheDocument()
    expect(container.querySelector('.maria-app')).toHaveAttribute('inert')
  })

  it('opens AliExpress as one vertically scrolling canvas in the same modal viewer', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    fireEvent.click(screen.getByRole('button', { name: 'Открыть презентацию «Collections Prototype - AliExpress DAU Hackathon»' }))

    const dialog = screen.getByRole('dialog', { name: 'Collections Prototype - AliExpress DAU Hackathon' })
    expect(dialog).toHaveClass('presentation-modal', 'presentation-modal--dimmed')
    expect(dialog.querySelector(':scope > .rarible-presentation')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Collections Prototype - AliExpress DAU Hackathon' })).toHaveAttribute(
      'src',
      '/assets/maria/aliexpress-presentation-numbered/01.png',
    )
    expect(dialog.querySelectorAll('.rarible-presentation__scroll img')).toHaveLength(12)
    expect(container.querySelector('.maria-app')).toHaveAttribute('inert')
  })

  it('closes the presentation from every exit path and restores focus', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Работы' }))
    const cover = screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })

    fireEvent.click(cover)
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть презентацию' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(cover).toHaveFocus()

    fireEvent.click(cover)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(cover)
    fireEvent.mouseDown(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses the supplied illustrated artwork for both home cards', () => {
    const { container } = render(<App />)
    const artwork = container.querySelectorAll<HTMLImageElement>('.maria-card__art')
    expect(artwork).toHaveLength(2)
    expect(artwork[0]).toHaveAttribute('src', '/assets/maria/home-card-works.png')
    expect(artwork[1]).toHaveAttribute('src', '/assets/maria/home-card-about.png')
    expect(container.querySelectorAll('.maria-card__label')).toHaveLength(2)
    expect(container.querySelector('.maria-symbol-rail')).not.toBeInTheDocument()
    expect(container.querySelector('.maria-diary')).not.toBeInTheDocument()
  })

  it('replaces Grain Archive and normalizes old paths', () => {
    window.history.replaceState({}, '', '/archive')
    render(<App />)
    expect(window.location.pathname).toBe('/')
    expect(screen.queryByText('Grain Archive')).not.toBeInTheDocument()
  })
})
