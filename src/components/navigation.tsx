// @ts-nocheck
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { CircleCheckBig, HeartHandshake, Home, PiggyBank, Rocket, WalletMinimal } from "lucide-react";
import { useEffect } from "react";

const navigationMenuItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Boosts", href: "/boosts", icon: Rocket },
  { title: "Earn", href: "/earn", icon: PiggyBank },
  { title: "Friends", href: "/friends", icon: HeartHandshake },
  { title: "Wallet", href: "/wallet", icon: WalletMinimal },
];

export default function NavigationMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = (path: string) => {
    if (location.pathname === path) {
      navigate({ to: path, replace: true });
    } else {
      navigate({ to: path, replace: true });
    }
    window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      window.Telegram.WebApp.BackButton.show();
    } else {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, [location]);

  useEffect(() => {
    window.Telegram.WebApp.BackButton.onClick(() => {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
      navigate({ to: "/" });
    });
  }, [navigate]);

  return (
    <nav className="fixed flex flex-col w-screen items-center justify-center bottom-0 left-0 bg-background/25 backdrop-blur-md z-40" style={{
      minHeight: "64px",
      height: "calc(var(--tg-safe-area-inset-bottom) + 64px)"
    }}>
      <ul className="flex justify-between px-4 py-2 w-full max-w-md">
        {navigationMenuItems.map((item) => (
          <li key={item.href} className="relative">
            <a
              onClick={() => {handleMenuClick(item.href)}}
              className={cn(
                "flex flex-col items-center w-11 gap-1 transition-all",
                location.pathname === item.href ? "opacity-100" : "opacity-75"
              )
              }>
              <item.icon size={28} className="transition-all" fill={location.pathname === item.href ? "var(--duotone)" : "#00000000"} strokeWidth={location.pathname === item.href ? 1.75 : 1.25} />
              <span
                className={cn(
                  "text-xs transition-all",
                  location.pathname === item.href ? "font-semibold" : "font-medium"
                )
                }>
                {item.title}
              </span>
            </a>
            {item.href === "/wallet" ? <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 size-2" /> : undefined}
            {item.href === "/wallet" ? <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary size-2 animate-ping" /> : undefined}
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--tg-safe-area-inset-bottom)" }} />
    </nav>
  );
}
