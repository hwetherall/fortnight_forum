-- Add the context column to the existing questions table
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS context text NULL;

-- Add the votes column to the existing questions table
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS votes int DEFAULT 0 NOT NULL;

-- Add comments for the new columns
COMMENT ON COLUMN public.questions.context IS 'Optional additional context for the question.';
COMMENT ON COLUMN public.questions.votes IS 'Number of votes this question has received.';

-- Add a policy to allow anonymous updates (needed for voting)
CREATE POLICY IF NOT EXISTS "Allow anonymous updates" ON public.questions
  FOR UPDATE USING (true); 