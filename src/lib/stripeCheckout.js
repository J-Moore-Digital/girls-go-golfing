function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (!configured) return '';
  return configured.endsWith('/') ? configured.slice(0, -1) : configured;
}

export async function createStripeCheckoutSession({ plan = 'annual', email } = {}) {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan,
      email,
    }),
  });

  if (!response.ok) {
    let message = 'Could not start checkout. Please try again.';
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      // Ignore parse errors and keep fallback message.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function redirectToStripeCheckout(options) {
  const session = await createStripeCheckoutSession(options);

  if (!session?.url) {
    throw new Error('Stripe checkout URL was not returned by the server.');
  }

  window.location.assign(session.url);
}
