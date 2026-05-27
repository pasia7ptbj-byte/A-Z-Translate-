import { useState, useEffect, FormEvent } from 'react';
import { QuizItem, QuizState } from '../types';
import { PRACTICE_WORDS } from '../utils/translator';
import { Trophy, HelpCircle, RefreshCw, Zap, Flame, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PracticeHub() {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [quiz, setQuiz] = useState<QuizState>({
    score: 0,
    totalAnswered: 0,
    currentIndex: 0,
    isPlaying: false,
    userAnswer: '',
    feedback: 'neutral'
  });
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  // Initialize practice pool of questions (randomize simple preloads)
  const startNewSession = () => {
    const randomized = [...PRACTICE_WORDS].sort(() => 0.5 - Math.random());
    setQuestions(randomized);
    setQuiz({
      score: 0,
      totalAnswered: 0,
      currentIndex: 0,
      isPlaying: true,
      userAnswer: '',
      feedback: 'neutral'
    });
    setStreak(0);
    setShowHint(false);
  };

  const currentQuestion = questions[quiz.currentIndex];

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || quiz.feedback !== 'neutral') return;

    const trimmedAnswer = quiz.userAnswer.trim().toLowerCase();
    const correctTranslation = currentQuestion.translation.toLowerCase();

    if (trimmedAnswer === correctTranslation) {
      setQuiz((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalAnswered: prev.totalAnswered + 1,
        feedback: 'correct'
      }));
      setStreak((prev) => prev + 1);
    } else {
      setQuiz((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        feedback: 'incorrect'
      }));
      setStreak(0);
    }
  };

  const handleNextWord = () => {
    setShowHint(false);
    if (quiz.currentIndex + 1 >= questions.length) {
      // Over - trigger game wrap up but maintain state
      setQuiz((prev) => ({
        ...prev,
        isPlaying: false,
        feedback: 'neutral'
      }));
    } else {
      setQuiz((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        userAnswer: '',
        feedback: 'neutral'
      }));
    }
  };

  const skipQuestion = () => {
    setShowHint(false);
    setStreak(0);
    if (quiz.currentIndex + 1 >= questions.length) {
      setQuiz((prev) => ({
        ...prev,
        isPlaying: false,
        feedback: 'neutral'
      }));
    } else {
      setQuiz((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        userAnswer: '',
        feedback: 'neutral'
      }));
    }
  };

  return (
    <div id="practice-hub-component" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col justify-between h-[450px]">
      <div>
        <div id="practice-header" className="flex items-center justify-between mb-4">
          <div>
            <h2 id="practice-title" className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-100" />
              Practice Translator Quiz
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-light">
              Test your proficiency in translating from standard alphabet/numbers to the mirror format!
            </p>
          </div>

          {/* Quick Streak display */}
          {streak > 0 && (
            <div id="streak-indicator" className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-indigo-100" />
              <span>Streak: {streak}</span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!quiz.isPlaying ? (
            /* Intro state or completed state */
            <motion.div
              key="quiz-intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              id="quiz-welcome-screen"
              className="text-center py-10"
            >
              {quiz.totalAnswered > 0 ? (
                <div id="quiz-completion" className="space-y-4">
                  <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                    <Trophy className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Quiz Complete!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-light">
                      You translated <strong className="text-slate-800 font-semibold">{quiz.score}</strong> out of <strong className="text-slate-800 font-semibold">{quiz.totalAnswered}</strong> terms correctly.
                    </p>
                  </div>
                  <div className="text-xl font-bold text-indigo-650">
                    {Math.round((quiz.score / quiz.totalAnswered) * 100)}% Accuracy
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <span className="text-indigo-400 text-4xl block mb-2">🧠</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Memorize and master standard English letter inversion pairs offline. Interactive flashcards will prompt standard letters/numbers and test if you translate correctly!
                  </p>
                </div>
              )}

              <button
                id="btn-start-practice"
                onClick={startNewSession}
                className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider rounded-lg shadow-sm transition-all text-center flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {quiz.totalAnswered > 0 ? 'Retry Practice Hub' : 'Launch Translation Quiz'}
              </button>
            </motion.div>
          ) : (
            /* Interactive active word task states */
            <motion.div
              key={`question-${quiz.currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              id="active-quiz-frame"
              className="mt-4 space-y-4"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded uppercase tracking-wider">
                  Word {quiz.currentIndex + 1} of {questions.length} • {currentQuestion.category}
                </span>
                <span className="font-bold">Score: {quiz.score}/{quiz.totalAnswered}</span>
              </div>

              {/* Central Task block showing the standard text requiring translation */}
              <div className="p-5 bg-slate-50/50 rounded-xl text-center border border-slate-200 relative">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Translate Standard String
                </span>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                  {currentQuestion.word}
                </span>

                {showHint && (
                  <div className="text-[11px] text-indigo-750 font-normal mt-2 bg-indigo-50 p-2 rounded border border-indigo-150/40">
                    💡 Hint: {currentQuestion.hint}
                  </div>
                )}
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={quiz.feedback !== 'neutral'}
                    value={quiz.userAnswer}
                    onChange={(e) => setQuiz({ ...quiz, userAnswer: e.target.value })}
                    placeholder="Type the mirrored equivalent..."
                    className={`w-full p-3 pr-12 text-center text-base font-bold font-mono tracking-wider rounded-lg border focus:outline-none transition-all ${
                      quiz.feedback === 'correct' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                        : quiz.feedback === 'incorrect' 
                        ? 'bg-rose-50 border-rose-500 text-rose-800' 
                        : 'bg-white border-slate-200 focus:border-indigo-550 focus:bg-slate-50/10 text-slate-850'
                    }`}
                  />

                  {quiz.feedback === 'correct' && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  )}
                  {quiz.feedback === 'incorrect' && (
                    <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 w-5 h-5" />
                  )}
                </div>

                {/* Feedback explanations */}
                {quiz.feedback !== 'neutral' && (
                  <div className={`p-3 rounded-lg text-xs font-semibold border ${
                    quiz.feedback === 'correct'
                      ? 'bg-emerald-100/50 text-emerald-850 border-emerald-100'
                      : 'bg-rose-100/50 text-rose-850 border-rose-100'
                  }`}>
                    {quiz.feedback === 'correct' ? (
                      <span>🎉 Well done! Symmetric mirror reflection confirmed. Your streak continues!</span>
                    ) : (
                      <span>
                        ❌ Incorrect. The mirror translation for <strong>{currentQuestion.word}</strong> is actually{' '}
                        <strong className="underline text-rose-900 font-mono text-sm">{currentQuestion.translation}</strong>.
                      </span>
                    )}
                  </div>
                )}

                {/* Submits or next button controls */}
                <div className="flex gap-2">
                  {quiz.feedback === 'neutral' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                        className="px-4 py-2 border border-slate-200 text-slate-650 rounded-lg hover:bg-slate-50 text-[11px] font-bold flex items-center justify-center gap-1 flex-1 disabled:opacity-40 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Hint
                      </button>

                      <button
                        type="button"
                        onClick={skipQuestion}
                        className="px-4 py-2 border border-slate-200 text-slate-650 rounded-lg hover:bg-slate-50 text-[11px] font-bold flex-1 cursor-pointer"
                      >
                        Skip
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[11px] tracking-wider rounded-lg shadow-sm text-center flex-1 cursor-pointer"
                      >
                        Verify
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      id="next-quiz-term-btn"
                      onClick={handleNextWord}
                      className="w-full px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider rounded-lg shadow-sm text-center cursor-pointer"
                    >
                      {quiz.currentIndex + 1 >= questions.length ? 'Show Results' : 'Next Question ➜'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[11px] text-slate-400 mt-4 border-t border-slate-200 pt-3 font-light">
        Practice runs 100% locally on preloaded core vocabulary files.
      </div>
    </div>
  );
}
