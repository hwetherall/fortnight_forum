'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateCurrentFortnightId } from '@/lib/utils';
import { QuestionFormData, Tag } from '@/types';

const TAGS: Tag[] = [
  'Operations',
  'Compliance',
  'Technology',
  'General',
  'Fellows Program',
  'Company Success'
];

export default function QuestionForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: '',
    context: '',
    tag: 'General'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Calculate current fortnight ID
      const fortnight_id = calculateCurrentFortnightId();
      
      // Combine question_text and context if context is provided
      const finalQuestionText = formData.question_text;
      const context = formData.context || null;
      
      // Submit to Supabase
      const { error } = await supabase
        .from('questions')
        .insert({
          question_text: finalQuestionText,
          context: context,
          tag: formData.tag,
          fortnight_id
        });
      
      if (error) throw error;
      
      // Reset form
      setFormData({
        question_text: '',
        context: '',
        tag: 'General'
      });
      
      // Notify parent component
      onSuccess();
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to submit your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Submit a Question</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question_text" className="block text-sm font-medium mb-1">
            Question <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question_text"
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What would you like to ask?"
          />
        </div>
        
        <div>
          <label htmlFor="context" className="block text-sm font-medium mb-1">
            Further Context <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="context"
            name="context"
            value={formData.context}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional details that provide context for your question"
          />
        </div>
        
        <div>
          <label htmlFor="tag" className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            style={{ WebkitAppearance: 'menulist' }}
          >
            {TAGS.map((tag) => (
              <option key={tag} value={tag} className="bg-white text-gray-800">
                {tag}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}