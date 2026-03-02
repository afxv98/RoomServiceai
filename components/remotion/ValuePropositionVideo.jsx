import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Star, TrendingUp, Users, Zap } from 'lucide-react';

export const ValuePropositionVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const values = [
    {
      icon: Star,
      title: 'Guest Delight',
      metric: '4.9/5',
      label: 'Guest Rating',
      color: '#F59E0B',
      delay: 0,
      x: 300,
      y: 300
    },
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      metric: '+35%',
      label: 'Order Value',
      color: '#10B981',
      delay: 15,
      x: 1620,
      y: 300
    },
    {
      icon: Users,
      title: 'Staff Freedom',
      metric: '90%',
      label: 'Time Saved',
      color: '#3B82F6',
      delay: 30,
      x: 300,
      y: 780
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      metric: '<5 min',
      label: 'Go Live',
      color: '#8B5CF6',
      delay: 45,
      x: 1620,
      y: 780
    }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
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
        <div style={{ fontSize: 56, fontWeight: 'bold', color: '#1F2937', fontFamily: 'Sora, sans-serif' }}>
          Four Pillars of Excellence
        </div>
        <div style={{ fontSize: 24, color: '#C78D4E', fontFamily: 'Inter, sans-serif', marginTop: 12, fontWeight: 600 }}>
          Transform Every Aspect of Room Service
        </div>
      </div>

      {/* Central Logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: interpolate(frame, [10, 30], [0, 1]),
          scale: `${interpolate(frame, [10, 30], [0.8, 1])}`
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
            border: '5px solid #C78D4E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
      </div>

      {/* Value Cards */}
      {values.map((value, index) => {
        const Icon = value.icon;
        const appear = spring({
          frame: frame - 30 - value.delay,
          fps,
          config: { damping: 100, stiffness: 200 }
        });

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: value.x - 150,
              top: value.y - 120,
              width: 300,
              height: 240,
              opacity: appear,
              transform: `scale(${appear})`
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                border: `4px solid ${value.color}`,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Icon */}
              <div
                style={{
                  position: 'absolute',
                  right: -30,
                  bottom: -30,
                  opacity: 0.05
                }}
              >
                <Icon size={150} color={value.color} />
              </div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
                {/* Icon */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    backgroundColor: `${value.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <Icon size={45} color={value.color} />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#1F2937',
                    fontFamily: 'Sora, sans-serif',
                    marginBottom: 12
                  }}
                >
                  {value.title}
                </div>

                {/* Metric */}
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 'bold',
                    color: value.color,
                    fontFamily: 'Sora, sans-serif',
                    marginBottom: 4,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {value.metric}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: 16,
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {value.label}
                </div>
              </div>

              {/* Animated border pulse */}
              {appear === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: 24,
                    border: `4px solid ${value.color}`,
                    opacity: interpolate((frame - value.delay) % 60, [0, 30, 60], [0, 0.6, 0]),
                    transform: `scale(${interpolate((frame - value.delay) % 60, [0, 60], [1, 1.05])})`
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Connecting Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: interpolate(frame, [70, 90], [0, 0.2])
        }}
      >
        <line x1={450} y1={300} x2={960} y2={540} stroke="#C78D4E" strokeWidth="2" strokeDasharray="5,5" />
        <line x1={1470} y1={300} x2={960} y2={540} stroke="#C78D4E" strokeWidth="2" strokeDasharray="5,5" />
        <line x1={450} y1={780} x2={960} y2={540} stroke="#C78D4E" strokeWidth="2" strokeDasharray="5,5" />
        <line x1={1470} y1={780} x2={960} y2={540} stroke="#C78D4E" strokeWidth="2" strokeDasharray="5,5" />
      </svg>

      {/* Bottom Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [90, 110], [0, 1])
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600
          }}
        >
          One Platform. <span style={{ color: '#C78D4E' }}>Total Transformation.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
