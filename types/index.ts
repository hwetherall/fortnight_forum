export type Tag = 'Operations' | 'Compliance' | 'Technology' | 'General' | 'Fellows Program' | 'Company Success';

export interface Question {
  id: string;
  created_at: string;
  question_text: string;
  context?: string | null;
  tag: Tag;
  fortnight_id: string;
  answer: string | null;
  is_answered: boolean;
  votes: number;
}

export interface QuestionFormData {
  question_text: string;
  context?: string;
  tag: Tag;
} 