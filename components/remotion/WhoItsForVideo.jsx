import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Building, Building2, Hotel, Crown } from 'lucide-react';

export const WhoItsForVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hotelTypes = [
    {
      icon: Hotel,
      name: 'Boutique Hotels',
      rooms: '20-80 rooms',
      color: '#8B5CF6',
      delay: 0,
      benefits: ['Premium service', 'Personal touch', 'High margins']
    },
    {
      icon: Building2,
      name: 'City Hotels',
      rooms: '80-200 rooms',
      color: '#3B82F6',
      delay: 15,
      benefits: ['High volume', 'Fast service', 'Efficiency']
    },
    {
      icon: Building,
      name: 'Resort Hotels',
      rooms: '150-400 rooms',
      color: '#10B981',
      delay: 30,
      benefits: ['24/7 service', 'Multi-language', 'Scale']
    },
    {
      icon: Crown,
      name: 'Luxury Properties',
      rooms: 'Any size',
      color: '#F59E0B',
      delay: 45,
      benefits: ['White glove', 'Zero errors', 'Brand excellence']
    }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F1EC' }}>
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(199, 141, 78, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(199, 141, 78, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
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
          Built for Every Property
        </div>
        <div style={{ fontSize: 22, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 12 }}>
          From boutique charm to luxury scale
        </div>
      </div>

      {/* Hotel Type Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          padding: '180px 120px 120px',
          height: '100%',
          alignItems: 'start'
        }}
      >
        {hotelTypes.map((hotel, index) => {
          const Icon = hotel.icon;
          const appear = spring({
            frame: frame - 20 - hotel.delay,
            fps,
            config: { damping: 100, stiffness: 200 }
          });

          return (
            <div
              key={index}
              style={{
                opacity: appear,
                transform: `scale(${appear}) translateY(${(1 - appear) * 30}px)`
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  padding: 40,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  border: `4px solid ${hotel.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                {/* Background Icon */}
                <div
                  style={{
                    position: 'absolute',
                    right: -40,
                    top: -40,
                    opacity: 0.04
                  }}
                >
                  <Icon size={200} color={hotel.color} />
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 22,
                      backgroundColor: `${hotel.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24
                    }}
                  >
                    <Icon size={50} color={hotel.color} />
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: '#1F2937',
                      fontFamily: 'Sora, sans-serif',
                      marginBottom: 8
                    }}
                  >
                    {hotel.name}
                  </div>

                  {/* Room count */}
                  <div
                    style={{
                      fontSize: 18,
                      color: hotel.color,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      marginBottom: 24
                    }}
                  >
                    {hotel.rooms}
                  </div>

                  {/* Benefits */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {hotel.benefits.map((benefit, idx) => {
                      const benefitAppear = spring({
                        frame: frame - 20 - hotel.delay - 10 - idx * 5,
                        fps,
                        config: { damping: 100 }
                      });

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            opacity: benefitAppear,
                            transform: `translateX(${(1 - benefitAppear) * -20}px)`
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: hotel.color
                            }}
                          />
                          <div
                            style={{
                              fontSize: 16,
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {benefit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Animated corner accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `linear-gradient(135deg, transparent 50%, ${hotel.color}15 50%)`,
                    opacity: interpolate((frame - hotel.delay) % 60, [0, 30, 60], [0.3, 0.7, 0.3])
                  }}
                />
              </div>
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
          opacity: interpolate(frame, [80, 100], [0, 1])
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#1F2937',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            marginBottom: 12
          }}
        >
          Your Property. <span style={{ color: '#C78D4E' }}>Our Expertise.</span>
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Tailored solutions for any hotel size or style
        </div>
      </div>
    </AbsoluteFill>
  );
};
