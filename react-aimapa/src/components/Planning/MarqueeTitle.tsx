import React, { useEffect, useRef, useState } from 'react';

interface MarqueeTitleProps {
  title: string;
  className?: string;
}

/**
 * Komponenta pro zobrazení názvu s marquee efektem, pokud je text příliš dlouhý
 * Používá dva elementy pro plynulý přechod bez prodlevy
 */
const MarqueeTitle: React.FC<MarqueeTitleProps> = ({ title, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  // Kontrola, zda je text příliš dlouhý a potřebuje animaci
  useEffect(() => {
    const checkTextOverflow = () => {
      if (marqueeRef.current && containerRef.current) {
        const textElement = marqueeRef.current.querySelector('.marquee-text');
        if (!textElement) return;

        const actualTextWidth = textElement.scrollWidth;
        const actualContainerWidth = containerRef.current.clientWidth;

        setTextWidth(actualTextWidth);
        setContainerWidth(actualContainerWidth);

        // Pokud je text širší než kontejner, aktivujeme animaci
        setShouldAnimate(actualTextWidth > actualContainerWidth);
      }
    };

    // Kontrola při načtení a při změně velikosti okna
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);

    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [title]);

  // Nastavení CSS proměnných pro animaci
  useEffect(() => {
    if (marqueeRef.current && shouldAnimate) {
      // Nastavíme CSS proměnné pro animaci
      marqueeRef.current.style.setProperty('--text-width', `${textWidth}px`);
      marqueeRef.current.style.setProperty('--container-width', `${containerWidth}px`);

      // Vypočítáme optimální rychlost animace na základě délky textu
      // Čím delší text, tím pomalejší animace, aby byl text čitelný
      const animationDuration = Math.max(textWidth / 100, 5); // minimálně 5 sekund
      marqueeRef.current.style.setProperty('--animation-duration', `${animationDuration}s`);
    }
  }, [textWidth, containerWidth, shouldAnimate]);

  return (
    <div ref={containerRef} className="plan-title-container" title={title}>
      <div
        ref={marqueeRef}
        className={`marquee-wrapper ${shouldAnimate ? 'animate' : ''}`}
      >
        {shouldAnimate ? (
          <>
            <span className="marquee-text">{title}</span>
            <span className="marquee-text">{title}</span>
          </>
        ) : (
          <span className="marquee-text">{title}</span>
        )}
      </div>
    </div>
  );
};

export default MarqueeTitle;
