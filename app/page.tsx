'use client';

import { useEffect, useState } from 'react';
import { TASKS, ZONES } from '../lib/tasksData';

interface CompletedTask {
  taskId: number;
  completedAt: string;
  date: string;
}

function requestNotificationPermission() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      resolve(false);
      return;
    }
    if (Notification.permission === 'granted') {
      resolve(true);
      return;
    }
    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        resolve(permission === 'granted');
      });
    } else {
      resolve(false);
    }
  });
}

export default function Home() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState<CompletedTask[]>([]);

  // 1️⃣ PERSISTANCE LOCALSTORAGE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger tâches du jour
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`tasks-${today}`);
      if (saved) {
        setCompletedTasks(new Set(JSON.parse(saved)));
      }

      // Charger historique
      const savedHistory = localStorage.getItem('tasks-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // Charger mode sombre
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode === 'true') {
        setDarkMode(true);
      }

      // Charger notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        setNotificationEnabled(true);
      }
    }
  }, []);

  // Sauvegarder au changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`tasks-${today}`, JSON.stringify([...completedTasks]));
    }
  }, [completedTasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks-history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
  };

  const toggleTaskCompletion = (taskId: number) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
        // Retirer de l'historique
        setHistory(h => h.filter(item => !(item.taskId === taskId && item.date === today)));
      } else {
        newSet.add(taskId);
        // Ajouter à l'historique
        setHistory(h => [...h, { taskId, completedAt: now, date: today }]);
      }
      return newSet;
    });
  };

  // 2️⃣ STATISTIQUES
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getStatsForLast7Days = () => {
    const days = getLast7Days();
    return days.map(date => ({
      date,
      count: history.filter(h => h.date === date).length,
      label: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })
    }));
  };

  const stats7Days = getStatsForLast7Days();
  const maxCount = Math.max(...stats7Days.map(s => s.count), 1);
  const totalThisWeek = stats7Days.reduce((sum, s) => sum + s.count, 0);
  const streakDays = (() => {
    let streak = 0;
    const days = getLast7Days().reverse();
    for (const date of days) {
      if (history.some(h => h.date === date)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  let zoneTasks = selectedZone ? TASKS.filter(t => t.zone === selectedZone) : [];
  if (filterFrequency !== 'all') {
    zoneTasks = zoneTasks.filter(t => t.frequency === filterFrequency);
  }

  const frequencies = ['quotidienne', 'hebdomadaire', 'mensuelle', 'saisonnière', 'annuelle', 'trimestrielle'];

  // 3️⃣ THÈME
  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    gradientFrom: darkMode ? '#1e3a8a' : '#e3f2fd',
    gradientTo: darkMode ? '#3730a3' : '#bbdefb',
  };

  return (
    <main style={{ 
      padding: '2rem 1rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: theme.bg,
      transition: 'background 0.3s ease'
    }}>
      {/* HEADER */}
      <header style={{ textAlign: 'center', padding: '2rem 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              padding: '0.5rem 1rem',
              background: showStats ? '#3b82f6' : theme.cardBg,
              color: showStats ? 'white' : theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
            title="Statistiques"
          >
            📊
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '0.5rem 1rem',
              background: theme.cardBg,
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)', 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🏠 CleanHome Pro
        </h1>
        <p style={{ fontSize: '1.2rem', color: theme.textSecondary, marginBottom: '1rem' }}>
          Votre assistant ménage intelligent avec <strong>{TASKS.length} tâches</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.95rem', color: theme.textSecondary }}>
            ✅ {completedTasks.size} tâches aujourd'hui
          </p>
          <p style={{ fontSize: '0.95rem', color: theme.textSecondary }}>
            📅 {totalThisWeek} cette semaine
          </p>
          <p style={{ fontSize: '0.95rem', color: theme.textSecondary }}>
            🔥 {streakDays} jour{streakDays > 1 ? 's' : ''} de suite
          </p>
        </div>
      </header>

      {/* STATISTIQUES */}
      {showStats && (
        <div style={{ 
          background: theme.cardBg, 
          borderRadius: '16px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: theme.text, marginBottom: '1.5rem' }}>
            📊 Statistiques - 7 derniers jours
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', gap: '0.5rem', marginBottom: '2rem' }}>
            {stats7Days.map((stat, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '0.25rem'
                }}>
                  {stat.count}
                </div>
                <div style={{ 
                  width: '100%',
                  height: `${(stat.count / maxCount) * 150}px`,
                  background: stat.count > 0 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : theme.border,
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: '10px'
                }} />
                <div style={{ fontSize: '0.75rem', color: theme.textSecondary, textTransform: 'capitalize' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ background: theme.bg, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{totalThisWeek}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Total semaine</div>
            </div>
            <div style={{ background: theme.bg, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{completedTasks.size}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Aujourd'hui</div>
            </div>
            <div style={{ background: theme.bg, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{streakDays}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Jours de suite</div>
            </div>
            <div style={{ background: theme.bg, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{history.length}</div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>Total historique</div>
            </div>
          </div>
        </div>
      )}

      {!selectedZone ? (
        <>
          {/* ZONES */}
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '16px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: theme.text, marginBottom: '1.5rem' }}>
              📍 Zones disponibles ({ZONES.length} zones)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {ZONES.map((zone) => {
                const taskCount = TASKS.filter((t) => t.zone === zone).length;
                const completedCount = TASKS.filter((t) => t.zone === zone && completedTasks.has(t.id)).length;
                const percentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
                
                return (
                  <div 
                    key={zone} 
                    onClick={() => setSelectedZone(zone)}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                      padding: '1.5rem',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: `2px solid ${theme.border}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {percentage > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${percentage}%`,
                        background: '#4caf50',
                        transition: 'width 0.3s ease'
                      }} />
                    )}
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: theme.text }}>
                      {zone}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: theme.textSecondary, marginBottom: '0.5rem' }}>
                      {taskCount} tâches
                    </p>
                    {percentage > 0 && (
                      <p style={{ fontSize: '0.85rem', color: '#4caf50', fontWeight: '600' }}>
                        {percentage}% complété
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div style={{ background: theme.cardBg, borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: `1px solid ${theme.border}` }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: theme.text, marginBottom: '1.5rem' }}>
              🔔 Notifications Push
            </h2>
            {!notificationEnabled ? (
              <button 
                onClick={handleEnableNotifications}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🔔 Activer les rappels quotidiens à 20h
              </button>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)',
                border: '2px solid #4caf50',
                color: '#1b5e20',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <strong>✅ Notifications activées !</strong><br/>
                Vous recevrez vos rappels à 20h la veille de chaque tâche.
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ 
          background: theme.cardBg, 
          borderRadius: '16px', 
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <button 
            onClick={() => setSelectedZone(null)}
            style={{
              padding: '0.5rem 1.5rem',
              background: theme.bg,
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            ← Retour aux zones
          </button>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: theme.text, marginBottom: '1rem' }}>
              {selectedZone} - {zoneTasks.length} tâche{zoneTasks.length > 1 ? 's' : ''}
            </h2>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterFrequency('all')}
                style={{
                  padding: '0.5rem 1rem',
                  background: filterFrequency === 'all' ? '#3b82f6' : theme.bg,
                  color: filterFrequency === 'all' ? 'white' : theme.text,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Toutes
              </button>
              {frequencies.map(freq => (
                <button
                  key={freq}
                  onClick={() => setFilterFrequency(freq)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: filterFrequency === freq ? '#3b82f6' : theme.bg,
                    color: filterFrequency === freq ? 'white' : theme.text,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {zoneTasks.map((task) => {
              const isCompleted = completedTasks.has(task.id);
              return (
                <div 
                  key={task.id}
                  onClick={() => toggleTaskCompletion(task.id)}
                  style={{
                    background: isCompleted ? (darkMode ? '#1e3a1e' : '#e8f5e9') : theme.bg,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isCompleted ? '2px solid #4caf50' : `2px solid ${theme.border}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isCompleted ? '2px solid #4caf50' : `2px solid ${theme.border}`,
                      background: isCompleted ? '#4caf50' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isCompleted && <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: isCompleted ? '#4caf50' : theme.text,
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        marginBottom: '0.5rem'
                      }}>
                        {task.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: darkMode ? '#1e3a8a' : '#e3f2fd',
                          color: darkMode ? '#93c5fd' : '#1565c0',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          📅 {task.frequency}
                        </span>
                        {task.estimatedTime && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: darkMode ? '#7c2d12' : '#fff3e0',
                            color: darkMode ? '#fdba74' : '#e65100',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            ⏱ {task.estimatedTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
