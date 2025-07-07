document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.multimedia-carousel .carousel-track');
  const items = document.querySelectorAll('.multimedia-carousel .carousel-item');
  const prevBtn = document.querySelector('.multimedia-carousel .carousel-arrow.left');
  const nextBtn = document.querySelector('.multimedia-carousel .carousel-arrow.right');
  let currentIndex = 0;
  const visibleItems = 4; // Adjust based on your design

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', function() {
    if (currentIndex < items.length - visibleItems) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Optional: Auto-play
  setInterval(function() {
    if (currentIndex < items.length - visibleItems) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 4000);

  // Initial update
  updateCarousel();
}); 