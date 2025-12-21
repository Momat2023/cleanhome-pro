'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission } from '@/lib/notificationService';
import { TASKS, ZONES } from '@/lib/tasksData';

export default function Home() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏠 CleanHome Pro
          </h1>
          <p className="text-gray-600">
            Votre assistant ménage intelligent avec {TASKS.length} tâches
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Zones disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ZONES.map((zone) => (
              <div
                key={zone}
                className="bg-blue-100 rounded-lg p-4 text-center hover:bg-blue-200 transition cursor-pointer"
              >
                <p className="font-medium text-gray-800">{zone}</p>
                <p className="text-sm text-gray-600">
                  {TASKS.filter((t) => t.zone === zone).length} tâches
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          {!notificationEnabled ? (
            <button
              onClick={handleEnableNotifications}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🔔 Activer les rappels quotidiens
            </button>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Notifications activées ! Vous recevrez vos rappels à 20h.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
