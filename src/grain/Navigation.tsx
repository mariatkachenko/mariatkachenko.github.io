import SiteLink from './SiteLink'

export default function Navigation() {
  return <nav className="grain-nav" aria-label="Primary navigation">
    <SiteLink className="grain-nav__logo" href="/" aria-label="Grain Archive home"><img src="/assets/grain/logo.png" alt="" /></SiteLink>
    <div><SiteLink className="nav-home" href="/">Home</SiteLink><SiteLink className="nav-archive" href="/archive">Archive</SiteLink><SiteLink className="nav-about" href="/about">About</SiteLink></div>
  </nav>
}
