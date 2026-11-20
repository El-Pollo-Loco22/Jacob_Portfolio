/**
 * Konami-code mini-game for the vaporwave background.
 * Up Up Down Down Left Right Left Right B A starts it (only while the scene is expanded);
 * click cubes to score.
 *
 * `scene` is provided by vaporwave-bg.js:
 *   container, isExpanded(), toCanvasPoint(clientX, clientY), setSpeed(speed),
 *   resetPalette(), onGameStart(), onGameEnd()
 */
window.createVaporwaveEasterEgg = function (p, scene) {
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  const MAX_LIVES = 3;
  const POINTS_PER_CUBE = 10;
  const STARTING_CUBES_PER_ROUND = 15;
  const EXTRA_CUBES_PER_ROUND = 5;
  const BASE_ENEMY_SPEED = 14;
  const MAX_ENEMY_SPEED = 80;
  const WARP_DURATION = 1400;

  let state = 'IDLE'; // 'IDLE' | 'MINIGAME' | 'WARP' | 'GAMEOVER'
  let enemies = [];
  let explosions = [];
  let score = 0;
  let round = 1;
  let roundProgress = 0;
  let warpEndsAt = 0;
  let lives = MAX_LIVES;
  let gameStartedAt = 0;
  let keyHistory = [];

  const hud = document.createElement('div');
  hud.className = 'vaporwave-game-hud';
  hud.hidden = true;
  hud.innerHTML = '<span data-hud="score"></span><span data-hud="lives"></span><span data-hud="status"></span>';
  scene.container.appendChild(hud);

  const scoreEl = hud.querySelector('[data-hud="score"]');
  const livesEl = hud.querySelector('[data-hud="lives"]');
  const statusEl = hud.querySelector('[data-hud="status"]');

  function isTypingTarget(el) {
    if (!el || !el.tagName) return false;
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable;
  }

  function getRoundCubeTarget() {
    return STARTING_CUBES_PER_ROUND + (round - 1) * EXTRA_CUBES_PER_ROUND;
  }

  function getEnemySpeed() {
    const elapsedSeconds = gameStartedAt ? (p.millis() - gameStartedAt) / 1000 : 0;
    return Math.min(MAX_ENEMY_SPEED, BASE_ENEMY_SPEED + (round - 1) * 5 + roundProgress * 0.45 + elapsedSeconds * 0.12);
  }

  function updateHud() {
    scoreEl.textContent = 'SCORE: ' + score + ' · ROUND ' + round + ': ' + roundProgress + ' / ' + getRoundCubeTarget();
    livesEl.textContent = 'LIVES: ' + '◆ '.repeat(lives).trim();
    livesEl.style.color = lives === 1 ? '#ff004d' : '#ff77a8';
    statusEl.textContent = 'SPEED: x' + (getEnemySpeed() / BASE_ENEMY_SPEED).toFixed(1) + ' · CLICK CUBES';
  }

  function start() {
    state = 'MINIGAME';
    scene.setSpeed(0.08);
    score = 0;
    round = 1;
    roundProgress = 0;
    warpEndsAt = 0;
    lives = MAX_LIVES;
    gameStartedAt = p.millis();
    enemies = [];
    explosions = [];
    hud.hidden = false;
    scene.onGameStart();
    updateHud();
  }

  function exit() {
    state = 'IDLE';
    enemies = [];
    explosions = [];
    hud.hidden = true;
    scene.onGameEnd();
  }

  function startNextRound() {
    round++;
    roundProgress = 0;
    gameStartedAt = p.millis();
    state = 'MINIGAME';
    scene.resetPalette();
    updateHud();
  }

  // p5's default WEBGL camera sits this far in front of the origin.
  function getEnemyScreenPosition(enemy) {
    const cameraZ = (p.height / 2) / Math.tan(Math.PI / 6);
    const scale = cameraZ / (cameraZ - enemy.z);
    return {
      x: p.width / 2 + enemy.x * scale,
      y: p.height / 2 + enemy.y * scale,
      size: 50 * scale
    };
  }

  function createExplosion(enemy) {
    for (let i = 0; i < 24; i++) {
      explosions.push({
        x: enemy.x,
        y: enemy.y,
        z: enemy.z,
        vx: p.random(-16, 16),
        vy: p.random(-16, 16),
        vz: p.random(-16, 16),
        life: p.random(22, 38),
        size: p.random(4, 11)
      });
    }
  }

  function destroyEnemyAt(pointerX, pointerY) {
    let closest = null;
    let closestDistance = Infinity;

    enemies.forEach((enemy) => {
      if (!enemy.active) return;
      const screen = getEnemyScreenPosition(enemy);
      const hitRadius = Math.max(22, screen.size * 0.8);
      const distance = p.dist(pointerX, pointerY, screen.x, screen.y);
      if (distance <= hitRadius && distance < closestDistance) {
        closest = enemy;
        closestDistance = distance;
      }
    });

    if (!closest) return;
    closest.active = false;
    createExplosion(closest);
    score += POINTS_PER_CUBE;
    roundProgress++;
    updateHud();

    if (roundProgress >= getRoundCubeTarget()) {
      state = 'WARP';
      warpEndsAt = p.millis() + WARP_DURATION;
      enemies = [];
      scoreEl.textContent = 'ROUND ' + round + ' COMPLETE · SCORE: ' + score;
      statusEl.textContent = '★ WARPING TO ROUND ' + (round + 1) + ' ★';
    }
  }

  function loseLife() {
    if (lives <= 0) return;
    lives--;
    updateHud();

    if (lives <= 0) {
      state = 'GAMEOVER';
      enemies = [];
      scoreEl.textContent = 'GAME OVER · SCORE: ' + score + ' · ROUND: ' + round;
      livesEl.textContent = 'LIVES: 0';
      statusEl.textContent = 'CLICK TO RETRY · ESC TO EXIT';
    }
  }

  function drawShip() {
    const shipX = p.map(p.mouseX, 0, p.width, -p.width * 0.4, p.width * 0.4);
    const shipY = p.height * 0.35;

    p.push();
    p.translate(shipX, shipY, 0);

    p.fill(0, 255, 255);
    p.stroke(255, 0, 255);
    p.strokeWeight(2);
    p.beginShape(p.TRIANGLES);
    p.vertex(0, -25, 0);
    p.vertex(-20, 15, 0);
    p.vertex(20, 15, 0);
    p.endShape();

    p.noStroke();
    p.fill(255, 0, 255);
    p.beginShape(p.TRIANGLES);
    p.vertex(0, -12, 1);
    p.vertex(-8, 8, 1);
    p.vertex(8, 8, 1);
    p.endShape();

    p.fill(255, 255, 0, 150 + Math.sin(p.frameCount * 0.3) * 100);
    p.beginShape(p.TRIANGLES);
    p.vertex(-6, 15, 0);
    p.vertex(6, 15, 0);
    p.vertex(0, 25 + Math.sin(p.frameCount * 0.5) * 5, 0);
    p.endShape();

    p.pop();
  }

  function updateEnemies() {
    // Spawn faster as the run continues, with a floor that keeps it playable.
    const elapsedSeconds = (p.millis() - gameStartedAt) / 1000;
    const spawnInterval = Math.max(8, Math.floor(44 - (round - 1) * 4 - roundProgress * 0.5 - elapsedSeconds * 0.12));
    if (p.frameCount % spawnInterval === 0) {
      enemies.push({
        x: p.random(-p.width * 0.35, p.width * 0.35),
        y: p.random(-p.height * 0.3, -p.height * 0.1),
        z: -2000,
        active: true
      });
    }

    if (p.frameCount % 30 === 0) updateHud();

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (!enemy.active) continue;
      enemy.z += getEnemySpeed();

      p.push();
      p.translate(enemy.x, enemy.y, enemy.z);
      p.fill(255, 50, 100);
      p.stroke(255);
      p.strokeWeight(1);
      p.rotateX(p.frameCount * 0.05);
      p.rotateY(p.frameCount * 0.07);
      p.box(50);
      p.pop();

      if (enemy.z > 200) {
        enemy.active = false;
        loseLife();
        if (state === 'GAMEOVER') break;
      }
    }

    enemies = enemies.filter((enemy) => enemy.active);
  }

  function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
      const particle = explosions[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
      particle.vy += 0.45;
      particle.life--;

      p.push();
      p.translate(particle.x, particle.y, particle.z);
      p.noStroke();
      p.fill(particle.life % 3 === 0 ? p.color(255, 236, 39) : p.color(255, 46, 136));
      p.box(particle.size);
      p.pop();

      if (particle.life <= 0) explosions.splice(i, 1);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (state !== 'IDLE' || !scene.isExpanded() || isTypingTarget(e.target)) return;

    keyHistory.push(e.key.toLowerCase());
    if (keyHistory.length > KONAMI.length) keyHistory.shift();

    if (keyHistory.join(',') === KONAMI.join(',')) {
      keyHistory = [];
      start();
    }
  }, true);

  scene.container.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;

    if (state === 'GAMEOVER') {
      start();
      return;
    }

    if (state === 'MINIGAME') {
      const point = scene.toCanvasPoint(e.clientX, e.clientY);
      destroyEnemyAt(point.x, point.y);
    }
  });

  return {
    isIdle: () => state === 'IDLE',
    isWarp: () => state === 'WARP',
    exit,
    update() {
      if (state === 'WARP' && p.millis() >= warpEndsAt) startNextRound();
    },
    render() {
      if (state === 'MINIGAME') {
        scene.setSpeed(Math.min(0.22, 0.08 + (getEnemySpeed() - BASE_ENEMY_SPEED) * 0.004));
        drawShip();
        updateEnemies();
      }
      // Explosion fragments keep animating if the final cube triggers warp.
      drawExplosions();
    }
  };
};
