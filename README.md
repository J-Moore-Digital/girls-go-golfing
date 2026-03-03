# Girls Go Golfing Website

Single-page React/Vite site for the Girls Go Golfing women's golf community.

## Stack
- React 19
- Vite 7
- Plain CSS (`src/styles/globals.css`)

## Run locally
```bash
npm install
npm run dev
```

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

## Notes
- The app currently hides the Gallery section when `gallery` is empty in the JSON.
- Contact form uses `mailto:` fallback unless a form endpoint is configured in the JSON.
