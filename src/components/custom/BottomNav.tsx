'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Apple, Dumbbell, Moon, MessageCircle } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: Apple, label: 'Nutrição', path: '/nutrition' },
    { icon: Dumbbell, label: 'Treino', path: '/workout' },
    { icon: Moon, label: 'Sono', path: '/sleep' },
    { icon: MessageCircle, label: 'Coach', path: '/chat' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#FF6A3D]'
                    : 'text-gray-500 hover:text-[#FF6A3D]'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
