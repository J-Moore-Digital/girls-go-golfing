import { useState } from 'react';
import '../styles/components/Membership.css';
import { redirectToStripeCheckout } from '../lib/stripeCheckout';

function PlanCard({ plan, isLoading, onCheckout }) {
  return (
    <article className="membership-plan-card">
      {plan.badge ? <p className="membership-plan-badge">{plan.badge}</p> : null}
      <h3>{plan.name}</h3>
      <p className="membership-plan-price">{plan.price}</p>
      {plan.interval ? <p className="membership-plan-interval">{plan.interval}</p> : null}
      <p className="membership-plan-description">{plan.description}</p>
      {Array.isArray(plan.features) && plan.features.length > 0 ? (
        <ul>
          {plan.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="btn"
        onClick={() => onCheckout(plan.plan_key || 'annual')}
        disabled={isLoading}
      >
        {isLoading ? 'Redirecting...' : plan.button_text || 'Join Now'}
      </button>
    </article>
  );
}

export default function Membership({ data }) {
  const [loadingPlan, setLoadingPlan] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  if (!data) return null;

  const handleCheckout = async (planKey) => {
    setCheckoutError('');
    setLoadingPlan(planKey);

    try {
      await redirectToStripeCheckout({ plan: planKey });
    } catch (error) {
      setCheckoutError(error.message || 'Could not start checkout. Please try again.');
      setLoadingPlan('');
    }
  };

  return (
    <section id="membership" className="membership">
      <div className="container">
        <p className="membership-kicker">Membership</p>
        <h2>{data.title}</h2>
        <p className="membership-subtitle">{data.subtitle}</p>

        {Array.isArray(data.benefits) && data.benefits.length > 0 ? (
          <div className="membership-benefits-grid">
            {data.benefits.map((benefit) => (
              <article className="membership-benefit-card" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        ) : null}

        {Array.isArray(data.plans) && data.plans.length > 0 ? (
          <div className="membership-plans-grid">
            {data.plans.map((plan) => (
              <PlanCard
                key={plan.plan_key || plan.name}
                plan={plan}
                isLoading={loadingPlan === (plan.plan_key || 'annual')}
                onCheckout={handleCheckout}
              />
            ))}
          </div>
        ) : null}

        {checkoutError ? <p className="membership-error">{checkoutError}</p> : null}
      </div>
    </section>
  );
}
