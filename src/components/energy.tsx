// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import CircularProgress from './ui/progress-circular'
import { Zap } from 'lucide-react'
import { useGameStore } from '@/store/game-store';
import CountUp from 'react-countup';

export default function Energy() {
  const { energy, maxEnergy } = useGameStore()

  const prevEnergyRef = useRef(energy)

  useEffect(() => {
    prevEnergyRef.current = energy;
  }, [energy, prevEnergyRef])

  return (
    <div className="flex items-center gap-0.5">
      <div className="relative">
        <Zap className='absolute size-7 top-5.5 left-5.5 text-primary' strokeWidth={1.5} fill="var(--primary)" />
        <CircularProgress value={energy / maxEnergy * 100} size={72} strokeWidth={6} />
      </div>
      <div className='flex flex-col gap-0.5'>
        <span className='text-lg leading-none font-semibold text-primary'>
          <CountUp
            duration={0.75}
            end={energy}
            separator=""
            start={prevEnergyRef.current}
          />
        </span>
        <span className='text-sm leading-none text-muted-foreground'>/ {maxEnergy}</span>
      </div>
    </div>
  )
}

