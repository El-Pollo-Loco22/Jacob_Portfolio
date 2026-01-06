/**
 * Portfolio 3D Scene Manager
 * Handles 3D background grid and model switching based on tab selection
 */

class Portfolio3DScene {
  constructor() {
    this.container = document.getElementById('portfolio-3d-container');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.grid = null;
    this.currentModel = null;
    this.animationId = null;
    this.loader = new THREE.GLTFLoader();
    
    // Tab-specific configurations
    this.tabConfigs = {
      'articles': {
        modelPath: '../3DAssts/mecha_gltf/scene.gltf',
        gridColor: 0x00ffff,
        backgroundColor: 0x0a0a1a,
        modelScale: 1.22,
        modelPosition: { x: 0, y: 0.4, z: 1.5 },
        modelRotation: { x: 0.3, y: 0, z: 0 }
      },
      'ux': {
        modelPath: '../3DAssts/commodore_pet_gltf 2/scene.gltf',
        gridColor: 0xff00ff,
        backgroundColor: 0x1a0a1a,
        modelScale: 1.8,
        modelPosition: { x: 0, y: 0.1, z: 1.5 },
        modelRotation: { x: 0.15, y: 0, z: 0 }
      },
      'video': {
        modelPath: '../3DAssts/cinema_camera_gltf/scene.gltf',
        gridColor: 0xffaa00,
        backgroundColor: 0x1a1a0a,
        modelScale: 2.25,
        modelPosition: { x: 0, y: 0.2, z: 1.5 },
        modelRotation: { x: 0.2, y: 0, z: 0 }
      },
      'mixed-media': {
        modelPath: '../3DAssts/spray_paint_gltf/scene.gltf',
        gridColor: 0x00ff88,
        backgroundColor: 0x0a1a1a,
        modelScale: 0.8,
        modelPosition: { x: 0, y: 0.4, z: 1.5 },
        modelRotation: { x: 0.2, y: 0, z: 0 }
      }
    };

    this.currentTab = 'articles'; // Default tab
    this.init();
  }

  init() {
    // Setup scene
    this.scene = new THREE.Scene();
    
    // Setup camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(0, 1, 4);
    this.camera.lookAt(0, 0, 0);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Append canvas
    const canvas = this.renderer.domElement;
    canvas.id = 'portfolio-3d-canvas';
    this.container.appendChild(canvas);

    // Setup lights
    this.setupLights();

    // Create grid
    this.createGrid();

    // Load initial model
    this.loadModel(this.currentTab);

    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Listen for tab changes
    this.setupTabListeners();
  }

  setupLights() {
    // Ambient light - brighter for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Directional light (main light)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // Additional front light for visibility
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 5, 10);
    this.scene.add(frontLight);

    // Point light for accent
    const pointLight = new THREE.PointLight(0x00ffff, 1.5, 50);
    pointLight.position.set(-3, 3, 5);
    this.scene.add(pointLight);
  }

  createGrid() {
    // Create animated grid
    const gridGroup = new THREE.Group();
    
    // Grid parameters
    const size = 20;
    const divisions = 20;
    const step = size / divisions;

    // Create grid lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    });

    // Horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const points = [];
      const y = -1.5; // Raised from -2
      const z = -size / 2 + i * step;
      
      points.push(new THREE.Vector3(-size / 2, y, z));
      points.push(new THREE.Vector3(size / 2, y, z));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      gridGroup.add(line);
    }

    // Vertical lines
    for (let i = 0; i <= divisions; i++) {
      const points = [];
      const y = -1.5; // Raised from -2
      const x = -size / 2 + i * step;
      
      points.push(new THREE.Vector3(x, y, -size / 2));
      points.push(new THREE.Vector3(x, y, size / 2));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      gridGroup.add(line);
    }

    this.grid = gridGroup;
    this.scene.add(this.grid);
  }

  updateGridColor(color) {
    if (!this.grid) return;
    
    // Animate color transition
    this.grid.children.forEach(line => {
      if (line.material) {
        const startColor = line.material.color.getHex();
        const duration = 1000; // 1 second
        const startTime = Date.now();
        
        const animateColor = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Interpolate colors
          const r1 = (startColor >> 16) & 0xff;
          const g1 = (startColor >> 8) & 0xff;
          const b1 = startColor & 0xff;
          
          const r2 = (color >> 16) & 0xff;
          const g2 = (color >> 8) & 0xff;
          const b2 = color & 0xff;
          
          const r = Math.round(r1 + (r2 - r1) * progress);
          const g = Math.round(g1 + (g2 - g1) * progress);
          const b = Math.round(b1 + (b2 - b1) * progress);
          
          line.material.color.setHex((r << 16) | (g << 8) | b);
          
          if (progress < 1) {
            requestAnimationFrame(animateColor);
          }
        };
        
        animateColor();
      }
    });
  }

  updateBackgroundColor(color) {
    const startColor = this.scene.background ? this.scene.background.getHex() : 0x000000;
    const duration = 1000;
    const startTime = Date.now();
    
    const animateBackground = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const r1 = (startColor >> 16) & 0xff;
      const g1 = (startColor >> 8) & 0xff;
      const b1 = startColor & 0xff;
      
      const r2 = (color >> 16) & 0xff;
      const g2 = (color >> 8) & 0xff;
      const b2 = color & 0xff;
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      this.scene.background = new THREE.Color((r << 16) | (g << 8) | b);
      
      if (progress < 1) {
        requestAnimationFrame(animateBackground);
      }
    };
    
    animateBackground();
  }

  loadModel(tabId) {
    const config = this.tabConfigs[tabId];
    if (!config) return;

    // Remove current model
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
      this.currentModel = null;
    }

    // Update colors
    this.updateGridColor(config.gridColor);
    this.updateBackgroundColor(config.backgroundColor);

    // Load new model
    this.container.classList.add('loading');
    
    this.loader.load(
      config.modelPath,
      (gltf) => {
        // Create a container group for proper rotation
        const modelContainer = new THREE.Group();
        
        // Normalize and center the loaded model
        this.normalizeModel(gltf.scene, config.modelScale);
        
        // Add the centered model to the container
        modelContainer.add(gltf.scene);
        
        // Apply position to the container
        modelContainer.position.set(
          config.modelPosition.x,
          config.modelPosition.y,
          config.modelPosition.z
        );
        
        // Apply initial rotation to the container
        modelContainer.rotation.set(
          config.modelRotation.x,
          config.modelRotation.y,
          config.modelRotation.z
        );

        // Enable shadows and improve materials
        let meshCount = 0;
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            meshCount++;
            child.castShadow = true;
            child.receiveShadow = true;
            // Enhance material visibility
            if (child.material) {
              child.material.needsUpdate = true;
              // Make sure materials are visible
              if (child.material.transparent) {
                child.material.opacity = Math.max(child.material.opacity, 0.9);
              }
            }
          }
        });

        // Store the container as currentModel
        this.currentModel = modelContainer;
        this.scene.add(this.currentModel);
        this.container.classList.remove('loading');
        console.log(`✓ Model loaded successfully: ${tabId}`);
        console.log(`  - Meshes found: ${meshCount}`);
        console.log(`  - Scale: ${config.modelScale}`);
        console.log(`  - Position: x=${config.modelPosition.x}, y=${config.modelPosition.y}, z=${config.modelPosition.z}`);
      },
      (progress) => {
        // Optional: Add loading progress
        if (progress.total > 0) {
          console.log(`Loading model: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        this.container.classList.remove('loading');
      }
    );
  }

  normalizeModel(model, targetScale) {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    console.log('Model dimensions:', {
      width: size.x,
      height: size.y,
      depth: size.z,
      maxDim: maxDim,
      targetScale: targetScale
    });

    if (maxDim > 0) {
      // Calculate bounding box center
      const center = box.getCenter(new THREE.Vector3());
      
      // Normalize to 1 unit, then apply target scale
      const normalizeScale = 1.0 / maxDim;
      const finalScale = normalizeScale * targetScale;
      
      model.scale.set(finalScale, finalScale, finalScale);

      // Center the model at origin by offsetting position
      // This ensures it rotates around its own center
      model.position.set(-center.x * finalScale, -center.y * finalScale, -center.z * finalScale);
      
      console.log('Model normalized with scale:', finalScale, 'centered at origin');
    } else {
      console.warn('Model has zero dimensions, applying direct scale');
      model.scale.set(targetScale, targetScale, targetScale);
    }
  }

  setupTabListeners() {
    const tabLinks = document.querySelectorAll('.nav-link[data-tab]');
    
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const tabId = link.getAttribute('data-tab');
        if (tabId && tabId !== this.currentTab) {
          this.currentTab = tabId;
          this.loadModel(tabId);
        }
      });
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate current model on Y-axis (horizontal spin)
    if (this.currentModel) {
      this.currentModel.rotation.y += 0.01; // Smooth continuous rotation
    }

    // Animate grid (subtle wave effect)
    if (this.grid) {
      const time = Date.now() * 0.001;
      this.grid.rotation.y = Math.sin(time * 0.1) * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Three.js to be available
  if (typeof THREE !== 'undefined') {
    window.portfolio3DScene = new Portfolio3DScene();
  } else {
    console.error('Three.js library not loaded');
  }
});

