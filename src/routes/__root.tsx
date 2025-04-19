// @ts-nocheck
import { TonIcon } from '@/components/icons';
import NavigationMenu from '@/components/navigation'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGameStore } from '@/store/game-store';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react';
import gif from "@/assets/congrats.gif"
import lastFrame from "@/assets/congrats_last_frame.png"

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    document.body.style.height = window.visualViewport?.height + 'px';
  });
}
// This will ensure user never overscroll the page
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) window.scrollTo(0, 0);
});

export const Route = createRootRoute({
  component: () => {
    const [isLoading, setIsLoading] = useState(true);
    const points = useGameStore().points;

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1750);
      return () => clearTimeout(timer);
    }, []);

    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
      if (points >= 15000) {
        if (isLoading) return; // ще не час

        const gifTimer = setTimeout(() => {
          setIsDone(true);
        }, 3000); // тривалість гіфки

        return () => clearTimeout(gifTimer);
      }
    }, [points, isLoading]);

    return (
      <main className='flex flex-col p-3 gap-3 max-w-md mx-auto w-screen relative' style={{
        paddingTop: "calc(var(--tg-content-safe-area-inset-top) + var(--tg-safe-area-inset-top) + 0.75rem)",
        minHeight: "calc(var(--tg-viewport-height) - 64px)",
        paddingBottom: "calc(var(--tg-content-safe-area-inset-bottom) + var(--tg-safe-area-inset-bottom) + 64px + 0.75rem))",
      }}>
        {isLoading && (
          <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          </div>
        )}

        <Outlet />
        <NavigationMenu />

        {useGameStore((state) => state.points) >= 15000 && !isLoading ?
          <div className="w-screen h-screen bg-black/50 inset-0 fixed z-50" />
          : undefined}
        <Dialog open={points >= 15000 && !isLoading} modal={false}>
          <DialogContent>
            <div className='relative w-full'>
              <img
                src={isDone ? lastFrame : gif}
                alt="congrats"
                className='size-28 mx-auto object-cover opacity-30'
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold drop-shadow-sm">
                  Congratulations!
                </span>
              </div>
            </div>
            <DialogHeader className='items-center'>
              <DialogDescription>
                Connect your wallet to collect reward!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="font-semibold mx-auto"
                onClick={window.openButton}
              >
                <TonIcon className='size-5' />
                Connect Wallet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    );
  },
});

