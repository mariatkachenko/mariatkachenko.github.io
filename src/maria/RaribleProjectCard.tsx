type RaribleProjectCardProps = {
  onOpen: () => void
  ariaLabel: string
  loadArtwork: boolean
}

export default function RaribleProjectCard({ onOpen, ariaLabel, loadArtwork }: RaribleProjectCardProps) {
  return <button
    className="rarible-project-card"
    type="button"
    onClick={onOpen}
    aria-label={ariaLabel}
  >
    <span className="rarible-project-card__surface" aria-hidden="true" />
    <span className="rarible-project-card__artwork" aria-hidden="true">
      {loadArtwork && <>
        <img className="rarible-project-card__ape" src="/assets/maria/rarible-ape.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="rarible-project-card__cover" src="/assets/maria/rarible-charity-cover.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="rarible-project-card__logo" src="/assets/maria/rarible-logo-hearts.webp" alt="" draggable="false" loading="eager" decoding="sync" />
      </>}
    </span>
    <span className="rarible-project-card__footer">
      <span className="rarible-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="rarible-project-card__copy">
        <strong className="rarible-project-card__title">Rarible Charity Program</strong>
        <span className="rarible-project-card__meta">Phystech Business Solutions</span>
      </span>
    </span>
  </button>
}
