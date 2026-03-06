import '../styles/components/GolfFooter.css';

function SocialLinks({ social }) {
  const socialIcons = {
    facebook: '/icons/facebook.png',
    instagram: '/icons/instagram.png',
    twitter: '/icons/twitter.png',
  };

  return (
    <div className="social-links">
      {Object.entries(social || {}).map(([platform, url]) => {
        if (!url) return null;
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={platform.charAt(0).toUpperCase() + platform.slice(1)}
          >
            {socialIcons[platform] ? (
              <img
                src={socialIcons[platform]}
                alt={`${platform} icon`}
                className="social-icon-img"
              />
            ) : (
              '🔗'
            )}
          </a>
        );
      })}
    </div>
  );
}

export default function GolfFooter({ business }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="golf-footer">
      <div className="container">
        <div className="golf-footer-top">
          <div className="golf-footer-brand">
            <a href="#" className="footer-logo" onClick={(e) => scrollToSection(e, '#top')}>
              <img src={business.logo_svg} alt={`${business.name}`} />
            </a>
            <p>{business.address}</p>
          </div>
          <div className="golf-footer-contact-links">
            <a href={`tel:${(business?.phone || '').replace(/[^\d+]/g, '')}`}>{business.phone}</a>
            <a href={`mailto:${business?.email || ''}`}>{business.email}</a>
          </div>
        </div>
        <SocialLinks social={business.social} />
        <p>&copy; {currentYear} {business.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
