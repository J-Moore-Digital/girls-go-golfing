import '../styles/components/Services.css';

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
    </article>
  );
}

export default function Services({ data }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const [featured, ...rest] = items;

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="services-title">{data.title}</h2>
        <div className="services-top-row">
          <p className="services-intro">
            {data.intro ||
              'Joining Girls Go Golfing means being part of a movement that prioritizes visibility, community, and professional growth. We create space for women to thrive both on and off the course.'}
          </p>
          {featured && (
            <article className="service-featured-card">
              <h3>{featured.name}</h3>
              <p>{featured.description}</p>
            </article>
          )}
        </div>
        <div className="services-grid">
          {rest.map((service, index) => (
            <ServiceCard key={`${service.name}-${index}`} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
