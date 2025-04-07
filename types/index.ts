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
  transcript_id?: string | null;
  ai_suggested_answer?: string | null;
}

export interface QuestionFormData {
  question_text: string;
  context?: string;
  tag: Tag;
}

export interface Transcript {
  id: string;
  created_at: string;
  title: string;
  content: string;
  fortnight_id: string;
}

export interface TranscriptFormData {
  title: string;
  fortnight_id: string;
  content: string;
} 