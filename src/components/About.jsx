import '../styles/components/About.css';

export default function About({ data }) {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-layout">
          <div className="about-panel">
            <p className="about-kicker script-accent">The Movement</p>
            <h2>{data.title}</h2>
            <p className="about-copy">{data.content}</p>
            <a href="#services" className="about-link script-accent">Our Values</a>
          </div>
          <div className="about-media">
            <img src={data.image} alt="Women golfers walking together" className="about-image" />
          </div>
        </div>
      </div>
    </section>
  );
}
