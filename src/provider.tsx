import { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster as ToastProvider } from "@/components/ui/sonner"
import { useGameStore } from "./store/game-store";

export function Provider({ children }: { children: React.ReactNode }) {
  const { regenerateEnergy } = useGameStore()
  useEffect(() => {
    // Виклик regenerateEnergy кожну секунду
    const interval = setInterval(() => {
      regenerateEnergy();
    }, 500);

    return () => clearInterval(interval);
  }, [regenerateEnergy]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider richColors visibleToasts={1} position="top-right" offset={128} mobileOffset={{top: "calc(var(--tg-safe-area-inset-top) + var(--tg-content-safe-area-inset-top) + 0.75rem)"}} swipeDirections={["top", "left", "right"]} />
      {children}
    </ThemeProvider>
  );
}
