import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenGuide: () => void;
  onOpenTeacherDashboard: () => void;
  isPlaying: boolean;
  studentNumber?: string;
  studentClass?: string;
  submissionsCount: number;
  userRole?: 'student' | 'teacher';
  hideTeacherBlock?: boolean;
  onSwitchToStudent?: () => void;
  onSwitchToTeacher?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex,
  totalQuestions,
  score,
  soundEnabled,
  onToggleSound,
  onRestart,
  onOpenGuide,
  onOpenTeacherDashboard,
  isPlaying,
  studentNumber,
  studentClass,
  submissionsCount,
  userRole = 'student',
  hideTeacherBlock = false,
  onSwitchToStudent,
  onSwitchToTeacher,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md text-white font-black text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight flex items-center gap-2">
              <span>ენერგია და გარემო</span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                VIII კლასი
              </span>
            </h1>
            {studentNumber && isPlaying ? (
              <p className="text-xs text-emerald-800 font-bold truncate max-w-[200px]">
                ჟურნალის № {studentNumber} ({studentClass})
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                ფიზიკის სასწავლო ქვიზი
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Teacher Dashboard access - Strictly hidden from student during tests and student portal */}
          {!isPlaying && userRole === 'teacher' && !hideTeacherBlock && (
            <button
              onClick={onOpenTeacherDashboard}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
              title="მასწავლებლის შეფასების ჟურნალი"
            >
              <GraduationCap className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">მასწავლებლის ჟურნალი</span>
              {submissionsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-black">
                  {submissionsCount}
                </span>
              )}
            </button>
          )}

          {/* Guide helper button */}
          <button
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="სასწავლო გზამკვლევი"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">გზამკვლევი</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title={soundEnabled ? 'ხმის გამორთვა' : 'ხმის ჩართვა'}
            aria-label={soundEnabled ? 'ხმის გამორთვა' : 'ხმის ჩართვა'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Restart button */}
          {isPlaying && (
            <button
              onClick={onRestart}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="თავიდან დაწყება"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">თავიდან</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar under header when playing */}
      {isPlaying && (
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300 rounded-r-full"
            style={{ width: `${Math.min(100, ((currentIndex + 1) / totalQuestions) * 100)}%` }}
          />
        </div>
      )}
    </header>
  );
};
