import '../styles/components/CTASection.css';

export default function CTASection({ data }) {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
        <a href={data.button_link} className="btn btn-light">
          {data.button_text}
        </a>
      </div>
    </section>
  );
}