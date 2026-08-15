import { quote, testimonials } from '../content'

export default function Testimonials() {
  return <section className="testimonials">
    <div className="testimonials__intro"><h2>What people say about me</h2><p>These steps are: Deep Observation (The Passive Mode), Skills Acquisition (The Practice Mode), and Experimentation (The Active Mode).</p><small>Empathy plays an enormous role in learning and knowledge.</small></div>
    <div className="testimonial-list">{testimonials.map(item => <article className={`testimonial ${item.featured ? 'testimonial--featured' : ''}`} key={item.name}>
      <img src={item.avatar} alt={`${item.name} avatar`} />
      <div><p>{quote}</p><h3>{item.name}</h3><small>{item.role}</small></div>
    </article>)}</div>
  </section>
}
