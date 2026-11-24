import React, { useEffect, useRef } from 'react';

/**
 * SmogParticleCanvas
 * High-performance, battery-aware particle physics simulation of PM2.5 and PM10.
 * Automatically pauses during background tabs via Page Visibility API to conserve GPU/CPU.
 * Supports Retina / High-DPI screens with devicePixelRatio scaling.
 */
export default function SmogParticleCanvas({ aqi = 180, pm25 = 95 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isPaused = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for power efficiency
    let width = 0;
    let height = 0;

    const setCanvasDimensions = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();

    let resizeTimeout;
    const handleResize = () => {
      cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(() => {
        setCanvasDimensions();
      });
    };

    window.addEventListener('resize', handleResize);

    // Page Visibility API to pause rendering when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle density proportional to AQI (capped between 35 and 180 particles for smooth 60fps)
    const particleCount = Math.min(180, Math.max(35, Math.round(aqi * 0.4)));
    const particles = [];

    // Particle color based on AQI
    let particleColor = 'rgba(148, 163, 184, 0.4)';
    if (aqi > 300) {
      particleColor = 'rgba(239, 68, 68, 0.65)';
    } else if (aqi > 200) {
      particleColor = 'rgba(168, 85, 247, 0.6)';
    } else if (aqi > 150) {
      particleColor = 'rgba(249, 115, 22, 0.55)';
    } else if (aqi > 100) {
      particleColor = 'rgba(245, 158, 11, 0.5)';
    } else {
      particleColor = 'rgba(52, 211, 153, 0.45)';
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (aqi > 250 ? 3.2 : 2.0) + 0.8,
        speedX: (Math.random() - 0.5) * (aqi > 200 ? 0.3 : 0.7),
        speedY: (Math.random() - 0.5) * 0.2 + 0.08,
        isPm10: Math.random() > 0.8
      });
    }

    let mouse = { x: -1000, y: -1000, radius: 95 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const render = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, width, height);

      // Atmospheric background haze layer
      const hazeGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (aqi > 300) {
        hazeGradient.addColorStop(0, 'rgba(69, 10, 10, 0.22)');
        hazeGradient.addColorStop(1, 'rgba(15, 23, 42, 0.82)');
      } else if (aqi > 200) {
        hazeGradient.addColorStop(0, 'rgba(59, 7, 100, 0.18)');
        hazeGradient.addColorStop(1, 'rgba(15, 23, 42, 0.78)');
      } else {
        hazeGradient.addColorStop(0, 'rgba(15, 23, 42, 0.25)');
        hazeGradient.addColorStop(1, 'rgba(15, 23, 42, 0.75)');
      }
      ctx.fillStyle = hazeGradient;
      ctx.fillRect(0, 0, width, height);

      // Render individual particulate matter
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interactive mouse repeller (clean air vortex dispersing smog)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 4.5;
          p.y += (dy / dist) * force * 4.5;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isPm10 ? 'rgba(203, 213, 225, 0.65)' : particleColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [aqi, pm25]);

  return (
    <div className="absolute inset-0 pointer-events-auto rounded-3xl overflow-hidden z-0">
      <canvas 
        ref={canvasRef} 
        aria-hidden="true"
        className="w-full h-full block cursor-crosshair" 
      />
      <div className="absolute bottom-3 right-4 pointer-events-none text-[11px] font-mono text-slate-400/80 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur">
        Interactive Inversion Sim (Hover to disperse PM2.5)
      </div>
    </div>
  );
}
