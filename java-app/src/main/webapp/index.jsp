<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:if test="${antiques == null}">
    <c:redirect url="/home"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Elite Indian Antique Network</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
    <header class="navbar">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1>Antiques</h1>
        </a>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/home" class="active">Gallery</a>
            <c:choose>
                <c:when test="${not empty sessionScope.user}">
                    <a href="${pageContext.request.contextPath}/cart">My Cart</a>
                    <c:choose>
                        <c:when test="${sessionScope.user.role eq 'ADMIN'}">
                            <a href="${pageContext.request.contextPath}/admin-dashboard">Admin Panel</a>
                        </c:when>
                        <c:otherwise>
                            <a href="${pageContext.request.contextPath}/dashboard">My Dashboard</a>
                        </c:otherwise>
                    </c:choose>
                    <span class="user-badge">${sessionScope.user.name} (${sessionScope.user.role})</span>
                    <a href="#" onclick="logout(); return false;">Sign Out</a>
                </c:when>
                <c:otherwise>
                    <a href="${pageContext.request.contextPath}/login.jsp">Sign In</a>
                    <a href="${pageContext.request.contextPath}/register.jsp">Register</a>
                </c:otherwise>
            </c:choose>
        </nav>
    </header>

    <main class="main-container">
        <!-- Hero Section with the Masterpiece 3D Vase -->
        <section class="hero-section">
            <div class="hero-content">
                <span class="hero-badge">Royal Indian Antiquities</span>
                <h2 class="hero-title gold-gradient">Masterpieces of the Past, Today.</h2>
                <p class="hero-text">
                    Welcome to India's most trusted, direct-to-consumer antique network. 
                    Every artifact is curated by experts, physically verified, and safely shipped to your doorstep.
                </p>
                <div style="display: flex; gap: 15px;">
                    <button class="btn-premium" onclick="document.getElementById('explore-gallery').scrollIntoView({ behavior: 'smooth' })">
                        Explore Gallery
                    </button>
                </div>
            </div>
            <div class="hero-visual">
                <canvas id="hero-3d-canvas"></canvas>
            </div>
        </section>

        <div id="explore-gallery" class="text-center mb-20" style="scroll-margin-top: 100px;">
            <h2 class="section-title">The Royal Collection</h2>
            <p class="section-subtitle">Exquisite historical artifacts, authenticated and verified by our master curators.</p>
        </div>

        <div class="antique-grid">
            <c:forEach var="item" items="${antiques}">
                <div class="glass-card antique-card">
                    <img src="${not empty item.imageUrl ? item.imageUrl : 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600'}" alt="${item.title}" class="antique-image">
                    <span class="antique-category">${item.category}</span>
                    <h3 class="antique-title">${item.title}</h3>
                    <p class="text-muted" style="font-size:14px; margin-bottom:15px;">${item.description}</p>
                    <div class="antique-price">₹<c:out value="${item.price}"/></div>
                    <form action="${pageContext.request.contextPath}/cart/add" method="POST">
                        <input type="hidden" name="productId" value="${item.id}">
                        <button type="submit" class="btn-premium w-100">Reserve Artifact</button>
                    </form>
                </div>
            </c:forEach>
        </div>
    </main>

    <script>
        async function logout() {
            const res = await fetch('${pageContext.request.contextPath}/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.reload();
            }
        }

        // Initialize 3D Scene for Antiques Landing Page
        (function() {
            const canvas = document.getElementById('hero-3d-canvas');
            if (!canvas) return;

            // Global Dragging States
            let isDragging = false;
            let previousMousePosition = { x: 0, y: 0 };

            const container = canvas.parentElement;
            const scene = new THREE.Scene();
            
            // Camera
            const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100);
            camera.position.set(0, 0, 16);

            // Renderer with premium tone mapping
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.3;

            // Group to contain the whole vase assembly
            const vaseGroup = new THREE.Group();
            vaseGroup.position.set(0, -3.2, 0);
            vaseGroup.scale.set(0.55, 0.55, 0.55);
            scene.add(vaseGroup);

            // Materials
            const colors = {
                teal: 0x042c23,
                gold: 0xdfb743,
                brightGold: 0xffd700
            };

            const tealMat = new THREE.MeshPhysicalMaterial({
                color: colors.teal,
                metalness: 0.35,
                roughness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                reflectivity: 1.0,
                ior: 1.8,
                iridescence: 0.5,
                side: THREE.DoubleSide
            });

            const goldMat = new THREE.MeshPhysicalMaterial({
                color: colors.gold,
                metalness: 1.0,
                roughness: 0.1,
                clearcoat: 1.0,
                emissive: colors.gold,
                emissiveIntensity: 0.1
            });

            // 1. Vase Lathe Body (Teal Glaze)
            const points = [];
            points.push(new THREE.Vector2(0, 0));
            points.push(new THREE.Vector2(1.5, 0));
            points.push(new THREE.Vector2(1.4, 0.4));
            points.push(new THREE.Vector2(1.1, 0.5));
            points.push(new THREE.Vector2(1.2, 0.8));
            points.push(new THREE.Vector2(0.8, 1.5));
            points.push(new THREE.Vector2(3.0, 4.0));
            points.push(new THREE.Vector2(3.4, 5.5));
            points.push(new THREE.Vector2(2.5, 7.0));
            points.push(new THREE.Vector2(1.6, 8.5));
            points.push(new THREE.Vector2(1.3, 9.5));
            points.push(new THREE.Vector2(1.2, 10.8));
            points.push(new THREE.Vector2(1.4, 11.4));
            points.push(new THREE.Vector2(2.4, 12.0));
            points.push(new THREE.Vector2(2.6, 12.2));

            const latheGeom = new THREE.LatheGeometry(points, 64);
            const vaseBody = new THREE.Mesh(latheGeom, tealMat);
            vaseGroup.add(vaseBody);

            // 2. Dual Handles (Venetian Gold)
            const handlePoints = [
                new THREE.Vector3(1.2, 10.5, 0),
                new THREE.Vector3(4.5, 9.5, 0),
                new THREE.Vector3(5.0, 7.0, 0),
                new THREE.Vector3(3.2, 5.0, 0)
            ];
            const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
            const handleGeom = new THREE.TubeGeometry(handleCurve, 64, 0.22, 12, false);

            // Left Handle Assembly
            const leftHandleGroup = new THREE.Group();
            const leftHandle = new THREE.Mesh(handleGeom, goldMat);
            leftHandleGroup.add(leftHandle);
            const leftOrnament = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMat);
            leftOrnament.position.set(4.5, 9.5, 0);
            leftHandleGroup.add(leftOrnament);
            vaseGroup.add(leftHandleGroup);

            // Right Handle Assembly (rotated 180 degrees)
            const rightHandleGroup = leftHandleGroup.clone();
            rightHandleGroup.rotation.y = Math.PI;
            vaseGroup.add(rightHandleGroup);

            // 3. Gold Trims & Decorative Filigree (Golden Work)
            const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.15, 16, 64), goldMat);
            baseRing.rotation.x = Math.PI / 2;
            vaseGroup.add(baseRing);

            const rimRing = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.12, 16, 64), goldMat);
            rimRing.position.y = 12.0;
            rimRing.rotation.x = Math.PI / 2;
            vaseGroup.add(rimRing);

            // Gold Waist Bands
            const waistBand1 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.08, 16, 64), goldMat);
            waistBand1.position.y = 2.0;
            waistBand1.rotation.x = Math.PI / 2;
            vaseGroup.add(waistBand1);

            const waistBand2 = new THREE.Mesh(new THREE.TorusGeometry(3.08, 0.08, 16, 64), goldMat);
            waistBand2.position.y = 4.0;
            waistBand2.rotation.x = Math.PI / 2;
            vaseGroup.add(waistBand2);

            // Double-Helix Gold Filigree Vine on Neck
            const spiralPoints = [];
            const spiralPoints2 = [];
            for (let t = 0; t <= 1; t += 0.01) {
                const angle = t * Math.PI * 5; // 2.5 full turns
                const height = 7.0 + t * 2.5;  // from y=7.0 to y=9.5
                const radius = (2.5 * (1 - t) + 1.35 * t) + 0.04;
                
                spiralPoints.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius));
                spiralPoints2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, height, Math.sin(angle + Math.PI) * radius));
            }
            
            const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
            const spiralGeom = new THREE.TubeGeometry(spiralCurve, 100, 0.06, 8, false);
            const spiralMesh = new THREE.Mesh(spiralGeom, goldMat);
            vaseGroup.add(spiralMesh);

            const spiralCurve2 = new THREE.CatmullRomCurve3(spiralPoints2);
            const spiralGeom2 = new THREE.TubeGeometry(spiralCurve2, 100, 0.06, 8, false);
            const spiralMesh2 = new THREE.Mesh(spiralGeom2, goldMat);
            vaseGroup.add(spiralMesh2);

            // Gold Medallions with Ruby Centers
            const emblemGroup = new THREE.Group();
            emblemGroup.position.set(0, 5.5, 3.35);
            emblemGroup.rotation.x = 0.3; // matches the belly tilt

            const gemGeom = new THREE.IcosahedronGeometry(0.35, 1);
            const gemMat = new THREE.MeshPhysicalMaterial({
                color: 0x9b111e, // Ruby Red
                roughness: 0.0,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9,
                transmission: 0.9,
                ior: 2.4,
                thickness: 0.5
            });
            const gem = new THREE.Mesh(gemGeom, gemMat);
            emblemGroup.add(gem);

            const emblemRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.08, 16, 64), goldMat);
            emblemGroup.add(emblemRing);

            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const bead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
                bead.position.set(Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0);
                emblemGroup.add(bead);
            }
            vaseGroup.add(emblemGroup);

            // Symmetrical back medallion
            const backEmblemGroup = emblemGroup.clone();
            backEmblemGroup.position.set(0, 5.5, -3.35);
            backEmblemGroup.rotation.x = -0.3;
            backEmblemGroup.rotation.y = Math.PI;
            vaseGroup.add(backEmblemGroup);

            // 4. Golden Sparkle Particles
            const particleCount = 40;
            const particleGeom = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const speeds = [];

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 12;
                positions[i * 3 + 1] = Math.random() * 12 - 2;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
                speeds.push({
                    y: 0.01 + Math.random() * 0.015,
                    x: (Math.random() - 0.5) * 0.005
                });
            }

            particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particleMat = new THREE.PointsMaterial({
                color: colors.brightGold,
                size: 0.1,
                transparent: true,
                opacity: 0.75
            });
            const particles = new THREE.Points(particleGeom, particleMat);
            scene.add(particles);

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
            dirLight.position.set(5, 10, 7);
            scene.add(dirLight);

            const pointLight1 = new THREE.PointLight(colors.brightGold, 2.5, 15);
            pointLight1.position.set(0, 3, 3);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
            pointLight2.position.set(-5, -3, 3);
            scene.add(pointLight2);

            // Animation Loop
            let clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);

                const elapsed = clock.getElapsedTime();

                // Rotate Vase slowly unless user drags it
                if (!isDragging) {
                    vaseGroup.rotation.y = elapsed * 0.15;
                }

                // Subtle float effect
                vaseGroup.position.y = -3.2 + Math.sin(elapsed * 1.5) * 0.12;

                // Animate particles rising
                const posAttr = particles.geometry.attributes.position;
                for (let i = 0; i < particleCount; i++) {
                    let y = posAttr.getY(i);
                    let x = posAttr.getX(i);
                    
                    y += speeds[i].y;
                    x += speeds[i].x;

                    if (y > 8) {
                        y = -4;
                        x = (Math.random() - 0.5) * 12;
                    }
                    
                    posAttr.setY(i, y);
                    posAttr.setX(i, x);
                }
                posAttr.needsUpdate = true;

                renderer.render(scene, camera);
            }

            animate();

            // Handle Resize
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            // Smooth Touch/Drag Rotation Controls
            canvas.addEventListener('mousedown', (e) => {
                isDragging = true;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            });

            canvas.addEventListener('touchstart', (e) => {
                isDragging = true;
                if (e.touches.length > 0) {
                    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            }, { passive: true });

            canvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const deltaX = e.clientX - previousMousePosition.x;
                    const deltaY = e.clientY - previousMousePosition.y;

                    vaseGroup.rotation.y += deltaX * 0.01;
                    vaseGroup.rotation.x += deltaY * 0.005;

                    previousMousePosition = { x: e.clientX, y: e.clientY };
                }
            });

            canvas.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches.length > 0) {
                    const touch = e.touches[0];
                    const deltaX = touch.clientX - previousMousePosition.x;
                    const deltaY = touch.clientY - previousMousePosition.y;

                    vaseGroup.rotation.y += deltaX * 0.01;
                    vaseGroup.rotation.x += deltaY * 0.005;

                    previousMousePosition = { x: touch.clientX, y: touch.clientY };
                }
            }, { passive: true });

            window.addEventListener('mouseup', () => { isDragging = false; });
            window.addEventListener('touchend', () => { isDragging = false; });
        })();
    </script>
</body>
</html>
