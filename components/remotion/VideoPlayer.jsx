'use client';

import { Player } from '@remotion/player';
import { useState } from 'react';

export const VideoPlayer = ({
  component: Component,
  durationInFrames = 120,
  width = 1920,
  height = 1080,
  className = '',
  autoPlay = true,
  loop = true,
  showControls = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container with Hover Effect */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isHovered
            ? '0 30px 80px rgba(0,0,0,0.4), 0 0 0 2px rgba(199, 141, 78, 0.3)'
            : '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <Player
          component={Component}
          durationInFrames={durationInFrames}
          compositionWidth={width}
          compositionHeight={height}
          fps={30}
          controls={showControls}
          loop={loop}
          autoPlay={autoPlay}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Decorative Corner Accents */}
      <div
        style={{
          position: 'absolute',
          top: -4,
          left: -4,
          width: 40,
          height: 40,
          borderTop: '4px solid #C78D4E',
          borderLeft: '4px solid #C78D4E',
          borderRadius: '16px 0 0 0',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          width: 40,
          height: 40,
          borderTop: '4px solid #C78D4E',
          borderRight: '4px solid #C78D4E',
          borderRadius: '0 16px 0 0',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          left: -4,
          width: 40,
          height: 40,
          borderBottom: '4px solid #C78D4E',
          borderLeft: '4px solid #C78D4E',
          borderRadius: '0 0 0 16px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          right: -4,
          width: 40,
          height: 40,
          borderBottom: '4px solid #C78D4E',
          borderRight: '4px solid #C78D4E',
          borderRadius: '0 0 16px 0',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
