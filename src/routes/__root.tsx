import NavigationMenu from '@/components/navigation'
import { createRootRoute, Outlet } from '@tanstack/react-router'

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
  component: () => (
    <main className='flex flex-col p-3 gap-3 max-w-md mx-auto w-screen' style={{
      minHeight: "calc(var(--tg-viewport-stable-height) - 64px)",
      paddingTop:
        "calc(var(--tg-content-safe-area-inset-top) + var(--tg-safe-area-inset-top) + 0.75rem)",
      paddingBottom: "calc(var(--tg-safe-area-inset-bottom) + 64px + 0.75rem))",
    }}>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <NavigationMenu />
    </main>
  ),
})
