document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mainNav = document.getElementById('mainNav');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');

  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      
      // Transform hamburger to X
      hamburgerLines[0].style.transform = mainNav.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : '';
      hamburgerLines[1].style.opacity = mainNav.classList.contains('open') ? '0' : '1';
      hamburgerLines[2].style.transform = mainNav.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        document.body.classList.remove('no-scroll');
        hamburgerLines[0].style.transform = '';
        hamburgerLines[1].style.opacity = '1';
        hamburgerLines[2].style.transform = '';
      });
    });
  }

  // Header Scroll State
  const header = document.getElementById('siteHeader');
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (scrollToTopBtn) scrollToTopBtn.classList.add('show');
    } else {
      header.classList.remove('scrolled');
      if (scrollToTopBtn) scrollToTopBtn.classList.remove('show');
    }

    // Update Scroll Progress Bar
    if (scrollProgress) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const percentage = (window.scrollY / totalScroll) * 100;
        scrollProgress.style.width = `${percentage}%`;
      } else {
        scrollProgress.style.width = '0%';
      }
    }
  });

  // Scroll to Top
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active Nav Link highlighting on scroll using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav.main-nav a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animates once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Cookie Banner Consent Logic
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookies = document.getElementById('acceptCookies');
  const declineCookies = document.getElementById('declineCookies');

  if (cookieBanner && acceptCookies && declineCookies) {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('ccc_cookies_consent');

    if (!cookieChoice) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('ccc_cookies_consent', 'accepted');
      cookieBanner.classList.remove('show');
    });

    declineCookies.addEventListener('click', () => {
      localStorage.setItem('ccc_cookies_consent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // Contact Form Submission & Client-Side Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const role = document.getElementById('formRole').value;
      const message = document.getElementById('formMessage').value.trim();
      const consent = document.getElementById('formConsent').checked;

      // Validate reCAPTCHA
      const recaptchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';

      if (!name || !email || !role || !message || !consent) {
        alert('Please fill out all fields and accept the privacy consent checkbox.');
        return;
      }

      if (!recaptchaResponse) {
        alert('Please complete the \'I am not a robot\' check before sending your message.');
        return;
      }

      // Format mailto link properties
      const recipient = 'carerscommunity@jstraininganddevelopment.co.uk';
      const subject = encodeURIComponent(`CCC Enquiry: ${role} - ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `I am a: ${role}\n\n` +
        `Message:\n${message}\n\n` +
        `Consent: Granted (I'm happy for CCC to contact me about my enquiry)`
      );

      // Trigger mail client fallback
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Show success message container
      const parent = contactForm.parentElement;
      const successDiv = document.createElement('div');
      successDiv.className = 'form-success-message';
      successDiv.style.padding = '2rem';
      successDiv.style.backgroundColor = 'var(--sage-green-light)';
      successDiv.style.borderRadius = 'var(--border-radius-md)';
      successDiv.style.border = '2px solid var(--sage-green)';
      successDiv.style.textAlign = 'center';
      successDiv.style.marginTop = '1rem';
      successDiv.innerHTML = `
        <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Thank You!</h3>
        <p style="color: var(--text-dark); margin-bottom: 1.5rem;">Your email client has been opened with your message. If it didn't open automatically, please send your email directly to <a href="mailto:carerscommunity@jstraininganddevelopment.co.uk" style="color: var(--primary); font-weight: bold;">carerscommunity@jstraininganddevelopment.co.uk</a>.</p>
        <button class="btn btn-primary btn-reset-form" style="padding: 0.5rem 1.25rem; font-size: 0.875rem;">Send another message</button>
      `;

      contactForm.style.display = 'none';
      parent.appendChild(successDiv);

      successDiv.querySelector('.btn-reset-form').addEventListener('click', () => {
        successDiv.remove();
        contactForm.reset();
        // Reset reCAPTCHA widget on form reset
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
        contactForm.style.display = 'block';
      });
    });
  }
});
