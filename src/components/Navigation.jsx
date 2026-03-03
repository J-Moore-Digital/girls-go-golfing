import { useState, useEffect } from 'react';

export default function Navigation({ business, labels, hasGallery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const navMenu = document.querySelector('nav ul');
      const mobileBtn = document.querySelector('.mobile-menu');
      
      if (navMenu && mobileBtn && 
          !navMenu.contains(e.target) && 
          !mobileBtn.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        <a href="#" className="logo" onClick={(e) => scrollToSection(e, '#top')}>
          <img src={business.logo_svg} alt={`${business.name}`} />
        </a>
        <ul className={isMenuOpen ? 'active' : ''}>
          <li><a href="#about" onClick={(e) => scrollToSection(e, '#about')}>{labels.nav_about}</a></li>
          <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>{labels.nav_services}</a></li>
          <li><a href="#membership" onClick={(e) => scrollToSection(e, '#membership')}>{labels.nav_membership || 'Membership'}</a></li>
          {hasGallery && (
            <li>
              <a href="#gallery" onClick={(e) => scrollToSection(e, '#gallery')}>
                {labels.nav_gallery}
              </a>
            </li>
          )}
          <li><a href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')}>{labels.nav_testimonials}</a></li>
          <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>{labels.nav_contact}</a></li>
        </ul>
        <div 
          className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
