import { projects } from '../content'

export default function Works() {
  return <section className="works" id="portfolio" aria-label="Portfolio">
    {projects.map(project => <a href="#contact" className="project" key={project.title}>
      <img className="project__image" src={project.image} alt={`${project.title} project preview`} />
      <span className="project__title">{project.title}</span>
      <span className={`project__arrow ${project.featured ? 'project__arrow--active' : ''}`}><img src={project.featured ? '/assets/arrow-active.svg' : '/assets/arrow.svg'} alt="" /></span>
    </a>)}
  </section>
}
