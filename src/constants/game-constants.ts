export const MAX_ENERGY = 1000;
export const POINTS_PER_TAP = 1;
export const ENERGY_REGEN_RATE = 1; // скільки одиниць енергії відновлюється за секунду
export const BOOST_DURATION = 10 * 1000; // тривалість бусту в мілісекундах (10 секунд)
export const BOOST_MULTIPLIER = 10;   // бонус за клік під час бусту
export const DAILY_BOOST_LIMIT = 3;     // максимальна кількість використань бусту на добу
export const BOOST_COOLDOWN = 5 * 60 * 1000; // час охолодження бусту (1 година)
export const BOOST_RESET_TIME = 0;

// Масив порогів для переходу на наступний ранг.
// Наприклад, якщо монети >= 100 – ранг 1, >= 500 – ранг 2 тощо.
export const RANK_THRESHOLDS = [0, 100, 500, 1000, 5000];

