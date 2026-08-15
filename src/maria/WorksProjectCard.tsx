type WorksProjectCardProps = {
  title: string
  meta: string
  imageSrc?: string
  imagePosition?: string
  placeholder?: boolean
  mtsFlag?: boolean
}

export default function WorksProjectCard({
  title,
  meta,
  imageSrc,
  imagePosition = 'center',
  placeholder = false,
  mtsFlag = false,
}: WorksProjectCardProps) {
  return <div className={`works-project-card${placeholder ? ' is-placeholder' : ''}`}>
    {mtsFlag && <span className="works-project-card__mts-flag" aria-hidden="true">
      <img src="/assets/maria/mts-hanging-flag.png" alt="" draggable="false" />
    </span>}
    <div className="works-project-card__media">
      {imageSrc
        ? <img
          className="works-project-card__image concept-cover__image"
          src={imageSrc}
          alt=""
          draggable="false"
          style={{ objectPosition: imagePosition }}
        />
        : <span className="works-project-card__placeholder-art" aria-hidden="true" />}
    </div>
    <span className="works-project-card__footer">
      <span className="works-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="works-project-card__copy">
        <strong className="works-project-card__title">{title}</strong>
        <span className="works-project-card__meta">{meta}</span>
      </span>
    </span>
  </div>
}
