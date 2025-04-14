// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createFileRoute } from '@tanstack/react-router'
import { BookUser, Check, Copy, HandCoins, Handshake, HeartHandshake, List, Send, UserPlus, Users } from 'lucide-react';

import QRCode from '@/assets/QRCode.jpg'
import { useState } from 'react';

export const Route = createFileRoute('/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  const [copied, setCopied] = useState(false);
  const textToCopy = "https://t.me/valorix_tgbot?start=r_78349209430";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1250); // Показати повідомлення на 2 сек
    } catch (err) {
      console.error('Не вдалося скопіювати: ', err);
    }
  };

  const handleShare = () => {
    const text = "Join Valorix and let`s earn together!";
    const message = encodeURIComponent(text);

    const tgShareLink = `https://t.me/share/url?url=${textToCopy}&text=${message}`;

    window.Telegram.WebApp.openTelegramLink(tgShareLink)
  };

  return (<>
    <div className="flex items-center gap-3 mb-4">
      <HeartHandshake size={38} strokeWidth={1.75} />
      <div className="flex flex-col">
        <h1 className='text-lg font-bold leading-tight'>Friends</h1>
        <p className='text-muted-foreground leading-tight text-xs'>Get more rewards by friends</p>
      </div>
    </div>


    <div className='flex space-x-3'>
      <Card className='flex-1 gap-1'>
        <CardHeader>
          <p className='text-xs text-muted-foreground'>Earn</p>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold'>10%</p>
        </CardContent>
        <CardFooter className='pt-1.5'>
          <p className='text-sm'><span className='text-primary'>of friendsʼ</span> farmed points</p>
        </CardFooter>
      </Card>

      <Card className='flex-1 gap-1'>
        <CardHeader>
          <p className='text-xs text-muted-foreground'>Earn</p>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold'>2.5%</p>
        </CardContent>
        <CardFooter className='pt-1.5'>
          <p className='text-sm'><span className='text-primary'>of their refsʼ</span> farmed points</p>
        </CardFooter>
      </Card>
    </div>

    <Separator />

    <div className='flex space-x-3'>
      <Card className='flex-1 gap-1'>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><Users size={18} strokeWidth={2.5} /> Total friends:</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold font-mono'>0</p>
        </CardContent>
      </Card>
      <Card className='flex-1 gap-1'>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><HandCoins size={18} strokeWidth={2.5} /> Total earned:</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold font-mono'>+0</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center"><List size={18} strokeWidth={2.5} /> Your friends:</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Name</TableHead>
              <TableHead className="text-right">Earned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>

            </TableRow>
          </TableBody>
        </Table>
        <div className="w-full h-64 flex flex-col items-center justify-center">
          <p className="text-center text-muted-foreground">No friends to display.</p>
        </div>
      </CardContent>
    </Card>

    <div className="flex flex-col w-full">
      <span className='h-2' />
      <span className='h-16' />
      <span className='h-[var(--tg-safe-area-inset-bottom)]' />
      <span className='h-[var(--tg-safe-area-inset-bottom)]' />
    </div>

    <div className='bg-background/25 backdrop-blur-md fixed flex justify-center p-2 w-full left-0' style={{
      bottom: "calc(var(--tg-safe-area-inset-bottom) + 64px)"
    }}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className='w-full max-w-md font-bold mx-auto' size={"lg"}>
            <UserPlus strokeWidth={3} /> Invite a friend
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Invite a friend
            </DrawerTitle>
            <DrawerDescription className='items-center'>
              <img src={QRCode} className='w-62 mx-auto rounded-md' />
            </DrawerDescription>
          </DrawerHeader>


          <DrawerFooter>
            <div className='flex gap-3'>
              <Button className='flex-1' onClick={handleShare}><Send /> Send invite</Button>
              <Button variant={"secondary"} onClick={handleCopy}>{copied ? <Check /> : <Copy />}</Button>
            </div>
            <DrawerClose>
              <Button variant="link" className='text-destructive'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>

    <div style={{
      height: "calc(var(--tg-safe-area-inset-bottom) + 24px)"
    }} />
  </>);
}
