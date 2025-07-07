// Custom JavaScript for Jacob Williams Portfolio
// Enhanced functionality and user experience improvements

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePortfolio();
    });

    function initializePortfolio() {
        // Initialize all features
        initPreloader();
        initSmoothScrolling();
        initLazyLoading();
        initScrollAnimations();
        initFormEnhancements();
        initInteractiveElements();
        initPerformanceOptimizations();
        initAccessibilityFeatures();
        initAnalytics();
    }

    // ===== PRELOADER FUNCTIONALITY =====
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        // Hide preloader after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.classList.remove('loading');
            }, 500);
        });
    }

    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Smooth scroll for "My work" button
        const workButton = document.querySelector('.circle-link');
        if (workButton) {
            workButton.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector('#Select');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ===== LAZY LOADING =====
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Animate elements on scroll
            document.querySelectorAll('.brix---team-v9-wrapper-3, .content-wrapper, .section-intro').forEach(el => {
                el.classList.add('scroll-animate');
                animationObserver.observe(el);
            });
        }

        // Parallax effect for background elements
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.background-wrapper');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===== FORM ENHANCEMENTS =====
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add loading states
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.value = 'Sending...';
                    submitBtn.classList.add('loading');
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearValidation);
            });
        });
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Show/hide validation message
        showFieldValidation(field, isValid, message);
    }

    function showFieldValidation(field, isValid, message) {
        let messageEl = field.parentNode.querySelector('.validation-message');
        
        if (!isValid) {
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.className = 'validation-message error';
                field.parentNode.appendChild(messageEl);
            }
            messageEl.textContent = message;
            field.classList.add('error');
        } else {
            if (messageEl) {
                messageEl.remove();
            }
            field.classList.remove('error');
        }
    }

    function clearValidation(e) {
        const field = e.target;
        field.classList.remove('error');
        const messageEl = field.parentNode.querySelector('.validation-message');
        if (messageEl) {
            messageEl.remove();
        }
    }

    // ===== INTERACTIVE ELEMENTS =====
    function initInteractiveElements() {
        // Enhanced hover effects for project cards
        const projectCards = document.querySelectorAll('.brix---team-v9-wrapper-3');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Typing animation for hero text
        const heroTitle = document.querySelector('.hero-title h1');
        if (heroTitle) {
            typeWriter(heroTitle, heroTitle.textContent, 50);
        }

        // Logo animation
        const logos = document.querySelectorAll('.logo-image');
        logos.forEach((logo, index) => {
            logo.style.animationDelay = `${index * 0.1}s`;
            logo.classList.add('logo-animate');
        });
    }

    function typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        setTimeout(type, 1000);
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    function initPerformanceOptimizations() {
        // Debounced scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(function() {
                // Handle scroll-based animations
                updateScrollBasedElements();
            }, 16); // ~60fps
        });

        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            }
        });
    }

    function updateScrollBasedElements() {
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Navbar background on scroll
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ===== ACCESSIBILITY FEATURES =====
    function initAccessibilityFeatures() {
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Escape key to close modals/menus
            if (e.key === 'Escape') {
                const openMenus = document.querySelectorAll('.w-nav-menu.w--open');
                openMenus.forEach(menu => {
                    menu.classList.remove('w--open');
                });
            }

            // Tab key navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Mouse navigation
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Focus management
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    // ===== ANALYTICS =====
    function initAnalytics() {
        // Track page views
        trackPageView();

        // Track interactions
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button');
            if (target) {
                trackInteraction(target);
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    trackScrollDepth(maxScroll);
                }
            }
        });
    }

    function trackPageView() {
        // Simple analytics tracking
        console.log('Page viewed:', window.location.pathname);
        // Add your analytics service here (Google Analytics, etc.)
    }

    function trackInteraction(element) {
        const action = element.textContent.trim() || element.getAttribute('href') || 'unknown';
        console.log('Interaction tracked:', action);
        // Add your analytics service here
    }

    function trackScrollDepth(depth) {
        console.log('Scroll depth:', depth + '%');
        // Add your analytics service here
    }

    // ===== UTILITY FUNCTIONS =====
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add CSS for animations
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Scroll animations */
            .scroll-animate {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .scroll-animate.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Logo animations */
            .logo-animate {
                animation: logoFloat 3s ease-in-out infinite;
            }
            
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            /* Loading states */
            .loading {
                position: relative;
                pointer-events: none;
            }
            
            .loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Validation styles */
            .validation-message {
                font-size: 12px;
                margin-top: 5px;
            }
            
            .validation-message.error {
                color: #e74c3c;
            }
            
            input.error {
                border-color: #e74c3c;
            }
            
            /* Accessibility */
            .keyboard-navigation *:focus {
                outline: 2px solid #3498db;
                outline-offset: 2px;
            }
            
            /* Navbar scroll effect */
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            /* Image loading */
            img {
                transition: opacity 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
            }
            
            /* Preloader */
            .preloader {
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize custom styles
    addCustomStyles();

})(); 