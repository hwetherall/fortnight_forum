'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TranscriptFormData } from '@/types';
import { calculateCurrentFortnightId, formatFortnightDateRange } from '@/lib/utils';

interface TranscriptFormProps {
  onSuccess?: (content: string) => void;
  initialContent?: string;
}

export default function TranscriptForm({ onSuccess, initialContent = '' }: TranscriptFormProps) {
  const [formData, setFormData] = useState<TranscriptFormData>({
    title: 'A Chance Meeting',
    fortnight_id: '',
    content: initialContent
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fortnightLabel, setFortnightLabel] = useState<string>('');
  
  useEffect(() => {
    const currentFortnightId = calculateCurrentFortnightId();
    setFormData(prev => ({ ...prev, fortnight_id: currentFortnightId }));
    
    // Set readable date range for display
    const fortnightStartDate = new Date(currentFortnightId);
    setFortnightLabel(formatFortnightDateRange(fortnightStartDate));
  }, []);
  
  // Update the form content if initialContent changes
  useEffect(() => {
    if (initialContent) {
      setFormData(prev => ({ ...prev, content: initialContent }));
    }
  }, [initialContent]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: TranscriptFormData) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // For demo purposes, we'll skip the actual database submission
      // In a real implementation, this would submit to Supabase or another backend
      
      // Show success message
      setSuccess('Transcript uploaded successfully!');
      
      // Notify parent component with the transcript content
      if (onSuccess) {
        onSuccess(formData.content);
      }
    } catch (err) {
      console.error('Error submitting transcript:', err);
      setError('Failed to upload transcript. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Upload Meeting Transcript</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Transcript Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="All Hands Meeting"
          />
        </div>
        
        <div>
          <label htmlFor="fortnight_id" className="block text-sm font-medium mb-1">
            Fortnight Period
          </label>
          <div className="flex items-center space-x-2">
            <div className="py-2 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 w-full">
              {fortnightLabel || 'Loading...'}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This is the current fortnight period.
          </p>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Transcript Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the meeting transcript here..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Transcript'}
        </button>
      </form>
    </div>
  );
} 