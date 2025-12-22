export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  color: string;
  level: 'bronze' | 'argent' | 'or' | 'platine' | 'diamant';
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  reward: number;
  type: 'daily' | 'weekly' | 'monthly';
  expiresAt: string;
}

export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export const BADGES: Badge[] = [
  // Badges basés sur nombre de tâches
  { id: 'first-task', name: 'Premier Pas', description: 'Complétez votre première tâche', icon: '🌟', requirement: 1, color: '#cd7f32', level: 'bronze' },
  { id: 'task-10', name: 'Débutant Motivé', description: 'Complétez 10 tâches', icon: '⭐', requirement: 10, color: '#cd7f32', level: 'bronze' },
  { id: 'task-50', name: 'Travailleur Assidu', description: 'Complétez 50 tâches', icon: '🌟', requirement: 50, color: '#c0c0c0', level: 'argent' },
  { id: 'task-100', name: 'Centurion', description: 'Complétez 100 tâches', icon: '💫', requirement: 100, color: '#ffd700', level: 'or' },
  { id: 'task-250', name: 'Expert du Ménage', description: 'Complétez 250 tâches', icon: '✨', requirement: 250, color: '#e5e4e2', level: 'platine' },
  { id: 'task-500', name: 'Maître Absolu', description: 'Complétez 500 tâches', icon: '💎', requirement: 500, color: '#b9f2ff', level: 'diamant' },
  
  // Badges basés sur streak
  { id: 'streak-3', name: 'Régulier', description: '3 jours consécutifs', icon: '🔥', requirement: 3, color: '#cd7f32', level: 'bronze' },
  { id: 'streak-7', name: 'Hebdomadaire', description: '7 jours consécutifs', icon: '🔥', requirement: 7, color: '#c0c0c0', level: 'argent' },
  { id: 'streak-30', name: 'Mensuel', description: '30 jours consécutifs', icon: '🔥', requirement: 30, color: '#ffd700', level: 'or' },
  { id: 'streak-100', name: 'Centenaire', description: '100 jours consécutifs', icon: '🔥', requirement: 100, color: '#b9f2ff', level: 'diamant' },
  
  // Badges basés sur points
  { id: 'points-100', name: 'Grimpeur', description: 'Gagnez 100 points', icon: '📈', requirement: 100, color: '#cd7f32', level: 'bronze' },
  { id: 'points-500', name: 'Collectionneur', description: 'Gagnez 500 points', icon: '📈', requirement: 500, color: '#c0c0c0', level: 'argent' },
  { id: 'points-1000', name: 'Champion', description: 'Gagnez 1000 points', icon: '📈', requirement: 1000, color: '#ffd700', level: 'or' },
  { id: 'points-5000', name: 'Légende', description: 'Gagnez 5000 points', icon: '📈', requirement: 5000, color: '#e5e4e2', level: 'platine' },
  { id: 'points-10000', name: 'Dieu du Ménage', description: 'Gagnez 10000 points', icon: '👑', requirement: 10000, color: '#b9f2ff', level: 'diamant' },
  
  // Badges spéciaux
  { id: 'zone-master', name: 'Maître de Zone', description: 'Complétez toutes les tâches d\'une zone', icon: '🎯', requirement: 1, color: '#ffd700', level: 'or' },
  { id: 'early-bird', name: 'Lève-Tôt', description: 'Complétez une tâche avant 8h', icon: '🌅', requirement: 1, color: '#c0c0c0', level: 'argent' },
  { id: 'night-owl', name: 'Couche-Tard', description: 'Complétez une tâche après 22h', icon: '🦉', requirement: 1, color: '#c0c0c0', level: 'argent' },
  { id: 'speed-demon', name: 'Rapide comme l\'éclair', description: 'Complétez 5 tâches en 1 heure', icon: '⚡', requirement: 1, color: '#ffd700', level: 'or' },
];

export const LEVELS: Level[] = [
  { level: 1, name: 'Débutant', minPoints: 0, maxPoints: 99, icon: '🌱', color: '#22c55e' },
  { level: 2, name: 'Apprenti', minPoints: 100, maxPoints: 299, icon: '🌿', color: '#10b981' },
  { level: 3, name: 'Pratiquant', minPoints: 300, maxPoints: 599, icon: '🍀', color: '#14b8a6' },
  { level: 4, name: 'Expérimenté', minPoints: 600, maxPoints: 999, icon: '🌳', color: '#06b6d4' },
  { level: 5, name: 'Expert', minPoints: 1000, maxPoints: 1999, icon: '⭐', color: '#3b82f6' },
  { level: 6, name: 'Maître', minPoints: 2000, maxPoints: 3999, icon: '💫', color: '#6366f1' },
  { level: 7, name: 'Grand Maître', minPoints: 4000, maxPoints: 7999, icon: '✨', color: '#8b5cf6' },
  { level: 8, name: 'Champion', minPoints: 8000, maxPoints: 14999, icon: '🏆', color: '#a855f7' },
  { level: 9, name: 'Légende', minPoints: 15000, maxPoints: 29999, icon: '👑', color: '#d946ef' },
  { level: 10, name: 'Dieu du Ménage', minPoints: 30000, maxPoints: Infinity, icon: '💎', color: '#ec4899' },
];

export function generateWeeklyChallenges(currentWeek: string): Challenge[] {
  const challenges: Challenge[] = [
    {
      id: `${currentWeek}-complete-10`,
      name: 'Marathon de la Semaine',
      description: 'Complétez 10 tâches cette semaine',
      icon: '🏃',
      target: 10,
      reward: 50,
      type: 'weekly',
      expiresAt: getEndOfWeek()
    },
    {
      id: `${currentWeek}-complete-all-zones`,
      name: 'Tour Complet',
      description: 'Complétez au moins 1 tâche dans chaque zone',
      icon: '🗺️',
      target: 1,
      reward: 100,
      type: 'weekly',
      expiresAt: getEndOfWeek()
    },
    {
      id: `${currentWeek}-daily-streak`,
      name: 'Régularité Parfaite',
      description: 'Complétez au moins 1 tâche chaque jour (7/7)',
      icon: '📅',
      target: 7,
      reward: 150,
      type: 'weekly',
      expiresAt: getEndOfWeek()
    },
    {
      id: `${currentWeek}-points-500`,
      name: 'Chasseur de Points',
      description: 'Gagnez 500 points cette semaine',
      icon: '🎯',
      target: 500,
      reward: 75,
      type: 'weekly',
      expiresAt: getEndOfWeek()
    },
  ];
  
  return challenges;
}

function getEndOfWeek(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek.toISOString();
}

export function calculatePoints(taskTime: number = 10): number {
  // Base : 5 points par tâche + bonus selon durée
  return 5 + Math.floor(taskTime / 10);
}

export function getCurrentLevel(totalPoints: number): Level {
  return LEVELS.find(level => 
    totalPoints >= level.minPoints && totalPoints <= level.maxPoints
  ) || LEVELS[0];
}

export function getNextLevel(totalPoints: number): Level | null {
  const currentLevel = getCurrentLevel(totalPoints);
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
}

export function getProgressToNextLevel(totalPoints: number): number {
  const currentLevel = getCurrentLevel(totalPoints);
  const nextLevel = getNextLevel(totalPoints);
  
  if (!nextLevel) return 100;
  
  const currentLevelPoints = totalPoints - currentLevel.minPoints;
  const levelRange = currentLevel.maxPoints - currentLevel.minPoints + 1;
  
  return Math.floor((currentLevelPoints / levelRange) * 100);
}

export function checkBadgeUnlocked(badge: Badge, stats: {
  totalTasks: number;
  totalPoints: number;
  currentStreak: number;
}): boolean {
  if (badge.id.startsWith('task-') || badge.id === 'first-task') {
    return stats.totalTasks >= badge.requirement;
  }
  if (badge.id.startsWith('streak-')) {
    return stats.currentStreak >= badge.requirement;
  }
  if (badge.id.startsWith('points-')) {
    return stats.totalPoints >= badge.requirement;
  }
  return false;
}
