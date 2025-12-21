export interface ScheduledTask {
  taskId: number;
  taskName: string;
  date: string;
  frequency: string;
  zone: string;
  estimatedTime?: number;
}

export function getScheduledTasksForMonth(year: number, month: number, allTasks: any[]): ScheduledTask[] {
  const scheduled: ScheduledTask[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    allTasks.forEach(task => {
      if (shouldTaskBeScheduled(task, date)) {
        scheduled.push({
          taskId: task.id,
          taskName: task.name,
          date: dateStr,
          frequency: task.frequency,
          zone: task.zone,
          estimatedTime: task.estimatedTime
        });
      }
    });
  }
  
  return scheduled;
}

function shouldTaskBeScheduled(task: any, date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi
  const dayOfMonth = date.getDate();
  
  switch (task.frequency) {
    case 'quotidienne':
      return true;
    
    case 'hebdomadaire':
      // Tous les lundis
      return dayOfWeek === 1;
    
    case 'mensuelle':
      // Le 1er de chaque mois
      return dayOfMonth === 1;
    
    case 'trimestrielle':
      // 1er janvier, avril, juillet, octobre
      return dayOfMonth === 1 && [0, 3, 6, 9].includes(date.getMonth());
    
    case 'saisonnière':
      // 1er mars, juin, septembre, décembre
      return dayOfMonth === 1 && [2, 5, 8, 11].includes(date.getMonth());
    
    case 'annuelle':
      // 1er janvier
      return dayOfMonth === 1 && date.getMonth() === 0;
    
    default:
      return false;
  }
}

export function getTasksForDate(date: string, scheduledTasks: ScheduledTask[]): ScheduledTask[] {
  return scheduledTasks.filter(t => t.date === date);
}

export function getTasksForWeek(weekStart: Date, scheduledTasks: ScheduledTask[]): ScheduledTask[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return scheduledTasks.filter(t => {
    const taskDate = new Date(t.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
}
