import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero3D — Soft, Light-Colored Background Animation
 * Replaces the previous bold 3D hardware models with a gentle, airy pastel wave
 * and soft floating light orbs rendered behind the hero typography on a pure white background.
 */
export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth || 1200;
    const height = container.clientHeight || 420;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Soft Pastel Floating Orbs & Gentle Light Wave Mesh (Light, Airy Colors — Not Bold)
    const group = new THREE.Group();
    scene.add(group);

    const pastelPalette = [
      0xdbeafe, // soft sky blue
      0xe0f2fe, // light ice blue
      0xf3e8ff, // soft lavender
      0xdcfce7, // soft mint green
      0xffedd5, // soft warm peach
    ];

    const orbs = [];
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    for (let i = 0; i < 14; i++) {
      const color = pastelPalette[i % pastelPalette.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.28,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      const scale = 0.55 + (i % 4) * 0.35;
      mesh.scale.set(scale, scale, scale);

      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 5.5;
      const z = -1.5 - Math.random() * 3;
      mesh.position.set(x, y, z);

      orbs.push({
        mesh,
        baseX: x,
        baseY: y,
        speed: 0.35 + (i % 5) * 0.12,
        phase: i * 0.9,
      });
      group.add(mesh);
    }

    // Subtle, delicate pastel wave ribbon in the background
    const waveGeo = new THREE.PlaneGeometry(18, 6, 36, 14);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = -0.55;
    waveMesh.position.set(0, -0.6, -2.5);
    group.add(waveMesh);

    let targetX = 0;
    let targetY = 0;
    let isVisible = true;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = null;
    const posAttr = waveGeo.attributes.position;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Gentle floating motion for soft pastel orbs
      for (let i = 0; i < orbs.length; i++) {
        const item = orbs[i];
        item.mesh.position.x = item.baseX + Math.sin(t * item.speed + item.phase) * 0.55;
        item.mesh.position.y = item.baseY + Math.cos(t * item.speed * 0.85 + item.phase) * 0.4;
      }

      // Gentle undulation on the light pastel wave mesh
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = Math.sin(vx * 0.45 + t * 0.7) * 0.25 + Math.cos(vy * 0.6 + t * 0.5) * 0.18;
        posAttr.setZ(i, vz);
      }
      posAttr.needsUpdate = true;

      group.rotation.y += (targetX * 0.25 - group.rotation.y) * 0.04;
      group.rotation.x += (targetY * 0.2 - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      sphereGeo.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-white"
    >
      {/* Soft Pastel Ambient Aura (Light, Never Bold) */}
      <div
        className="hero-pastel-orb-1 absolute -top-20 left-1/4 w-[380px] h-[380px] rounded-full blur-3xl opacity-55"
        style={{
          background:
            'radial-gradient(circle, rgba(224,242,254,0.75) 0%, rgba(243,232,255,0.35) 60%, transparent 100%)',
        }}
      />
      <div
        className="hero-pastel-orb-2 absolute -bottom-24 right-1/4 w-[360px] h-[360px] rounded-full blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(220,252,231,0.65) 0%, rgba(254,243,199,0.35) 60%, transparent 100%)',
        }}
      />

      {/* Light Pastel Three.js Background Canvas */}
      <div ref={mountRef} className="w-full h-full opacity-80" />
    </div>
  );
}
