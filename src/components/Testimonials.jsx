import '../styles/components/Testimonials.css';

function TestimonialCard({ testimonial }) {
  const stars = '★'.repeat(testimonial.rating);
  
  return (
    <div className="testimonial-card">
      <div className="stars">{stars}</div>
      <p className="testimonial-text">"{testimonial.text}"</p>
      <p className="testimonial-author">— {testimonial.author}</p>
    </div>
  );
}

export default function Testimonials({ data, labels }) {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2 className="section-title">{labels.testimonials_title}</h2>
        <div className="testimonials-grid">
          {data.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
