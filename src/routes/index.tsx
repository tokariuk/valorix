import Energy from '@/components/energy'
import { MiningArea } from '@/components/mining-area'
import Points from '@/components/points'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (<>
    <div className='flex flex-col items-center mx-auto mt-6'>
      <p className='text-muted-foreground'>Balance:</p>
      <span className="text-3xl font-bold"><Points /></span>
    </div>

    <div className='mx-auto my-auto mt-14'>
      <MiningArea />
    </div>

    <div className='mt-auto'>
      <Energy />
    </div>
  </>)
}
