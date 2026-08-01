import React, { useState, useMemo } from 'react';
import { stories, type StoryItem } from '../data/generatedContent';
import { ArrowLeft, ArrowRight, Type, Sparkles, Volume2, Bookmark } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

export const StorybookSection: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'largest'>('normal');
  const [bookTheme, setBookTheme] = useState<'sepia' | 'dark' | 'cyberpunk'>('sepia');
  const [isFlipping, setIsFlipping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    if (direction === 'next' && currentPage < selectedStory!.pages.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 500); // match flip animation
    } else if (direction === 'prev' && currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const getPageClass = () => {
    let cls = `page-body font-sans size-${fontSize}`;
    if (isFlipping) cls += ' flip-animating';
    return cls;
  };

  const combinedList = useMemo(() => {
    const list = [];
    let storyPointer = 0;
    for (let i = 0; storyPointer < stories.length; i++) {
      if (i % 2 === 0) {
        list.push({ type: 'story', data: stories[storyPointer], id: stories[storyPointer].id });
        storyPointer++;
      } else {
        list.push({ type: 'ad', id: `story-grid-ad-${i}` });
      }
    }
    return list;
  }, []);

  return (
    <div className="storybook-section">
      <div className="section-header">
        <h2 className="font-display section-title">STORYBOOK <span className="gradient-text-cyber">LIBRARY</span></h2>
        <p className="section-desc">Open one of 40 publicly available chronicles in our interactive reader.</p>
      </div>

      {!selectedStory ? (
        /* Library Catalog Selection */
        <div className="library-grid">
          {combinedList.map((item) => {
            if (item.type === 'story' && item.data) {
              const story = item.data;
              return (
                <div key={story.id} className="story-card glass-panel-glow" onClick={() => {
                  setSelectedStory(story);
                  setCurrentPage(0);
                }}>
                  <div className="story-cover-image">
                    <img src={story.coverImage} alt={story.title} />
                    <div className="genre-tag font-mono">{story.genre}</div>
                  </div>
                  <div className="story-info">
                    <h3 className="font-display story-title">{story.title}</h3>
                    <p className="story-desc">{story.description}</p>
                    <div className="story-meta font-mono">
                      <span>Author: {story.author}</span>
                      <span className="rating-badge"><Sparkles size={12} /> {story.rating}</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  key={item.id} 
                  className="story-card glass-panel-glow ad-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    minHeight: '350px',
                    padding: '1rem',
                    cursor: 'default'
                  }}
                >
                  <AdSenseUnit slot={item.id} format="rectangle" />
                </div>
              );
            }
          })}
        </div>
      ) : (
        /* Interactive Reader */
        <div className="storybook-reader-container">
          {/* Reader Header / Controls */}
          <div className="reader-toolbar glass-panel">
            <button className="back-btn font-mono" onClick={() => setSelectedStory(null)}>
              <ArrowLeft size={16} /> CATALOG
            </button>
            <div className="reader-title font-display">{selectedStory.title}</div>
            <div className="reader-controls">
              <button 
                className={`control-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title="Toggle Page Audio Effect"
              >
                <Volume2 size={16} />
              </button>
              
              {/* Font Size Toggle */}
              <div className="control-group">
                <Type size={16} className="control-icon" />
                <select 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="reader-select"
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="largest">Largest</option>
                </select>
              </div>

              {/* Theme Selector */}
              <select 
                value={bookTheme} 
                onChange={(e) => setBookTheme(e.target.value as any)}
                className="reader-select theme-select"
              >
                <option value="sepia">Sepia Paper</option>
                <option value="dark">Cyber Grid</option>
                <option value="cyberpunk">Neon Synth</option>
              </select>
            </div>
          </div>

          {/* Simulated 3D Book Layout with side gutters for Ads */}
          <div className="storybook-reader-layout">
            <div className="side-ad left-ad">
              <AdSenseUnit slot="story-read-left" format="rectangle" />
            </div>

            <div className="book-main-content">
              <div className={`book-viewport theme-${bookTheme}`}>
                <div className="book-binding"></div>
                
                {/* Left Page (Static context or current - 1) */}
                <div className="book-page left-page">
                  <div className="page-header font-mono">
                    <span>Page {currentPage * 2 + 1}</span>
                    <span>{selectedStory.genre}</span>
                  </div>
                  <div className="page-content">
                    <p className={getPageClass()}>
                      {selectedStory.pages[currentPage * 2] || "End of volume."}
                    </p>
                  </div>
                  <div className="page-footer font-mono">
                    <Bookmark size={12} /> {selectedStory.author}
                  </div>
                </div>

                {/* Right Page (Flipping or current) */}
                <div className="book-page right-page">
                  <div className="page-header font-mono">
                    <span>Page {currentPage * 2 + 2}</span>
                    <span>LuminaTales</span>
                  </div>
                  <div className="page-content">
                    <p className={getPageClass()}>
                      {selectedStory.pages[currentPage * 2 + 1] || "The saga continues in the next logs..."}
                    </p>
                  </div>
                  <div className="page-footer font-mono">
                    SECURE RECORD #{selectedStory.id.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="side-ad right-ad">
              <AdSenseUnit slot="story-read-right" format="rectangle" />
            </div>
          </div>

          {/* Navigation controls */}
          <div className="reader-nav">
            <button 
              className="nav-arrow neon-btn" 
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 0 || isFlipping}
            >
              <ArrowLeft size={20} />
            </button>
            <span className="page-indicator font-mono">
              Volume Page {currentPage + 1} / {Math.ceil(selectedStory.pages.length / 2)}
            </span>
            <button 
              className="nav-arrow neon-btn" 
              onClick={() => handlePageChange('next')}
              disabled={currentPage >= Math.ceil(selectedStory.pages.length / 2) - 1 || isFlipping}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .storybook-section {
          padding: 2rem 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .library-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1024px) {
          .library-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .library-grid {
            grid-template-columns: 1fr;
          }
        }
        .story-card {
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
        }
        .story-card:hover {
          transform: scale(1.03);
          border-color: var(--neon-cyan);
          box-shadow: 0 10px 25px rgba(0, 242, 254, 0.15);
        }
        .story-cover-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .story-cover-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .story-card:hover .story-cover-image img {
          transform: scale(1.08);
        }
        .genre-tag {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid var(--neon-purple);
          color: var(--neon-purple);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .story-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .story-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .story-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .story-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 0.8rem;
        }
        .rating-badge {
          color: var(--neon-gold);
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        /* Reader Layout */
        .storybook-reader-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .storybook-reader-layout {
          display: grid;
          grid-template-columns: 180px 1fr 180px;
          gap: 2rem;
          align-items: center;
          margin-bottom: 2rem;
        }
        .book-main-content {
          width: 100%;
        }
        .side-ad {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 1200px) {
          .storybook-reader-layout {
            grid-template-columns: 1fr;
          }
          .side-ad {
            display: none;
          }
        }
        .reader-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .back-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
        }
        .back-btn:hover {
          color: var(--neon-cyan);
        }
        .reader-title {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .reader-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .control-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .control-btn.active {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }
        .control-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .control-icon {
          color: var(--text-muted);
        }
        .reader-select {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
        }

        /* Book 3D Styling */
        .book-viewport {
          position: relative;
          display: flex;
          border-radius: 12px;
          height: 500px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          perspective: 1500px;
        }
        .book-binding {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 20px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, rgba(0,0,0,0.5), rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.5));
          z-index: 10;
          box-shadow: 0 0 10px rgba(0,0,0,0.8);
        }
        .book-page {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        
        /* Book Themes */
        .theme-sepia .book-page {
          background: #f4ecd8;
          color: #3e2723;
        }
        .theme-sepia .page-header, .theme-sepia .page-footer {
          color: #8d6e63;
        }
        .theme-dark .book-page {
          background: #11121b;
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.02);
        }
        .theme-dark .page-header, .theme-dark .page-footer {
          color: #64748b;
        }
        .theme-cyberpunk .book-page {
          background: #060814;
          color: #00f2fe;
          border: 1px solid rgba(0, 242, 254, 0.1);
          text-shadow: 0 0 5px rgba(0, 242, 254, 0.2);
        }
        .theme-cyberpunk .page-header, .theme-cyberpunk .page-footer {
          color: var(--neon-purple);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding-bottom: 0.5rem;
        }
        .theme-dark .page-header {
          border-bottom-color: rgba(255,255,255,0.05);
        }
        .theme-cyberpunk .page-header {
          border-bottom-color: rgba(0, 242, 254, 0.1);
        }
        .page-content {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 0;
        }
        .page-body {
          line-height: 1.6;
          transition: transform 0.5s ease-in-out, opacity 0.3s;
        }
        .page-body.size-normal { font-size: 1.1rem; }
        .page-body.size-large { font-size: 1.3rem; }
        .page-body.size-largest { font-size: 1.5rem; }

        .flip-animating {
          animation: pageTurnRight 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 0.5rem;
        }
        .theme-dark .page-footer {
          border-top-color: rgba(255,255,255,0.05);
        }
        .theme-cyberpunk .page-footer {
          border-top-color: rgba(0, 242, 254, 0.1);
        }

        .reader-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .page-indicator {
          color: var(--text-secondary);
        }
        .nav-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          padding: 0;
        }
        @media (max-width: 768px) {
          .book-viewport {
            flex-direction: column;
            height: auto;
          }
          .book-binding {
            display: none;
          }
          .book-page {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
