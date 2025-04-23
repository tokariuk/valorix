// @ts-nocheck
import React, { useState } from 'react'
import valorixCoin from "@/assets/mining-button.png"
import { useGameStore } from '@/store/game-store'
import { toast } from 'sonner'
import { ZapOff } from 'lucide-react'
import { BOOST_MULTIPLIER, POINTS_PER_TAP } from '@/constants/game-constants'

export const MiningArea = () => {
  const { click } = useGameStore();
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number, pointsToAdd: number }[]>([]);
  const upgrades = useGameStore((state) => state.upgrades);
  const tappingGuruActive = useGameStore((state) => state.tappingGuruBoost.active)
  const pointsToAdd = useGameStore((state) => state.pointsPerTap) * (tappingGuruActive ? 10 : 1)
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  function handleTap(x: number, y: number) {
    const clicked = click();

    if (clicked) {
      setClicks((prev) => [...prev, { id: Date.now() + Math.random() + Math.random(), x, y, pointsToAdd }]);
    } else {
      toast.dismiss()
      toast.error("Not enough energy!", { icon: <ZapOff size={20} /> });
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    }
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setIsPressed(true);
    const rect = e.currentTarget.getBoundingClientRect();

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      handleTap(x, y);
    }
  }

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div
        className='relative mt-4'
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
      >
        <img className="size-60 select-none" src={valorixCoin} style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transform: isPressed ? 'translateY(4px)' : 'translateY(0px)',
          transition: 'transform 100ms ease',
        }} />
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: `float 1s ease-out`
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    </div>
  );
};
