// Selection Stack Animation and Interaction Script
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initializeSelectionStack();
    });

    function initializeSelectionStack() {
        // Initialize staggered animations
        animateButtonsOnLoad();
        
        // Add enhanced interactions
        enhanceButtonInteractions();
        
        // Add keyboard navigation
        addKeyboardNavigation();
        
        // Add analytics tracking
        trackButtonInteractions();
    }

    function animateButtonsOnLoad() {
        const buttons = document.querySelectorAll('.selection-stack .select-btn');
        
        if (buttons.length === 0) return;

        // Reset initial state
        buttons.forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(40px)';
        });

        // Animate buttons in with staggered delay
        buttons.forEach((btn, index) => {
            const delay = 300 + (index * 200); // Longer delay for more dramatic effect
            
            setTimeout(() => {
                btn.style.transition = 'all 0.8s cubic-bezier(0.4, 2, 0.6, 1)';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
                
                // Add subtle scale effect for square buttons
                if (btn.classList.contains('square')) {
                    setTimeout(() => {
                        btn.style.transform = 'scale(1.01)';
                        setTimeout(() => {
                            btn.style.transform = 'scale(1)';
                        }, 300);
                    }, 600);
                }
            }, delay);
        });

        // Add entrance sound effect simulation (visual feedback)
        setTimeout(() => {
            addVisualRippleEffect();
        }, 1000);
    }

    function enhanceButtonInteractions() {
        const buttons = document.querySelectorAll('.selection-stack .select-btn');
        
        buttons.forEach(btn => {
            // Enhanced hover effect
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.filter = 'brightness(1.1) contrast(1.1)';
                
                // Add ripple effect
                addRippleEffect(this);
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.filter = 'brightness(1) contrast(1)';
            });

            // Click animation
            btn.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.98)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'scale(1.02)';
            });

            // Focus enhancement
            btn.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.outline = '4px solid rgba(255, 255, 255, 0.6)';
                this.style.outlineOffset = '8px';
            });

            btn.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.outline = 'none';
            });
        });
    }

    function addRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function addVisualRippleEffect() {
        // Add a subtle visual feedback when all buttons have loaded
        const stack = document.querySelector('.selection-stack');
        if (!stack) return;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: expandRipple 1s ease-out forwards;
            pointer-events: none;
            z-index: -1;
        `;
        
        stack.style.position = 'relative';
        stack.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    function addKeyboardNavigation() {
        const buttons = document.querySelectorAll('.selection-stack .select-btn');
        let currentIndex = -1;

        document.addEventListener('keydown', function(e) {
            const isInSelectionArea = document.querySelector('.selection-stack:hover') || 
                                    document.activeElement.closest('.selection-stack');
            
            if (!isInSelectionArea) return;

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = Math.min(currentIndex + 1, buttons.length - 1);
                    buttons[currentIndex].focus();
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = Math.max(currentIndex - 1, 0);
                    buttons[currentIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    currentIndex = 0;
                    buttons[currentIndex].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    currentIndex = buttons.length - 1;
                    buttons[currentIndex].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (currentIndex >= 0) {
                        buttons[currentIndex].click();
                    }
                    break;
            }
        });

        // Track focus for arrow navigation
        buttons.forEach((btn, index) => {
            btn.addEventListener('focus', () => {
                currentIndex = index;
            });
        });
    }

    function trackButtonInteractions() {
        const buttons = document.querySelectorAll('.selection-stack .select-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const category = this.dataset.category || 'unknown';
                const buttonText = this.querySelector('.btn-text')?.textContent || 'unknown';
                
                // Track the interaction
                console.log('Selection button clicked:', {
                    category: category,
                    text: buttonText,
                    square: this.classList.contains('square'),
                    timestamp: new Date().toISOString()
                });
                
                // Add click feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // You can integrate with Google Analytics or other tracking services here
                // Example: gtag('event', 'selection_button_click', { category: category });
            });
        });
    }

    // Add CSS animations via JavaScript
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
            
            @keyframes expandRipple {
                to {
                    width: 600px;
                    height: 600px;
                    opacity: 0;
                }
            }
            
            @keyframes buttonShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            .selection-stack .select-btn.shake {
                animation: buttonShake 0.5s ease-in-out;
            }
            
            .selection-stack .select-btn:active {
                transition: transform 0.1s ease;
            }
            
            /* Enhanced focus styles for better accessibility */
            .selection-stack .select-btn:focus-visible {
                outline: 3px solid #4f8cff;
                outline-offset: 4px;
                box-shadow: 0 0 0 6px rgba(79, 140, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    // Intersection Observer for scroll-triggered animations
    function initScrollAnimation() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateButtonsOnLoad();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            });

            const selectionStack = document.querySelector('.selection-stack');
            if (selectionStack) {
                observer.observe(selectionStack);
            }
        }
    }

    // Initialize dynamic styles
    addDynamicStyles();
    
    // Initialize scroll animation if needed
    initScrollAnimation();

    // Performance optimization: Use passive listeners where possible
    document.addEventListener('scroll', function() {
        // Parallax or scroll-based effects can be added here
    }, { passive: true });

})(); 