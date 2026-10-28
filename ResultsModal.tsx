import React, { useState, useEffect } from 'react';
import { UserAnswerRecord, PerformanceLevel } from '../types';
import { getSummativeAssessment } from '../utils/evaluation';
import { RotateCcw, Award, CheckCircle2, XCircle, BookOpen, ChevronDown, ChevronUp, GraduationCap, Copy, Check, Printer, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  score: number;
  totalScore: number;
  answers: UserAnswerRecord[];
  onRestart: () => void;
  onOpenGuide: () => void;
  onOpenTeacherDashboard?: () => void;
  studentNumber: string;
  studentClass: string;
  performanceLevel: PerformanceLevel;
  teacherComment: string;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  score,
  totalScore,
  answers,
  onRestart,
  onOpenGuide,
  onOpenTeacherDashboard,
  studentNumber,
  studentClass,
  performanceLevel,
  teacherComment,
}) => {
  const [filter, setFilter] = useState<'all' | 'mistakes'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summative = getSummativeAssessment(score);

  // Trigger celebration confetti for high achievement (გაფართოებული / შემოქმედებითი დონე)
  useEffect(() => {
    if (performanceLevel === 'გაფართოებული / შემოქმედებითი') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }
  }, [performanceLevel]);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;

  const filteredAnswers = filter === 'mistakes' ? answers.filter(a => !a.isCorrect) : answers;

  const handleCopySummary = () => {
    const text = `=== მოსწავლის შეფასების ბარათი ===
მოსწავლე №${studentNumber} (${studentClass})
• განმსაზღვრელი შეფასება: ${summative.grade10} ქულა (10-დან), ქულა: ${score}/${totalScore} (${summative.gradeDescription})
• განმავითარებელი შეფასების დონე: ${performanceLevel}

მასწავლებლის განმავითარებელი კომენტარი:
${teacherComment}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getLevelStyle = () => {
    switch (performanceLevel) {
      case 'გაფართოებული / შემოქმედებითი':
        return {
          badge: '🌟 დონე: გაფართოებული / შემოქმედებითი',
          bg: 'bg-emerald-50 border-emerald-300',
          textColor: 'text-emerald-950',
          badgeColor: 'bg-emerald-600 text-white'
        };
      case 'დამოუკიდებელი':
        return {
          badge: '💡 დონე: დამოუკიდებელი',
          bg: 'bg-amber-50 border-amber-300',
          textColor: 'text-amber-950',
          badgeColor: 'bg-amber-600 text-white'
        };
      case 'საჭიროებს მხარდაჭერას':
        return {
          badge: '🤝 დონე: საჭიროებს მხარდაჭერას',
          bg: 'bg-rose-50 border-rose-300',
          textColor: 'text-rose-950',
          badgeColor: 'bg-rose-600 text-white'
        };
    }
  };

  const lvl = getLevelStyle();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Official Print Header (Only visible on print) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              ფიზიკის სასწავლო ტესტირების შეფასების ბარათი
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              თემა: „ენერგია და გარემო“ • VIII კლასი
            </p>
          </div>
          <div className="text-right text-xs font-bold text-slate-700">
            <div>ჟურნალის №: {studentNumber}</div>
            <div>კლასი: {studentClass}</div>
            <div>თარიღი: {new Date().toLocaleDateString('ka-GE')}</div>
          </div>
        </div>
      </div>

      {/* Score Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center space-y-5 print:shadow-none print:border-slate-400 print:p-4">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-emerald-100 to-teal-100 border border-emerald-200 shadow-inner print:hidden">
          <Award className="w-12 h-12 text-emerald-600" />
        </div>

        <div>
          <div className="inline-block px-3.5 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800 mb-2">
            ჟურნალის № {studentNumber} • კლასი: {studentClass}
          </div>
          <span className="text-xs font-black tracking-widest text-slate-400 block uppercase">
            ტესტირების შედეგები
          </span>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 mt-1">
            {score} <span className="text-2xl text-slate-400 font-bold">/ {totalScore}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            10-დან {correctCount} სწორი პასუხი ({Math.round((score / totalScore) * 100)}%)
          </p>
        </div>

        {/* ================= 1. განმსაზღვრელი შეფასება (SUMMATIVE ASSESSMENT) ================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 text-left space-y-2.5 print:bg-white print:border-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-600 text-white print:bg-slate-200 print:text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>განმსაზღვრელი შეფასება (ნიშანი)</span>
            </span>
            <span className="text-xs font-extrabold text-indigo-900 print:text-slate-900">
              ეროვნული 10-ბალიანი სისტემა
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">10-ბალიანი შეფასება</span>
              <span className="text-2xl font-black text-indigo-900">
                {summative.grade10} <span className="text-xs text-slate-400">/ 10</span>
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">მიღწევის ხარისხი</span>
              <span className="text-xs font-black text-slate-800 block mt-1">
                {summative.gradeDescription}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">სტატუსი</span>
              <span className="text-xs font-black text-emerald-800 block mt-1">
                {summative.status}
              </span>
            </div>
          </div>
        </div>

        {/* ================= 2. განმავითარებელი შეფასება (FORMATIVE ASSESSMENT) ================= */}
        <div className={`p-4 sm:p-5 rounded-2xl border-2 text-left space-y-3 ${lvl.bg} print:bg-white print:border-slate-400`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${lvl.badgeColor} print:bg-slate-200 print:text-slate-900`}>
              {lvl.badge}
            </span>
            <span className="text-[11px] font-bold text-slate-500 print:text-slate-700">
              განმავითარებელი შეფასება
            </span>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60 text-xs sm:text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-line print:bg-white print:border-slate-300">
            {teacherComment}
          </div>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>თავიდან დაწყება</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>ამობეჭდვა</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="შეფასების კოპირება"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'კოპირებულია!' : 'კოპირება'}</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>გზამკვლევი</span>
          </button>
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200 space-y-4 print:shadow-none print:border-slate-300 print:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 print:border-slate-300">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">ნამუშევრის დეტალური გარჩევა</h3>
            <p className="text-xs text-slate-500 font-medium">მოსწავლის პასუხები და სწორი ვარიანტები განმარტებებით</p>
          </div>

          {/* Filter Pills (Hidden on print) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold print:hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ყველა ({answers.length})
            </button>
            <button
              onClick={() => setFilter('mistakes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'mistakes' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              შეცდომები ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-3">
          {filteredAnswers.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              გილოცავ! შეცდომა არ გაქვს — ყველა დავალება უნაკლოდ შეასრულე! 🏆
            </div>
          ) : (
            filteredAnswers.map((item, idx) => {
              const isExpanded = expandedId === item.questionId;
              return (
                <div
                  key={item.questionId || idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition-all print:p-2.5 print:mb-2 print:border-slate-300 shadow-xs"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.questionId)}
                    className="cursor-pointer select-none space-y-2"
                  >
                    {/* ONLY THE QUESTION IS GREEN */}
                    <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-600 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                            დავალება #{idx + 1} • {item.topic}
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
                            {item.isCorrect ? 'სწორია (+10 ქულა)' : 'არასწორია (0 ქულა)'}
                          </span>
                        </div>
                        <h4 className="font-black text-emerald-950 text-sm leading-snug">{item.questionText}</h4>
                      </div>

                      <button className="text-emerald-700 hover:text-emerald-900 p-1 shrink-0 print:hidden mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Explanation (Always visible on print) - ANSWERS COMPLETELY NEUTRAL, NO GREEN! */}
                  <div className={`mt-3 pt-1 text-xs space-y-2 ${isExpanded ? 'block' : 'hidden print:block'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[10px] font-bold uppercase mb-0.5">მოსწავლის პასუხი:</span>
                        <span className={`font-bold ${item.isCorrect ? 'text-slate-900' : 'text-rose-600'}`}>
                          {item.selectedText}
                        </span>
                      </div>

                      {!item.isCorrect && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] font-bold uppercase mb-0.5">სწორი პასუხი:</span>
                          <span className="font-bold text-slate-900">{item.correctText}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-slate-700 leading-relaxed print:bg-white print:border-slate-300">
                      <span className="font-bold text-slate-900 block mb-0.5">განმარტება:</span>
                      {item.explanation}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Official Teacher Signature Area for Printout */}
      <div className="hidden print:flex items-center justify-between pt-8 text-xs font-bold text-slate-800 border-t border-slate-400 mt-6">
        <div>
          <span>მასწავლებლის ხელმოწერა: _________________________</span>
        </div>
        <div>
          <span>თარიღი: _________________________</span>
        </div>
      </div>
    </div>
  );
};
