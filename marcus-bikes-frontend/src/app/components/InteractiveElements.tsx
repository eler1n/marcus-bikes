'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/layout.module.css';

export default function InteractiveElements() {
  const [showModal, setShowModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [pixelArt, setPixelArt] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize pixel art grid
  useEffect(() => {
    const grid = Array(16).fill(null).map(() => Array(16).fill('#FFFFFF'));
    setPixelArt(grid);
  }, []);

  const handleEmojiParty = () => {
    setShowModal(true);
  };

  const handlePixelClick = (row: number, col: number) => {
    if (!isDrawing) return;
    
    const newPixelArt = [...pixelArt];
    newPixelArt[row][col] = selectedColor;
    setPixelArt(newPixelArt);
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (row: number, col: number) => {
    if (!isDrawing) return;
    handlePixelClick(row, col);
  };

  return (
    <div className={styles.interactiveContainer}>
      <div className={styles.emojiParty} onClick={handleEmojiParty}>
        🎉 Click for a surprise! 🎈
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <div className={styles.modalGif}>
              🎉
            </div>
            <div className={styles.modalText}>
              <h2>You found the party! 🎈</h2>
              <p>Keep clicking to join the fun!</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.pixelArt}>
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>
        <div 
          className={styles.pixelGrid}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {pixelArt.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.pixelRow}>
              {row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={styles.pixel}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePixelClick(rowIndex, colIndex)}
                  onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.clickCounter}>
        <div className={styles.clickMessage}>
          Clicks: {clickCount}
        </div>
        <button onClick={() => setClickCount(prev => prev + 1)}>
          Click me! 👆
        </button>
      </div>
    </div>
  );
} 