import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Zap, ArrowRight, CheckCircle } from 'lucide-react';

export const IntegrationPartnersVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const partners = [
    { name: 'Oracle', color: '#F80000', x: 200, y: 200 },
    { name: 'Micros', color: '#0052CC', x: 200, y: 540 },
    { name: 'Apaleo', color: '#00B8D4', x: 200, y: 880 },
    { name: 'Mews', color: '#8B5CF6', x: 1720, y: 200 },
    { name: 'Cloudbeds', color: '#10B981', x: 1720, y: 540 },
    { name: 'Protel', color: '#F59E0B', x: 1720, y: 880 }
  ];

  const centerX = 960;
  const centerY = 540;

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.05) 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 20], [0, 1])
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 'bold', color: '#1F2937', fontFamily: 'Sora, sans-serif' }}>
          Seamless Integration
        </div>
        <div style={{ fontSize: 20, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          Works with your existing systems
        </div>
      </div>

      {/* Central RS AI Hub */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 120,
          top: centerY - 120,
          width: 240,
          height: 240,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          border: '6px solid #C78D4E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: interpolate(frame, [10, 30], [0, 1]),
          transform: `scale(${interpolate(frame, [10, 30], [0.8, 1])})`
        }}
      >
        <Zap size={60} color="#C78D4E" fill="#FEF3C7" />
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#C78D4E', fontFamily: 'Sora, sans-serif' }}>
          RS AI
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Central Hub
        </div>

        {/* Pulse rings */}
        {[1, 2, 3].map((i) => {
          const pulseProgress = ((frame + i * 20) % 60) / 60;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: -20 * i,
                borderRadius: '50%',
                border: '3px solid rgba(199, 141, 78, 0.3)',
                opacity: 1 - pulseProgress,
                transform: `scale(${1 + pulseProgress * 0.5})`
              }}
            />
          );
        })}
      </div>

      {/* Partner Nodes and Connection Lines */}
      {partners.map((partner, index) => {
        const appear = spring({
          frame: frame - 30 - index * 8,
          fps,
          config: { damping: 100, stiffness: 200 }
        });

        const isConnected = frame >= 30 + index * 8 + 15;
        const connectionProgress = interpolate(
          frame,
          [30 + index * 8, 30 + index * 8 + 15],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );

        // Calculate connection line path
        const startX = partner.x < centerX ? partner.x + 100 : partner.x - 100;
        const endX = centerX + (partner.x < centerX ? -120 : 120);
        const startY = partner.y;
        const endY = centerY;

        return (
          <div key={index}>
            {/* Connection Line */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: appear
              }}
            >
              <defs>
                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={partner.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#C78D4E" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <line
                x1={startX}
                y1={startY}
                x2={interpolate(connectionProgress, [0, 1], [startX, endX])}
                y2={interpolate(connectionProgress, [0, 1], [startY, endY])}
                stroke={`url(#grad-${index})`}
                strokeWidth="3"
                strokeDasharray="8,4"
              />

              {/* Data packet animation */}
              {isConnected && (
                <circle
                  cx={interpolate(
                    (frame % 60) / 60,
                    [0, 1],
                    [startX, endX]
                  )}
                  cy={interpolate(
                    (frame % 60) / 60,
                    [0, 1],
                    [startY, endY]
                  )}
                  r="6"
                  fill={partner.color}
                  opacity={interpolate((frame % 60) / 60, [0, 0.2, 0.8, 1], [0, 1, 1, 0])}
                />
              )}
            </svg>

            {/* Partner Node */}
            <div
              style={{
                position: 'absolute',
                left: partner.x - 100,
                top: partner.y - 50,
                width: 200,
                height: 100,
                opacity: appear,
                transform: `scale(${appear}) translateY(${(1 - appear) * 20}px)`
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: `3px solid ${isConnected ? partner.color : '#E5E7EB'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  position: 'relative',
                  transition: 'border 0.3s ease'
                }}
              >
                {/* Status indicator */}
                {isConnected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      right: -12,
                      opacity: spring({
                        frame: frame - (30 + index * 8 + 15),
                        fps,
                        config: { damping: 100 }
                      }),
                      transform: `scale(${spring({
                        frame: frame - (30 + index * 8 + 15),
                        fps,
                        config: { damping: 100 }
                      })})`
                    }}
                  >
                    <CheckCircle size={32} color="#10B981" fill="#D1FAE5" />
                  </div>
                )}

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: partner.color,
                    fontFamily: 'Sora, sans-serif'
                  }}
                >
                  {partner.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {isConnected ? 'Connected' : 'PMS/POS System'}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Stats */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 80,
          opacity: interpolate(frame, [80, 100], [0, 1])
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#C78D4E', fontFamily: 'Sora, sans-serif' }}>
            &lt;5 min
          </div>
          <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Setup Time
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#10B981', fontFamily: 'Sora, sans-serif' }}>
            100%
          </div>
          <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Compatibility
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#3B82F6', fontFamily: 'Sora, sans-serif' }}>
            Real-time
          </div>
          <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Sync
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
