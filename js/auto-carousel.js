document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  // Duplicate items for seamless looping
  track.innerHTML += track.innerHTML;

  let pos = 0;
  const speed = 1; // pixels per frame

  function animate() {
    pos -= speed;
    // Reset for infinite loop
    if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Optional: Pause on hover
  let paused = false;
  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  function animateWithPause() {
    if (!paused) {
      pos -= speed;
      if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
    }
    requestAnimationFrame(animateWithPause);
  }
  // Uncomment below to enable pause on hover
  // animateWithPause();
}); 