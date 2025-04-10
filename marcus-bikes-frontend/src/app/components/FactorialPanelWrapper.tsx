'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/layout.module.css';
import Header from './Header';
import Confetti from 'react-confetti';

interface FactorialPanelWrapperProps {
  children: React.ReactNode;
}

export default function FactorialPanelWrapper({ children }: FactorialPanelWrapperProps) {
  const [showFactorialPanel, setShowFactorialPanel] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleFactorialClick = () => {
    setClickCount(prev => prev + 1);
    setShowConfetti(true);
  };

  const getClickMessage = () => {
    if (clickCount === 0) return "¡Haz clic para celebrar!";
    if (clickCount < 3) return `Has clicado ${clickCount} veces. ¡Sigue así! 🧡`;
    if (clickCount < 7) return `Has clicado ${clickCount} veces. Claramente un fan. 🧡`;
    if (clickCount < 10) return `Has clicado ${clickCount} veces. ¡Eres un superfan! 🧡`;
    return `Has clicado ${clickCount} veces. ¡Eres un Factorial addict! 🧡`;
  };

  return (
    <>
      <Header onFactorialClick={() => setShowFactorialPanel(!showFactorialPanel)} />
      <main className={styles.main}>
        {showFactorialPanel ? (
          <div className={styles.factorialPanel}>
            {showConfetti && (
              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.2}
                initialVelocityY={20}
              />
            )}
            <div className={styles.factorialContent}>
              <h1 
                className={styles.factorialTitle}
                onClick={handleFactorialClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFactorialClick();
                  }
                }}
              >
                Factorial Rocks! 🚀
              </h1>
              
              <div className={styles.clickCounter}>
                <div className={styles.clickCounterText}>
                  {clickCount} {clickCount === 1 ? 'clic' : 'clics'}
                </div>
                <div className={styles.clickMessage}>{getClickMessage()}</div>
              </div>
              
              <button 
                className={styles.clickCounterButton}
                onClick={handleFactorialClick}
              >
                ¡Haz clic aquí! 🎉
              </button>
              
              <div className={styles.emojiParty}>
                <div className={styles.emojiContainer}>
                  <span className={styles.emoji}>🎉</span>
                  <span className={styles.emoji}>🥳</span>
                  <span className={styles.emoji}>🧡</span>
                </div>
                <p className={styles.emojiMessage}>
                  ¡Factorial, sois la caña! Gracias por hacer del HR algo tan humano como techie.
                </p>
              </div>
              
              <div className={styles.pixelArt}>
                <div className={styles.pixelArtContainer}>
                  <div className={styles.pixelArtOffice}>
                    <div className={styles.pixelArtDesk}></div>
                    <div className={styles.pixelArtComputer}></div>
                    <div className={styles.pixelArtPerson}></div>
                    <div className={styles.pixelArtFlag}>
                        <span className={styles.pixelArtText}>
                            $ factorial --rock
                            <br />
                            <br />
                            🔥🔥🔥 Factorial detected as 100% awesome 🔥🔥🔥
                        </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.factorialCTA}>
                <p className={styles.ctaText}>¿Listo para transformar la gestión de tu equipo?</p>
                <a 
                  href="https://factorial.es/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.ctaButton}
                >
                  Descubre Factorial
                </a>
              </div>
              
              <button 
                className={styles.modalButton}
                onClick={() => setShowModal(true)}
              >
                Ver mensaje especial
              </button>
              
              {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                  <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <button 
                      className={styles.modalClose}
                      onClick={() => setShowModal(false)}
                    >
                      ×
                    </button>
                    <div className={styles.modalGif}>
                      <img 
                        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDhudjY2bGRhbXUwMTJ4dzdtdmZscG5qMWZicnhsZzNyYXRraGlyYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IwAZ6dvvvaTtdI8SD5/giphy.gif" 
                        alt="The Office clapping" 
                        className={styles.gifImage}
                      />
                    </div>
                    <p className={styles.modalText}>
                    💗 Fan de Factorial desde antes de enviar el CV
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </>
  );
} 