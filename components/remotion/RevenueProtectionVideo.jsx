import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Shield, AlertTriangle, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export const RevenueProtectionVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for before/after comparison
  const splitProgress = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Before (left side) - Problems
  const beforeOpacity = interpolate(frame, [10, 30], [0, 1]);
  const beforeProblems = [
    { label: 'Chargebacks', cost: '$2,400', delay: 0 },
    { label: 'Disputes', cost: '$1,800', delay: 10 },
    { label: 'Errors', cost: '$3,200', delay: 20 }
  ];

  // After (right side) - Protected
  const afterOpacity = interpolate(frame, [50, 70], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Diagonal split line */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      >
        <line
          x1={interpolate(splitProgress, [0, 1], [960, 960])}
          y1={0}
          x2={interpolate(splitProgress, [0, 1], [960, 960])}
          y2={1080}
          stroke="#C78D4E"
          strokeWidth="4"
          strokeDasharray="10,5"
        />
      </svg>

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
          Revenue Protection
        </div>
        <div style={{ fontSize: 20, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          Eliminate chargebacks and disputes automatically
        </div>
      </div>

      {/* LEFT SIDE - Before (Problems) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          opacity: beforeOpacity
        }}
      >
        <div
          style={{
            marginBottom: 40,
            opacity: interpolate(frame, [10, 30], [0, 1])
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              margin: '0 auto'
            }}
          >
            <XCircle size={70} color="#DC2626" />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#DC2626',
              fontFamily: 'Sora, sans-serif',
              textAlign: 'center'
            }}
          >
            Without Protection
          </div>
        </div>

        {/* Problem Cards */}
        <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {beforeProblems.map((problem, index) => {
            const appear = spring({
              frame: frame - 30 - problem.delay,
              fps,
              config: { damping: 100 }
            });

            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)',
                  border: '3px solid #FCA5A5',
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * -30}px)`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <AlertTriangle size={32} color="#DC2626" />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#1F2937',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: 4
                      }}
                    >
                      {problem.label}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#DC2626',
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {problem.cost}/mo
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Loss */}
        <div
          style={{
            marginTop: 30,
            opacity: interpolate(frame, [60, 80], [0, 1])
          }}
        >
          <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
            Total Monthly Loss
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#DC2626',
              fontFamily: 'Sora, sans-serif',
              textAlign: 'center'
            }}
          >
            $7,400
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - After (Protected) */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          opacity: afterOpacity
        }}
      >
        <div
          style={{
            marginBottom: 40,
            opacity: interpolate(frame, [50, 70], [0, 1])
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <Shield size={70} color="#10B981" fill="#10B981" />

            {/* Shield pulse effect */}
            {[1, 2, 3].map((i) => {
              const pulse = ((frame - 50 + i * 15) % 60) / 60;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: -10 * i,
                    borderRadius: '50%',
                    border: '3px solid rgba(16, 185, 129, 0.3)',
                    opacity: 1 - pulse,
                    transform: `scale(${1 + pulse * 0.5})`
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#10B981',
              fontFamily: 'Sora, sans-serif',
              textAlign: 'center'
            }}
          >
            With RS AI
          </div>
        </div>

        {/* Protection Features */}
        <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Audio Proof', icon: CheckCircle, delay: 0 },
            { label: 'Order Verification', icon: CheckCircle, delay: 10 },
            { label: 'Automatic Documentation', icon: CheckCircle, delay: 20 }
          ].map((feature, index) => {
            const appear = spring({
              frame: frame - 70 - feature.delay,
              fps,
              config: { damping: 100 }
            });

            const Icon = feature.icon;

            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
                  border: '3px solid #86EFAC',
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 30}px)`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Icon size={32} color="#10B981" />
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {feature.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings */}
        <div
          style={{
            marginTop: 30,
            opacity: interpolate(frame, [100, 110], [0, 1]),
            transform: `scale(${interpolate(frame, [100, 110], [0.8, 1])})`
          }}
        >
          <div style={{ fontSize: 16, color: '#6B7280', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
            Protected Revenue
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#10B981',
              fontFamily: 'Sora, sans-serif',
              textAlign: 'center'
            }}
          >
            $7,400/mo
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#C78D4E',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              marginTop: 8,
              fontWeight: 600
            }}
          >
            = $88,800/year saved
          </div>
        </div>
      </div>

      {/* Center Arrow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: interpolate(frame, [45, 55], [0, 1]),
          zIndex: 10
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#C78D4E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(199, 141, 78, 0.4)',
            transform: `scale(${spring({
              frame: frame - 45,
              fps,
              config: { damping: 100 }
            })})`
          }}
        >
          <DollarSign size={50} color="#FFFFFF" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
