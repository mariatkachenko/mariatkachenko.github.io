type MtsFlyoutOverlayProps = {
  activation: number
  visible: boolean
}

export default function MtsFlyoutOverlay({ activation, visible }: MtsFlyoutOverlayProps) {
  if (activation === 0) return null

  return <div
    key={activation}
    className={`mts-flyout-overlay${visible ? ' is-active' : ''}`}
    data-activation={activation}
    aria-hidden="true"
  >
    <img
      className="mts-flyout-overlay__logo"
      src="/assets/maria/mts-pay-logo-flyout.webp"
      alt=""
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      draggable="false"
    />
    <img
      className="mts-flyout-overlay__butterfly"
      src="/assets/maria/mts-pay-butterfly-flyout.webp"
      alt=""
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      draggable="false"
    />
  </div>
}
