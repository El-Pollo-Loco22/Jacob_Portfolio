// Contact form enhancement script
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        enhanceContactForm();
    });

    function enhanceContactForm() {
        const contactForm = document.querySelector('form[data-name="Contact Form"]');
        if (!contactForm) return;

        // Add real-time character count
        const messageField = contactForm.querySelector('textarea[name="Message"]');
        if (messageField) {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
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

        // Add form submission feedback
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;
            
            // Show loading state
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(function() {
                showSuccessMessage(contactForm);
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    function showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-top: 15px; text-align: center;">
                <strong>Thank you!</strong> Your message has been sent successfully. I'll get back to you soon.
            </div>
        `;
        
        form.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(function() {
            successDiv.remove();
        }, 5000);
    }
})(); 