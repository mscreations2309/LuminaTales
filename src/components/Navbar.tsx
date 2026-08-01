import React from 'react';
import { Shield, BookOpen, FileText, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isUnlocked }) => {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => setActiveTab('home')}>
          <span className="logo-icon font-mono">L</span>
          <span className="logo-text font-display">Lumina<span className="gradient-text-cyber">Tales</span></span>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-item font-display ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Layers size={18} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-item font-display ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <FileText size={18} />
            <span>Blogs</span>
          </button>
          
          <button 
            className={`nav-item font-display ${activeTab === 'storybook' ? 'active' : ''}`}
            onClick={() => setActiveTab('storybook')}
          >
            <BookOpen size={18} />
            <span>Storybook</span>
          </button>
          
          <button 
            className={`nav-item font-display ${activeTab === 'vault' ? 'active' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
            onClick={() => setActiveTab('vault')}
          >
            <Shield size={18} className={isUnlocked ? 'text-cyan' : 'text-magenta'} />
            <span>Vault</span>
            <span className="vault-status-dot"></span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 1rem;
          margin: 1rem auto;
          width: 90%;
          max-width: 1200px;
          z-index: 100;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 900;
          color: #000;
          box-shadow: var(--shadow-cyan);
        }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .nav-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.6rem 1.2rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 30px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item.active {
          color: var(--neon-cyan);
          background: rgba(0, 242, 254, 0.08);
          border: 1px solid rgba(0, 242, 254, 0.2);
          box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.05);
        }
        .nav-item.active.locked {
          color: var(--neon-magenta);
          background: rgba(255, 0, 127, 0.08);
          border-color: rgba(255, 0, 127, 0.2);
        }
        .nav-item.unlocked .vault-status-dot {
          background: var(--neon-cyan);
          box-shadow: var(--shadow-cyan);
        }
        .nav-item.locked .vault-status-dot {
          background: var(--neon-magenta);
          box-shadow: 0 0 8px var(--neon-magenta);
        }
        .vault-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .text-cyan {
          color: var(--neon-cyan);
        }
        .text-magenta {
          color: var(--neon-magenta);
        }
        @media (max-width: 768px) {
          .navbar {
            border-radius: 20px;
            padding: 0.75rem 1rem;
            width: 95%;
          }
          .nav-item span:not(.vault-status-dot) {
            display: none;
          }
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
