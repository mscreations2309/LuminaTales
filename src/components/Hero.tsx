import React, { useEffect, useRef } from 'react';
import { BookOpen, Shield } from 'lucide-react';

interface HeroProps {
  onExploreBlogs: () => void;
  onExploreVault: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreBlogs, onExploreVault }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    const colors = ['rgba(0, 242, 254, 0.4)', 'rgba(157, 78, 221, 0.3)', 'rgba(255, 0, 127, 0.3)'];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle mesh
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 - dist / 120 * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hero-section">
      <canvas ref={canvasRef} className="hero-particles" />
      <div className="hero-content glass-panel-glow">
        <div className="status-badge font-mono">
          <span className="pulse-dot"></span> SECURE NEURAL PROTOCOL ACTIVE
        </div>
        <h1 className="hero-title font-display">
          Step Into the <br />
          <span className="gradient-text-cyber text-glow-cyan">LuminaTales</span>
        </h1>
        <p className="hero-subtitle">
          Explore a decentralized matrix of cyberpunk chronicles, immersive fantasy flip-books, 
          and a highly secured mature-content vault of encrypted archives.
        </p>

        <div className="hero-actions">
          <button className="neon-btn" onClick={onExploreBlogs}>
            <BookOpen size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Open Chronicles
          </button>
          <button className="neon-btn neon-btn-magenta" onClick={onExploreVault}>
            <Shield size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Enter The Vault
          </button>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }
        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 4rem 3rem;
          text-align: center;
          animation: float 6s ease-in-out infinite;
        }
        .status-badge {
          background: rgba(0, 242, 254, 0.06);
          border: 1px solid rgba(0, 242, 254, 0.2);
          color: var(--neon-cyan);
          padding: 0.5rem 1rem;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          margin-bottom: 2rem;
          letter-spacing: 2px;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neon-cyan);
          box-shadow: var(--shadow-cyan);
          animation: pulseGlow 1.5s infinite;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-content {
            padding: 2.5rem 1.5rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
