type AliExpressProjectCardProps = {
  onOpen: () => void
  ariaLabel: string
}

export default function AliExpressProjectCard({ onOpen, ariaLabel }: AliExpressProjectCardProps) {
  return <button className="aliexpress-project-card" type="button" onClick={onOpen} aria-label={ariaLabel}>
    <span className="aliexpress-project-card__surface" aria-hidden="true" />
    <span className="aliexpress-project-card__artwork" aria-hidden="true">
      <img className="aliexpress-project-card__phones" src="/assets/maria/aliexpress-collections-cover.png" alt="" draggable="false" />
      <img className="aliexpress-project-card__bag" src="/assets/maria/aliexpress-bag.png" alt="" draggable="false" />
      <img className="aliexpress-project-card__heart" src="/assets/maria/aliexpress-heart.png" alt="" draggable="false" />
      <img className="aliexpress-project-card__sparkles" src="/assets/maria/aliexpress-sparkles.png" alt="" draggable="false" />
    </span>
    <span className="aliexpress-project-card__footer">
      <span className="aliexpress-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="aliexpress-project-card__copy">
        <strong className="aliexpress-project-card__title">AliExpress Collections</strong>
        <span className="aliexpress-project-card__meta">AliExpress DAU Hackathon</span>
      </span>
    </span>
  </button>
}
