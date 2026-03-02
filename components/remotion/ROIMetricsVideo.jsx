import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

export const ROIMetricsVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const metrics = [
    { icon: TrendingUp, value: '35%', label: 'Revenue Increase', color: '#10B981', delay: 0 },
    { icon: DollarSign, value: '$125K', label: 'Avg. Annual Savings', color: '#C78D4E', delay: 15 },
    { icon: Clock, value: '90%', label: 'Time Saved', color: '#3B82F6', delay: 30 },
    { icon: Users, value: '100%', label: 'Order Accuracy', color: '#8B5CF6', delay: 45 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.5
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
          Real Results
        </div>
        <div style={{ fontSize: 20, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          Industry-leading performance metrics
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          padding: '0 100px',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 100
        }}
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const appear = spring({
            frame: frame - metric.delay,
            fps,
            config: { damping: 100, stiffness: 200 }
          });

          const countUpProgress = interpolate(
            frame - metric.delay,
            [0, 30],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          // Extract number from value string
          const numValue = parseFloat(metric.value.replace(/[^0-9.]/g, ''));
          const prefix = metric.value.match(/^[^0-9]*/)[0];
          const suffix = metric.value.match(/[^0-9.]+$/)?.[0] || '';
          const animatedValue = Math.floor(numValue * countUpProgress);

          return (
            <div
              key={index}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: 40,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                transform: `scale(${appear}) translateY(${(1 - appear) * 30}px)`,
                opacity: appear,
                border: `3px solid ${metric.color}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Icon */}
              <div
                style={{
                  position: 'absolute',
                  right: -20,
                  bottom: -20,
                  opacity: 0.05
                }}
              >
                <Icon size={150} color={metric.color} />
              </div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    backgroundColor: `${metric.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24
                  }}
                >
                  <Icon size={40} color={metric.color} />
                </div>

                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 'bold',
                    color: metric.color,
                    fontFamily: 'Sora, sans-serif',
                    marginBottom: 12,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {prefix}{animatedValue}{suffix}
                </div>

                <div
                  style={{
                    fontSize: 20,
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }}
                >
                  {metric.label}
                </div>
              </div>

              {/* Animated border pulse */}
              {appear === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: 24,
                    border: `3px solid ${metric.color}`,
                    opacity: interpolate((frame - metric.delay) % 60, [0, 30, 60], [0, 0.5, 0]),
                    transform: `scale(${interpolate((frame - metric.delay) % 60, [0, 60], [1, 1.1])})`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [60, 80], [0, 1])
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600
          }}
        >
          Your ROI. <span style={{ color: '#C78D4E' }}>Guaranteed.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
