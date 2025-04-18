import Energy from '@/components/energy'
import { MiningArea } from '@/components/mining-area'
import Points from '@/components/points'
import { useGameStore } from '@/store/game-store'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


function Index() {
  const isTappingGuruActive = useGameStore((state) => state.tappingGuruBoost.active);
  const TappingGuruEndTime = useGameStore((state) => state.tappingGuruBoost.boostEndTime) ?? 0;
  const [remainingTime, setRemainingTime] = useState(TappingGuruEndTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = TappingGuruEndTime - Date.now();
      setRemainingTime(timeLeft > 0 ? timeLeft : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [TappingGuruEndTime, isTappingGuruActive]);

  return (<>
    <div className='flex flex-col items-center mx-auto mt-6'>
      <p className='text-muted-foreground'>Balance:</p>
      <span className="text-3xl font-bold"><Points /></span>
    </div>

    <div className="fixed w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <MiningArea />
    </div>

    <div className='fixed flex justify-center p-4 w-full left-0 items-center' style={{
      bottom: "calc(var(--tg-safe-area-inset-bottom) + var(--tg-content-safe-area-inset-bottom) + 64px)"
    }}>
      <div className='mr-auto'>
        <Energy />
      </div>
      {isTappingGuruActive ?
        <div className='ml-auto font-bold text-sm'>
          <span className='bg-primary rounded-full p-1 px-2'>
            10X • <span className='font-medium'>{formatTime(remainingTime)}</span>
          </span>
        </div>
        :
        undefined
      }
    </div>
  </>)
}
