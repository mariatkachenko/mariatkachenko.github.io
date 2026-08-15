import type { Article } from '../grainContent'
import SiteLink from './SiteLink'

export default function ArticleCard({ article }: { article: Article }) {
  return <article className="article-card"><SiteLink href="/article"><img src={article.image} alt={`${article.title} editorial`} /><div className="article-card__caption"><h2>{article.title}</h2><p>{article.category} · {article.date}</p></div></SiteLink></article>
}
