import { bodyCopy } from '../content'

type Props = { reverse?: boolean }

export default function Information({ reverse = false }: Props) {
  const title = reverse ? 'My main goal is too keep my customers satisfied.' : 'I build products for companies & startups.'
  return <section className={`information ${reverse ? 'information--reverse' : ''}`} id={reverse ? 'blog' : 'about'}>
    <div className="information__copy"><h2>{title}</h2><p>{reverse ? 'Even with skills that are primarily mental, such as computer programming or speaking a foreign language.' : bodyCopy}</p><p>{reverse ? 'it remains the case that we learn best through practice and repetition—the natural learning process.' : bodyCopy}</p></div>
    <img src={reverse ? '/assets/info-customer.png' : '/assets/info-workspace.png'} alt={reverse ? 'Designer working at a desk' : 'Minimal designer workspace'} />
  </section>
}
