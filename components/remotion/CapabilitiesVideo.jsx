import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Mic, Globe, Check, TrendingUp, Shield, Bell } from 'lucide-react';

export const CapabilitiesVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const capabilities = [
    { icon: Mic, label: 'Voice AI', delay: 0 },
    { icon: Globe, label: 'Multi-Language', delay: 10 },
    { icon: Check, label: 'Order Confirmation', delay: 20 },
    { icon: TrendingUp, label: 'Smart Upselling', delay: 30 },
    { icon: Shield, label: 'Chargeback Prevention', delay: 40 },
    { icon: Bell, label: 'Tray Collection', delay: 50 }
  ];

  const centerX = 960;
  const centerY = 540;
  const radius = 300;

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Gradient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(199, 141, 78, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 20], [0, 1])
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 'bold', color: '#1F2937', fontFamily: 'Sora, sans-serif' }}>
          Complete Platform
        </div>
        <div style={{ fontSize: 22, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          Everything you need, built-in
        </div>
      </div>

      {/* Central Logo/Icon */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 100,
          top: centerY - 100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
          border: '4px solid #C78D4E',
          opacity: interpolate(frame, [0, 20], [0, 1]),
          transform: `scale(${interpolate(frame, [0, 20], [0.8, 1])})`
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 'bold',
            color: '#C78D4E',
            fontFamily: 'Sora, sans-serif'
          }}
        >
          RS AI
        </div>
      </div>

      {/* Orbiting Capabilities */}
      {capabilities.map((capability, index) => {
        const Icon = capability.icon;
        const angle = (index / capabilities.length) * Math.PI * 2 - Math.PI / 2;

        const appear = spring({
          frame: frame - capability.delay,
          fps,
          config: { damping: 100, stiffness: 200 }
        });

        const orbitProgress = interpolate(
          frame,
          [capability.delay, capability.delay + 120],
          [0, Math.PI * 2]
        );

        const x = centerX + Math.cos(angle + orbitProgress * 0.1) * radius;
        const y = centerY + Math.sin(angle + orbitProgress * 0.1) * radius;

        // Connection line
        const lineOpacity = interpolate(frame - capability.delay, [0, 20], [0, 0.2]);

        return (
          <div key={index}>
            {/* Connection Line */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: lineOpacity * appear
              }}
            >
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#C78D4E"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.3"
              />
            </svg>

            {/* Capability Node */}
            <div
              style={{
                position: 'absolute',
                left: x - 70,
                top: y - 70,
                width: 140,
                height: 140,
                opacity: appear,
                transform: `scale(${appear})`
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 20,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '2px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: 16
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={28} color="#C78D4E" />
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {capability.label}
                </div>
              </div>

              {/* Pulse effect */}
              {appear === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -5,
                    borderRadius: 20,
                    border: '2px solid #C78D4E',
                    opacity: interpolate((frame - capability.delay) % 60, [0, 30, 60], [0, 0.5, 0]),
                    transform: `scale(${interpolate((frame - capability.delay) % 60, [0, 60], [1, 1.2])})`
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [70, 90], [0, 1])
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600
          }}
        >
          One System. <span style={{ color: '#C78D4E' }}>Infinite Possibilities.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
