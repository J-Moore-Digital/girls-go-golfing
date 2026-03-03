# Girls Go Golfing Website

Single-page React/Vite site for the Girls Go Golfing women's golf community.

## Stack
- React 19
- Vite 7
- Plain CSS (`src/styles/globals.css`)
- Stripe Checkout backend scaffold (`server/index.js`)

## Run locally
```bash
npm install
npm run dev
```

## Run Stripe backend locally
```bash
cp .env.example .env
# add your Stripe keys + price IDs to .env
npm run dev:server
```

Frontend + backend together (two processes):
```bash
npm run dev:full
```

## Stripe setup checklist
1. Create recurring products/prices in Stripe Dashboard.
2. Put your price IDs in `.env`:
- `STRIPE_PRICE_ID_ANNUAL`
- `STRIPE_PRICE_ID_MONTHLY` (optional)
3. Set secrets:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
4. Start webhook forwarding from Stripe CLI:
```bash
stripe listen --forward-to localhost:4242/api/stripe/webhook
```
5. Use the emitted `whsec_...` for `STRIPE_WEBHOOK_SECRET`.

## Implemented payment flow
- Frontend CTA uses `button_link: "stripe_checkout"` in `girls-go-golfing.json`.
- `src/components/CTASection.jsx` calls `POST /api/stripe/create-checkout-session`.
- Backend creates a Stripe Checkout Session and returns `session.url`.
- Browser redirects directly to Stripe hosted checkout.
- Webhook endpoint handles:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Membership records are written to `server/data/members.json`.

## Production build
```bash
npm run build
npm run preview
```

## Content editing
All site content is hard-coded in:
- `src/data/girls-go-golfing.json`

Update this file to edit:
- Business/contact info
- Hero/About/Services/Testimonial copy
- CTA content
- Theme colors
- SEO metadata

## Key app files
- `src/App.jsx`: page composition and SEO/theme meta setup
- `src/components/*`: section components
- `public/logos/GGG-logo.png`: navbar logo
- `server/index.js`: Stripe session + webhook scaffold

## Notes
- The app currently hides the Gallery section when `gallery` is empty in the JSON.
- Contact form uses `mailto:` fallback unless a form endpoint is configured in the JSON.
