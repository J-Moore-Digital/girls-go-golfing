import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import Stripe from 'stripe';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const membersFile = path.join(__dirname, 'data', 'members.json');

const {
  PORT = 4242,
  FRONTEND_URL = 'http://localhost:5173',
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_ID_ANNUAL,
  STRIPE_PRICE_ID_MONTHLY,
} = process.env;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables.');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

const planPriceIds = {
  annual: STRIPE_PRICE_ID_ANNUAL,
  monthly: STRIPE_PRICE_ID_MONTHLY,
};

async function readMembers() {
  try {
    const json = await fs.readFile(membersFile, 'utf8');
    return JSON.parse(json);
  } catch {
    return [];
  }
}

async function writeMembers(records) {
  await fs.mkdir(path.dirname(membersFile), { recursive: true });
  await fs.writeFile(membersFile, JSON.stringify(records, null, 2));
}

async function upsertMember(update) {
  const records = await readMembers();
  const index = records.findIndex((row) => {
    if (update.subscriptionId && row.subscriptionId === update.subscriptionId) return true;
    if (update.customerId && row.customerId === update.customerId) return true;
    return false;
  });

  const next = {
    ...update,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    records[index] = { ...records[index], ...next };
  } else {
    records.push({
      id: `member_${Date.now()}`,
      ...next,
      createdAt: new Date().toISOString(),
    });
  }

  await writeMembers(records);
}

const app = express();
app.use(cors({ origin: FRONTEND_URL }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/stripe/create-checkout-session', express.json(), async (req, res) => {
  try {
    const plan = (req.body?.plan || 'annual').toLowerCase();
    const email = req.body?.email || undefined;
    const priceId = planPriceIds[plan];

    if (!priceId) {
      return res.status(400).json({
        error: `Plan '${plan}' is not configured. Set STRIPE_PRICE_ID_${plan.toUpperCase()} in your server env.`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/?checkout=cancelled`,
      customer_email: email,
      allow_promotion_codes: true,
      metadata: {
        plan,
      },
    });

    return res.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Failed to create Stripe Checkout session.',
    });
  }
});

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!STRIPE_WEBHOOK_SECRET) {
      return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
    }

    const signature = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        await upsertMember({
          email: session.customer_details?.email || session.customer_email || null,
          customerId: session.customer || null,
          subscriptionId: session.subscription || null,
          plan: session.metadata?.plan || 'annual',
          status: 'active',
          lastEvent: event.type,
        });
      }

      if (
        event.type === 'customer.subscription.updated' ||
        event.type === 'customer.subscription.deleted'
      ) {
        const subscription = event.data.object;
        const isDeleted = event.type === 'customer.subscription.deleted';

        await upsertMember({
          customerId: subscription.customer,
          subscriptionId: subscription.id,
          status: isDeleted ? 'cancelled' : subscription.status,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
          lastEvent: event.type,
        });
      }

      return res.json({ received: true });
    } catch (error) {
      return res.status(500).json({ error: error?.message || 'Webhook processing failed.' });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Stripe server listening on http://localhost:${PORT}`);
});
