'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { Question, Tag } from '@/types';

interface QuestionListProps {
  fortnightId: string;
  refreshTrigger?: number;
}

export default function QuestionList({ fortnightId, refreshTrigger = 0 }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<Record<string, boolean>>({});
  const [deleteInProgress, setDeleteInProgress] = useState<Record<string, boolean>>({});
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Fetch questions for the current fortnight
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        console.log('Fetching questions for fortnight:', fortnightId);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('fortnight_id', fortnightId)
          .order('votes', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('Fetched questions:', data?.length || 0);
        setQuestions(data || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [fortnightId, refreshTrigger, refreshCount]);
  
  // Manual refresh function
  const handleManualRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };
  
  // Helper function to get the tag color
  const getTagColor = (tag: Tag): string => {
    const colors: Record<Tag, string> = {
      'Operations': 'bg-blue-100 text-blue-800',
      'Compliance': 'bg-purple-100 text-purple-800',
      'Technology': 'bg-green-100 text-green-800',
      'General': 'bg-gray-100 text-gray-800',
      'Fellows Program': 'bg-yellow-100 text-yellow-800',
      'Company Success': 'bg-red-100 text-red-800'
    };
    
    return colors[tag];
  };

  // Handle vote
  const handleVote = async (questionId: string) => {
    if (votingInProgress[questionId]) return;

    setVotingInProgress(prev => ({ ...prev, [questionId]: true }));
    
    try {
      // Get current question
      const questionToUpdate = questions.find(q => q.id === questionId);
      if (!questionToUpdate) return;

      // Update vote count
      const { error } = await supabase
        .from('questions')
        .update({ votes: questionToUpdate.votes + 1 })
        .eq('id', questionId);
        
      if (error) throw error;
      
      // Update local state
      setQuestions(prevQuestions => 
        prevQuestions.map(q => q.id === questionId ? { ...q, votes: q.votes + 1 } : q)
          .sort((a, b) => b.votes - a.votes || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
    } catch (err) {
      console.error('Error voting for question:', err);
    } finally {
      setVotingInProgress(prev => ({ ...prev, [questionId]: false }));
    }
  };
  
  // Handle direct deletion without password
  const handleDelete = async (questionId: string) => {
    if (deleteInProgress[questionId]) return;
    
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    setDeleteInProgress(prev => ({ ...prev, [questionId]: true }));
    
    try {
      // Log the question ID we're trying to delete
      console.log('Attempting to delete question with ID:', questionId);
      
      // Delete the question
      const { data, error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId)
        .select();
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      console.log('Delete response:', data);
      
      // Remove the question from the local state
      setQuestions(prevQuestions => 
        prevQuestions.filter(q => q.id !== questionId)
      );
      
      // Refresh to ensure sync with database
      handleManualRefresh();
      
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question. Please try again.');
    } finally {
      setDeleteInProgress(prev => ({ ...prev, [questionId]: false }));
    }
  };
  
  if (loading) {
    return <div className="w-full text-center py-8">Loading questions...</div>;
  }
  
  if (error) {
    return (
      <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        No questions for this fortnight yet. Be the first to ask!
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Questions for {formatDate(fortnightId)}</h2>
        <button 
          onClick={handleManualRefresh}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTagColor(question.tag)}`}>
                  {question.tag}
                </span>
                <button 
                  onClick={() => handleVote(question.id)}
                  disabled={votingInProgress[question.id]}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>{question.votes}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(question.id)}
                  disabled={deleteInProgress[question.id]}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  {deleteInProgress[question.id] ? (
                    <span>Deleting...</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-gray-500">
                  {new Date(question.created_at).toLocaleString()}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-2">{question.question_text}</h3>
            
            {question.context && (
              <div className="mt-2 mb-3 pl-3 border-l-2 border-gray-200">
                <p className="text-sm text-gray-600">{question.context}</p>
              </div>
            )}
            
            {question.is_answered && question.answer && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium text-gray-700">Answer:</p>
                <p className="text-sm text-gray-600">{question.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}