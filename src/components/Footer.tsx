import { navItems } from '../content'
import { Logo } from './Header'

const links = [...navItems, { label: 'Contact', href: '#contact' }, { label: 'Handbook', href: '#' }, { label: 'Design System', href: '#' }, { label: 'Timeline', href: '#' }]
const socials = ['twitter', 'github', 'figma', 'codesandbox']

export default function Footer() {
  return <footer className="footer"><Logo /><nav aria-label="Footer navigation">{links.map(item => <a key={item.label} href={item.href}>{item.label}</a>)}</nav><p>Copyright 2021 © Portier. All right reserved</p><div className="socials">{socials.map(name => <a href="#" aria-label={name} key={name}><img src={`/assets/social-${name}.svg`} alt="" /></a>)}</div></footer>
}
