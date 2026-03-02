import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { MessageCircle, Mail, Phone, Send } from 'lucide-react';

export const ContactHeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contactMethods = [
    { icon: Mail, label: 'Email', color: '#3B82F6', angle: 0, delay: 0 },
    { icon: Phone, label: 'Phone', color: '#10B981', angle: 120, delay: 10 },
    { icon: MessageCircle, label: 'Chat', color: '#8B5CF6', angle: 240, delay: 20 }
  ];

  const centerX = 960;
  const centerY = 540;
  const radius = 280;

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Gradient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(199, 141, 78, 0.15) 0%, transparent 60%)'
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
          Let's Connect
        </div>
        <div style={{ fontSize: 22, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          We're here to help transform your room service
        </div>
      </div>

      {/* Central "You" Node */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 100,
          top: centerY - 100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          border: '5px solid #C78D4E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: interpolate(frame, [10, 30], [0, 1]),
          transform: `scale(${interpolate(frame, [10, 30], [0.8, 1])})`
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#C78D4E',
            fontFamily: 'Sora, sans-serif'
          }}
        >
          You
        </div>
        <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Start Here
        </div>

        {/* Pulse rings */}
        {[1, 2].map((i) => {
          const pulse = ((frame + i * 30) % 60) / 60;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: -20 * i,
                borderRadius: '50%',
                border: '3px solid rgba(199, 141, 78, 0.4)',
                opacity: 1 - pulse,
                transform: `scale(${1 + pulse * 0.8})`
              }}
            />
          );
        })}
      </div>

      {/* Contact Method Nodes */}
      {contactMethods.map((method, index) => {
        const Icon = method.icon;
        const angleRad = (method.angle * Math.PI) / 180 - Math.PI / 2;

        const appear = spring({
          frame: frame - 40 - method.delay,
          fps,
          config: { damping: 100, stiffness: 200 }
        });

        const x = centerX + Math.cos(angleRad) * radius;
        const y = centerY + Math.sin(angleRad) * radius;

        // Message animation
        const messageProgress = interpolate(
          (frame - 60 - method.delay) % 60,
          [0, 30],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );

        const showMessage = frame >= 60 + method.delay;

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
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={method.color}
                strokeWidth="3"
                strokeDasharray="8,4"
                opacity="0.3"
              />

              {/* Animated message dot */}
              {showMessage && (
                <circle
                  cx={interpolate(messageProgress, [0, 1], [centerX, x])}
                  cy={interpolate(messageProgress, [0, 1], [centerY, y])}
                  r="8"
                  fill={method.color}
                  opacity={interpolate(messageProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])}
                />
              )}
            </svg>

            {/* Contact Method Node */}
            <div
              style={{
                position: 'absolute',
                left: x - 90,
                top: y - 90,
                width: 180,
                height: 180,
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
                  border: `3px solid ${method.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  position: 'relative'
                }}
              >
                {/* Icon background */}
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 16,
                    backgroundColor: `${method.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={40} color={method.color} />
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#1F2937',
                    fontFamily: 'Sora, sans-serif'
                  }}
                >
                  {method.label}
                </div>

                {/* Active indicator */}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: method.color,
                    opacity: interpolate((frame % 60) / 60, [0, 0.5, 1], [0.3, 1, 0.3])
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Send Button Animation */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(frame, [80, 100], [0, 1])
        }}
      >
        <div
          style={{
            backgroundColor: '#C78D4E',
            borderRadius: 50,
            padding: '20px 60px',
            boxShadow: '0 10px 30px rgba(199, 141, 78, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transform: `scale(${interpolate(frame, [80, 100], [0.8, 1])})`
          }}
        >
          <Send size={32} color="#FFFFFF" />
          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontFamily: 'Sora, sans-serif'
            }}
          >
            Get in Touch
          </div>
        </div>

        {/* Pulse effect */}
        {interpolate(frame, [80, 100], [0, 1]) === 1 && (
          <div
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: 50,
              border: '3px solid #C78D4E',
              opacity: interpolate((frame % 60) / 60, [0, 0.5, 1], [0.5, 0, 0.5]),
              transform: `scale(${interpolate((frame % 60) / 60, [0, 1], [1, 1.15])})`
            }}
          />
        )}
      </div>

      {/* Bottom Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [90, 110], [0, 1])
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Typical response time: <span style={{ color: '#C78D4E', fontWeight: 600 }}>Under 1 hour</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
