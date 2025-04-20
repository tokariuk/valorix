// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  BatteryCharging,
  BatteryFull,
  BatteryPlus,
  ChevronRight,
  Flame,
  Hourglass,
  MousePointerClick,
  Rocket,
} from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { createFileRoute } from '@tanstack/react-router';
import { DAILY_BOOST_LIMIT, BOOST_COOLDOWN, ENERGY_REGEN_RATE, BOOST_RESET_TIME } from '@/constants/game-constants';
import Points from '@/components/points';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/boosts')({
  component: Boosts,
});

type SelectedCard =
  | {
    type: 'boost';
    key: 'tappingGuru' | 'fullTank';
    title: string;
    description: string;
  }
  | {
    type: 'upgrade';
    key: 'pointsPerClick' | 'maxEnergy' | 'energyRegen';
    title: string;
    description: string;
  }
  | null;

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getResetCountdown() {
  const now = new Date();
  const resetTime = new Date();
  resetTime.setDate(now.getDate() + 1);
  resetTime.setHours(BOOST_RESET_TIME, 0, 0, 0);
  return resetTime.getTime() - now.getTime();
}


function Boosts() {
  const navigate = useNavigate();
  const gameStore = useGameStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SelectedCard>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Оновлення поточного часу кожну секунду для таймерів
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lastReset = gameStore.lastBoostResetTime; // Отримуємо час останнього скидання
    const now = Date.now();

    if (!lastReset || now - lastReset >= getResetCountdown()) {
      gameStore.resetBoosts(); // Функція, яка скидає `dailyCount`
      gameStore.setLastBoostResetTime(now); // Оновлюємо час останнього скидання
    }
  }, [gameStore]);


  // Обчислення залишку активацій та часу охолодження для кожного бусту
  const getBoostInfo = (boost: { dailyCount: number; lastActivationTime: number }) => {
    const available = DAILY_BOOST_LIMIT - boost.dailyCount;
    let cooldown = 0;
    const elapsed = currentTime - boost.lastActivationTime;
    if (elapsed < BOOST_COOLDOWN) {
      cooldown = BOOST_COOLDOWN - elapsed;
    }
    return { available, cooldown };
  };

  const tappingGuruInfo = getBoostInfo(gameStore.tappingGuruBoost);
  const fullTankInfo = getBoostInfo(gameStore.fullTankBoost);

  // Для прокачок – обчислення поточних значень і приросту
  const getUpgradeInfo = (type: 'pointsPerClick' | 'maxEnergy' | 'energyRegen') => {
    const upgrade = gameStore.upgrades[type];

    if (type === 'pointsPerClick') {
      // Наприклад, Tap Power зростає за експоненційною шкалою
      const current = upgrade.level * upgrade.effect
      const nextIncrease = upgrade.effect
      return { current, nextIncrease };
    }

    else if (type === 'maxEnergy') {
      const current = gameStore.maxEnergy;
      const nextIncrease = upgrade.effect;
      return { current, nextIncrease };
    }

    else if (type === 'energyRegen') {
      // Наприклад, Energy Recovery збільшується вдвічі на кожному рівні
      const current = ENERGY_REGEN_RATE + upgrade.effect * (upgrade.level - 1);
      const nextIncrease = upgrade.effect
      return { current, nextIncrease };
    }

    return { current: 0, nextIncrease: 0 };
  };

  const handleCardClick = (card: SelectedCard) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  // Для Tapping Guru: після активації редіректимо на головну
  const handleActivateTappingGuru = () => {
    gameStore.activateTappingGuru();
    navigate({to: "/"})
    setDrawerOpen(false);
    toast.success("Tapping Guru activated! Earn 10x points for 10 seconds");
  };

  // Для Full Tank: просто активуємо буст і закриваємо Drawer
  const handleActivateFullTank = () => {
    gameStore.activateFullTank();
    setDrawerOpen(false);
    toast.success("Full Tank activated! Energy fully restored");
  };

  const handlePurchaseUpgrade = (upgradeType: 'pointsPerClick' | 'maxEnergy' | 'energyRegen') => {
    gameStore.upgrade(upgradeType);
    setDrawerOpen(false);
    if (upgradeType === "pointsPerClick") {
      toast.success("Tap Power upgraded! Earn more points with every tap");
    } else if (upgradeType === "maxEnergy") {
      toast.success("Energy Capacity upgraded! Now you can store even more energy");
    } else if (upgradeType === "energyRegen") {
      toast.success("Energy Regen upgraded! Your energy will recover faster");
    }
  };

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedCard?.title}</DrawerTitle>
            <DrawerDescription>{selectedCard?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {selectedCard?.type === 'upgrade$' && (
              <div className="mb-4">
                {selectedCard.key === 'pointsPerClick' && (
                  <div className="flex gap-1">
                    <p>
                      Current Tap Power:{' '}
                      {getUpgradeInfo('pointsPerClick').current} per tap
                    </p>
                    <p className="text-muted-foreground">
                      {" "}+{getUpgradeInfo('pointsPerClick').nextIncrease}
                    </p>
                  </div>
                )}
                {selectedCard.key === 'maxEnergy' && (
                  <div>
                    <p>
                      Current Energy Capacity: {getUpgradeInfo('maxEnergy').current}
                    </p>
                    <p>
                      Next Upgrade Increase: +{getUpgradeInfo('maxEnergy').nextIncrease}
                    </p>
                  </div>
                )}
                {selectedCard.key === 'energyRegen' && (
                  <div>
                    <p>
                      Current Energy Regen: {getUpgradeInfo('energyRegen').current} per sec
                    </p>
                    <p>
                      Next Upgrade Increase: +{getUpgradeInfo('energyRegen').nextIncrease} per sec
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DrawerFooter>
            {selectedCard?.type === 'boost' ? (
              selectedCard.key === 'tappingGuru' ? (
                <Button onClick={handleActivateTappingGuru} disabled={tappingGuruInfo.cooldown > 0 || tappingGuruInfo.available <= 0}>
                  Activate
                </Button>
              ) : (
                <Button onClick={handleActivateFullTank} disabled={fullTankInfo.cooldown > 0 || fullTankInfo.available <= 0}>
                  Activate
                </Button>
              )
            ) : selectedCard?.type === 'upgrade' ? (
              <Button onClick={() => handlePurchaseUpgrade(selectedCard.key)}>
                Upgrade
              </Button>
            ) : null}
            <DrawerClose>
              <Button variant="link" className='text-destructive'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex items-center gap-3 mb-4">
        <Rocket size={36} strokeWidth={1.75} />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-tight">Boosts</h1>
          <p className="text-muted-foreground leading-tight text-xs">
            Enhance your gameplay with upgrades and boosts
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mb-4">
        <Card className="flex-1 gap-1">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Your balance:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono">
              <Points />
            </span>
          </CardContent>
        </Card>
      </div>


      <h1 className="text-lg font-semibold mb-2">Daily boosts:</h1>
      <div className="flex w-full gap-3 mb-6">
        <Card
          className="flex-1 cursor-pointer"
          onClick={() =>
            handleCardClick({
              type: 'boost',
              key: 'tappingGuru',
              title: 'Tapping Guru',
              description:
                'Earn 10x points per tap for 10 seconds without spending energy. (Usage limit: 3 per day)',
            })
          }
        >
          <CardContent className="relative flex gap-2">
            <div className="flex gap-2 items-center"
              style={{
                opacity: tappingGuruInfo.cooldown > 0 || tappingGuruInfo.available <= 0 ?
                  0.075 :
                  1
              }}>
              <Flame size={32} />
              <div>
                <h1 className="text-md font-semibold line-clamp-1">Tapping Guru</h1>
                <span className="text-muted-foreground text-sm">{tappingGuruInfo.available}/{DAILY_BOOST_LIMIT}</span>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              {tappingGuruInfo.available > 0 && tappingGuruInfo.cooldown > 0 && (
                <span className="flex gap-1.5 font-semibold drop-shadow-md items-center">
                  <Hourglass size={20} /> {formatTime(tappingGuruInfo.cooldown)}
                </span>
              )}
              {tappingGuruInfo.available <= 0 && (
                <span className="flex gap-1.5 font-semibold drop-shadow-md items-center">
                  <Hourglass size={20} /> {formatTime(getResetCountdown())}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className="flex-1 cursor-pointer"
          onClick={() =>
            handleCardClick({
              type: 'boost',
              key: 'fullTank',
              title: 'Full Tank',
              description:
                'Instantly refill your energy to maximum. (Usage limit: 3 per day)',
            })
          }
        >
          <CardContent className="relative flex gap-2">
            <div className="flex gap-2 items-center"
              style={{
                opacity: fullTankInfo.cooldown > 0 || fullTankInfo.available <= 0 ?
                  0.075 :
                  1
              }}>
              <BatteryFull className="-rotate-90" size={32} />
              <div>
                <h1 className="text-md font-semibold line-clamp-1">Full Tank</h1>
                <span className="text-muted-foreground text-sm">{fullTankInfo.available}/{DAILY_BOOST_LIMIT}</span>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              {fullTankInfo.available > 0 && fullTankInfo.cooldown > 0 && (
                <span className="flex gap-1.5 font-semibold drop-shadow-md items-center">
                  <Hourglass size={20} /> {formatTime(fullTankInfo.cooldown)}
                </span>
              )}
              {fullTankInfo.available <= 0 && (
                <span className="flex gap-1.5 font-semibold drop-shadow-md items-center">
                  <Hourglass size={20} /> {formatTime(getResetCountdown())}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <h1 className="text-lg font-semibold mb-2">Upgrades:</h1>
      <div className="flex flex-col w-full gap-3">
        <Card
          className="flex-1 cursor-pointer"
          onClick={() =>
            handleCardClick({
              type: 'upgrade',
              key: 'pointsPerClick',
              title: 'Tap Power',
              description: 'Increase the number of pointss you earn per tap.',
            })
          }
        >
          <CardContent className="flex gap-2 items-center">
            <MousePointerClick size={32} />
            <div>
              <h1 className="text-md font-semibold">Tap Power</h1>
              <p className="text-sm text-muted-foreground">
                {gameStore.upgrades.pointsPerClick.cost} • Lvl. {gameStore.upgrades.pointsPerClick.level}
              </p>
            </div>
            <ChevronRight className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card
          className="flex-1 cursor-pointer"
          onClick={() =>
            handleCardClick({
              type: 'upgrade',
              key: 'maxEnergy',
              title: 'Energy Capacity',
              description: 'Increase your maximum energy capacity.',
            })
          }
        >
          <CardContent className="flex gap-2 items-center">
            <BatteryPlus className="-rotate-90" size={32} />
            <div>
              <h1 className="text-md font-semibold">Energy Capacity</h1>
              <p className="text-sm text-muted-foreground">
                {gameStore.upgrades.maxEnergy.cost} • Lvl. {gameStore.upgrades.maxEnergy.level}
              </p>
            </div>
            <ChevronRight className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card
          className="flex-1 cursor-pointer"
          onClick={() =>
            handleCardClick({
              type: 'upgrade',
              key: 'energyRegen',
              title: 'Energy Regen',
              description: 'Increase the rate at which your energy regenerates.',
            })
          }
        >
          <CardContent className="flex gap-2 items-center">
            <BatteryCharging className="-rotate-90" size={32} />
            <div>
              <h1 className="text-md font-semibold">Energy Regen</h1>
              <p className="text-sm text-muted-foreground">
                {gameStore.upgrades.energyRegen.cost} • Lvl. {gameStore.upgrades.energyRegen.level}
              </p>
            </div>
            <ChevronRight className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div style={{
        height: "calc(var(--tg-safe-area-inset-bottom) + 64px)"
      }} />
    </>
  );
}

export default Boosts;
