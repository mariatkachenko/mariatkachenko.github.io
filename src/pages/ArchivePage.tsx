import { articles } from '../grainContent'
import ArticleCard from '../grain/ArticleCard'
import Layout from '../grain/Layout'

export default function ArchivePage() {
  const eight = [...articles, ...articles]
  return <Layout><header className="page-header"><h1>Archive</h1></header><section className="article-grid archive-grid">{eight.map((article, i) => <ArticleCard article={article} key={i} />)}</section><p className="end-reel">End of reel · Fin ·</p></Layout>
}
