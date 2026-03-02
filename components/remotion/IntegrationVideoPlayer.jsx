'use client';

import { Player } from '@remotion/player';
import { IntegrationVideo } from './IntegrationVideo';

export const IntegrationVideoPlayer = () => {
  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      <Player
        component={IntegrationVideo}
        durationInFrames={120}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        controls={false}
        loop
        autoPlay
        allowFullscreen={false}
        clickToPlay={false}
      />
    </div>
  );
};
