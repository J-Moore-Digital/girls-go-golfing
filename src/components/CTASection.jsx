import { useState } from 'react';
import '../styles/components/CTASection.css';
import { redirectToStripeCheckout } from '../lib/stripeCheckout';

export default function CTASection({ data }) {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const shouldUseStripeCheckout = data?.button_link === 'stripe_checkout';

  const handleStripeCheckout = async () => {
    setCheckoutError('');
    setIsStartingCheckout(true);

    try {
      await redirectToStripeCheckout({
        plan: data?.checkout_plan || 'annual',
      });
    } catch (error) {
      setCheckoutError(error.message || 'Could not start checkout. Please try again.');
      setIsStartingCheckout(false);
    }
  };

  return (
    <section className="cta-section">
      <div className="container">
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
        {shouldUseStripeCheckout ? (
          <>
            <button
              type="button"
              className="btn btn-light"
              onClick={handleStripeCheckout}
              disabled={isStartingCheckout}
            >
              {isStartingCheckout ? 'Redirecting...' : data.button_text}
            </button>
            {checkoutError && <p className="cta-error">{checkoutError}</p>}
          </>
        ) : (
          <a href={data.button_link} className="btn btn-light">
            {data.button_text}
          </a>
        )}
      </div>
    </section>
  );
}
