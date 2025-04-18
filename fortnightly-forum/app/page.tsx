'use client';

import { useState, useEffect } from 'react';
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
  );
}
