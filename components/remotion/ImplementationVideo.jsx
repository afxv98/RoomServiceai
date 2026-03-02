import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const ImplementationVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { label: 'Setup', time: '1 day', delay: 0 },
    { label: 'Integration', time: '2 days', delay: 20 },
    { label: 'Training', time: '1 day', delay: 40 },
    { label: 'Go Live', time: '1 day', delay: 60 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(199, 141, 78, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(199, 141, 78, 0.05) 1px, transparent 1px)',
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
        <div style={{ fontSize: 52, fontWeight: 'bold', color: '#1F2937', fontFamily: 'Sora, sans-serif' }}>
          Quick Implementation
        </div>
        <div style={{ fontSize: 22, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          From zero to hero in 5 days
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '0 100px',
          gap: 40
        }}
      >
        {steps.map((step, index) => {
          const appear = spring({
            frame: frame - step.delay,
            fps,
            config: { damping: 100, stiffness: 200 }
          });

          const isComplete = frame >= step.delay + 20;
          const checkAppear = spring({
            frame: frame - (step.delay + 20),
            fps,
            config: { damping: 100 }
          });

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              {/* Step Card */}
              <div
                style={{
                  width: 280,
                  opacity: appear,
                  transform: `scale(${appear}) translateY(${(1 - appear) * 30}px)`
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: 40,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: isComplete ? '3px solid #10B981' : '3px solid #E5E7EB',
                    position: 'relative',
                    transition: 'all 0.5s ease'
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#C78D4E',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Sora, sans-serif',
                      boxShadow: '0 4px 12px rgba(199, 141, 78, 0.4)'
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Check Mark */}
                  {isComplete && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -20,
                        right: 20,
                        opacity: checkAppear,
                        transform: `scale(${checkAppear})`
                      }}
                    >
                      <CheckCircle size={40} color="#10B981" fill="#D1FAE5" />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#1F2937',
                        fontFamily: 'Sora, sans-serif',
                        marginBottom: 12
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 'bold',
                        color: '#C78D4E',
                        fontFamily: 'Sora, sans-serif',
                        marginBottom: 8
                      }}
                    >
                      {step.time}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      marginTop: 20,
                      height: 6,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: isComplete ? '#10B981' : '#C78D4E',
                        width: isComplete ? '100%' : `${Math.min(((frame - step.delay) / 20) * 100, 100)}%`,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    opacity: appear,
                    transform: `scale(${appear})`
                  }}
                >
                  <ArrowRight size={40} color="#C78D4E" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [80, 100], [0, 1])
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
          <span style={{ color: '#10B981' }}>Fast.</span> Simple. <span style={{ color: '#C78D4E' }}>Effective.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
