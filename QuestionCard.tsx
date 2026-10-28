import React from 'react';
import { ShuffledQuestion } from '../types';
import { PhysicsIllustration } from './Illustrations';
import { Check, X, CheckCircle2, AlertCircle, Lightbulb, ArrowRight, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

interface QuestionCardProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedIndex: number | null;
  isAnswered: boolean;
  onSelectOption: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  studentNumber?: string;
  studentClass?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedIndex,
  isAnswered,
  onSelectOption,
  onNext,
  onPrev,
  canGoPrev = false,
  canGoNext = false,
  studentNumber,
  studentClass,
}) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'მარტივი' };
      case 'medium':
        return { label: 'საშუალო' };
      case 'hard':
        return { label: 'შედარებით რთული' };
      default:
        return { label: '' };
    }
  };

  const diffBadge = getDifficultyBadge(question.difficulty);
  const optionLetters = ['ა', 'ბ', 'გ', 'დ'];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-200 space-y-5 animate-fade-in">
      {/* Top Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-black tracking-wide shadow-xs">
            კითხვა {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-100 text-slate-700">
            {diffBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {studentNumber && (
            <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              № {studentNumber} ({studentClass || 'VIII-ა'})
            </span>
          )}
          <span className="font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
            თემა: {question.topic}
          </span>
        </div>
      </div>

      {/* Physics Illustration */}
      <PhysicsIllustration type={question.illustrationType} />

      {/* Question Header (Green) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-600 shadow-xs space-y-1">
        <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
          დავალება #{currentIndex + 1}
        </span>
        <h2 className="text-lg sm:text-xl font-black text-emerald-950 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* 4 Answer Options (A, B, C, D) with red for incorrect and green for correct upon marking */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs font-bold text-slate-500">
            {selectedIndex === null
              ? 'აირჩიე შენი პასუხი (მონიშნე ერთ-ერთი):'
              : 'შენი არჩევანი და სწორი პასუხი:'}
          </p>

          {isAnswered && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>პასუხი დაფიქსირებულია (შეცვლა შეუძლებელია)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((option, idx) => {
            const isUserSelected = selectedIndex === idx;
            const isCorrectOption = idx === question.correctIndex;

            let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-slate-300';
            let letterBg = 'bg-slate-100 text-slate-700 border-slate-300';
            let iconElement = null;

            if (selectedIndex !== null) {
              if (isCorrectOption) {
                // Correct answer is always GREEN upon marking
                btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 shadow-sm font-bold';
                letterBg = 'bg-emerald-600 text-white border-emerald-600';
                iconElement = (
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-600 bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                );
              } else if (isUserSelected) {
                // Student picked wrong answer: show in RED
                btnStyle = 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 shadow-sm font-bold';
                letterBg = 'bg-rose-600 text-white border-rose-600';
                iconElement = (
                  <div className="w-6 h-6 rounded-full border-2 border-rose-600 bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                );
              } else {
                // Other options: neutral and dimmed
                btnStyle = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60';
                letterBg = 'bg-slate-100 text-slate-400 border-slate-200';
                iconElement = (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white shrink-0" />
                );
              }
            } else {
              // Not yet marked: neutral empty radio
              iconElement = (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white shrink-0" />
              );
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered || selectedIndex !== null}
                onClick={() => onSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3 text-balance cursor-pointer disabled:cursor-default active:scale-[0.99] ${btnStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl font-black flex items-center justify-center shrink-0 border text-xs sm:text-sm ${letterBg}`}
                  >
                    {optionLetters[idx]}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedIndex !== null && isCorrectOption && (
                    <span className="hidden sm:inline-block text-[11px] font-black text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-md">
                      სწორია
                    </span>
                  )}
                  {selectedIndex !== null && isUserSelected && !isCorrectOption && (
                    <span className="hidden sm:inline-block text-[11px] font-black text-rose-700 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded-md">
                      შენი პასუხი
                    </span>
                  )}
                  {iconElement}
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate Formative Feedback Banner */}
        {selectedIndex !== null && (
          <div
            className={`p-4 rounded-2xl border-2 space-y-2.5 animate-fade-in ${
              selectedIndex === question.correctIndex
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950'
                : 'bg-rose-50/90 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm sm:text-base">
              {selectedIndex === question.correctIndex ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>ყოჩაღ, სწორია! 🎉 (+10 ქულა)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>არასწორია! სწორი პასუხი მონიშნულია მწვანედ 💡</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 bg-white/90 p-3 rounded-xl border border-slate-200/60">
              {selectedIndex === question.correctIndex
                ? question.explanation.correctText
                : question.explanation.mistakeText}
            </p>

            <div className="flex items-start gap-1.5 text-xs text-slate-600 pt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>მინიშნება ფიზიკოსს:</strong> {question.explanation.scienceHint}
              </span>
            </div>

            {/* Quick in-banner bidirectional navigation */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-black/5 mt-2">
              {canGoPrev && onPrev ? (
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-orange-200 hover:shadow-lg ring-2 ring-orange-400/40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>წინა შეკითხვა</span>
                </button>
              ) : <div />}

              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-violet-200 hover:shadow-lg ring-2 ring-violet-400/30"
                >
                  <span>{currentIndex === totalQuestions - 1 ? 'ტესტის დასრულება და შეფასება' : 'შემდეგი შეკითხვა'}</span>
                  {currentIndex === totalQuestions - 1 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
