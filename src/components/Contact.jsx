import { useState } from 'react';
import '../styles/components/Contact.css';

export default function Contact({ business, contactForm, businessType, labels }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const submitByEmailClient = () => {
    const emailTarget = business?.email || '';
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${emailTarget}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      if (contactForm?.endpoint) {
        const response = await fetch(contactForm.endpoint, {
          method: (contactForm.method || 'POST').toUpperCase(),
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            business: business.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }
      } else {
        submitByEmailClient();
      }

      setStatus({
        type: 'success',
        message: contactForm?.success_message || 'Thanks! Your message has been sent.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        message: contactForm?.error_message || 'Could not send message. Please call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const normalizedBusinessType = (businessType || '').trim().toLowerCase();
  const hideFormForGolf = normalizedBusinessType === 'golf-course';
  const showForm =
    contactForm?.enabled === true || (!hideFormForGolf && contactForm?.enabled !== false);
  const contactInfoClass = showForm ? 'contact-info' : 'contact-info contact-info-grid';

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{labels.contact_title}</h2>
        <div className={`contact-grid ${showForm ? '' : 'contact-grid-single'}`.trim()}>
          <div className={contactInfoClass}>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>{labels.contact_phone_label}</h3>
                <p>
                  <a href={`tel:${(business?.phone || '').replace(/[^\d+]/g, '')}`}>
                    {business?.phone}
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <h3>{labels.contact_email_label}</h3>
                <p><a href={`mailto:${business?.email || ''}`}>{business?.email}</a></p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>{labels.contact_address_label}</h3>
                <p>{business?.address}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div>
                <h3>{labels.contact_hours_label}</h3>
                <p>{business?.hours}</p>
              </div>
            </div>
          </div>
          {showForm && (
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder={labels.form_name_placeholder}
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder={labels.form_email_placeholder}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder={labels.form_subject_placeholder}
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder={labels.form_message_placeholder}
                value={formData.message}
                onChange={handleChange}
                required
              />
              {status.message && (
                <p className={`form-status ${status.type}`}>{status.message}</p>
              )}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? labels.form_submitting : labels.form_submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
