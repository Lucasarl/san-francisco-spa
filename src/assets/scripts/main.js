/**
 * Import dependencies from node_modules
 * see commented examples below
 */

import "@fortawesome/fontawesome-free/css/all.min.css";

/**
 * San Francisco SPA - Professional JavaScript
 */

class SanFranciscoApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoading();
    this.setupNavigation();
    this.setupCarousel();
    this.setupScrollAnimations();
    this.setupScrollToTop();
    this.setupSmoothScrolling();
    this.setupContactForm();
    this.setupCounters();
  }

  // Loading Screen
  setupLoading() {
    // Hide loading screen immediately when DOM is ready
    const loading = document.getElementById('loading');
    if (loading) {
      setTimeout(() => {
        loading.classList.add('is-hidden');
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }, 800);
    }

    // Fallback: Hide loading screen after window load
    window.addEventListener('load', () => {
      const loading = document.getElementById('loading');
      if (loading && !loading.classList.contains('is-hidden')) {
        loading.classList.add('is-hidden');
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    });
  }

  // Navigation
  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Active link highlighting and smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile menu
        if (navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
        
        // Smooth scroll to target
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section, main');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // Image Carousel
  setupCarousel() {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.c-carousel__slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = carousel.querySelectorAll('.c-carousel__indicator');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let isAnimating = false;

    // Set background images
    slides.forEach((slide, index) => {
      const bgUrl = slide.getAttribute('data-bg');
      if (bgUrl) {
        // Set background image if not already set by CSS class
        if (!slide.classList.contains('c-lombard-street') && !slide.classList.contains('c-golden-gate') && !slide.classList.contains('c-painted-ladies') && !slide.classList.contains('c-alcatraz') && !slide.classList.contains('c-cable-car')) {
          slide.style.backgroundImage = bgUrl;
        }
      }
    });

    const showSlide = (index) => {
      if (isAnimating || index === currentSlide) return;
      isAnimating = true;

      // Remove active classes
      slides.forEach(slide => slide.classList.remove('is-active', 'is-prev'));
      indicators.forEach(indicator => indicator.classList.remove('is-active'));

      const prevSlide = currentSlide;
      currentSlide = index;

      // Add classes
      if (slides[prevSlide]) slides[prevSlide].classList.add('is-prev');
      if (slides[currentSlide]) slides[currentSlide].classList.add('is-active');
      if (indicators[currentSlide]) indicators[currentSlide].classList.add('is-active');

      setTimeout(() => {
        isAnimating = false;
      }, 800);
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    // Event listeners with error handling
    try {
      nextBtn?.addEventListener('click', nextSlide);
      prevBtn?.addEventListener('click', prevSlide);

      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
      });

      // Auto-play with error handling
      setInterval(() => {
        try {
          nextSlide();
        } catch (error) {
          console.warn('Carousel autoplay error:', error);
        }
      }, 5000);

    } catch (error) {
      console.warn('Carousel setup error:', error);
    }
  }

  // Scroll Animations
  setupScrollAnimations() {
    // Simple scroll animations with fallback
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-animate');
          }
        });
      }, observerOptions);

      // Observe elements with animation attributes
      const animatedElements = document.querySelectorAll('[data-aos], .c-card, .c-landmark, .c-testimonial, .c-stats__item');
      animatedElements.forEach(el => {
        if (el) observer.observe(el);
      });

    } catch (error) {
      console.warn('Animation observer not supported, using fallback');
      // Fallback: Add animate class to all elements immediately
      const animatedElements = document.querySelectorAll('[data-aos], .c-card, .c-landmark, .c-testimonial, .c-stats__item');
      animatedElements.forEach(el => {
        if (el) el.classList.add('is-animate');
      });
    }
  }

  // Scroll to Top Button
  setupScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth Scrolling for anchor links
  setupSmoothScrolling() {
    // General anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        console.log('Smooth scroll to:', targetId);
      });
    });

    // Specific handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.c-hero__cta');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        console.log('CTA button clicked:', targetId);
      });
    });

    // Specific handlers for footer links
    const footerLinks = document.querySelectorAll('.c-footer__links a[href^="#"]');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        console.log('Footer link clicked:', targetId);
      });
    });

    // Hero scroll button
    const heroScroll = document.querySelector('.c-hero__scroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        const nextSection = document.getElementById('carousel') || document.getElementById('neighborhoods');
        if (nextSection) {
          nextSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }
  }

  // Contact Form
  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.c-form__submit');
      const originalText = submitBtn.innerHTML;
      
      // Loading state
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success state
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Enviado!';
      submitBtn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
      
      // Reset form
      form.reset();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 3000);
    });

    // Floating label animation
    const formGroups = form.querySelectorAll('.c-form__group');
    formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      
      if (input && label) {
        input.addEventListener('focus', () => {
          label.style.transform = 'translateY(-20px) scale(0.8)';
          label.style.color = '#667eea';
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            label.style.transform = '';
            label.style.color = '';
          }
        });
      }
    });
  }

  // Animated Counters
  setupCounters() {
    console.log('Setting up counters...');
    const counters = document.querySelectorAll('.c-stats__number');
    console.log('Found', counters.length, 'counters');
    if (counters.length === 0) return;

    // Immediately show the numbers first
    counters.forEach((counter, index) => {
      const target = parseInt(counter.getAttribute('data-count')) || 0;
      counter.textContent = target.toLocaleString();
      counter.style.color = 'white';
      counter.style.fontSize = '3.5rem';
      counter.style.fontWeight = '900';
      console.log(`Counter ${index}: ${target}`);
    });

    try {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            
            if (target === 0) {
              counter.textContent = '0';
              return;
            }

            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 50); // 50ms intervals
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current).toLocaleString();
              }
            }, 50);

            counterObserver.unobserve(counter);
          }
        });
      }, { threshold: 0.2 });

      counters.forEach(counter => {
        if (counter) counterObserver.observe(counter);
      });

    } catch (error) {
      console.warn('Counter animation not supported, showing final values');
      // Numbers are already shown from the immediate display above
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new SanFranciscoApp();
    console.log('🌉 San Francisco SPA loaded successfully!');
  } catch (error) {
    console.error('Error initializing app:', error);
    // Emergency fallback: hide loading screen
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }
});

// Emergency fallback: ensure loading screen is hidden after 3 seconds
setTimeout(() => {
  const loading = document.getElementById('loading');
  if (loading && loading.style.display !== 'none') {
    loading.style.display = 'none';
    console.log('Emergency loading screen removal triggered');
  }
}, 3000);
