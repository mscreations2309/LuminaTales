import React, { useState } from 'react';
import { vaultItems, type VaultItem } from '../data/generatedContent';
import { Lock, Unlock, Eye, FileText, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface VaultSectionProps {
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
}

export const VaultSection: React.FC<VaultSectionProps> = ({ isUnlocked, setIsUnlocked }) => {
  const [agreedAge, setAgreedAge] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState<VaultItem | null>(null);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'RESTRICTED' | 'SECRET' | 'TOP_SECRET'>('ALL');

  const startScanning = () => {
    if (!agreedAge) {
      alert("Please confirm your age-gate criteria (18+) first.");
      return;
    }
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUnlocked(true);
            setScanning(false);
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const filteredVault = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = accessFilter === 'ALL' || item.accessLevel === accessFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="vault-section">
      <div className="section-header">
        <h2 className="font-display section-title">RESTRICTED <span className="gradient-text-cyber neon-btn-magenta">VAULT</span></h2>
        <p className="section-desc">Classified archives & mature narratives. Authorized personnel only.</p>
      </div>

      {!isUnlocked ? (
        /* Bio Security Lock Screen */
        <div className="security-screen glass-panel-glow">
          <div className="lock-icon-container">
            <Lock className="lock-icon pulsing" size={48} />
          </div>
          <h3 className="font-display security-title">SECURE CLASSIFIED ACCESS</h3>
          <p className="security-desc">
            This sector contains highly restricted adult materials, sensual logs, and neural experimental journals. 
            Confirm you meet the requirements to initiate biometric scan.
          </p>

          <div className="age-gate-container">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreedAge} 
                onChange={(e) => setAgreedAge(e.target.checked)} 
              />
              <span className="checkbox-text font-mono">I DECLARE THAT I AM 18 YEARS OF AGE OR OLDER</span>
            </label>
          </div>

          <div className="scanner-outer" onClick={startScanning}>
            <div className={`scanner-bar ${scanning ? 'scanning' : ''}`}></div>
            <div className="fingerprint-btn">
              <div className="scanner-waves">
                <span style={{ animationDelay: '0s' }}></span>
                <span style={{ animationDelay: '0.4s' }}></span>
              </div>
              <span className="scanner-text font-mono">
                {scanning ? `SCANNING NEURAL MESH... ${scanProgress}%` : 'HOLD TO VERIFY IDENTITY'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Restricted Archive Dashboard */
        <div className="vault-dashboard">
          {/* Dashboard Toolbar */}
          <div className="vault-toolbar glass-panel">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search classified records..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>

            <div className="access-filters font-mono">
              {(['ALL', 'RESTRICTED', 'SECRET', 'TOP_SECRET'] as const).map(level => (
                <button 
                  key={level} 
                  className={`level-btn ${accessFilter === level ? 'active' : ''} ${level.toLowerCase()}`}
                  onClick={() => setAccessFilter(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            <button className="lock-btn font-mono" onClick={() => setIsUnlocked(false)}>
              <Unlock size={16} /> DE-AUTHORIZE
            </button>
          </div>

          {/* Catalog list */}
          <div className="vault-grid">
            {filteredVault.map(item => (
              <div key={item.id} className={`vault-card glass-panel-glow ${item.accessLevel.toLowerCase()}`}>
                <div className="card-image-wrapper" style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={item.coverImage} alt={item.title} className="card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card-header font-mono">
                  <span className={`access-badge ${item.accessLevel.toLowerCase()}`}>
                    {item.accessLevel}
                  </span>
                  <span>{item.fileSize}</span>
                </div>
                <h3 className="font-display card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
                <div className="card-actions font-mono">
                  <span>CLASSIFIED: {item.dateClassified}</span>
                  <button className="read-doc-btn" onClick={() => {
                    setActiveItem(item);
                    setPdfZoom(100);
                  }}>
                    <Eye size={14} /> DECRYPT
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Simulated PDF Reader */}
          {activeItem && (
            <div className="pdf-overlay" onClick={() => setActiveItem(null)}>
              <div className="pdf-container glass-panel-glow" onClick={(e) => e.stopPropagation()}>
                {/* PDF Header Controls */}
                <div className="pdf-header">
                  <div className="pdf-title font-display">
                    <FileText size={18} className="text-magenta" /> 
                    {activeItem.title} - SECURE_READER.exe
                  </div>
                  <div className="pdf-controls">
                    <button className="pdf-btn" onClick={() => setPdfZoom(z => Math.max(50, z - 10))} title="Zoom Out">
                      <ZoomOut size={16} />
                    </button>
                    <span className="zoom-text font-mono">{pdfZoom}%</span>
                    <button className="pdf-btn" onClick={() => setPdfZoom(z => Math.min(200, z + 10))} title="Zoom In">
                      <ZoomIn size={16} />
                    </button>
                    <button className="pdf-btn" onClick={() => setPdfZoom(100)} title="Reset Zoom">
                      <RotateCcw size={16} />
                    </button>
                    <button className="close-btn font-mono" onClick={() => setActiveItem(null)}>
                      CLOSE
                    </button>
                  </div>
                </div>

                {/* PDF Decryption Screen */}
                <div className="pdf-viewport">
                  <div 
                    className="pdf-page"
                    style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  >
                    <div className="classified-watermark font-display">RESTRICTED VAULT SYSTEM</div>
                    <div className="pdf-system-header font-mono">
                      <span>DECRYPTION COMPLETED</span>
                      <span>SECURE PIPELINE // SYNC: ACTIVE</span>
                      <span>SYSTEM LEVEL: {activeItem.accessLevel}</span>
                    </div>

                    <div 
                      className="pdf-content"
                      dangerouslySetInnerHTML={{ __html: activeItem.content }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .vault-section {
          padding: 2rem 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .security-screen {
          max-width: 600px;
          margin: 4rem auto;
          padding: 4rem 3rem;
          text-align: center;
        }
        .lock-icon-container {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255, 0, 127, 0.1);
          border: 1px solid rgba(255, 0, 127, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 0 20px rgba(255, 0, 127, 0.1);
        }
        .lock-icon {
          color: var(--neon-magenta);
        }
        .pulsing {
          animation: pulseGlow 2s infinite;
        }
        .security-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          letter-spacing: 2px;
        }
        .security-desc {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
        }
        .age-gate-container {
          margin-bottom: 2.5rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          justify-content: center;
        }
        .checkbox-text {
          font-size: 0.8rem;
          color: var(--neon-magenta);
          letter-spacing: 1px;
        }

        /* Interactive Fingerprint Scanner */
        .scanner-outer {
          position: relative;
          background: rgba(0, 242, 254, 0.04);
          border: 1px solid rgba(0, 242, 254, 0.2);
          padding: 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s;
        }
        .scanner-outer:hover {
          border-color: var(--neon-cyan);
          background: rgba(0, 242, 254, 0.08);
          box-shadow: var(--shadow-cyan);
        }
        .scanner-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--neon-cyan);
          box-shadow: var(--shadow-cyan);
          opacity: 0;
        }
        .scanner-bar.scanning {
          opacity: 1;
          animation: scanline 1.5s infinite linear;
        }
        .fingerprint-btn {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .scanner-waves span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid var(--neon-cyan);
          opacity: 0;
          animation: scanWave 2s infinite linear;
        }
        @keyframes scanWave {
          0% {
            width: 40px;
            height: 40px;
            opacity: 0.8;
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }
        .scanner-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--neon-cyan);
          letter-spacing: 2px;
        }

        /* Vault Dashboard */
        .vault-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .access-filters {
          display: flex;
          gap: 0.5rem;
        }
        .level-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.3s;
        }
        .level-btn.active {
          color: #000;
          font-weight: 700;
        }
        .level-btn.active.all { background: var(--text-primary); border-color: var(--text-primary); }
        .level-btn.active.restricted { background: #3b82f6; border-color: #3b82f6; color: #fff; }
        .level-btn.active.secret { background: var(--neon-purple); border-color: var(--neon-purple); color: #fff; }
        .level-btn.active.top_secret { background: var(--neon-magenta); border-color: var(--neon-magenta); color: #fff; }

        .lock-btn {
          background: rgba(255, 0, 127, 0.1);
          border: 1px solid rgba(255, 0, 127, 0.3);
          color: var(--neon-magenta);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        .lock-btn:hover {
          background: var(--neon-magenta);
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
        }

        /* Grid */
        .vault-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .vault-card {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-left: 4px solid var(--text-muted);
          transition: all 0.3s;
        }
        .vault-card.restricted { border-left-color: #3b82f6; }
        .vault-card.secret { border-left-color: var(--neon-purple); }
        .vault-card.top_secret { border-left-color: var(--neon-magenta); }

        .vault-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .access-badge {
          font-weight: 700;
          font-size: 0.75rem;
        }
        .access-badge.restricted { color: #3b82f6; }
        .access-badge.secret { color: var(--neon-purple); }
        .access-badge.top_secret { color: var(--neon-magenta); }

        .card-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          flex: 1;
        }
        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1rem;
          color: var(--text-muted);
        }
        .read-doc-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.3s;
        }
        .vault-card.restricted:hover .read-doc-btn { border-color: #3b82f6; color: #3b82f6; }
        .vault-card.secret:hover .read-doc-btn { border-color: var(--neon-purple); color: var(--neon-purple); }
        .vault-card.top_secret:hover .read-doc-btn { border-color: var(--neon-magenta); color: var(--neon-magenta); }

        /* Simulated PDF View Overlay */
        .pdf-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1100;
          display: flex;
          justify-content: center;
          padding: 1rem;
        }
        .pdf-container {
          width: 100%;
          max-width: 950px;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: #090a10;
        }
        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #11121c;
          padding: 0.8rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .pdf-title {
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pdf-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .pdf-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          padding: 0.4rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .pdf-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
        .zoom-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          min-width: 45px;
          text-align: center;
        }
        .close-btn {
          background: var(--neon-magenta);
          border: none;
          color: #fff;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }

        .pdf-viewport {
          flex: 1;
          overflow: auto;
          padding: 2rem;
          background: #141520;
          display: flex;
          justify-content: center;
        }
        .pdf-page {
          background: #0f1018;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          padding: 4rem;
          width: 800px;
          position: relative;
          color: #e2e8f0;
        }
        .classified-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255, 0, 127, 0.05);
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: 5px;
        }
        .pdf-system-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--neon-magenta);
          border-bottom: 2px solid rgba(255, 0, 127, 0.2);
          padding-bottom: 0.8rem;
          margin-bottom: 2rem;
        }
        .pdf-content {
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .pdf-content h2 {
          font-family: var(--font-display);
          color: var(--neon-magenta);
          margin-bottom: 1.5rem;
        }
        .pdf-content p {
          margin-bottom: 1.5rem;
        }
        .pdf-content h3 {
          font-family: var(--font-display);
          color: var(--neon-purple);
          margin: 2rem 0 1rem;
        }
        @media (max-width: 768px) {
          .security-screen {
            padding: 2rem 1rem;
          }
          .vault-toolbar {
            padding: 1rem;
          }
          .pdf-page {
            width: 100%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
