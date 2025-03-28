// @ts-nocheck
import { useGameStore } from '@/store/game-store'
import React, { useEffect, useRef } from 'react'
import CountUp from "react-countup"

function Points() {
  const { points } = useGameStore()
  const prevPointsRef = useRef(points)

  useEffect(() => {
    prevPointsRef.current = points;
  }, [points, prevPointsRef])

  return (
    <CountUp
      duration={0.75}
      end={points}
      separator=" "
      start={prevPointsRef.current}
    />
  )
}

export default Points

