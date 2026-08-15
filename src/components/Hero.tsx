import { services } from '../content'

const serviceCopy = 'The time that leads to mastery is dependent on the intensity of our focus.'

export default function Hero() {
  return <section className="hero">
    <div className="hero__intro">
      <h1>Digital <span>Product</span> Designer<i>.</i></h1>
      <p>I am Portier, experienced Digital Product Designer based on Florida.<br /> I am here to help you build your amazing product.</p>
      <a className="button" href="#contact">Hire Me</a>
    </div>
    <div className="services">
      {services.map(service => <article className={`service ${service.featured ? 'service--featured' : ''}`} key={service.title}>
        <span className="icon-box"><img src={service.icon} alt="" /></span>
        <div><h2>{service.title}</h2><p>{serviceCopy}</p></div>
      </article>)}
    </div>
  </section>
}
