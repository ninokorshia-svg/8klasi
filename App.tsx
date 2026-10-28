/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShuffledQuestion, UserAnswerRecord, GameStage, StudentSubmission, PerformanceLevel } from './types';
import { generateRandomizedQuiz } from './data/questions';
import { evaluateStudentWork } from './utils/evaluation';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { ResultsModal } from './components/ResultsModal';
import { EnergyLabModal } from './components/EnergyLabModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { ShareTestModal } from './components/ShareTestModal';
import { SAMPLE_SUBMISSIONS } from './data/sampleSubmissions';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, X, Share2, Copy, Check, GraduationCap } from 'lucide-react';

const STORAGE_KEY = 'energy_quiz_student_submissions_v3';

export default function App() {
  const [gameStage, setGameStage] = useState<GameStage>('start');
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<Record<string, UserAnswerRecord>>({});
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [studentNumber, setStudentNumber] = useState<string>('1');
  const [studentClass, setStudentClass] = useState<string>('VIII-ა');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(SAMPLE_SUBMISSIONS);
  const [currentLevel, setCurrentLevel] = useState<PerformanceLevel>('დამოუკიდებელი');
  const [currentComment, setCurrentComment] = useState<string>('');
  const [showUnansweredModal, setShowUnansweredModal] = useState<boolean>(false);

  const [currentPortal, setCurrentPortal] = useState<'student' | 'teacher'>('student');
  const [testSentToStudent, setTestSentToStudent] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [linkCopiedAlert, setLinkCopiedAlert] = useState<boolean>(false);
  const [isStudentOnlyMode, setIsStudentOnlyMode] = useState<boolean>(false);

  // Parse URL search parameters on initial load (e.g. ?mode=student&class=VIII-ა or ?role=teacher)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const urlClass = params.get('class');
        if (urlClass) {
          setStudentClass(urlClass);
        }
        const urlMode = params.get('mode');
        if (urlMode === 'student') {
          setCurrentPortal('student');
          setGameStage('start');
          setIsStudentOnlyMode(true);
        }
        const urlRole = params.get('role');
        if (urlRole === 'teacher') {
          setCurrentPortal('teacher');
          setGameStage('teacher_dashboard');
          setIsStudentOnlyMode(false);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Load submissions from localStorage with safe data normalization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized: StudentSubmission[] = parsed.map((item: any, idx: number) => {
            const score = typeof item?.score === 'number' && !isNaN(item.score) ? item.score : 0;
            const level: PerformanceLevel = (
              item?.performanceLevel === 'გაფართოებული / შემოქმედებითი' ||
              item?.performanceLevel === 'დამოუკიდებელი' ||
              item?.performanceLevel === 'საჭიროებს მხარდაჭერას'
            )
              ? item.performanceLevel
              : (score >= 80 ? 'გაფართოებული / შემოქმედებითი' : score >= 60 ? 'დამოუკიდებელი' : 'საჭიროებს მხარდაჭერას');

            return {
              id: item?.id || `sub-stored-${idx}`,
              studentNumber: String(item?.studentNumber || idx + 1),
              studentClass: item?.studentClass || 'VIII-ა',
              score,
              totalPossible: item?.totalPossible || 100,
              correctCount: typeof item?.correctCount === 'number' ? item.correctCount : Math.round(score / 10),
              totalQuestions: item?.totalQuestions || 10,
              completedAt: item?.completedAt || new Date().toLocaleDateString('ka-GE'),
              answers: Array.isArray(item?.answers) ? item.answers : [],
              performanceLevel: level,
              teacherNotes: item?.teacherNotes || item?.formativeComment || '',
            };
          });
          setSubmissions(sanitized);
          return;
        }
      }
      setSubmissions(SAMPLE_SUBMISSIONS);
    } catch {
      setSubmissions(SAMPLE_SUBMISSIONS);
    }
  }, []);

  const saveSubmissions = (newSubmissions: StudentSubmission[]) => {
    setSubmissions(newSubmissions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubmissions));
    } catch {
      // Ignore
    }
  };

  const handleLoadSampleData = () => {
    saveSubmissions(SAMPLE_SUBMISSIONS);
  };

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const handleOpenTeacherDashboard = () => {
    sound.playClick();
    setCurrentPortal('teacher');
    setGameStage('teacher_dashboard');
  };

  const handleTeacherAuthSuccess = () => {
    setCurrentPortal('teacher');
    setGameStage('teacher_dashboard');
  };

  const handleSwitchToStudent = () => {
    setCurrentPortal('student');
    if (gameStage === 'teacher_dashboard') {
      setGameStage('start');
    }
  };

  const handleSendTestToStudents = () => {
    sound.playClick();
    setIsShareModalOpen(true);
  };

  const handleCopyDirectLink = async () => {
    sound.playClick();
    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    const link = `${baseUrl}?mode=student&class=${encodeURIComponent(studentClass || 'VIII-ა')}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopiedAlert(true);
      setTimeout(() => setLinkCopiedAlert(false), 3000);
    } catch {
      setLinkCopiedAlert(true);
      setTimeout(() => setLinkCopiedAlert(false), 3000);
    }
  };

  // Start new quiz session with student's roll number
  const handleStartGame = (rollNumber: string, sClass: string) => {
    sound.playClick();
    setStudentNumber(rollNumber || '1');
    setStudentClass(sClass || 'VIII-ა');
    const newQuestions = generateRandomizedQuiz(10);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAnswersMap({});
    setAnswers([]);
    setScore(0);
    setStreak(0);
    setShowUnansweredModal(false);
    setGameStage('playing');
  };

  const handleRestart = () => {
    setGameStage('start');
  };

  const currentQ = questions[currentIndex];
  const currentRecord = currentQ ? answersMap[currentQ.id] : undefined;
  const isCurrentAnswered = !!currentRecord;
  const currentSelectedIndex = currentRecord ? currentRecord.userSelectedIndex : null;

  // Once an answer is chosen, it is locked immediately and cannot be changed!
  const handleSelectOption = (idx: number) => {
    if (!currentQ || isCurrentAnswered) return; // Cannot change already answered question!

    const isCorrect = idx === currentQ.correctIndex;
    const answerRecord: UserAnswerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,
      userSelectedIndex: idx,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      selectedText: currentQ.options[idx],
      correctText: currentQ.options[currentQ.correctIndex],
      explanation: isCorrect ? currentQ.explanation.correctText : currentQ.explanation.mistakeText,
    };

    setAnswersMap(prev => ({ ...prev, [currentQ.id]: answerRecord }));

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      sound.playClick();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      sound.playClick();
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinishQuiz(false);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    if (idx >= 0 && idx < questions.length) {
      sound.playClick();
      setCurrentIndex(idx);
    }
  };

  const handleJumpToFirstUnanswered = () => {
    const firstUnansweredIndex = questions.findIndex(q => !answersMap[q.id]);
    if (firstUnansweredIndex !== -1) {
      setCurrentIndex(firstUnansweredIndex);
    }
    setShowUnansweredModal(false);
  };

  const handleFinishQuiz = (forceFinish = false) => {
    const answeredCount = Object.keys(answersMap).length;
    if (!forceFinish && answeredCount < questions.length) {
      setShowUnansweredModal(true);
      return;
    }

    sound.playClick();
    setShowUnansweredModal(false);

    // Build the ordered 10 answers array matching original questions order
    const finalAnswers: UserAnswerRecord[] = questions.map((q) => {
      if (answersMap[q.id]) {
        return answersMap[q.id];
      }
      return {
        questionId: q.id,
        questionText: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        userSelectedIndex: -1,
        correctIndex: q.correctIndex,
        isCorrect: false,
        selectedText: 'პასუხი არ გაცემულა',
        correctText: q.options[q.correctIndex],
        explanation: q.explanation.mistakeText,
      };
    });

    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const finalScore = correctCount * 10;

    const evalResult = evaluateStudentWork(finalScore, finalAnswers, studentNumber, studentClass);
    setCurrentLevel(evalResult.level);
    setCurrentComment(evalResult.comment);
    setAnswers(finalAnswers);
    setScore(finalScore);

    const submission: StudentSubmission = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      studentNumber: studentNumber || '1',
      studentClass: studentClass || 'VIII-ა',
      completedAt: new Date().toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: finalScore,
      totalPossible: questions.length * 10,
      correctCount,
      totalQuestions: questions.length,
      performanceLevel: evalResult.level,
      answers: finalAnswers,
      teacherNotes: evalResult.comment,
    };

    saveSubmissions([submission, ...submissions]);
    setGameStage('summary');
    if (evalResult.level === 'გაფართოებული / შემოქმედებითი') {
      sound.playVictory();
    }
  };

  const handleUpdateSubmission = (updated: StudentSubmission) => {
    const updatedList = submissions.map(s => s.id === updated.id ? updated : s);
    saveSubmissions(updatedList);
  };

  const handleDeleteSubmission = (id: string) => {
    const updatedList = submissions.filter(s => s.id !== id);
    saveSubmissions(updatedList);
  };

  const handleClearAllSubmissions = () => {
    if (window.confirm('დარწმუნებული ხართ, რომ გსურთ ყველა ნამუშევრის წაშლა?')) {
      saveSubmissions([]);
    }
  };

  const answeredCount = Object.keys(answersMap).length;
  const currentRunningScore = Object.values(answersMap).filter(a => a.isCorrect).length * 10;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        currentIndex={currentIndex}
        totalQuestions={questions.length || 10}
        score={currentRunningScore}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onRestart={handleRestart}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTeacherDashboard={handleOpenTeacherDashboard}
        isPlaying={gameStage === 'playing'}
        studentNumber={studentNumber}
        studentClass={studentClass}
        submissionsCount={submissions.length}
        userRole={currentPortal}
        hideTeacherBlock={isStudentOnlyMode}
        onSwitchToStudent={handleSwitchToStudent}
        onSwitchToTeacher={handleOpenTeacherDashboard}
      />

      {/* Role Navigation Bar (Only outside active quiz) */}
      {gameStage !== 'playing' && (
        <div className="bg-white border-b border-slate-200/90 shadow-2xs print:hidden">
          <div className="max-w-4xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            {/* If accessed via student link (?mode=student), ONLY display student block and completely omit teacher block */}
            {isStudentOnlyMode ? (
              <div className="flex items-center gap-2.5">
                <div className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5">
                  <span>ბლოკი: „მოსწავლე“</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ენერგია და გარემო • ტესტური დავალება ({studentClass})
                </span>
              </div>
            ) : (
              /* Two Main Blocks Selector for Teacher / Class coordinator */
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={handleSwitchToStudent}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentPortal === 'student' && gameStage !== 'teacher_dashboard'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <span>ბლოკი 1: „მოსწავლე“</span>
                </button>

                {/* Block 2: Teacher - Colored BLUE */}
                <button
                  type="button"
                  onClick={handleOpenTeacherDashboard}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentPortal === 'teacher' && gameStage === 'teacher_dashboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100/70 bg-blue-50/70'
                  }`}
                  title="პირდაპირი წვდომა რეგისტრაციის გარეშე"
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${currentPortal === 'teacher' && gameStage === 'teacher_dashboard' ? 'text-blue-200' : 'text-blue-600'}`} />
                  <span>ბლოკი 2: „მასწავლებელი“</span>
                  {submissions.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      currentPortal === 'teacher' && gameStage === 'teacher_dashboard'
                        ? 'bg-blue-800 text-white'
                        : 'bg-blue-200 text-blue-900'
                    }`}>
                      {submissions.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Current Portal Badge & No Registration Notice */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>რეგისტრაციის გარეშე • პირდაპირი წვდომა</span>
              </span>

              {currentPortal === 'teacher' && gameStage === 'teacher_dashboard' ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-800 font-black rounded-xl border border-blue-200 flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>მასწავლებლის სივრცე (ლურჯი ბლოკი)</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-black rounded-xl border border-emerald-200 text-xs">
                  მოსწავლის სასწავლო სივრცე
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {gameStage === 'start' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenTeacherDashboard={handleOpenTeacherDashboard}
            submissionCount={submissions.length}
            activeRole={currentPortal}
            initialClass={studentClass}
            hideTeacherBlock={isStudentOnlyMode}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onSelectRole={role => {
              if (role === 'teacher') handleOpenTeacherDashboard();
              else handleSwitchToStudent();
            }}
          />
        )}

        {gameStage === 'playing' && currentQ && (
          <div className="space-y-4 max-w-2xl mx-auto w-full animate-fade-in">
            {/* Quick 10-Question Navigator Pill Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  შეკითხვა:
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {answeredCount}/{questions.length} პასუხგაცემული
                </span>
              </div>

              {/* Number buttons 1..10 with status indicators */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                {questions.map((q, idx) => {
                  const qRecord = answersMap[q.id];
                  const isCurrent = idx === currentIndex;
                  const isAns = !!qRecord;

                  let pillStyle = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';

                  if (isCurrent) {
                    pillStyle = 'bg-violet-600 text-white border-violet-600 ring-2 ring-violet-400 shadow-xs font-black scale-105';
                  } else if (isAns) {
                    if (qRecord.isCorrect) {
                      pillStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold hover:bg-emerald-200';
                    } else {
                      pillStyle = 'bg-rose-100 text-rose-800 border-rose-300 font-bold hover:bg-rose-200';
                    }
                  }

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs flex items-center justify-center border transition-all cursor-pointer ${pillStyle}`}
                      title={`შეკითხვა #${idx + 1}${isAns ? (qRecord.isCorrect ? ' (სწორია)' : ' (არასწორია)') : ' (უპასუხო)'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Card */}
            <QuestionCard
              key={`${currentQ.id}_${currentIndex}`}
              question={currentQ}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              selectedIndex={currentSelectedIndex}
              isAnswered={isCurrentAnswered}
              onSelectOption={handleSelectOption}
              onNext={currentIndex < questions.length - 1 ? handleNextQuestion : () => handleFinishQuiz(false)}
              onPrev={handlePrevQuestion}
              canGoPrev={currentIndex > 0}
              canGoNext={currentIndex < questions.length - 1}
              studentNumber={studentNumber}
              studentClass={studentClass}
            />

            {/* Bottom Bidirectional Navigation & Action Bar */}
            <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
              {/* Back / Previous Button (Orange) */}
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrevQuestion}
                className="px-4 sm:px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-orange-200 hover:shadow-lg ring-2 ring-orange-400/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">წინა შეკითხვა</span>
                <span className="sm:hidden">უკან</span>
              </button>

              {/* Status indicator */}
              <div className="text-center">
                <span className="text-xs font-bold text-slate-600 block">
                  {isCurrentAnswered ? '🔒 პასუხი ჩაკეტილია' : 'მონიშნეთ პასუხი'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  შეგიძლიათ თავისუფლად გადახვიდეთ კითხვებს შორის
                </span>
              </div>

              {/* Next / Finish Button (Violet) */}
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 sm:px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-violet-200 hover:shadow-lg ring-2 ring-violet-400/40"
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? 'ტესტის დასრულება და შეფასება'
                    : 'შემდეგი შეკითხვა'}
                </span>
                {currentIndex === questions.length - 1 ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {gameStage === 'summary' && (
          <ResultsModal
            score={score}
            totalScore={questions.length * 10}
            answers={answers}
            onRestart={handleRestart}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenTeacherDashboard={handleOpenTeacherDashboard}
            studentNumber={studentNumber}
            studentClass={studentClass}
            performanceLevel={currentLevel}
            teacherComment={currentComment}
          />
        )}

        {gameStage === 'teacher_dashboard' && (
          <TeacherDashboard
            submissions={submissions}
            onBackToGame={() => setGameStage(answers.length > 0 ? 'summary' : 'start')}
            onUpdateSubmission={handleUpdateSubmission}
            onDeleteSubmission={handleDeleteSubmission}
            onClearAll={handleClearAllSubmissions}
            onLoadSampleData={handleLoadSampleData}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}
      </main>

      {/* Share Test Modal for Class Chat Link Dispatch */}
      <ShareTestModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        defaultClass={studentClass || 'VIII-ა'}
      />

      {/* Unanswered Questions Confirmation Modal */}
      {showUnansweredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>ყურადღება! უპასუხო შეკითხვები</span>
              </div>
              <button
                onClick={() => setShowUnansweredModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              თქვენ გაქვთ <strong>{questions.length - answeredCount}</strong> უპასუხო შეკითხვა 10-დან.
              თუ ტესტს დაასრულებთ, უპასუხო კითხვები ჩაითვლება 0 ქულად.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleJumpToFirstUnanswered}
                className="flex-1 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                უპასუხო კითხვებზე დაბრუნება
              </button>
              <button
                type="button"
                onClick={() => handleFinishQuiz(true)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer text-center"
              >
                მაინც დასრულება
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Authentication Password Modal (requires word "Teachers") */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={handleTeacherAuthSuccess}
      />

      {/* Educational Reference Modal */}
      <EnergyLabModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer - Teacher access is completely hidden when student is playing */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 py-4 px-4 text-center text-xs text-slate-500 font-medium print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ფიზიკა • მე-8 კლასი • „ენერგია და გარემო“</span>
          <div className="flex items-center gap-3">
            {gameStage !== 'playing' && currentPortal === 'teacher' && !isStudentOnlyMode && (
              <>
                <button
                  onClick={handleOpenTeacherDashboard}
                  className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                >
                  მასწავლებლის შეფასების ჟურნალი ({submissions.length})
                </button>
                <span>•</span>
              </>
            )}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              სასწავლო გზამკვლევი
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
