// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MAX_ENERGY,
  ENERGY_REGEN_RATE,
  BOOST_DURATION,
  BOOST_MULTIPLIER,
  DAILY_BOOST_LIMIT,
  BOOST_COOLDOWN,
  RANK_THRESHOLDS,
  BOOST_RESET_TIME,
} from '@/constants/game-constants';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface Boost {
  dailyCount: number;
  lastActivationTime: number;
  active?: boolean; // потрібен тільки для Tapping Guru (бо має тривалість)
  boostEndTime?: number;
}

interface Upgrade {
  level: number;
  cost: number;
  effect: number; // базовий приріст ефекту (наприклад, +1 монета за клік або +10 до maxEnergy)
}

type UpgradeType = 'pointsPerClick' | 'maxEnergy' | 'energyRegen';


type TaskVisual =
  | { type: 'image'; src: string }
  | { type: 'iconify'; iconName: string };


interface Task {
  id: string;
  type: 'link' | 'rank';
  link?: string;
  title: string;
  description?: string;
  category: "special" | "friends" | "ranks";
  visual: TaskVisual;
  target?: number; // для завдання "дійти до певного рангу" – бажаний ранг
  status: 'pending' | 'loading' | 'claimable' | 'completed';
  reward: number;
}

interface GameState {
  points: number;
  energy: number;
  maxEnergy: number;
  rank: number;
  upgrades: Record<UpgradeType, Upgrade>;
  tasks: Task[];
  tappingGuruBoost: Boost;
  fullTankBoost: Boost;
  lastUpdate: number; // timestamp для офлайн-регенерації
  lastBoostResetTime: number;
  // Дії
  resetBoosts: () => void;
  setLastBoostResetTime: (time: number) => void;
  click: () => boolean;
  regenerateEnergy: () => void;
  activateTappingGuru: () => void;
  activateFullTank: () => void;
  addPoints: (amount: number) => void;
  spendEnergy: (amount: number) => void;
  updateRank: () => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  claimTask: (taskId: string) => void;
  upgrade: (type: UpgradeType) => void;
  getBoostResetTime: () => number;
  checkBoostReset: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 0,
      energy: MAX_ENERGY,
      maxEnergy: MAX_ENERGY,
      rank: 0,
      upgrades: {
        pointsPerClick: { level: 1, cost: 100, effect: 1 },
        maxEnergy: { level: 1, cost: 200, effect: 20 },
        energyRegen: { level: 1, cost: 150, effect: 1 },
      },
      tasks: [],
      tappingGuruBoost: {
        dailyCount: 0,
        lastActivationTime: 0,
        active: false,
        boostEndTime: 0,
      },
      fullTankBoost: {
        dailyCount: 0,
        lastActivationTime: 0,
      },
      lastUpdate: Date.now(),
      lastBoostResetTime: Date.now(),

      // Обробка кліку. Якщо Tapping Guru активний – енергія не списується, а монети множаться.
      click: () => {
        get().regenerateEnergy();
        let pointsEarn =
          get().upgrades.pointsPerClick.effect * get().upgrades.pointsPerClick.level;
        const energyCost = pointsEarn;
        if (!get().tappingGuruBoost.active && get().energy < energyCost) {
          console.warn('Недостатньо енергії');
          return false;
        }
        if (!get().tappingGuruBoost.active) {
          set((state) => ({ energy: state.energy - energyCost }));
        }
        if (get().tappingGuruBoost.active) {
          pointsEarn *= BOOST_MULTIPLIER;
        }
        set((state) => ({ points: state.points + pointsEarn }));
        get().updateRank();
        return true;
      },

      resetBoosts: () => {
        set({
          tappingGuruBoost: { dailyCount: 0, lastActivationTime: 0 },
          fullTankBoost: { dailyCount: 0, lastActivationTime: 0 },
          lastBoostResetTime: Date.now(),
        });
      },

      setLastBoostResetTime: (time) => {
        set({ lastBoostResetTime: time });
      },

      // Регенерація енергії з урахуванням поточної maxEnergy
      regenerateEnergy: () => {
        const now = Date.now();
        const elapsed = now - get().lastUpdate;
        const regenRate =
          ENERGY_REGEN_RATE +
          get().upgrades.energyRegen.effect * (get().upgrades.energyRegen.level - 1);
        const regenAmount = Math.floor(elapsed / 1000) * regenRate;
        if (regenAmount > 0) {
          set((state) => ({
            energy: Math.min(state.energy + regenAmount, state.maxEnergy),
            lastUpdate: now,
          }));
        }
      },

      checkBoostReset: () => {
        const now = Date.now();
        const resetTime = get().getBoostResetTime();

        if (now >= resetTime) {
          set((state) => ({
            tappingGuruBoost: { ...state.tappingGuruBoost, dailyCount: 0 },
            fullTankBoost: { ...state.fullTankBoost, dailyCount: 0 },
          }));
        }
      },

      // Отримання часу до скидання спроб буста
      getBoostResetTime: () => {
        const now = new Date();
        const reset = new Date(now);
        reset.setUTCHours(BOOST_RESET_TIME, 0, 0, 0); // Наприклад, 00:00 UTC
        if (now.getTime() > reset.getTime()) {
          reset.setUTCDate(reset.getUTCDate() + 1); // Наступний день
        }
        return reset.getTime();
      },

      // Активує Tapping Guru: перевірка ліміту та охолодження, встановлення активності бусту
      activateTappingGuru: () => {
        get().checkBoostReset();
        const now = Date.now();
        const boost = get().tappingGuruBoost;

        if (boost.dailyCount >= DAILY_BOOST_LIMIT) return;
        if (now - boost.lastActivationTime < BOOST_COOLDOWN) return;

        set((state) => ({
          tappingGuruBoost: {
            dailyCount: state.tappingGuruBoost.dailyCount + 1,
            lastActivationTime: now,
            active: true,
            boostEndTime: now + BOOST_DURATION,
          },
        }));

        setTimeout(() => {
          set((state) => ({
            tappingGuruBoost: { ...state.tappingGuruBoost, active: false },
          }));
        }, BOOST_DURATION);
      },

      // Активує Full Tank: перевірка ліміту та охолодження, миттєве відновлення енергії
      activateFullTank: () => {
        get().checkBoostReset();
        const now = Date.now();
        const boost = get().fullTankBoost;

        if (boost.dailyCount >= DAILY_BOOST_LIMIT) return;
        if (now - boost.lastActivationTime < BOOST_COOLDOWN) return;

        set((state) => ({
          energy: state.maxEnergy,
          fullTankBoost: {
            dailyCount: state.fullTankBoost.dailyCount + 1,
            lastActivationTime: now,
          },
        }));
      },

      addPoints: (amount: number) => {
        set((state) => ({ points: state.points + amount }));
        get().updateRank();
      },

      spendEnergy: (amount: number) => {
        set((state) => ({
          energy: Math.max(state.energy - amount, 0),
        }));
      },

      updateRank: () => {
        const points = get().points;
        let newRank = get().rank;
        for (let i = get().rank + 1; i < RANK_THRESHOLDS.length; i++) {
          if (points >= RANK_THRESHOLDS[i]) {
            newRank = i;
          }
        }
        if (newRank > get().rank) {
          set({ rank: newRank });
        }
      },

      addTask: (task: Task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      updateTaskStatus: (taskId: string, status: Task['status']) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
          ),
        }));
      },

      claimTask: (taskId: string) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || task.status !== 'claimable') {
          console.warn('Завдання недоступне для зарахування');
          return;
        }
        set((state) => ({ points: state.points + task.reward }));
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'completed' } : t
          ),
        }));
        get().updateRank();
        toast.success("You`ve successfully completed the task")
      },

      upgrade: (type: UpgradeType) => {
        const upgrade = get().upgrades[type];
        if (get().points < upgrade.cost) {
          console.warn('Недостатньо монет для прокачки', type);
          return;
        }
        set((state) => {
          const newUpgrade = {
            level: upgrade.level + 1,
            cost: Math.floor(upgrade.cost * 1.1),
            effect: upgrade.effect,
          };
          let newMaxEnergy = state.maxEnergy;
          if (type === 'maxEnergy') {
            newMaxEnergy = state.maxEnergy + upgrade.effect;
          }
          return {
            points: state.points - upgrade.cost,
            upgrades: {
              ...state.upgrades,
              [type]: newUpgrade,
            },
            maxEnergy: newMaxEnergy,
          };
        });
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        points: state.points,
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        rank: state.rank,
        upgrades: state.upgrades,
        tasks: state.tasks,
        tappingGuruBoost: state.tappingGuruBoost,
        fullTankBoost: state.fullTankBoost,
        lastUpdate: state.lastUpdate,
        lastBoostResetTime: state.lastBoostResetTime
      }),
    }
  )
);
