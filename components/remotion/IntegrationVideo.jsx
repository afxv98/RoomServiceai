import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Mic, Server, ArrowRight, Check } from 'lucide-react';

export const IntegrationVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const aiAppear = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 }
  });

  const arrowProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 200 }
  });

  const posAppear = spring({
    frame: frame - 50,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 }
  });

  const codeAppear = spring({
    frame: frame - 70,
    fps,
    config: { damping: 100 }
  });

  const particlesOpacity = interpolate(
    frame,
    [0, 30, 90, 120],
    [0, 1, 1, 0]
  );

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: Math.sin(frame * 0.02 + i) * 50,
    y: Math.cos(frame * 0.03 + i) * 30,
    delay: i * 5
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(199, 141, 78, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Animated Particles */}
      {particles.map((particle, i) => {
        const particleSpring = spring({
          frame: frame - particle.delay,
          fps,
          config: { damping: 100 }
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${50 + particle.x}%`,
              top: `${50 + particle.y}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#C78D4E',
              opacity: particlesOpacity * particleSpring * 0.3,
              transform: `scale(${particleSpring})`
            }}
          />
        );
      })}

      {/* Main Content Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '60px',
          position: 'relative'
        }}
      >
        {/* AI Box */}
        <div
          style={{
            transform: `scale(${aiAppear}) translateY(${(1 - aiAppear) * 50}px)`,
            opacity: aiAppear,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              backgroundColor: '#0B0B0D',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '2px solid #C78D4E'
            }}
          >
            <Mic size={48} color="#C78D4E" />
            <div
              style={{
                color: '#C78D4E',
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: 12,
                fontFamily: 'Sora, sans-serif'
              }}
            >
              AI
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#1F2937',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Voice Agent
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            margin: '0 60px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: arrowProgress
          }}
        >
          <div
            style={{
              width: interpolate(arrowProgress, [0, 1], [0, 120]),
              height: 3,
              backgroundColor: '#C78D4E',
              borderRadius: 2,
              position: 'relative'
            }}
          >
            {/* Data packets flowing */}
            {[0, 1, 2].map((i) => {
              const packetProgress = interpolate(
                frame,
                [30 + i * 10, 60 + i * 10],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${packetProgress * 100}%`,
                    top: -6,
                    width: 12,
                    height: 12,
                    backgroundColor: '#C78D4E',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(199, 141, 78, 0.6)',
                    opacity: packetProgress * (1 - packetProgress) * 4
                  }}
                />
              );
            })}
          </div>
          <ArrowRight
            size={32}
            color="#C78D4E"
            style={{
              transform: `scale(${arrowProgress})`,
              filter: 'drop-shadow(0 0 10px rgba(199, 141, 78, 0.5))'
            }}
          />
        </div>

        {/* POS Box */}
        <div
          style={{
            transform: `scale(${posAppear}) translateY(${(1 - posAppear) * 50}px)`,
            opacity: posAppear,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              border: '3px solid #E5E7EB'
            }}
          >
            <Server size={48} color="#DC2626" />
            <div
              style={{
                color: '#DC2626',
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: 12,
                fontFamily: 'Sora, sans-serif'
              }}
            >
              POS
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#1F2937',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Simphony
          </div>
        </div>
      </div>

      {/* Code Block Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: `translateX(-50%) translateY(${(1 - codeAppear) * 30}px)`,
          opacity: codeAppear,
          backgroundColor: '#1F2937',
          padding: '24px 32px',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: '2px solid #374151',
          maxWidth: '80%'
        }}
      >
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 14,
            color: '#9CA3AF',
            lineHeight: 1.6
          }}
        >
          <div>
            <span style={{ color: '#10B981' }}>POST</span>
            {' '}
            <span style={{ color: '#F3F4F6' }}>/api/v1/checks/fire</span>
          </div>
          <div style={{ marginTop: 8 }}>{'{'}</div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: '#F3F4F6' }}>"item":</span>
            {' '}
            <span style={{ color: '#C78D4E' }}>"Club Sandwich"</span>,
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: '#F3F4F6' }}>"modifiers":</span>
            {' '}
            <span style={{ color: '#60A5FA' }}>["No Mayo", "Add Bacon"]</span>,
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: '#F3F4F6' }}>"upsell":</span>
            {' '}
            <span style={{ color: '#C78D4E' }}>"Glass_Malbec_Red"</span>
          </div>
          <div>{'}'}</div>
        </div>

        {/* Success Badge */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid #374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <Check size={20} color="#10B981" />
          <span
            style={{
              color: '#10B981',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: '"IBM Plex Mono", monospace'
            }}
          >
            Verified OHIP Integration
          </span>
        </div>
      </div>

      {/* Title at Top */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: aiAppear
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}
        >
          Seamless Integration
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            marginTop: 8
          }}
        >
          AI → POS in real-time
        </div>
      </div>
    </AbsoluteFill>
  );
};
