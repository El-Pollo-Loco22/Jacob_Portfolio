/**
 * Vaporwave terrain + sun background for the portfolio header column.
 * Requires p5.js, vaporwave-stars.js, vaporwave-expand.js and vaporwave-easter-egg.js.
 */
(function () {
  const container = document.getElementById('vaporwave-bg');
  if (!container || typeof p5 === 'undefined') return;

  // The sketch always renders at this height and CSS scales it to the column,
  // so the scene keeps its proportions in both the tall desktop and short mobile header.
  const REFERENCE_HEIGHT = 900;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WARP_SPEED = 0.6;

  // Tab accent colors in portfolio.html (--tab-color) mirror these grid colors.
  const TAB_SCENES = {
    'articles': { grid: [0, 255, 255], sun: [255, 20, 147], speed: 0.04 },
    'ux': { grid: [255, 0, 255], sun: [50, 200, 255], speed: 0.08 },
    'video': { grid: [255, 170, 0], sun: [255, 50, 255], speed: 0.02 },
    'mixed-media': { grid: [0, 255, 136], sun: [255, 236, 39], speed: 0.12 }
  };

  new p5((p) => {
    const scl = 50;
    const planeWidth = 4000;
    const planeDepth = 2500;
    const cols = planeWidth / scl;
    const rows = planeDepth / scl;
    const terrain = Array.from({ length: cols }, () => []);

    let activeScene = TAB_SCENES.articles;
    let flying = 0;
    let currentSpeed = 0;
    let targetSpeed = 0;
    let gridColor, sunColor, glowColor;
    let targetGridColor, targetSunColor, targetGlowColor;
    let starfield, expander, game;

    function getCanvasSize() {
      const cw = Math.max(1, container.clientWidth);
      const ch = Math.max(1, container.clientHeight);
      return {
        width: Math.round(REFERENCE_HEIGHT * cw / ch),
        height: REFERENCE_HEIGHT,
        density: Math.min(2, (ch * (window.devicePixelRatio || 1)) / REFERENCE_HEIGHT)
      };
    }

    function applyPalette(palette) {
      targetGridColor = p.color(...palette.grid);
      targetSunColor = p.color(...palette.sun);
      targetGlowColor = p.color(...palette.sun);
    }

    function showTabScene(tabScene) {
      applyPalette(tabScene);
      targetSpeed = reduceMotion ? 0 : tabScene.speed;
    }

    function resizeScene() {
      const size = getCanvasSize();
      p.pixelDensity(size.density);
      p.resizeCanvas(size.width, size.height);
      starfield.resize();
    }

    function bindTabs() {
      document.querySelectorAll('.nav-link[data-tab]').forEach((link) => {
        const tabScene = TAB_SCENES[link.getAttribute('data-tab')] || TAB_SCENES.articles;
        link.addEventListener('mouseenter', () => showTabScene(tabScene));
        link.addEventListener('mouseleave', () => showTabScene(activeScene));
        link.addEventListener('click', () => {
          activeScene = tabScene;
          showTabScene(activeScene);
        });
      });
    }

    const scene = {
      container,
      isExpanded: () => expander.isExpanded(),
      toCanvasPoint(clientX, clientY) {
        const rect = container.getBoundingClientRect();
        return {
          x: (clientX - rect.left) * (p.width / rect.width),
          y: (clientY - rect.top) * (p.height / rect.height)
        };
      },
      setSpeed(speed) {
        targetSpeed = speed;
      },
      resetPalette() {
        applyPalette(activeScene);
      },
      onGameStart() {
        container.classList.add('is-playing');
      },
      onGameEnd() {
        container.classList.remove('is-playing');
        showTabScene(activeScene);
      }
    };

    p.setup = () => {
      const size = getCanvasSize();
      p.pixelDensity(size.density);
      const canvas = p.createCanvas(size.width, size.height, p.WEBGL);
      canvas.parent(container);
      canvas.elt.setAttribute('aria-hidden', 'true');

      showTabScene(activeScene);
      currentSpeed = targetSpeed;
      gridColor = targetGridColor;
      sunColor = targetSunColor;
      glowColor = targetGlowColor;

      starfield = window.createVaporwaveStarfield(container);
      expander = window.createVaporwaveExpander(container, {
        onToggle(expanded) {
          if (!expanded && !game.isIdle()) game.exit();
          resizeScene();
        },
        onEscape() {
          if (game.isIdle()) expander.collapse();
          else game.exit();
        }
      });
      game = window.createVaporwaveEasterEgg(p, scene);
      bindTabs();
    };

    p.windowResized = resizeScene;

    function updateTerrain(isWarp) {
      const heightMod = isWarp ? 2.0 : p.map(currentSpeed, 0.02, 0.15, 0.8, 1.5);
      let yoff = flying;
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          const distFromCenter = Math.abs(x - cols / 2) / (cols / 2);
          const valleyFactor = p.map(distFromCenter, 0, 1, 0.1, 1.8);
          terrain[x][y] = p.map(p.noise(xoff, yoff), 0, 1, -50, 400) * valleyFactor * heightMod;
          xoff += 0.15;
        }
        yoff += 0.15;
      }
    }

    function drawSun(horizonY) {
      p.push();
      p.translate(0, horizonY - 100, -2500);
      p.noStroke();
      for (let i = 15; i > 0; i--) {
        p.fill(p.red(glowColor), p.green(glowColor), p.blue(glowColor), p.map(i, 15, 0, 0, 60));
        p.circle(0, 0, 500 + i * 40);
      }
      p.fill(p.red(sunColor), p.green(sunColor), p.blue(sunColor));
      p.circle(0, 0, 500);
      p.fill(10, 5, 20);
      for (let i = 0; i < 250; i += 15) {
        p.rect(-300, i, 600, p.map(i, 0, 250, 2, 16));
      }
      p.pop();
    }

    function drawGrid(horizonY, isWarp) {
      p.push();
      p.translate(0, horizonY, 0);
      p.rotateX(Math.PI / 2.2);
      if (isWarp) p.translate(0, 500, 0);
      p.translate(-planeWidth / 2, -planeDepth / 2);

      for (let y = 0; y < rows - 1; y++) {
        const distFactor = Math.pow(p.map(y, 0, rows - 2, 0, 1), 1.2);
        p.strokeWeight(p.map(distFactor, 0, 1, 0.3, 4));
        p.stroke(p.red(gridColor), p.green(gridColor), p.blue(gridColor), p.map(distFactor, 0, 1, 15, 255));
        p.fill(10, 5, 20);

        p.beginShape(p.QUADS);
        for (let x = 0; x < cols - 1; x++) {
          p.vertex(x * scl, y * scl, terrain[x][y]);
          p.vertex((x + 1) * scl, y * scl, terrain[x + 1][y]);
          p.vertex((x + 1) * scl, (y + 1) * scl, terrain[x + 1][y + 1]);
          p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
        }
        p.endShape();
      }
      p.pop();
    }

    p.draw = () => {
      game.update();
      const isWarp = game.isWarp();

      if (isWarp) {
        p.colorMode(p.HSB, 255);
        targetGridColor = p.color(p.frameCount % 255, 200, 255);
        targetSunColor = p.color((p.frameCount + 128) % 255, 200, 255);
        targetGlowColor = targetSunColor;
        p.colorMode(p.RGB, 255);
        targetSpeed = WARP_SPEED;
      }

      gridColor = p.lerpColor(gridColor, targetGridColor, 0.05);
      sunColor = p.lerpColor(sunColor, targetSunColor, 0.05);
      glowColor = p.lerpColor(glowColor, targetGlowColor, 0.05);
      currentSpeed = p.lerp(currentSpeed, targetSpeed, 0.05);
      flying -= currentSpeed;

      updateTerrain(isWarp);

      const horizonY = p.height / 6;
      p.background(10, 5, 20);
      drawSun(horizonY);
      drawGrid(horizonY, isWarp);
      game.render();

      starfield.draw(isWarp, reduceMotion && game.isIdle() ? 0 : 1);
    };
  }, container);
})();
