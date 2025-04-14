// @ts-nocheck
import { useEffect } from 'react';
import Points from '@/components/points';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Check, Loader, PiggyBank } from 'lucide-react';
import { Icon } from "@iconify/react";
import { useGameStore } from '@/store/game-store';

export const Route = createFileRoute('/earn')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate()
  const tasks = useGameStore((state) => state.tasks);
  const updateTaskStatus = useGameStore((state) => state.updateTaskStatus);
  const claimTask = useGameStore((state) => state.claimTask);
  const addTask = useGameStore((state) => state.addTask);

  useEffect(() => {
    if (tasks.length === 0) {
      addTask({
        id: '1',
        type: 'link',
        link: '/wallet',
        title: 'Connect your wallet',
        category: "special",
        visual: { type: "iconify", iconName: "simple-icons:ton" },
        status: 'pending',
        reward: 15000,
      });
      addTask({
        id: '2',
        type: 'link',
        link: 'https://t.me/valorix_news',
        title: 'Join the community',
        category: "special",
        visual: { type: "iconify", iconName: "simple-icons:telegram" },
        status: 'pending',
        reward: 5000,
      });
      addTask({
        id: '3',
        type: 'link',
        link: 'https://t.me/blum/app?startapp=ref_PCSLlqjcHu',
        title: 'Launch Blum',
        category: "special",
        visual: { type: "image", src: "https://s2.coinmarketcap.com/static/img/coins/200x200/33154.png" },
        status: 'pending',
        reward: 10000,
      });
      addTask({
        id: '4',
        type: 'link',
        link: 'https://t.me/tapswap_mirror_bot?start=r_6130589912',
        title: 'Launch TapSwap',
        category: "special",
        visual: { type: "image", src: "https://minitelegram.com/wp-content/uploads/2024/11/tapswap-logo.webp" },
        status: 'pending',
        reward: 10000,
      });
      addTask({
        id: '5',
        type: 'link',
        link: 'https://t.me/OKX_official_bot/OKX_Racer?startapp=linkCode_103789641',
        title: 'Launch OKX Racer',
        category: "special",
        visual: { type: "image", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAgO2wJUYUmF3nb6cj6k1Y_C6xkrqBQCApQg&s" },
        status: 'pending',
        reward: 10000,
      });
      addTask({
        id: '6',
        type: 'link',
        link: 'https://t.me/dotcoin_bot?start=r_6130589912',
        title: 'Launch Dotcoin',
        category: "special",
        visual: { type: "image", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYMeh5iHtrfGV0vLXrTHw1D_TTxDjywZkwpw&s" },
        status: 'pending',
        reward: 10000,
      });
      addTask({
        id: '7',
        type: 'link',
        link: 'https://t.me/Binance_Moonbix_bot/start?startApp=ref_6130589912&startapp=ref_6130589912&utm_medium=web_share_copy',
        title: 'Launch Binance Moonbix',
        category: "special",
        visual: { type: "image", src: "https://i0.wp.com/airdropalert.com/wp-content/uploads/2024/09/Binance-Moonbix.jpg?w=1080&quality=50&ssl=1" },
        status: 'pending',
        reward: 10000,
      });

      addTask({
        id: 'i1',
        type: 'link',
        link: '/friends',
        title: 'Invite 1 friend',
        category: "friends",
        visual: { type: "iconify", iconName: "mdi:user-plus" },
        status: 'pending',
        reward: 1000,
      });
      addTask({
        id: 'i25',
        type: 'link',
        link: '/friends',
        title: 'Invite 25 friends',
        category: "friends",
        visual: { type: "iconify", iconName: "mdi:users-plus" },
        status: 'pending',
        reward: 30000,
      });
      addTask({
        id: 'i50',
        type: 'link',
        link: '/friends',
        title: 'Invite 50 friends',
        category: "friends",
        visual: { type: "iconify", iconName: "mdi:users-plus" },
        status: 'pending',
        reward: 75000,
      });
      addTask({
        id: 'i100',
        type: 'link',
        link: '/friends',
        title: 'Invite 100 friends',
        category: "friends",
        visual: { type: "iconify", iconName: "mdi:users-plus" },
        status: 'pending',
        reward: 200000,
      });
    }
  }, [tasks, addTask]);

  const handleStart = (taskId: string, taskType: 'link' | 'rank', taskLink?: string) => {
    if (taskLink?.startsWith("/")) {
      navigate({ to: taskLink })
      return;
    }
    if (taskLink?.startsWith("https://t.me")) {
      window.Telegram.WebApp.openTelegramLink(taskLink)
    }
    if (taskLink) {
      window.Telegram.WebApp.openLink(taskLink)
    }
    updateTaskStatus(taskId, 'loading');

    setTimeout(() => {
      updateTaskStatus(taskId, 'claimable');
    }, 7500);
  };

  const handleClaim = (taskId: string) => {
    claimTask(taskId);
  };

  const renderTasks = (category: string) => {
    return tasks
      .filter(task => task.category === category)
      .sort((a, b) => (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0))
      .map(task => (
        <div key={task.id}>
          <div className="flex items-center justify-between h-14" style={{ opacity: task.status === "completed" ? 0.5 : 1 }}>
            <div className="flex items-center space-x-3">
              {task.visual.type === "iconify" ?
                <Icon icon={task.visual.iconName} className='size-8' /> :
                <img src={task.visual.src} alt="task" className="size-8 rounded-2xl" />
              }
              <div>
                <h1 className="font-semibold leading-tight">{task.title}</h1>
                <p className="text-muted-foreground leading-tight">+{task.reward}</p>
              </div>
            </div>
            {task.status === 'pending' && (
              <Button size="sm" className="font-semibold" onClick={() => handleStart(task.id, task.type, task.link)}>
                Start
              </Button>
            )}
            {task.status === 'loading' && (
              <Button size="sm" className="font-semibold" disabled>
                <Loader className="animate-spin" />
              </Button>
            )}
            {task.status === 'claimable' && (
              <Button size="sm" className="font-semibold" onClick={() => handleClaim(task.id)}>
                Claim
              </Button>
            )}
            {task.status === 'completed' && <Check size={24} />}
          </div>
          <Separator />
        </div>
      ));
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <PiggyBank size={38} strokeWidth={1.75} />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-tight">Earn</h1>
          <p className="text-muted-foreground leading-tight text-xs">
            Get more points by completing tasks
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


      <Tabs defaultValue="special" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="special">Special</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="ranks">Ranks</TabsTrigger>
        </TabsList>
        <TabsContent value="special">{renderTasks("special")}</TabsContent>
        <TabsContent value="friends">{renderTasks("friends")}</TabsContent>
        <TabsContent value="ranks">
          <div className='flex w-full items-center mt-10'>
            <span className='text-muted-foreground mx-auto'>Coming soon...</span>
          </div>
        </TabsContent>

      </Tabs>

      <div style={{
        height: "calc(var(--tg-safe-area-inset-bottom) + 64px)"
      }} />
    </>
  );
}

export default RouteComponent;
