'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import { calculateCurrentFortnightId } from '@/lib/utils';

export default function Home() {
  const [currentFortnightId, setCurrentFortnightId] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    setCurrentFortnightId(calculateCurrentFortnightId());
  }, []);

  const handleFormSuccess = () => {
    // Trigger a refresh of the question list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image 
              src="/images/logo.svg" 
              alt="Fortnightly Forum Logo" 
              width={200} 
              height={50} 
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fortnightly Forum</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit your anonymous questions for the All Hands meeting
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <QuestionForm onSuccess={handleFormSuccess} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {currentFortnightId ? (
              <QuestionList 
                fortnightId={currentFortnightId}
                refreshTrigger={refreshTrigger}
              />
            ) : (
              <div className="text-center py-8">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
