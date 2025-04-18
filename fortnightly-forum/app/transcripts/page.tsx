'use client';

import { useState, useEffect } from 'react';
import TranscriptForm from '@/components/TranscriptForm';
import { Question } from '@/types';

export default function TranscriptsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [demoTranscript] = useState<string>(`## A Chance Meeting

**Sarah:** Hey Mike! I haven't seen you in ages. How have you been?

**Mike:** Sarah! Great to see you. I've been really good - busy, but good. Actually, I just got back from the park with Buddy, my Labrador Retriever.

**Sarah:** Oh, you got a dog? That's wonderful! How long have you had him?

**Mike:** Almost a year now. Best decision ever. Buddy's such a character - he's this big, goofy yellow Lab with endless energy.

**Sarah:** That's so nice. What do you two usually do together?

**Mike:** Well, Buddy absolutely loves swimming - I can barely keep him out of the water when we're near a lake or beach. He also goes crazy for fetch, especially with his favorite tennis ball. And believe it or not, he's really into hiking. We did a six-mile trail last weekend and he was still ready for more.

**Sarah:** Sounds like the perfect companion for your active lifestyle! Does he do any tricks?

**Mike:** He's got the basics down - sit, stay, paw. But his most impressive trick is how quickly he can destroy a new chew toy. Record time is about 7 minutes!

**Sarah:** Haha! That sounds about right for a Lab. They're such great dogs. Would love to meet Buddy sometime.

**Mike:** Definitely! I'm taking him to the dog park this Saturday if you want to join. Fair warning though - you might get slobbered on. Buddy's very affectionate.

**Sarah:** I'll risk it. See you Saturday!`);

  const [selectedTranscript, setSelectedTranscript] = useState<string>('');
  const [showTranscript, setShowTranscript] = useState(false);

  const [demoQuestions] = useState<Question[]>([
    {
      id: '1',
      created_at: new Date().toISOString(),
      question_text: 'What is the name of the dog?',
      tag: 'General',
      fortnight_id: '2023-03-01',
      answer: null,
      is_answered: false,
      votes: 5,
      ai_suggested_answer: null
    },
    {
      id: '2',
      created_at: new Date().toISOString(),
      question_text: 'What kind of dog is it?',
      tag: 'General',
      fortnight_id: '2023-03-01',
      answer: null,
      is_answered: false,
      votes: 3,
      ai_suggested_answer: null
    },
    {
      id: '3',
      created_at: new Date().toISOString(),
      question_text: 'What activities does the dog like doing?',
      tag: 'General',
      fortnight_id: '2023-03-01',
      answer: null,
      is_answered: false,
      votes: 4,
      ai_suggested_answer: null
    }
  ]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [typingProgress, setTypingProgress] = useState<Record<string, string>>({});

  const analysisSteps = [
    "Reading transcript...",
    "Extracting relevant information...",
    "Cross-referencing with questions...",
    "Generating answers...",
    "Finalizing responses..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing && analysisStep < analysisSteps.length - 1) {
      interval = setInterval(() => {
        setAnalysisStep(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing, analysisStep, analysisSteps.length]);

  const fullAnswers: Record<string, string> = {
    '1': "The dog's name is Buddy.",
    '2': "Buddy is a Labrador Retriever (specifically mentioned as a \"yellow Lab\").",
    '3': "Buddy likes swimming, playing fetch with tennis balls, hiking, and destroying chew toys."
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Typing effect for answers
    if (showAnswers && typingIndex !== null) {
      const currentQuestionId = demoQuestions[typingIndex]?.id;
      
      if (currentQuestionId) {
        const fullAnswer = fullAnswers[currentQuestionId];
        const currentProgress = typingProgress[currentQuestionId] || '';
        
        if (currentProgress.length < fullAnswer.length) {
          timeout = setTimeout(() => {
            setTypingProgress(prev => ({
              ...prev,
              [currentQuestionId]: fullAnswer.substring(0, currentProgress.length + 1)
            }));
          }, 30); // Speed of typing
        } else if (typingIndex < demoQuestions.length - 1) {
          // Move to next question
          timeout = setTimeout(() => {
            setTypingIndex(prev => prev !== null ? prev + 1 : prev);
          }, 300);
        }
      }
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showAnswers, typingIndex, typingProgress, demoQuestions, fullAnswers]);

  const handleFormSuccess = (transcriptContent: string) => {
    // Display the uploaded transcript
    setSelectedTranscript(transcriptContent);
    setShowTranscript(true);
    setRefreshTrigger((prev: number) => prev + 1);
  };

  const handleGenerateAnswers = () => {
    // Reset and start analysis
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setShowAnswers(false);
    setTypingProgress({});
    
    setTimeout(() => {
      // In a real implementation, this would call an AI service
      setAnswers(fullAnswers);
      setIsAnalyzing(false);
      setAnalysisStep(0);
      setShowAnswers(true);
      setTypingIndex(0); // Start typing from the first question
    }, 5000); // 5 second delay to simulate AI processing
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <TranscriptForm 
          onSuccess={handleFormSuccess}
          initialContent={demoTranscript}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-bold mb-4">Transcript Analysis</h2>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Unanswered Questions</h3>
          <ul className="list-disc pl-5 space-y-2">
            {demoQuestions.map((q) => (
              <li key={q.id} className="text-gray-700 dark:text-gray-300">
                {q.question_text}
              </li>
            ))}
          </ul>
        </div>
        
        {showTranscript ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Transcript</h3>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50 dark:bg-gray-700 max-h-96 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none">
                  {selectedTranscript.split('\n').map((line, index) => (
                    <div key={index} className={line.startsWith('#') ? 'font-bold text-lg' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleGenerateAnswers}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 flex items-center space-x-2 disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing Transcript...</span>
                  </>
                ) : (
                  <span>Answer Questions</span>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 dark:text-gray-400">
            <p className="mb-4 text-center">Upload a transcript to begin analysis</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="mt-6 border-t pt-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-medium">{analysisSteps[analysisStep]}</p>
              </div>
              
              <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(analysisStep + 1) / analysisSteps.length * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {showAnswers && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">AI-Generated Answers</h3>
            <div className="space-y-4">
              {demoQuestions.map((question, qIndex) => (
                <div key={question.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{question.question_text}</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 min-h-[1.5rem]">
                    {typingProgress[question.id] || ''}
                    {typingIndex === qIndex && typingProgress[question.id] !== fullAnswers[question.id] && (
                      <span className="inline-block w-1 h-4 bg-gray-800 dark:bg-gray-200 ml-0.5 animate-pulse"></span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 