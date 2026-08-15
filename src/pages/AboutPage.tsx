import { vintageObjects } from '../grainContent'
import Layout from '../grain/Layout'

export default function AboutPage() {
  return <Layout><header className="page-header about-header"><h1>About</h1></header><section className="objects" aria-label="Vintage media objects">{vintageObjects.map(name=><img src={`/assets/grain/${name}.png`} alt="" key={name}/>)}</section><section className="about-copy"><h2>Why this exists</h2><p>Grain Archive is a running record of the fuzz, fragments, and found moments in music, film, and visual culture. From washed-out shoegaze to sun-faded celluloid, we document the tones that don’t always get clean airtime. Not everything needs to be polished to mean something. Independently run by me, Casey Moth, and updated at the mercy of mood, memory, and whatever’s looping at 3am.</p></section><section className="contact"><img src="/assets/grain/portrait.png" alt="Portrait of the Grain Archive editor"/><div><h2>Contact</h2><p>Got a dusty VHS, a lost record, or a film no one talks about?</p><p>Send recs, love letters, or questions to <a href="mailto:mail@grainarchive.com">mail@grainarchive.com</a>.</p></div></section></Layout>
}
