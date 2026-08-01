import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BlogSection } from './components/BlogSection';
import { StorybookSection } from './components/StorybookSection';
import { VaultSection } from './components/VaultSection';

import { AdSenseUnit } from './components/AdSenseUnit';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);

  return (
    <>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isUnlocked={isVaultUnlocked} 
      />

      <main className="main-content-flow">
        {activeTab === 'home' && (
          <Hero 
            onExploreBlogs={() => setActiveTab('blogs')} 
            onExploreVault={() => setActiveTab('vault')} 
          />
        )}
        
        {activeTab === 'blogs' && <BlogSection />}
        
        {activeTab === 'storybook' && <StorybookSection />}
        
        {activeTab === 'vault' && (
          <VaultSection 
            isUnlocked={isVaultUnlocked} 
            setIsUnlocked={setIsVaultUnlocked} 
          />
        )}
        
        <div style={{ padding: '0 5%', width: '100%' }}>
          <AdSenseUnit slot="global-footer-ad" />
        </div>
      </main>

      <footer className="footer-system font-mono">
        <div className="footer-glow-bar"></div>
        <p>© 2026 LUMINA_TALES // DECENTRALIZED CREATIVE HUB // STATUS: ONLINE</p>
      </footer>

      <style>{`
        .main-content-flow {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .footer-system {
          position: relative;
          padding: 2.5rem 1rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8rem;
          letter-spacing: 1px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          margin-top: auto;
          background: rgba(5, 5, 8, 0.95);
        }
        .footer-glow-bar {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
          box-shadow: 0 0 10px var(--neon-cyan);
        }
      `}</style>
    </>
  );
}

export default App;
