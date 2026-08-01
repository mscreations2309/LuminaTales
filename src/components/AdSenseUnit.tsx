import React, { useEffect } from 'react';

interface AdSenseUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: 'true' | 'false';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ slot, format = 'auto', responsive = 'true' }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense script did not load or failed to run initialization.', e);
    }
  }, [slot]);

  return (
    <div className="adsense-wrapper glass-panel-glow">
      <div className="adsense-label font-mono">SPONSORED ANNOUNCEMENT</div>
      
      {/* Real Google AdSense Tag */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      
      {/* Visual local placeholder matching the cyberpunk vibe */}
      <div className="adsense-mock font-display">
        <span className="glow-cyan">[ NEURAL STREAM DIRECT AD SLOT ]</span>
        <span className="adsense-mock-desc">Swap ca-pub-XXXXXXXXXXXXXXXX with your AdSense client ID to serve real ads.</span>
      </div>

      <style>{`
        .adsense-wrapper {
          margin: 2rem auto;
          width: 100%;
          max-width: 728px;
          min-height: 90px;
          padding: 1rem;
          text-align: center;
          position: relative;
          background: rgba(16, 18, 30, 0.4);
          border: 1px solid rgba(0, 242, 254, 0.1);
        }
        .adsense-label {
          position: absolute;
          top: -10px;
          left: 1.5rem;
          background: #050508;
          color: var(--neon-gold);
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 183, 3, 0.3);
          letter-spacing: 1px;
        }
        .adsense-mock {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .adsense-mock span:first-child {
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 1.5px;
        }
        .adsense-mock-desc {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};
export default AdSenseUnit;
