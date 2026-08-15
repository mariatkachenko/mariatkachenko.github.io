export default function HeroMedia() {
  return <header className="grain-hero">
    <h1>Grain Archive</h1>
    <video autoPlay muted loop playsInline poster="/assets/grain/hero-poster.jpg" aria-hidden="true">
      <source src="/assets/grain/hero.webm" type="video/webm" />
    </video>
    <img className="grain-hero__wordmark" src="/assets/grain/wordmark.svg" alt="" />
  </header>
}
