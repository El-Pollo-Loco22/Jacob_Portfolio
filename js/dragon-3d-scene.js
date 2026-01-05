/**
 * Dragon 3D Scene - Three.js Implementation
 * Animated golden dragon background for Dungeon Archivist whitepaper
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let scene, camera, renderer, dragon = null;
  let animationFrameId = null;
  let glidingOffset = 0;
  let rotationY = 0;

  // Golden yellow color (#FFD700)
  const GOLDEN_YELLOW = 0xFFD700;
  const WARM_YELLOW = 0xFFC125; // Slightly warmer variant

  function init() {
    const container = document.querySelector('.project-hero.dungeon-theme');
    if (!container) {
      console.error('Dungeon theme hero container not found');
      return;
    }

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'dragon-3d-canvas';
    canvasContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;
    container.insertBefore(canvasContainer, container.firstChild);

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || window.innerWidth;
    const height = rect.height || container.clientHeight || window.innerHeight;

    // Camera setup - positioned to show full dragon
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1); // Black background
    canvasContainer.appendChild(renderer.domElement);

    // Lighting - atmospheric lighting for dramatic effect
    setupLights();

    // Load dragon model
    loadDragonModel();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
  }

  function setupLights() {
    // Ambient light - subtle overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main directional light - highlights the golden dragon
    const mainLight = new THREE.DirectionalLight(0xFFD700, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Secondary directional light - adds depth
    const fillLight = new THREE.DirectionalLight(0xFFC125, 0.6);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Point light for extra drama
    const pointLight = new THREE.PointLight(0xFFD700, 0.8, 100);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);
  }

  function loadDragonModel() {
    const loader = new THREE.GLTFLoader();
    const modelPath = '../3DAssts/dragon_decimated_sculpt_gltf/scene.gltf';

    loader.load(
      modelPath,
      (gltf) => {
        console.log('Dragon model loaded successfully');
        dragon = gltf.scene;

        // Normalize and position the dragon
        normalizeDragon(dragon);

        // Apply golden yellow material to all meshes
        applyGoldenMaterial(dragon);

        // Add to scene
        scene.add(dragon);

        // Center the dragon
        dragon.position.set(0, 0, 0);
      },
      (progress) => {
        // Progress callback (optional)
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading dragon: ${percent.toFixed(2)}%`);
        }
      },
      (error) => {
        console.error('Error loading dragon model:', error);
        // Fallback: create a simple golden geometric shape
        createFallbackDragon();
      }
    );
  }

  function normalizeDragon(dragonModel) {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(dragonModel);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      // Scale to fit nicely in view (about 2 units)
      const scale = 2.0 / maxDim;
      dragonModel.scale.setScalar(scale);

      // Recalculate bounding box after scaling
      box.setFromObject(dragonModel);
      const center = box.getCenter(new THREE.Vector3());

      // Center the model
      dragonModel.position.sub(center);
    }
  }

  function applyGoldenMaterial(dragonModel) {
    // Create golden yellow material
    const goldenMaterial = new THREE.MeshStandardMaterial({
      color: GOLDEN_YELLOW,
      metalness: 0.7,
      roughness: 0.3,
      emissive: WARM_YELLOW,
      emissiveIntensity: 0.2
    });

    // Alternative: MeshPhongMaterial for more dramatic lighting
    const goldenPhongMaterial = new THREE.MeshPhongMaterial({
      color: GOLDEN_YELLOW,
      shininess: 100,
      emissive: WARM_YELLOW,
      emissiveIntensity: 0.15,
      specular: 0xFFFFAA
    });

    // Traverse the model and apply material to all meshes
    dragonModel.traverse((child) => {
      if (child.isMesh) {
        // Use MeshStandardMaterial for better PBR rendering
        child.material = goldenMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  function createFallbackDragon() {
    // Fallback: create a golden torus knot as placeholder
    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: GOLDEN_YELLOW,
      metalness: 0.7,
      roughness: 0.3,
      emissive: WARM_YELLOW,
      emissiveIntensity: 0.2
    });
    
    dragon = new THREE.Mesh(geometry, material);
    scene.add(dragon);
    console.warn('Using fallback geometry - dragon model failed to load');
  }

  function onWindowResize() {
    const container = document.querySelector('.project-hero.dungeon-theme');
    if (!container || !camera || !renderer) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth;
    const height = rect.height || container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (dragon) {
      // Continuous 360-degree rotation on Y-axis
      rotationY += 0.005; // Adjust speed as needed
      dragon.rotation.y = rotationY;

      // Gentle gliding motion (floating up and down)
      // Using sine wave for smooth animation
      glidingOffset += 0.01;
      const glidingAmount = Math.sin(glidingOffset) * 0.3; // 0.3 units up/down
      dragon.position.y = glidingAmount;
    }

    renderer.render(scene, camera);
  }

  // Cleanup function (optional, for page transitions)
  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', onWindowResize);
  }

  // Expose cleanup if needed
  window.dragon3DCleanup = cleanup;
})();

