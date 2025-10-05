// Contact form enhancement script with confetti
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        enhanceContactForm();
    });

    function enhanceContactForm() {
        const contactForm = document.querySelector('form[data-name="Contact form"]');
        if (!contactForm) return;

        // Add real-time character count
        const messageField = contactForm.querySelector('textarea[name="message"]');
        if (messageField) {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
            charCount.style.cssText = 'font-size: 12px; color: #7f8c8d; margin-top: 5px;';
            charCount.textContent = '0 characters';
            messageField.parentNode.appendChild(charCount);

            messageField.addEventListener('input', function() {
                const count = this.value.length;
                charCount.textContent = `${count} characters`;
                
                if (count > 500) {
                    charCount.style.color = '#e74c3c';
                } else if (count > 400) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#7f8c8d';
                }
            });
        }

        // Handle form submission with Formspree
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;
            
            // Show loading state
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;
            
            // Let the form submit naturally to Formspree
            // The success/error handling will be done by monitoring the page state
        });

        // Monitor for successful form submission
        // Formspree redirects or shows success state, we'll detect this
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    checkForSuccessState();
                }
            });
        });

        // Start observing the form container for changes
        const formContainer = contactForm.closest('.form-block');
        if (formContainer) {
            observer.observe(formContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        // Check URL parameters for success (in case Formspree redirects back)
        if (window.location.search.includes('success=true') || 
            window.location.hash.includes('success')) {
            triggerConfetti();
        }
    }

    function checkForSuccessState() {
        const successMessage = document.querySelector('.success-message.w-form-done');
        const errorMessage = document.querySelector('.error-message.w-form-fail');
        
        // Check if success message is visible
        if (successMessage && 
            (successMessage.style.display !== 'none' && 
             !successMessage.classList.contains('w-hidden'))) {
            triggerConfetti();
        }
        
        // Reset submit button if there's an error
        if (errorMessage && 
            (errorMessage.style.display !== 'none' && 
             !errorMessage.classList.contains('w-hidden'))) {
            const submitBtn = document.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.value = 'Submit';
                submitBtn.disabled = false;
            }
        }
    }

    function triggerConfetti() {
        // Ensure confetti library is loaded
        if (typeof confetti === 'undefined') {
            console.warn('Confetti library not loaded');
            return;
        }

        // Create a burst of confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Create confetti from different positions
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);

        // Add a big burst at the center
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
})(); 