// Projects page enhancement script
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        enhanceProjectsPage();
    });

    function enhanceProjectsPage() {
        // Add filter functionality
        addProjectFilters();
        
        // Add search functionality
        addProjectSearch();
        
        // Add project preview modals
        addProjectModals();
        
        // Add scroll-triggered animations
        addScrollAnimations();
    }

    function addProjectFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <div style="margin: 20px 0; text-align: center;">
                <button class="filter-btn active" data-filter="all">All Projects</button>
                <button class="filter-btn" data-filter="ux">UX/UI</button>
                <button class="filter-btn" data-filter="multimedia">Multimedia</button>
                <button class="filter-btn" data-filter="ai">AI</button>
            </div>
        `;

        const projectsSection = document.querySelector('#Work-show-case');
        if (projectsSection) {
            projectsSection.parentNode.insertBefore(filterContainer, projectsSection);
        }

        // Filter functionality
        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects (you'll need to add data-category attributes to your project elements)
                filterProjects(filter);
            });
        });
    }

    function filterProjects(category) {
        const projects = document.querySelectorAll('.brix---team-v9-wrapper-3');
        
        projects.forEach(project => {
            const projectCategory = project.dataset.category || 'all';
            
            if (category === 'all' || projectCategory === category) {
                project.style.display = 'block';
                project.style.animation = 'fadeIn 0.5s ease';
            } else {
                project.style.display = 'none';
            }
        });
    }

    function addProjectSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'project-search';
        searchContainer.innerHTML = `
            <div style="margin: 20px 0; text-align: center;">
                <input type="text" placeholder="Search projects..." class="search-input" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; width: 300px; max-width: 100%;">
            </div>
        `;

        const projectsSection = document.querySelector('#Work-show-case');
        if (projectsSection) {
            projectsSection.parentNode.insertBefore(searchContainer, projectsSection);
        }

        // Search functionality
        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchProjects(searchTerm);
        });
    }

    function searchProjects(term) {
        const projects = document.querySelectorAll('.brix---team-v9-wrapper-3');
        
        projects.forEach(project => {
            const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = project.querySelector('.brix---text-200-medium-4')?.textContent.toLowerCase() || '';
            
            if (title.includes(term) || description.includes(term)) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }

    function addProjectModals() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'project-modal-container';
        modalContainer.innerHTML = `
            <div class="project-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
                <div class="modal-content" style="background: white; margin: 50px auto; padding: 30px; max-width: 800px; border-radius: 10px; position: relative;">
                    <button class="modal-close" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                    <div class="modal-body"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalContainer);

        // Add click handlers to project cards
        const projectCards = document.querySelectorAll('.brix---team-v9-wrapper-3');
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                showProjectModal(this);
            });
        });

        // Close modal functionality
        const modal = modalContainer.querySelector('.project-modal');
        const closeBtn = modal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    function showProjectModal(projectCard) {
        const modal = document.querySelector('.project-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        const title = projectCard.querySelector('h3')?.textContent || 'Project';
        const description = projectCard.querySelector('.brix---text-200-medium-4')?.textContent || '';
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p>${description}</p>
            <div style="margin-top: 20px;">
                <a href="${projectCard.href}" class="button w-inline-block" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    View Full Project
                </a>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    function addScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.brix---team-v9-wrapper-3').forEach(el => {
                el.classList.add('scroll-animate');
                observer.observe(el);
            });
        }
    }

    // Add CSS for project enhancements
    const style = document.createElement('style');
    style.textContent = `
        .project-filters button {
            margin: 0 10px;
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .project-filters button.active,
        .project-filters button:hover {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0,123,255,0.3);
        }
        
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .scroll-animate.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
})(); 