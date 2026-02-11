import * as THREE from 'three';

export class Experience {
    constructor(canvas) {
        this.canvas = canvas;
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.currentSection = 0;
        this.clock = new THREE.Clock();

        this.init();
        this.createLights();
        this.createHeroModel();
        this.createGalaxyParticles();
        this.createFloatingGeometries();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x020617, 0.08);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 8);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    createLights() {
        // Soft ambient
        const ambientLight = new THREE.AmbientLight(0x4338ca, 0.4);
        this.scene.add(ambientLight);

        // Main light (cyan)
        const mainLight = new THREE.DirectionalLight(0x22d3ee, 1.2);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        // Accent light (violet)
        this.violetLight = new THREE.PointLight(0x8b5cf6, 3, 15);
        this.violetLight.position.set(-4, 3, 3);
        this.scene.add(this.violetLight);

        // Secondary accent (cyan)
        this.cyanLight = new THREE.PointLight(0x06b6d4, 2, 12);
        this.cyanLight.position.set(4, -2, 4);
        this.scene.add(this.cyanLight);

        // Rim light (rose)
        const rimLight = new THREE.PointLight(0xf43f5e, 1, 10);
        rimLight.position.set(0, -5, 2);
        this.scene.add(rimLight);
    }

    createHeroModel() {
        // Iridescent shader material
        const iridMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(0x06b6d4) },
                uColor2: { value: new THREE.Color(0x8b5cf6) },
                uColor3: { value: new THREE.Color(0xf43f5e) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                uniform float uTime;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    
                    // Subtle vertex displacement
                    vec3 pos = position;
                    float displacement = sin(pos.x * 3.0 + uTime * 0.5) * 
                                        cos(pos.y * 2.0 + uTime * 0.3) * 
                                        sin(pos.z * 4.0 + uTime * 0.4) * 0.03;
                    pos += normal * displacement;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    // Fresnel-like iridescence
                    vec3 viewDir = normalize(cameraPosition - vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                    
                    // Shifting color palette
                    float t = sin(vUv.x * 3.14 + uTime * 0.3) * 0.5 + 0.5;
                    vec3 color = mix(uColor1, uColor2, t);
                    color = mix(color, uColor3, fresnel * 0.6);
                    
                    // Metallic sheen
                    float specular = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.5, 0.5, 1.0)), 0.0), 32.0);
                    color += vec3(specular * 0.3);
                    
                    // Edge glow
                    color += fresnel * uColor1 * 0.4;
                    
                    // Ambient occlusion simulation
                    float ao = smoothstep(-0.5, 1.0, vNormal.y) * 0.5 + 0.5;
                    color *= ao;
                    
                    gl_FragColor = vec4(color, 0.95);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        // Main torus knot
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 40, 2, 3);
        this.heroModel = new THREE.Mesh(geometry, iridMaterial);

        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            this.heroModel.position.set(0, 0.5, 0);
            this.heroModel.scale.setScalar(0.5);
        } else {
            this.heroModel.position.set(2.5, 0, 0);
            this.heroModel.scale.setScalar(0.9);
        }

        this.scene.add(this.heroModel);

        // Wireframe overlay
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            wireframe: true,
            transparent: true,
            opacity: 0.06
        });
        const wireframe = new THREE.Mesh(geometry, wireMaterial);
        wireframe.scale.setScalar(1.002);
        this.heroModel.add(wireframe);

        // Outer glow ring
        const ringGeometry = new THREE.TorusGeometry(2, 0.005, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.2
        });
        this.glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.glowRing.position.copy(this.heroModel.position);
        this.scene.add(this.glowRing);
    }

    createGalaxyParticles() {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorInside = new THREE.Color(0x22d3ee);
        const colorOutside = new THREE.Color(0x8b5cf6);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Galaxy spiral pattern
            const radius = Math.random() * 15 + 1;
            const spinAngle = radius * 1.5;
            const branchAngle = ((i % 3) / 3) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 0.5;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 5;

            // Color gradient
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / 15);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            sizes[i] = Math.random() * 3 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float aSize;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Gentle floating
                    pos.y += sin(uTime * 0.3 + pos.x * 0.5) * 0.1;
                    
                    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    gl_Position = projectedPosition;
                    
                    gl_PointSize = aSize * uPixelRatio * (1.0 / -viewPosition.z) * 15.0;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    // Soft circular point
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if(dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.galaxyParticles = new THREE.Points(geometry, material);
        this.scene.add(this.galaxyParticles);
    }

    createFloatingGeometries() {
        this.floatingMeshes = [];

        const sharedMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.95,
            roughness: 0.05,
            transparent: true,
            opacity: 0.4
        });

        const geometries = [
            new THREE.OctahedronGeometry(0.3, 0),
            new THREE.TetrahedronGeometry(0.25, 0),
            new THREE.IcosahedronGeometry(0.2, 0),
            new THREE.OctahedronGeometry(0.15, 0),
            new THREE.TetrahedronGeometry(0.2, 0),
        ];

        const offsets = [
            { x: -5, y: 3, z: -3 },
            { x: 6, y: -2, z: -4 },
            { x: -4, y: -4, z: -2 },
            { x: 5, y: 4, z: -5 },
            { x: -6, y: 1, z: -6 },
        ];

        geometries.forEach((geo, i) => {
            const mesh = new THREE.Mesh(geo, sharedMaterial.clone());
            mesh.position.set(offsets[i].x, offsets[i].y, offsets[i].z);

            // Edges
            const edges = new THREE.EdgesGeometry(geo);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x22d3ee : 0x8b5cf6,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.LineSegments(edges, edgeMaterial);
            mesh.add(line);

            mesh.userData = {
                speed: 0.2 + Math.random() * 0.4,
                floatOffset: Math.random() * Math.PI * 2,
                rotSpeed: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 }
            };

            this.floatingMeshes.push(mesh);
            this.scene.add(mesh);
        });
    }

    addEventListeners() {
        // Resize
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            this.updateMobileSettings();
        });

        // Mouse
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / this.sizes.width) * 2 - 1;
            this.targetMouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
        });

        // Scroll
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
            this.currentSection = Math.round(this.scrollY / this.sizes.height);
        });
    }

    updateMobileSettings() {
        const isMobile = this.sizes.width < 768;
        if (this.heroModel) {
            if (isMobile) {
                this.heroModel.position.set(0, 0.5, 0);
                this.heroModel.scale.setScalar(0.5);
            } else {
                this.heroModel.position.set(2.5, 0, 0);
                this.heroModel.scale.setScalar(0.9);
            }
        }
    }

    animate() {
        const tick = () => {
            const elapsed = this.clock.getElapsedTime();

            // Smooth mouse
            this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
            this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

            const isMobile = this.sizes.width < 768;

            // Hero model
            if (this.heroModel) {
                const baseX = isMobile ? 0 : 2.5;
                const floatAmp = isMobile ? 0.05 : 0.25;

                this.heroModel.rotation.x = elapsed * 0.08;
                this.heroModel.rotation.y = elapsed * 0.12;
                this.heroModel.rotation.z = elapsed * 0.05;

                if (!isMobile) {
                    this.heroModel.position.x = baseX + this.mouse.x * 0.4;
                    this.heroModel.position.y = Math.sin(elapsed * 0.4) * floatAmp + this.mouse.y * 0.25;
                } else {
                    this.heroModel.position.y = 0.5 + Math.sin(elapsed * 0.4) * floatAmp;
                }

                // Update shader time
                if (this.heroModel.material.uniforms) {
                    this.heroModel.material.uniforms.uTime.value = elapsed;
                }
            }

            // Glow ring
            if (this.glowRing) {
                this.glowRing.rotation.x = elapsed * 0.15 + Math.PI * 0.5;
                this.glowRing.rotation.z = elapsed * 0.1;
                this.glowRing.position.x = isMobile ? 0 : 2.5 + this.mouse.x * 0.2;
                this.glowRing.position.y = isMobile ? 0.5 : this.mouse.y * 0.15;
            }

            // Galaxy particles
            if (this.galaxyParticles) {
                this.galaxyParticles.rotation.y = elapsed * 0.02;
                this.galaxyParticles.material.uniforms.uTime.value = elapsed;
            }

            // Floating geometries
            this.floatingMeshes.forEach((mesh) => {
                const { speed, floatOffset, rotSpeed } = mesh.userData;
                mesh.rotation.x += rotSpeed.x * 0.01;
                mesh.rotation.y += rotSpeed.y * 0.01;
                mesh.position.y += Math.sin(elapsed * speed + floatOffset) * 0.002;
            });

            // Animate lights
            if (this.violetLight) {
                this.violetLight.position.x = Math.sin(elapsed * 0.3) * 4;
                this.violetLight.position.y = Math.cos(elapsed * 0.4) * 3;
            }
            if (this.cyanLight) {
                this.cyanLight.position.x = Math.cos(elapsed * 0.25) * 4;
                this.cyanLight.position.z = Math.sin(elapsed * 0.35) * 4 + 2;
            }

            // Render
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(tick);
        };

        tick();
    }
}
