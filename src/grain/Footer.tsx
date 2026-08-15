import SiteLink from './SiteLink'

export default function Footer() {
  return <footer className="grain-footer"><h2>Grain<br />Archive</h2><div className="footer-columns"><div><span>Links</span><SiteLink href="/">Home</SiteLink><SiteLink href="/archive">Archive</SiteLink><SiteLink href="/about">About</SiteLink></div><div><span>Connect</span><a href="https://instagram.com/figma">Instagram</a><a href="https://threads.com/@figma">Threads</a><a href="https://youtube.com/@figma">YouTube</a><a href="mailto:mail@grainarchive.com">Email</a></div><p>©2025 Grain Archive<br />Words, images, and signals from the edge</p></div></footer>
}
