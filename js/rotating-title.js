// Simple Rotating Title Script
document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('.rotating-text');
    
    if (titles.length === 0) {
        console.log('No rotating titles found');
        return;
    }
    
    let currentIndex = 0;
    let animationStarted = false;
    
    // Hide all titles initially
    titles.forEach((title, index) => {
        title.style.display = 'none';
        title.style.opacity = '0';
        title.style.visibility = 'hidden';
    });
    
    function showNextTitle() {
        // Hide current title
        titles[currentIndex].style.opacity = '0';
        
        setTimeout(() => {
            titles[currentIndex].style.display = 'none';
            
            // Move to next title
            currentIndex = (currentIndex + 1) % titles.length;
            
            // Show next title
            titles[currentIndex].style.display = 'block';
            titles[currentIndex].style.visibility = 'visible';
            
            setTimeout(() => {
                titles[currentIndex].style.opacity = '1';
            }, 50);
            
        }, 300);
    }
    
    function startRotatingTitles() {
        if (animationStarted) return;
        animationStarted = true;
        
        // Show first title
        titles[0].style.display = 'block';
        titles[0].style.visibility = 'visible';
        titles[0].style.opacity = '1';
        
        // Start the rotation after showing first title
        setTimeout(() => {
            setInterval(showNextTitle, 2000);
        }, 2000);
    }
    
    // Wait for main text to appear first (delay the rotating titles)
    setTimeout(startRotatingTitles, 3000); // 3 second delay
    
    console.log('Rotating titles will start after main text appears');
}); 