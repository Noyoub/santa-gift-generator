
import { useEffect, useState } from 'react';

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    opacity: number;
    fontSize: number;
  }>>([]);

  useEffect(() => {
    const createSnowflake = () => ({
      id: Math.random(),
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.2,
      fontSize: Math.random() * 10 + 10,
    });

    const initialSnowflakes = Array.from({ length: 50 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    const interval = setInterval(() => {
      setSnowflakes(prev => [
        ...prev.slice(-49),
        createSnowflake()
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            fontSize: `${flake.fontSize}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default SnowEffect;
