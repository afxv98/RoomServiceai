import { AbsoluteFill } from 'remotion';

export const SimpleTestVideo = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#C78D4E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        RoomService AI
      </div>
    </AbsoluteFill>
  );
};
