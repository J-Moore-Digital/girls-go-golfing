import '../styles/components/Hero.css';

export default function Hero({ data }) {
  return (
    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-media">
          <img src={data.background_image} alt="Women golfers on the course" />
        </div>
        <div className="hero-copy">
          <h1>{data.headline}</h1>
          <p>{data.subheadline}</p>
          <a href={data.cta_link} className="btn hero-btn">{data.cta_text}</a>
        </div>
      </div>
    </section>
  );
}
