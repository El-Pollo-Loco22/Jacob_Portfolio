/**
 * Hero 3D Scene - Three.js Implementation
 * Interactive 3D geometric shapes with particles, mouse parallax,
 * and hover-triggered mode transformations
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let scene, camera, renderer, meshes = [], particles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let currentMode = 'default';
  let autoRotateInterval = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Color palette
  const colors = [0xd4a574, 0x4f8cff, 0xa855f7, 0xec4899, 0xd4a574, 0x4f8cff];

  // Mode configurations for hover transformations
  const modeConfigs = {
    'default': {
      camera: { x: 0, y: 0, z: 6 },
      particleColor: 0xd4a574,
      shapes: [
        { position: [-2, 1.5, 0], scale: 1, rotation: [0, 0, 0] },
        { position: [2, -1, -1], scale: 1, rotation: [0, 0, 0] },
        { position: [0, -2, 0], scale: 1, rotation: [0, 0, 0] },
        { position: [-1.5, -1, 1], scale: 1, rotation: [0, 0, 0] },
        { position: [2.5, 2, -1], scale: 1, rotation: [0, 0, 0] },
        { position: [-2.5, -1.5, 0], scale: 1, rotation: [0, 0, 0] }
      ]
    },
    'ux-designer': {
      camera: { x: 0, y: 0, z: 7 },
      particleColor: 0x4f8cff,
      shapes: [
        { position: [-2, 1.5, 0], scale: 1.4, rotation: [0.3, 0.5, 0] },
        { position: [2, 1.5, 0], scale: 1.3, rotation: [0.2, -0.3, 0] },
        { position: [-2, -1, 0], scale: 1.2, rotation: [-0.2, 0.4, 0] },
        { position: [2, -1, 0], scale: 1.2, rotation: [0.4, 0.2, 0] },
        { position: [0, 0.5, 1], scale: 1.1, rotation: [0, 0.6, 0] },
        { position: [0, -2, 0], scale: 1.1, rotation: [0.3, 0, 0.2] }
      ]
    },
    'tech-creative': {
      camera: { x: 0.5, y: 0.5, z: 6.5 },
      particleColor: 0xa855f7,
      shapes: [
        { position: [-2.5, 2, 0.5], scale: 1.5, rotation: [0.5, 0.8, 0.2] },
        { position: [2.5, 1, -0.5], scale: 1.3, rotation: [-0.3, 0.5, 0.1] },
        { position: [-1, -1.5, 1], scale: 1.2, rotation: [0.2, -0.4, 0.3] },
        { position: [1.5, -2, 0], scale: 1.1, rotation: [0.4, 0.3, -0.2] },
        { position: [0, 2.5, -1], scale: 1.0, rotation: [-0.2, 0.6, 0.4] },
        { position: [-2, 0, 1.5], scale: 1.4, rotation: [0.3, -0.5, 0.1] }
      ]
    },
    'prompt-engineer': {
      camera: { x: 0, y: 0.5, z: 7 },
      particleColor: 0xec4899,
      shapes: [
        { position: [0, 2.5, 0], scale: 1.3, rotation: [0, 0.5, 0] },
        { position: [0, 1, 0], scale: 1.2, rotation: [0.2, 0.3, 0] },
        { position: [0, -0.5, 0], scale: 1.1, rotation: [0.1, -0.2, 0] },
        { position: [0, -2, 0], scale: 1.0, rotation: [-0.1, 0.4, 0] },
        { position: [-1.5, 0.5, 1], scale: 1.1, rotation: [0.3, 0.5, 0.2] },
        { position: [1.5, 0.5, 1], scale: 1.1, rotation: [-0.3, -0.5, 0.2] }
      ]
    },
    'multi-media': {
      camera: { x: -0.3, y: 0, z: 6.5 },
      particleColor: 0xf59e0b,
      shapes: [
        { position: [-2, 2, 0.5], scale: 1.6, rotation: [0.4, 0.7, 0.3] },
        { position: [2.5, 1.5, -0.5], scale: 1.4, rotation: [-0.3, 0.5, -0.2] },
        { position: [-1.5, -1, 1.5], scale: 1.3, rotation: [0.5, -0.3, 0.4] },
        { position: [1, -2, 0.5], scale: 1.2, rotation: [0.2, 0.6, -0.3] },
        { position: [0.5, 0, -1], scale: 1.0, rotation: [-0.4, 0.4, 0.2] },
        { position: [-2.5, 0.5, 0], scale: 1.1, rotation: [0.3, -0.6, 0.5] }
      ]
    },
    'view-work': {
      camera: { x: 0, y: 0, z: 8 },
      particleColor: 0xffd700,
      shapes: [
        { position: [0, 0, 0], scale: 2.2, rotation: [0, 0, 0] },
        { position: [-2, 1.5, -2], scale: 0.7, rotation: [0.5, 0.5, 0] },
        { position: [2, 1.5, -2], scale: 0.7, rotation: [-0.5, 0.5, 0] },
        { position: [-2, -1.5, -2], scale: 0.7, rotation: [0.5, -0.5, 0] },
        { position: [2, -1.5, -2], scale: 0.7, rotation: [-0.5, -0.5, 0] },
        { position: [0, -2.5, -1], scale: 0.7, rotation: [0, 0.3, 0] }
      ]
    },
    'about': {
      camera: { x: 0.5, y: 0.8, z: 6.5 },
      particleColor: 0x87ceeb,
      shapes: [
        { position: [-3, 0, 0], scale: 0.9, rotation: [0, 0.3, 0] },
        { position: [-1, 0, 0], scale: 0.9, rotation: [0, 0.3, 0] },
        { position: [1, 0, 0], scale: 0.9, rotation: [0, 0.3, 0] },
        { position: [3, 0, 0], scale: 0.9, rotation: [0, 0.3, 0] },
        { position: [-1, 2, 0], scale: 0.9, rotation: [0, 0.3, 0] },
        { position: [1, 2, 0], scale: 0.9, rotation: [0, 0.3, 0] }
      ]
    },
    'contact': {
      camera: { x: 0, y: 0, z: 6 },
      particleColor: 0xff69b4,
      shapes: [
        { position: [-2, 1, 0], scale: 0.9, rotation: [0, 0, 0] },
        { position: [0, 1, 0], scale: 0.9, rotation: [0, 0, 0] },
        { position: [2, 1, 0], scale: 0.9, rotation: [0, 0, 0] },
        { position: [-2, -1, 0], scale: 0.9, rotation: [0, 0, 0] },
        { position: [0, -1, 0], scale: 0.9, rotation: [0, 0, 0] },
        { position: [2, -1, 0], scale: 0.9, rotation: [0, 0, 0] }
      ]
    }
  };

  // Easing function
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Animate a value over time
  function animateValue(obj, prop, from, to, duration, callback) {
    const startTime = Date.now();
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      obj[prop] = from + (to - from) * easedProgress;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (callback) {
        callback();
      }
    }
    update();
  }

  // Animate color transition for particles
  function animateColor(material, fromColor, toColor, duration) {
    const startTime = Date.now();
    const from = new THREE.Color(fromColor);
    const to = new THREE.Color(toColor);

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      material.color.r = from.r + (to.r - from.r) * easedProgress;
      material.color.g = from.g + (to.g - from.g) * easedProgress;
      material.color.b = from.b + (to.b - from.b) * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    update();
  }

  function init() {
    const container = document.getElementById('hero-3d-container');
    if (!container) {
      console.error('Hero 3D container not found');
      return;
    }

    // Scene setup
    scene = new THREE.Scene();

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || window.innerWidth / 2;
    const height = rect.height || container.clientHeight || window.innerHeight;

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    setupLights();

    // Create geometric objects
    meshes = createGeometricObjects();

    // Create particle system
    particles = createParticles();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // Setup hover listeners for text elements
    setupHoverListeners();

    // Start auto-rotation through modes
    startAutoRotation();

    // Start animation loop
    animate();

    console.log('Hero 3D scene initialized');
  }

  function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Directional light 1 - Gold
    const dirLight1 = new THREE.DirectionalLight(0xd4a574, 0.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    // Directional light 2 - Blue
    const dirLight2 = new THREE.DirectionalLight(0x4f8cff, 0.5);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);
  }

  function createGeometricObjects() {
    const objects = [];

    // Shape configurations
    const shapes = [
      { geometry: new THREE.BoxGeometry(1.2, 1.2, 1.2), position: [-2, 1.5, 0] },
      { geometry: new THREE.OctahedronGeometry(0.9), position: [2, -1, -1] },
      { geometry: new THREE.TetrahedronGeometry(1), position: [0, -2, 0] },
      { geometry: new THREE.IcosahedronGeometry(0.8), position: [-1.5, -1, 1] },
      { geometry: new THREE.TorusGeometry(0.7, 0.3, 16, 100), position: [2.5, 2, -1] },
      { geometry: new THREE.ConeGeometry(0.8, 1.6, 8), position: [-2.5, -1.5, 0] }
    ];

    shapes.forEach((shape, index) => {
      const color = colors[index % colors.length];
      const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.2
      });

      const mesh = new THREE.Mesh(shape.geometry, material);
      mesh.position.set(...shape.position);
      mesh.castShadow = true;
      mesh.userData = {
        originalScale: 1,
        isAnimating: false,
        index: index,
        baseRotationX: 0,
        baseRotationY: 0
      };

      scene.add(mesh);
      objects.push(mesh);
    });

    return objects;
  }

  function createParticles() {
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4a574,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    return particleSystem;
  }

  function setupHoverListeners() {
    // Rotating text titles
    const rotatingTexts = document.querySelectorAll('.rotating-text');
    rotatingTexts.forEach((text) => {
      const textContent = text.textContent.toLowerCase();
      let mode = 'default';

      if (textContent.includes('ux')) mode = 'ux-designer';
      else if (textContent.includes('tech')) mode = 'tech-creative';
      else if (textContent.includes('prompt')) mode = 'prompt-engineer';
      else if (textContent.includes('multi')) mode = 'multi-media';

      text.addEventListener('mouseenter', () => {
        stopAutoRotation();
        transitionToMode(mode);
      });
      text.addEventListener('mouseleave', () => {
        transitionToMode('default');
        startAutoRotation();
      });
    });

    // View Work button
    const viewWorkBtn = document.querySelector('.circle-link');
    if (viewWorkBtn) {
      viewWorkBtn.addEventListener('mouseenter', () => {
        stopAutoRotation();
        transitionToMode('view-work');
      });
      viewWorkBtn.addEventListener('mouseleave', () => {
        transitionToMode('default');
        startAutoRotation();
      });
    }

    // About button
    const aboutLinks = document.querySelectorAll('a[href="about.html"]');
    aboutLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        stopAutoRotation();
        transitionToMode('about');
      });
      link.addEventListener('mouseleave', () => {
        transitionToMode('default');
        startAutoRotation();
      });
    });

    // Contact button
    const contactLinks = document.querySelectorAll('a[href="contact.html"]');
    contactLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        stopAutoRotation();
        transitionToMode('contact');
      });
      link.addEventListener('mouseleave', () => {
        transitionToMode('default');
        startAutoRotation();
      });
    });
  }

  function startAutoRotation() {
    const modes = ['ux-designer', 'tech-creative', 'prompt-engineer', 'multi-media'];
    let modeIndex = 0;

    autoRotateInterval = setInterval(() => {
      transitionToMode(modes[modeIndex]);
      modeIndex = (modeIndex + 1) % modes.length;
    }, 3000);
  }

  function stopAutoRotation() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  function transitionToMode(modeName) {
    if (currentMode === modeName) return;

    const config = modeConfigs[modeName] || modeConfigs['default'];
    currentMode = modeName;
    const duration = 1000;

    // Animate camera position
    animateValue(camera.position, 'x', camera.position.x, config.camera.x, duration);
    animateValue(camera.position, 'y', camera.position.y, config.camera.y, duration);
    animateValue(camera.position, 'z', camera.position.z, config.camera.z, duration);

    // Animate particle color
    if (particles && particles.material) {
      const currentColor = particles.material.color.getHex();
      animateColor(particles.material, currentColor, config.particleColor, duration);
    }

    // Animate shapes
    meshes.forEach((mesh, index) => {
      const shapeConfig = config.shapes[index];
      if (shapeConfig) {
        // Position
        animateValue(mesh.position, 'x', mesh.position.x, shapeConfig.position[0], duration);
        animateValue(mesh.position, 'y', mesh.position.y, shapeConfig.position[1], duration);
        animateValue(mesh.position, 'z', mesh.position.z, shapeConfig.position[2], duration);

        // Scale
        animateValue(mesh.scale, 'x', mesh.scale.x, shapeConfig.scale, duration);
        animateValue(mesh.scale, 'y', mesh.scale.y, shapeConfig.scale, duration);
        animateValue(mesh.scale, 'z', mesh.scale.z, shapeConfig.scale, duration);

        // Save base rotation for continuous animation
        mesh.userData.baseRotationX = shapeConfig.rotation[0];
        mesh.userData.baseRotationY = shapeConfig.rotation[1];
      }
    });
  }

  function onWindowResize() {
    const container = document.getElementById('hero-3d-container');
    if (!container || !camera || !renderer) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth;
    const height = rect.height || container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(event) {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;
  }

  function onClick(event) {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      if (!clickedMesh.userData.isAnimating) {
        animateClick(clickedMesh);
      }
    }
  }

  function animateClick(mesh) {
    mesh.userData.isAnimating = true;
    const startRotationX = mesh.rotation.x;
    const startRotationY = mesh.rotation.y;
    const startScale = mesh.scale.x;
    const startTime = Date.now();
    const duration = 300;

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      // 360 degree spin on both axes
      mesh.rotation.x = startRotationX + (Math.PI * 2 * easeProgress);
      mesh.rotation.y = startRotationY + (Math.PI * 2 * easeProgress);

      // Scale up then down
      const scaleFactor = progress < 0.5
        ? 1 + (0.4 * (progress * 2))
        : 1.4 - (0.4 * ((progress - 0.5) * 2));
      mesh.scale.setScalar(scaleFactor * startScale);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        mesh.scale.setScalar(startScale);
        mesh.userData.isAnimating = false;
      }
    }

    update();
  }

  function animate() {
    requestAnimationFrame(animate);

    // Rotate meshes continuously
    meshes.forEach((mesh, index) => {
      if (!mesh.userData.isAnimating) {
        mesh.rotation.x += 0.0008 * (index + 1);
        mesh.rotation.y += 0.001 * (index + 1);
      }
    });

    // Rotate particles
    if (particles) {
      particles.rotation.y += 0.0003;
    }

    // Mouse parallax with smooth damping
    targetX += (mouseX * 0.3 - targetX) * 0.03;
    targetY += (mouseY * 0.3 - targetY) * 0.03;

    // Apply parallax offset to camera (add to mode-defined position)
    const config = modeConfigs[currentMode] || modeConfigs['default'];
    camera.position.x = config.camera.x + targetX;
    camera.position.y = config.camera.y + targetY;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
})();
