import React from 'react';
import { ShuffledQuestion } from '../types';
import { CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: ShuffledQuestion;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  question,
  onNextQuestion,
  isLastQuestion,
}) => {
  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border-2 shadow-lg animate-fade-in space-y-4 ${
        isCorrect
          ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
          : 'bg-amber-50/90 border-amber-400 text-amber-950'
      }`}
    >
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertCircle className="w-6 h-6" />
          </div>
        )}

        <div>
          <h3 className="font-extrabold text-base sm:text-lg">
            {isCorrect ? 'ყოჩაღ, პასუხი სწორია! 🎉 (+10 ქულა)' : 'არ არის სწორი, მაგრამ არ იდარდო! 💡'}
          </h3>
          <p className="text-xs font-semibold opacity-80">
            {isCorrect ? 'შესანიშნავი ლოგიკა და ფიზიკური ცოდნა' : 'მოდი ერთად გავარჩიოთ, რატომ:'}
          </p>
        </div>
      </div>

      {/* Formative Explanation */}
      <div className="text-sm font-medium leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-black/5 space-y-2">
        <p className="text-slate-800">
          {isCorrect ? question.explanation.correctText : question.explanation.mistakeText}
        </p>

        {/* Science hint / tip */}
        <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 border-t border-slate-200/60 mt-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span><strong>მინიშნება ფიზიკოსს:</strong> {question.explanation.scienceHint}</span>
        </div>
      </div>

      {/* Next Question / Finish Button (Violet) */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onNextQuestion}
          className="px-7 py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-violet-200"
        >
          <span>{isLastQuestion ? 'შედეგების შეჯამება' : 'შემდეგი შეკითხვა'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
