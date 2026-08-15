import { navItems } from '../content'

type Props = { open: boolean; onToggle: () => void; onNavigate: () => void }

export function Logo() {
  return <a className="logo" href="#top"><img src="/assets/logo.svg" alt="" /><strong>Portier</strong></a>
}

export default function Header({ open, onToggle, onNavigate }: Props) {
  return <header className="header" id="top">
    <Logo />
    <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main navigation">
      {navItems.map(item => <a key={item.label} href={item.href} onClick={onNavigate}>{item.label}</a>)}
    </nav>
    <a className="button button--secondary header__cta" href="#contact">Get Template</a>
    <button className="menu" aria-label="Menu" aria-expanded={open} onClick={onToggle}>
      <span /><span /><span />
    </button>
  </header>
}
