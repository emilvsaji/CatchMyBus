import { useEffect, useRef, useState } from 'react';

interface BusProgressProps {
  height?: number; // canvas height in px
  dark?: boolean;  // adapt colors for dark backgrounds
}

// Lightweight Three.js-based bus animation moving between start and end
// Falls back to CSS animation if WebGL/Three is unavailable
const BusProgress = ({ height = 80, dark = false }: BusProgressProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    // Lazy-load three to avoid SSR/build timing issues
    (async () => {
      try {
        const THREE = await import('three');
        if (!mounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 600;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, width, height, 0, -1000, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.appendChild(renderer.domElement);

        // Background subtle gradient
        const bg = new THREE.PlaneGeometry(width, height);
        const bgMat = new THREE.MeshBasicMaterial({ color: dark ? 0x0b1020 : 0xf8fafc, transparent: true, opacity: dark ? 0.3 : 1 });
        const bgMesh = new THREE.Mesh(bg, bgMat);
        bgMesh.position.set(width / 2, height / 2, -10);
        scene.add(bgMesh);

        // Track line
        const trackY = height / 2;
        const trackLen = Math.max(120, width - 120);
        const trackGeo = new THREE.PlaneGeometry(trackLen, 4);
        const trackMat = new THREE.MeshBasicMaterial({ color: dark ? 0x5eead4 : 0xd1d5db });
        const track = new THREE.Mesh(trackGeo, trackMat);
        track.position.set(width / 2, trackY, 0);
        scene.add(track);

        // Start and end pins (circles)
        const pinGeo = new THREE.CircleGeometry(6, 32);
        const startPin = new THREE.Mesh(pinGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
        const endPin = new THREE.Mesh(pinGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        const startX = (width - trackLen) / 2;
        const endX = startX + trackLen;
        startPin.position.set(startX, trackY, 1);
        endPin.position.set(endX, trackY, 1);
        scene.add(startPin);
        scene.add(endPin);

        // Bus body (rounded rectangle via box + small border)
        const busWidth = 36;
        const busHeight = 18;
        const busGeo = new THREE.BoxGeometry(busWidth, busHeight, 4);
        const busMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
        const bus = new THREE.Mesh(busGeo, busMat);
        bus.position.set(startX, trackY, 2);
        scene.add(bus);

        // Windows (small light rectangles)
        const winGeo = new THREE.PlaneGeometry(6, 6);
        const winMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
        for (let i = -1; i <= 1; i++) {
          const w = new THREE.Mesh(winGeo, winMat);
          w.position.set(bus.position.x + i * 10, bus.position.y + 2, 3);
          scene.add(w);
        }

        // Wheels (circles)
        const wheelGeo = new THREE.CircleGeometry(4, 32);
        const wheelMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
        const w1 = new THREE.Mesh(wheelGeo, wheelMat);
        const w2 = new THREE.Mesh(wheelGeo, wheelMat);
        w1.position.set(bus.position.x - 10, bus.position.y - 10, 3);
        w2.position.set(bus.position.x + 10, bus.position.y - 10, 3);
        scene.add(w1);
        scene.add(w2);

        // Glow behind bus for "premium" feel
        const glowGeo = new THREE.CircleGeometry(14, 32);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.25 });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(bus.position.x, bus.position.y, 1.5);
        scene.add(glow);

        // Animation
        let raf = 0;
        let t = 0; // 0..1 progress
        const speed = 0.4; // seconds per 100px (approx)
        const animate = (time: number) => {
          raf = requestAnimationFrame(animate);
          // convert to seconds delta
          const dt = 0.016; // fixed step keeps smoothness consistent
          t += (dt * 100) / (trackLen * speed);
          if (t > 1) t = 0;
          const x = startX + t * trackLen;
          bus.position.x = x;
          w1.position.x = x - 10;
          w2.position.x = x + 10;
          glow.position.x = x;

          // Subtle bobbing
          const bob = Math.sin(time * 0.003) * 1.2;
          bus.position.y = trackY + bob;
          w1.position.y = trackY - 10 + bob;
          w2.position.y = trackY - 10 + bob;
          glow.position.y = trackY + bob;

          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(animate);

        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || width;
          renderer.setSize(w, height);
          camera.right = w;
          camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('resize', onResize);
          renderer.dispose();
          container.removeChild(renderer.domElement);
        };
      } catch (e) {
        console.warn('Three.js not available, using CSS fallback', e);
        if (mounted) setFallback(true);
      }
    })();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [height, dark]);

  if (fallback) {
    return (
      <div className="bus-fallback-wrapper">
        <div className="bus-fallback-track">
          <div className="bus-fallback-icon">🚌</div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default BusProgress;
