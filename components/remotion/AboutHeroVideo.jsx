import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Globe, MapPin, Lightbulb } from 'lucide-react';

export const AboutHeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases
  const globeAppear = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100, stiffness: 200 }
  });

  const pinsAppear = spring({
    frame: frame - 30,
    fps,
    config: { damping: 80 }
  });

  const ideaAppear = spring({
    frame: frame - 60,
    fps,
    config: { damping: 100 }
  });

  const textFade = interpolate(frame, [0, 20, 100, 120], [0, 1, 1, 1]);

  // Rotating globe
  const globeRotation = interpolate(frame, [0, 120], [0, 360]);

  // Pin locations (representing European hotels)
  const pins = [
    { x: 45, y: 35, delay: 0 },
    { x: 55, y: 40, delay: 5 },
    { x: 50, y: 45, delay: 10 },
    { x: 60, y: 38, delay: 15 },
    { x: 48, y: 50, delay: 20 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Gradient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(199, 141, 78, 0.15) 0%, transparent 60%)'
        }}
      />

      {/* Main Content */}
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        {/* Globe Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: globeAppear
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 300,
              height: 300,
              transform: `scale(${globeAppear}) rotate(${globeRotation}deg)`
            }}
          >
            <Globe
              size={300}
              color="#C78D4E"
              strokeWidth={1.5}
              style={{
                opacity: 0.3,
                filter: 'drop-shadow(0 20px 40px rgba(199, 141, 78, 0.2))'
              }}
            />

            {/* Hotel Pins */}
            {pins.map((pin, i) => {
              const pinSpring = spring({
                frame: frame - 30 - pin.delay,
                fps,
                config: { damping: 100 }
              });

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: `translate(-50%, -100%) scale(${pinSpring})`,
                    opacity: pinSpring
                  }}
                >
                  <MapPin size={32} fill="#DC2626" color="#DC2626" />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(220, 38, 38, 0.2)',
                      animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                      animationDelay: `${pin.delay * 0.1}s`
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 40,
              opacity: pinsAppear,
              textAlign: 'center',
              maxWidth: 280
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#C78D4E', fontFamily: 'Sora, sans-serif', marginBottom: 8 }}>
              The Pattern
            </div>
            <div style={{ fontSize: 16, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              Room service relies on manual phone handling. During peak hours, communication breaks down.
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            width: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ideaAppear
          }}
        >
          <div
            style={{
              fontSize: 60,
              color: '#C78D4E',
              transform: `scale(${ideaAppear})`
            }}
          >
            →
          </div>
        </div>

        {/* Solution Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ideaAppear
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(199, 141, 78, 0.3)',
              border: '4px solid #C78D4E',
              transform: `scale(${ideaAppear})`,
              position: 'relative'
            }}
          >
            <Lightbulb
              size={100}
              color="#C78D4E"
              fill="#FEF3C7"
            />

            {/* Radiating circles */}
            {[1, 2, 3].map((i) => {
              const pulse = interpolate(
                frame % 60,
                [0, 60],
                [1, 1.5]
              );

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: -20 * i,
                    borderRadius: '50%',
                    border: '2px solid rgba(199, 141, 78, 0.2)',
                    opacity: interpolate(frame % 60, [0, 60], [0.5, 0]),
                    transform: `scale(${pulse})`
                  }}
                />
              );
            })}
          </div>

          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              maxWidth: 280
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#C78D4E',
                fontFamily: 'Sora, sans-serif',
                marginBottom: 8
              }}
            >
              The Solution
            </div>
            <div style={{ fontSize: 16, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              AI-powered 24/7 call handling built specifically for hotel room service.
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: textFade
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 'bold',
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            marginBottom: 8
          }}
        >
          Born From Repeated Real-World Experience
        </div>
        <div style={{ fontSize: 20, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
          The same friction. Different hotel. Every time.
        </div>
        <div style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
          Across premium 4- and 5-star properties, one pattern kept repeating.
        </div>
      </div>

      {/* Bottom Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ideaAppear
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            maxWidth: 700,
            margin: '0 auto'
          }}
        >
          Luxury experience shouldn't depend on call availability.
        </div>
      </div>

      <style>
        {`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </AbsoluteFill>
  );
};
