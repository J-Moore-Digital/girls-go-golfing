import { useEffect, useState } from 'react';
import siteData from './data/girls-go-golfing.json';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Membership from './components/Membership';
import Contact from './components/Contact';
import GolfFooter from './components/GolfFooter';
import './styles/globals.css';

const labels = siteData.ui_labels || {};
const hasGallery = Array.isArray(siteData.gallery) && siteData.gallery.length > 0;

function toAbsoluteUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${window.location.origin}${url}`;
}

function upsertMeta(selector, attrs, content) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function App() {
  const [checkoutStatus, setCheckoutStatus] = useState(() => {
    if (typeof window === 'undefined') return '';
    const checkout = new URLSearchParams(window.location.search).get('checkout');
    return checkout === 'success' || checkout === 'cancelled' ? checkout : '';
  });

  useEffect(() => {
    const theme = siteData.theme || {};
    const root = document.documentElement;

    root.style.setProperty('--primary-color', theme.primary_color || '#F7A8B8');
    root.style.setProperty('--secondary-color', theme.secondary_color || '#2E5D43');
    root.style.setProperty('--accent-color', theme.accent_color || '#6BB96F');
    root.style.setProperty('--accent-lavender', theme.lavender_color || '#DBB4E2');
    root.style.setProperty('--accent-yellow', theme.pastel_yellow_color || '#FFF3B0');
  }, []);

  useEffect(() => {
    if (!checkoutStatus) return;

    const params = new URLSearchParams(window.location.search);
    params.delete('checkout');
    params.delete('session_id');
    const cleanQuery = params.toString();
    const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', cleanUrl);
  }, [checkoutStatus]);

  useEffect(() => {
    const business = siteData.business || {};
    const siteTitle = business.tagline
      ? `${business.name} - ${business.tagline}`
      : business.name || 'Girls Go Golfing';

    const defaultDescription = siteData.about?.content
      ? `${siteData.about.content.slice(0, 155)}...`
      : 'Girls Go Golfing connects women and girls through community golf groups.';

    const description = siteData.seo?.description || defaultDescription;
    const ogImage = toAbsoluteUrl(siteData.seo?.og_image || siteData.hero?.background_image || '');

    document.title = siteTitle;
    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, siteTitle);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, ogImage);

    const sameAs = Object.values(business.social || {}).filter(Boolean);
    const schema = {
      '@context': 'https://schema.org',
      '@type': siteData.seo?.schema_type || 'SportsOrganization',
      name: business.name,
      description,
      telephone: business.phone,
      email: business.email,
      address: business.address,
      openingHours: business.hours,
      image: ogImage,
      url: window.location.href,
      sameAs,
    };

    let schemaTag = document.getElementById('local-business-schema');
    if (!schemaTag) {
      schemaTag = document.createElement('script');
      schemaTag.type = 'application/ld+json';
      schemaTag.id = 'local-business-schema';
      document.head.appendChild(schemaTag);
    }
    schemaTag.textContent = JSON.stringify(schema);
  }, []);

  return (
    <>
      <div id="top"></div>
      <Navigation business={siteData.business} labels={labels} hasGallery={hasGallery} />
      {checkoutStatus && (
        <div className={`checkout-banner ${checkoutStatus}`}>
          <div className="container checkout-banner-inner">
            <p>
              {checkoutStatus === 'success'
                ? 'Test payment successful. Stripe checkout returned correctly.'
                : 'Checkout was cancelled. No payment was made.'}
            </p>
            <button type="button" onClick={() => setCheckoutStatus('')}>
              Dismiss
            </button>
          </div>
        </div>
      )}
      <main>
        <Hero data={siteData.hero} />
        <About data={siteData.about} />
        <Services data={siteData.services} />
        {hasGallery && <Gallery images={siteData.gallery} labels={labels} />}
        <Testimonials data={siteData.testimonials} labels={labels} />
        <Membership data={siteData.membership} />
        <CTASection data={siteData.cta_section} />
        <Contact
          business={siteData.business}
          contactForm={siteData.contact_form}
          businessType="golf-course"
          labels={labels}
        />
      </main>
      <GolfFooter business={siteData.business} />
    </>
  );
}

export default App;
