export type UpgradeType = 'coinsPerTap' | 'energyRegen' | 'maxEnergy' | 'offlineFarm';

export type TaskType = 'link' | 'rank';
export type TaskState = 'pending' | 'inProgress' | 'ready' | 'completed';

export interface Upgrade {
  type: UpgradeType;
  level: number;
  cost: number;
}

export interface Boost {
  type: string; // Наприклад: 'coinBoost', 'energyRefill'
  dailyLimit: number;
  used: number;
}

export interface Task {
  id: string;
  type: TaskType;
  state: TaskState;
  reward: number;
  // Для завдань типу "rank" – мінімальний рівень, який потрібно досягти
  requiredRank?: number;
  // Поле для внутрішнього використання (наприклад, для відліку часу у завданнях типу "link")
  startTime?: number;
}
