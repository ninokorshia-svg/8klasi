import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, CheckCircle, Leaf, Zap, Globe, Hash, GraduationCap, Share2, Copy, Check, Send, ShieldCheck } from 'lucide-react';

interface StartScreenProps {
  onStartGame: (studentNumber: string, studentClass: string) => void;
  onOpenGuide: () => void;
  onOpenTeacherDashboard: () => void;
  submissionCount: number;
  activeRole?: 'student' | 'teacher';
  onSelectRole?: (role: 'student' | 'teacher') => void;
  initialClass?: string;
  onOpenShareModal?: () => void;
  hideTeacherBlock?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ 
  onStartGame, 
  onOpenGuide, 
  onOpenTeacherDashboard,
  submissionCount,
  activeRole = 'student',
  onSelectRole,
  initialClass = 'VIII-ა',
  onOpenShareModal,
  hideTeacherBlock = false,
}) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [studentClass, setStudentClass] = useState(initialClass);
  const [isSent, setIsSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const studentShareUrl = `${baseUrl}?mode=student&class=${encodeURIComponent(studentClass.trim() || 'VIII-ა')}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(studentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = studentNumber.replace(/[^0-9]/g, '') || '1';
    setIsSent(true);
    onStartGame(cleanNumber, studentClass.trim() || 'VIII-ა');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white p-7 sm:p-9 shadow-xl border border-emerald-500/30">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ფიზიკა • მე-8 კლასი • ენერგია და ეკოლოგია</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            ენერგია ჩვენს გარშემო ⚡
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            ინტერაქტიული სასწავლო ქვიზი: შეამოწმე ცოდნა ენერგიის ფორმებზე, განახლებად რესურსებსა და ეკოლოგიაზე.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenGuide}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>სასწავლო გზამკვლევი</span>
            </button>

            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-4 py-2 bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-100 rounded-xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-400/30"
                title="ტესტის ლინკის გაგზავნა კლასის ჩატში"
              >
                <Share2 className="w-4 h-4 text-cyan-300" />
                <span>ტესტის გაგზავნა ჩატში</span>
              </button>
            )}

            {!hideTeacherBlock && activeRole === 'teacher' && (
              <button
                onClick={onOpenTeacherDashboard}
                className="px-4 py-2 bg-blue-500/25 hover:bg-blue-500/35 text-blue-200 rounded-xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
                title="მასწავლებლის გვერდი (პირდაპირი წვდომა)"
              >
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span>მასწავლებელი {submissionCount > 0 && `(${submissionCount})`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* No Registration Direct Access Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-emerald-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <CheckCircle className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>🔓 გახსნა რეგისტრაციის გარეშე — მარტივად და პირდაპირ</span>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black uppercase">
                უფასო & ღია
              </span>
            </h3>
            <p className="text-xs text-emerald-100 font-medium">
              ვისთანაც მივა ეს ბმული (მოსწავლე, მშობელი თუ კოლეგა), ყველას შეუძლია მისი გახსნა რეგისტრაციის, ელ-ფოსტის ან პაროლის გარეშე!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 bg-emerald-800/50 px-3 py-1.5 rounded-xl border border-emerald-400/30 self-stretch sm:self-auto justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>პირდაპირი ღია წვდომა</span>
        </div>
      </div>

      {/* Feature Box inside Student Block: ტესტის გაგზავნა ლინკით */}
      <div className="bg-emerald-50/90 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-black uppercase">
                  ბლოკი 1: „მოსწავლე“
                </span>
                <span className="text-[11px] font-bold text-emerald-800">ტესტის გაგზავნა</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-emerald-950 mt-0.5">
                ტესტის გაგზავნა მოსწავლეებისთვის ლინკით
              </h3>
            </div>
          </div>
          <span className="text-[11px] text-emerald-800 font-bold bg-white/80 px-2.5 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
            კლასი: {studentClass}
          </span>
        </div>

        <p className="text-xs text-emerald-900 leading-relaxed">
          გადაუგზავნეთ ეს ლინკი მოსწავლეებს საერთო ჩატში (Microsoft Teams, Zoom, Viber, WhatsApp). <strong>ვისთანაც მივა ეს ლინკი, ყველა შეძლებს მის გახსნას რეგისტრაციის გარეშე, მარტივად პირდაპირ</strong>. მოსწავლეები პირდაპირ იწყებენ ტესტს, ხოლო მასწავლებლის ბლოკი მათთვის სრულად დამალულია.
        </p>

        {/* Link input & actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-white border border-emerald-300 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-emerald-950 truncate select-all shadow-2xs">
            {studentShareUrl}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                copiedLink
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
              }`}
              title="მოსწავლის ტესტის ლინკის კოპირება"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'დაკოპირდა!' : 'ლინკის კოპირება'}</span>
            </button>

            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="მზა ტექსტის გაგზავნა კლასის ჩატში"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>ჩატში გაგზავნა</span>
              </button>
            )}
          </div>
        </div>

        {/* Reassurance Note */}
        <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-2xl border border-emerald-200/70 text-[11px] text-emerald-900 leading-snug">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>უსაფრთხო ბმული:</strong> მოსწავლე ვერ ხედავს მასწავლებლის ბლოკს, შეფასების ჟურნალს ან სარეკომენდაციო ანალიტიკას. მოსწავლისთვის ხელმისაწვდომია მხოლოდ ტესტის შესრულება.
          </span>
        </div>
      </div>

      {/* Student Identification by Journal Number */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-md space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Hash className="w-5 h-5 text-emerald-600" />
            <span>მოსწავლის მონაცემები (ჟურნალის ნომერი)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            ჩაწერე შენი რიგითი ნომერი საკლასო ჟურნალში, რათა მასწავლებელმა შეძლოს შენი ნამუშევრის შეფასება:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>მოსწავლის რიგითი ნომერი ჟურნალში:</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                არასავალდებულო (ნაგულისხმევად: 1)
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                №
              </span>
              <input
                type="number"
                min="1"
                max="50"
                placeholder="ჩაწერე ნომერი (ან დატოვე ცარიელი და დაიწყე)"
                value={studentNumber}
                onChange={e => setStudentNumber(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>კლასი:</span>
              <span className="text-[11px] font-medium text-slate-500">მითითებულია ბმულით</span>
            </label>
            <input
              type="text"
              placeholder="მაგ: VIII-ა"
              value={studentClass}
              onChange={e => setStudentClass(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-emerald-600 transition-colors"
            />
          </div>
        </div>

        {/* 3-Level Evaluation Overview */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <span className="font-bold text-slate-700 block">📊 შეფასების 3 დონე:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px] font-bold">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 leading-snug">
              საჭიროებს მხარდაჭერას
              <span className="block text-[10px] text-rose-600 font-normal mt-0.5">0-50 ქულა</span>
            </div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-snug">
              დამოუკიდებელი
              <span className="block text-[10px] text-amber-600 font-normal mt-0.5">60-70 ქულა</span>
            </div>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-snug">
              გაფართოებული / შემოქმედებითი
              <span className="block text-[10px] text-emerald-600 font-normal mt-0.5">80-100 ქულა</span>
            </div>
          </div>
        </div>

        <div className="pt-1 space-y-2.5">
          {/* Main Action: გაგზავნა / დაწყება (Send test and start) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>ტესტის დაწყება და გაგზავნა</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const cleanNumber = studentNumber.replace(/[^0-9]/g, '') || '1';
                setIsSent(true);
                onStartGame(cleanNumber, studentClass.trim() || 'VIII-ა');
              }}
              className="sm:w-auto px-5 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="პირდაპირი მყისიერი დაწყება რეგისტრაციის გარეშე"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>პირდაპირ დაწყება (1 წამში)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-600 font-medium pt-1">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>რეგისტრაცია არ არის საჭირო! ლინკი იხსნება პირდაპირ, კითხვები და ყველა ინფორმაცია მყისიერად ხელმისაწვდომია.</span>
          </div>
        </div>
      </form>

      {/* Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">ენერგიის ფორმები</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            კინეტიკური, პოტენციური, ქიმიური, სითბური და სინათლის ენერგია.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">წყაროები და რესურსი</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            განახლებადი (მზე, ქარი, წყალი) vs წიაღისეული (ქვანახშირი, გაზი).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">ეკოლოგია და CO₂</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            სათბურის ეფექტი და გლობალური დათბობის გამოწვევები.
          </p>
        </div>
      </div>
    </div>
  );
};
