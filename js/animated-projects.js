// Animated Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced hover animations
    const projectSections = document.querySelectorAll('.project-section');
    
    projectSections.forEach(section => {
        let hoverTimeout;
        
        section.addEventListener('mouseenter', function() {
            // Clear any existing timeout
            clearTimeout(hoverTimeout);
            
            // Add animation class for smoother transitions
            this.classList.add('animate-in');
            this.classList.remove('animate-out');
        });
        
        section.addEventListener('mouseleave', function() {
            // Add animation class for exit
            this.classList.add('animate-out');
            this.classList.remove('animate-in');
            
            // Clean up classes after animation
            hoverTimeout = setTimeout(() => {
                this.classList.remove('animate-out');
            }, 400);
        });
        
        // Handle clicks
        section.addEventListener('click', function() {
            const projectType = this.getAttribute('data-project');
            handleProjectClick(projectType);
        });
    });
    
    // Project click handler
    function handleProjectClick(projectType) {
        // Add click animation
        const clickedSection = document.querySelector(`[data-project="${projectType}"]`);
        clickedSection.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            clickedSection.style.transform = '';
        }, 150);
        
        // Navigate to project pages
        switch(projectType) {
            case 'restaurant-rex':
                // Placeholder for Restaurant-Rex project
                window.location.href = 'projects.html#restaurant-rex';
                break;
            case 'dkb':
                window.location.href = 'dkb.html';
                break;
            case 'wanderwell':
                window.location.href = 'wanderwell.html';
                break;
            case 'random':
                // Could link to a random project or show a modal
                showRandomProjectModal();
                break;
            default:
                window.location.href = 'projects.html';
        }
    }
    
    // Random project modal or action
    function showRandomProjectModal() {
        const projects = ['UX_Case_Study/got.html', 'UX_Case_Study/class-quest-case-study.html', 'sookies.html', 'UX_Case_Study/hydn-1-0.html', 'UX_Case_Study/indie-box-office.html'];
        const randomProject = projects[Math.floor(Math.random() * projects.length)];
        
        // Create a brief loading animation
        const randomSection = document.querySelector('[data-project="random"]');
        const randomIcon = randomSection.querySelector('.random-icon');
        
        // Spin animation
        randomIcon.style.transform = 'rotate(360deg)';
        randomIcon.style.transition = 'transform 0.8s ease';
        
        setTimeout(() => {
            window.location.href = randomProject;
        }, 800);
    }
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const projectsContainer = document.querySelector('.projects-container');
            if (projectsContainer) {
                projectsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Footer button interactions
    const askAboutBtn = document.querySelector('.ask-about-btn');
    const externalLinkBtn = document.querySelector('.external-link-btn');
    
    if (askAboutBtn) {
        askAboutBtn.addEventListener('click', function() {
            window.location.href = 'contact.html';
        });
    }
    
    if (externalLinkBtn) {
        externalLinkBtn.addEventListener('click', function() {
            window.open('https://github.com', '_blank');
        });
    }
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project sections for scroll animations
    projectSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Remove any active states
            projectSections.forEach(section => {
                section.classList.remove('animate-in', 'animate-out');
            });
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const focusedElement = document.activeElement;
            const currentIndex = Array.from(projectSections).indexOf(focusedElement);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = currentIndex < projectSections.length - 1 ? currentIndex + 1 : 0;
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : projectSections.length - 1;
            }
            
            projectSections[nextIndex].focus();
        }
        
        // Enter key to activate
        if (e.key === 'Enter' && document.activeElement.classList.contains('project-section')) {
            const projectType = document.activeElement.getAttribute('data-project');
            handleProjectClick(projectType);
        }
    });
    
    // Make sections focusable for keyboard navigation
    projectSections.forEach((section, index) => {
        section.setAttribute('tabindex', '0');
        section.setAttribute('role', 'button');
        section.setAttribute('aria-label', `Navigate to ${section.getAttribute('data-project')} project`);
    });
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Add any scroll-based animations here
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.animated-hero');
            
            if (hero) {
                // Parallax effect for hero image
                const heroImage = hero.querySelector('.hero-image');
                if (heroImage) {
                    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            }
        }, 16); // ~60fps
    });
    
    // Add loading animation completion
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        }
        
        // Trigger initial animations
        projectSections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
    
    // Add touch support for mobile
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // Simple swipe detection for mobile navigation
        if (Math.abs(touchDiff) > 50) {
            const target = e.target.closest('.project-section');
            if (target) {
                target.style.transform = touchDiff > 0 ? 'translateX(-10px)' : 'translateX(10px)';
                setTimeout(() => {
                    target.style.transform = '';
                }, 200);
            }
        }
    });
});

// Export functions for potential external use
window.AnimatedProjects = {
    navigateToProject: function(projectType) {
        handleProjectClick(projectType);
    },
    
    showRandomProject: function() {
        showRandomProjectModal();
    }
};

// Make functions globally accessible
window.handleProjectClick = function(projectType) {
    // Add click animation
    const clickedSection = document.querySelector(`[data-project="${projectType}"]`);
    if (clickedSection) {
        clickedSection.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            clickedSection.style.transform = '';
        }, 150);
    }
    
    // Navigate to project pages
    switch(projectType) {
        case 'restaurant-rex':
            // Placeholder for Restaurant-Rex project
            window.location.href = 'projects.html#restaurant-rex';
            break;
        case 'dkb':
            window.location.href = 'dkb.html';
            break;
        case 'wanderwell':
            window.location.href = 'wanderwell.html';
            break;
        case 'random':
            // Could link to a random project or show a modal
            showRandomProjectModal();
            break;
        default:
            window.location.href = 'projects.html';
    }
};

window.showRandomProjectModal = function() {
    const projects = ['UX_Case_Study/got.html', 'UX_Case_Study/class-quest-case-study.html', 'sookies.html', 'UX_Case_Study/hydn-1-0.html', 'UX_Case_Study/indie-box-office.html'];
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    
    // Create a brief loading animation
    const randomSection = document.querySelector('[data-project="random"]');
    const randomIcon = randomSection.querySelector('.random-icon');
    
    // Spin animation
    randomIcon.style.transform = 'rotate(360deg)';
    randomIcon.style.transition = 'transform 0.8s ease';
    
    setTimeout(() => {
        window.location.href = randomProject;
    }, 800);
}; 