import { articles, cinemaPicks } from '../grainContent'
import ArticleCard from '../grain/ArticleCard'
import HeroMedia from '../grain/HeroMedia'
import Layout from '../grain/Layout'
import SiteLink from '../grain/SiteLink'

export default function HomePage() {
  return <Layout marquee="Independent writing on music, film, and visual culture—one deep cut at a time.">
    <HeroMedia />
    <section className="article-grid">{articles.map((article, i) => <ArticleCard article={article} key={i} />)}</section>
    <SiteLink className="view-all" href="/archive">View all</SiteLink>
    <section className="album-feature"><h2>Featured Album</h2><img src="/assets/grain/album-cover.png" alt="False Memory by Artifact album cover" /><p>False Memory by Artifact</p><a href="#listen">▷ Listen now</a></section>
    <section className="cinema"><h2>Cinema Selects</h2><div className="cinema__labels"><span>Film</span><span>Year</span><span>Mood</span><span>Why watch</span></div>{cinemaPicks.map((pick, i) => <div className="cinema__row" key={i}><span>{pick.film}</span><span>{pick.year}</span><span>{pick.mood}</span><span>{pick.why}</span></div>)}</section>
  </Layout>
}
