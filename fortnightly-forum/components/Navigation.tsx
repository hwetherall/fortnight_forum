'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Questions', href: '/' },
    { name: 'Transcripts', href: '/transcripts' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex -mb-px space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
                          (tab.href !== '/' && pathname?.startsWith(tab.href));
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${isActive 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-300'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 