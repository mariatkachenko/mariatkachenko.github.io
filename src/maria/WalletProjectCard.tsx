import type { Language } from './i18n'

type WalletProjectCardProps = {
  language: Language
  loadArtwork: boolean
}

export default function WalletProjectCard({ language, loadArtwork }: WalletProjectCardProps) {
  return <div className="wallet-project-card">
    <span className="wallet-project-card__surface" aria-hidden="true" />
    <span className="wallet-project-card__artwork" aria-hidden="true">
      {loadArtwork && <>
        <img className="wallet-project-card__phones" src="/assets/maria/wallet-phones.png" alt="" draggable="false" />
        <img className="wallet-project-card__drink" src="/assets/maria/wallet-drink.png" alt="" draggable="false" />
        <img className="wallet-project-card__bottle" src="/assets/maria/wallet-bottle.png" alt="" draggable="false" />
        <img className="wallet-project-card__cart" src="/assets/maria/wallet-cart.png" alt="" draggable="false" />
      </>}
    </span>
    <span className="wallet-project-card__footer">
      <span className="wallet-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="wallet-project-card__copy">
        <strong className="wallet-project-card__title">{language === 'ru' ? 'Приложение для заказа еды' : 'Food ordering app'}</strong>
        <span className="wallet-project-card__meta">{language === 'ru' ? 'aneExcuse, Дублин 2021' : 'aneExcuse, Dublin 2021'}</span>
      </span>
    </span>
  </div>
}
