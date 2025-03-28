// @ts-nocheck
import { TonIcon } from '@/components/icons';
import RotatingText from '@/components/rotating-text';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<>
    <div className='flex flex-col gap-10' style={{
    }}>
      <div className="flex flex-col items-center justify-center text-3xl mt-[25vh]">
        <span className="font-bold">Your</span>
        <RotatingText
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          initial={{ y: "100%" }}
          mainClassName="text-primary font-bold overflow-hidden justify-center items-center"
          rotationInterval={2500}
          splitLevelClassName="overflow-hidden"
          staggerDuration={0.025}
          staggerFrom={"last"}
          texts={[
            "protected",
            "anonymous",
            "innovative",
            "convenient",
            "accessible",
            "powerful",
            "versatile",
          ]}
          transition={{ type: "keyframes", damping: 30, stiffness: 400 }}
        />
        <span className="font-bold">crypto wallet</span>
        <Button
          className="font-semibold mx-auto mt-10"
          onClick={window.openButton}
          size={"lg"}
        >
          <TonIcon className='size-5'/>
          Connect Wallet
        </Button>
      </div>
    </div>
  </>);
}
