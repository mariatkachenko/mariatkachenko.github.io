import type { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'
import Subscribe from './Subscribe'

export default function Layout({ children, marquee }: { children: ReactNode; marquee?: string }) {
  return <div className={`grain-site${marquee ? ' grain-site--marquee' : ''}`}><Navigation />{marquee && <p className="top-marquee">{marquee}</p>}<main id="main" tabIndex={-1}>{children}</main><Subscribe /><Footer /></div>
}
