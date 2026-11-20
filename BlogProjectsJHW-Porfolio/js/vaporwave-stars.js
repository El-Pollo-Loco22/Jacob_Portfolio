/**
 * Twinkling parallax starfield layered over the vaporwave terrain.
 * Driven by the p5 draw loop in vaporwave-bg.js (no separate animation frame).
 */
window.createVaporwaveStarfield = function (container) {
  const canvas = document.createElement('canvas');
  canvas.className = 'vaporwave-stars';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const starCount = Math.max(60, Math.floor((width * height) / 9000));

    canvas.width = width;
    canvas.height = height;

    stars = Array.from({ length: starCount }, () => {
      const layer = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        layer,
        size: layer === 2 ? 2 : 1,
        speed: 0.15 + layer * 0.35,
        twinkle: Math.random() * Math.PI * 2,
        color: layer === 2 ? '#ffffff' : (layer === 1 ? '#9ad8ff' : '#5a6fa0')
      };
    });
  }

  function draw(isWarp, driftScale) {
    const w = canvas.width;
    const h = canvas.height;

    if (isWarp) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    stars.forEach((star) => {
      star.x -= isWarp ? star.speed * 15 : star.speed * driftScale;
      star.twinkle += 0.04 * driftScale;
      if (star.x < -2) {
        star.x = w + (isWarp ? 200 : 2);
        star.y = Math.random() * h * 0.85;
      }

      const alpha = 0.55 + 0.45 * Math.sin(star.twinkle);
      const x = Math.floor(star.x);
      const y = Math.floor(star.y);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = star.color;
      ctx.fillRect(x, y, star.size, star.size);

      if (star.layer === 2) {
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillRect(x + star.size, y, star.size * 2, 1);
      }
    });

    ctx.globalAlpha = 1;
  }

  resize();
  return { resize, draw };
};
