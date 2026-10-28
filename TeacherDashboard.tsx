import React, { useState } from 'react';
import { StudentSubmission, PerformanceLevel } from '../types';
import { getSummativeAssessment } from '../utils/evaluation';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Copy, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Check, 
  Calendar, 
  GraduationCap,
  FileSpreadsheet,
  BarChart3,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Award,
  Target,
  BookOpen,
  ListOrdered,
  Sparkles,
  Layers,
  ChevronRight,
  Share2
} from 'lucide-react';
import { ShareWithColleaguesModal } from './ShareWithColleaguesModal';

interface TeacherDashboardProps {
  submissions: StudentSubmission[];
  onBackToGame: () => void;
  onUpdateSubmission: (updated: StudentSubmission) => void;
  onDeleteSubmission: (id: string) => void;
  onClearAll: () => void;
  onLoadSampleData?: () => void;
  onOpenShareModal?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions,
  onBackToGame,
  onUpdateSubmission,
  onDeleteSubmission,
  onClearAll,
  onLoadSampleData,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'analysis' | 'recommendations'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | PerformanceLevel>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    submissions.length > 0 ? submissions[0].id : null
  );
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');
  const [isSavedNote, setIsSavedNote] = useState(false);
  const [printMode, setPrintMode] = useState<'single' | 'class_list' | 'class_analysis' | 'class_plan'>('single');
  const [isShareColleaguesOpen, setIsShareColleaguesOpen] = useState<boolean>(false);
  
  // Custom teacher plan for the recommendation rubric
  const [customPlanNote, setCustomPlanNote] = useState<string>('');
  const [isSavedPlanNote, setIsSavedPlanNote] = useState<boolean>(false);

  // Available classes in the submissions
  const availableClasses = Array.from(new Set(submissions.map(s => s.studentClass))).filter(Boolean);

  // Find currently selected submission
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId) || submissions[0];

  React.useEffect(() => {
    if (selectedSubmission) {
      setTeacherNote(selectedSubmission.teacherNotes || '');
      setIsSavedNote(false);
    }
  }, [selectedSubmissionId, selectedSubmission]);

  // Load custom plan note from localStorage if available
  React.useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('teacher_class_plan_note');
      if (savedPlan) {
        setCustomPlanNote(savedPlan);
      } else {
        setCustomPlanNote('1. მომდევნო 2 გაკვეთილზე განვიხილოთ ენერგიის შენახვის კანონი და გარემოსდაცვითი ასპექტები.\n2. მხარდაჭერის საჭიროების მქონე მოსწავლეებთან ჩატარდეს 15-წუთიანი დამატებითი კონსულტაცია.\n3. გაფართოებული დონის მოსწავლეები მოამზადებენ პრეზენტაციას განახლებად ენერგიაზე.');
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSavePlanNote = () => {
    try {
      localStorage.setItem('teacher_class_plan_note', customPlanNote);
      setIsSavedPlanNote(true);
      setTimeout(() => setIsSavedPlanNote(false), 2000);
    } catch {
      // Ignore
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || s.performanceLevel === levelFilter;
    const matchesClass = selectedClassFilter === 'all' || s.studentClass === selectedClassFilter;
    return matchesSearch && matchesLevel && matchesClass;
  });

  const handleSaveNote = () => {
    if (!selectedSubmission) return;
    const updated: StudentSubmission = {
      ...selectedSubmission,
      teacherNotes: teacherNote,
    };
    onUpdateSubmission(updated);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  const handleCopyReport = () => {
    if (!selectedSubmission) return;
    const summative = getSummativeAssessment(selectedSubmission.score);
    const text = `
=== მოსწავლის შეფასების ბარათი (ფიზიკა, VIII კლასი) ===
მოსწავლის რიგითი №: ${selectedSubmission.studentNumber}
კლასი: ${selectedSubmission.studentClass}
თარიღი: ${selectedSubmission.completedAt}

[განმსაზღვრელი შეფასება]:
• 10-ბალიანი შეფასება: ${summative.grade10} / 10 ქულა
• ჯამური ქულა: ${selectedSubmission.score} / ${selectedSubmission.totalPossible} (${selectedSubmission.correctCount}/${selectedSubmission.totalQuestions} სწორი)
• მიღწევის ხარისხი: ${summative.gradeDescription}

[განმავითარებელი შეფასება]:
• შეფასების დონე: ${selectedSubmission.performanceLevel}
• მასწავლებლის კომენტარი და რეკომენდაცია:
${teacherNote || selectedSubmission.teacherNotes}

შესრულებული დავალებების ანალიზი:
${selectedSubmission.answers.map((a, i) => `
${i + 1}. ${a.questionText}
• მოსწავლის პასუხი: ${a.selectedText} [${a.isCorrect ? 'სწორია' : 'არასწორია'}]
• სწორი პასუხი: ${a.correctText}
• განმარტება: ${a.explanation}
`).join('\n')}
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // Print handlers
  const handlePrintSingle = () => {
    setPrintMode('single');
    setTimeout(() => window.print(), 50);
  };

  const handlePrintClassList = () => {
    setPrintMode('class_list');
    setTimeout(() => window.print(), 50);
  };

  const handlePrintClassAnalysis = () => {
    setPrintMode('class_analysis');
    setTimeout(() => window.print(), 50);
  };

  const handlePrintClassPlan = () => {
    setPrintMode('class_plan');
    setTimeout(() => window.print(), 50);
  };

  const getLevelBadge = (level?: PerformanceLevel | string | null) => {
    switch (level) {
      case 'გაფართოებული / შემოქმედებითი':
        return { label: 'გაფართოებული / შემოქმედებითი', short: 'გაფართოებული', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'დამოუკიდებელი':
        return { label: 'დამოუკიდებელი', short: 'დამოუკიდებელი', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'საჭიროებს მხარდაჭერას':
        return { label: 'საჭიროებს მხარდაჭერას', short: 'მხარდაჭერა', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { label: 'დამოუკიდებელი', short: 'დამოუკიდებელი', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
  };

  // Target submissions for statistics (scoped to selected class if filtered)
  const scopedSubmissions = selectedClassFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.studentClass === selectedClassFilter);

  const totalSubmissions = scopedSubmissions.length;
  const averageScore = totalSubmissions > 0
    ? Math.round(scopedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalSubmissions)
    : 0;
  const averageGrade10 = Math.max(1, Math.min(10, Math.round(averageScore / 10)));
  
  const advancedCount = scopedSubmissions.filter(s => s.performanceLevel === 'გაფართოებული / შემოქმედებითი').length;
  const independentCount = scopedSubmissions.filter(s => s.performanceLevel === 'დამოუკიდებელი' || !s.performanceLevel).length;
  const supportCount = scopedSubmissions.filter(s => s.performanceLevel === 'საჭიროებს მხარდაჭერას').length;

  const advancedPct = totalSubmissions > 0 ? Math.round((advancedCount / totalSubmissions) * 100) : 0;
  const independentPct = totalSubmissions > 0 ? Math.round((independentCount / totalSubmissions) * 100) : 0;
  const supportPct = totalSubmissions > 0 ? Math.round((supportCount / totalSubmissions) * 100) : 0;

  // Topic mastery statistics
  const topicStats: Record<string, { total: number; correct: number }> = {
    'ფორმები': { total: 0, correct: 0 },
    'წყაროები': { total: 0, correct: 0 },
    'განახლებადი': { total: 0, correct: 0 },
    'ეკოლოგია': { total: 0, correct: 0 },
  };

  scopedSubmissions.forEach(sub => {
    (sub.answers || []).forEach(ans => {
      if (ans && topicStats[ans.topic]) {
        topicStats[ans.topic].total += 1;
        if (ans.isCorrect) {
          topicStats[ans.topic].correct += 1;
        }
      }
    });
  });

  const selectedSummative = selectedSubmission ? getSummativeAssessment(selectedSubmission.score) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* ===================== PRINT LAYOUT 1: FULL CLASS REGISTER TABLE ===================== */}
      {printMode === 'class_list' && (
        <div className="hidden print:block space-y-4">
          <div className="border-b-2 border-slate-900 pb-3">
            <h1 className="text-xl font-black text-slate-900">
              ფიზიკის სასწავლო ტესტირების საკლასო შემაჯამებელი უწყისი
            </h1>
            <p className="text-xs font-bold text-slate-600">
              თემა: „ენერგია და გარემო“ • {selectedClassFilter === 'all' ? 'VIII კლასი' : selectedClassFilter} • თარიღი: {new Date().toLocaleDateString('ka-GE')}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-xs text-left">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 p-2 font-black">№</th>
                <th className="border border-slate-400 p-2 font-black">ჟურნალის №</th>
                <th className="border border-slate-400 p-2 font-black">კლასი</th>
                <th className="border border-slate-400 p-2 font-black">განმსაზღვრელი ქულა</th>
                <th className="border border-slate-400 p-2 font-black">10-ბალიანი ნიშანი</th>
                <th className="border border-slate-400 p-2 font-black">განმავითარებელი დონე</th>
                <th className="border border-slate-400 p-2 font-black">მასწავლებლის განმავითარებელი კომენტარი</th>
              </tr>
            </thead>
            <tbody>
              {scopedSubmissions.map((sub, idx) => {
                const subSummative = getSummativeAssessment(sub.score);
                return (
                  <tr key={sub.id}>
                    <td className="border border-slate-400 p-2 font-bold">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 font-black">№ {sub.studentNumber}</td>
                    <td className="border border-slate-400 p-2">{sub.studentClass}</td>
                    <td className="border border-slate-400 p-2 font-black">{sub.score} / 100</td>
                    <td className="border border-slate-400 p-2 font-black text-center">{subSummative.grade10} / 10</td>
                    <td className="border border-slate-400 p-2 font-bold">{sub.performanceLevel}</td>
                    <td className="border border-slate-400 p-2 text-[11px] leading-relaxed">
                      {sub.teacherNotes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between pt-8 text-xs font-bold border-t border-slate-400">
            <span>სულ მოსწავლე: {scopedSubmissions.length}</span>
            <span>საშუალო ქულა: {averageScore} / 100 ({averageGrade10} / 10)</span>
            <span>მასწავლებლის ხელმოწერა: _________________________</span>
          </div>
        </div>
      )}

      {/* ===================== PRINT LAYOUT 2: CLASS TASK ANALYSIS ===================== */}
      {printMode === 'class_analysis' && (
        <div className="hidden print:block space-y-6">
          <div className="border-b-2 border-slate-900 pb-3">
            <h1 className="text-xl font-black text-slate-900">
              კლასში ჩატარებული ტესტური დავალების ანალიზი და შედეგების შეჯამება
            </h1>
            <p className="text-xs font-bold text-slate-600">
              საგანი: ფიზიკა • {selectedClassFilter === 'all' ? 'VIII კლასი' : selectedClassFilter} • თემა: „ენერგია და გარემო“ • თარიღი: {new Date().toLocaleDateString('ka-GE')}
            </p>
          </div>

          {/* I. General Statistics */}
          <div className="space-y-2 border border-slate-300 p-3 rounded-lg">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-1">
              I. ზოგადი სტატისტიკური მონაცემები
            </h2>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="border border-slate-200 p-2">
                <span className="font-bold text-slate-600 block">ტესტირებული მოსწავლეები:</span>
                <span className="font-black text-sm">{totalSubmissions} მოსწავლე</span>
              </div>
              <div className="border border-slate-200 p-2">
                <span className="font-bold text-slate-600 block">საშუალო ქულა (განმსაზღვრელი):</span>
                <span className="font-black text-sm">{averageScore} / 100</span>
              </div>
              <div className="border border-slate-200 p-2">
                <span className="font-bold text-slate-600 block">საშუალო ნიშანი (10-ბალიანი):</span>
                <span className="font-black text-sm">{averageGrade10} / 10 ქულა</span>
              </div>
              <div className="border border-slate-200 p-2">
                <span className="font-bold text-slate-600 block">წარმატების ზოგადი მაჩვენებელი:</span>
                <span className="font-black text-sm">{averageScore}%</span>
              </div>
            </div>
          </div>

          {/* II. 3-Level Performance Distribution */}
          <div className="space-y-2 border border-slate-300 p-3 rounded-lg">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-1">
              II. განმავითარებელი შეფასების სამდონიანი განაწილება კლასში
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 font-bold">მიღწევის დონე</th>
                  <th className="border border-slate-300 p-2 font-bold">ქულობრივი დიაპაზონი</th>
                  <th className="border border-slate-300 p-2 font-bold">მოსწავლეთა რაოდენობა</th>
                  <th className="border border-slate-300 p-2 font-bold">პროცენტული წილი (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">გაფართოებული / შემოქმედებითი</td>
                  <td className="border border-slate-300 p-2">80 - 100 ქულა (8-10 ნიშანი)</td>
                  <td className="border border-slate-300 p-2 font-black">{advancedCount} მოსწავლე</td>
                  <td className="border border-slate-300 p-2 font-black">{advancedPct}%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">დამოუკიდებელი</td>
                  <td className="border border-slate-300 p-2">60 - 70 ქულა (6-7 ნიშანი)</td>
                  <td className="border border-slate-300 p-2 font-black">{independentCount} მოსწავლე</td>
                  <td className="border border-slate-300 p-2 font-black">{independentPct}%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">საჭიროებს მხარდაჭერას</td>
                  <td className="border border-slate-300 p-2">0 - 50 ქულა (1-5 ნიშანი)</td>
                  <td className="border border-slate-300 p-2 font-black">{supportCount} მოსწავლე</td>
                  <td className="border border-slate-300 p-2 font-black">{supportPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* III. Thematic Content Analysis */}
          <div className="space-y-2 border border-slate-300 p-3 rounded-lg">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-1">
              III. თემატური კომპეტენციების ანალიზი
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(topicStats).map(([topic, data]) => {
                const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={topic} className="border border-slate-200 p-2 rounded">
                    <div className="flex justify-between font-bold mb-1">
                      <span>თემა: „{topic}“</span>
                      <span>{pct}% წარმატება ({data.correct}/{data.total})</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-800 h-2" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IV. Methodological & Pedagogical Recommendations */}
          <div className="space-y-2 border border-slate-300 p-3 rounded-lg text-xs leading-relaxed">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-1">
              IV. მასწავლებლის დასკვნა და პედაგოგიური რეკომენდაციები
            </h2>
            <p>
              <strong>• წარმატებით ათვისებული კომპეტენციები:</strong> კლასის უმრავლესობა წარმატებით ერკვევა ენერგიის ძირითად ფორმებში (კინეტიკური და პოტენციური ენერგია) და ასახელებს განახლებად რესურსებს (მზის, ქარისა და ჰიდროენერგია).
            </p>
            <p>
              <strong>• ძირითადი გამოწვევები და გასამეორებელი საკითხები:</strong> მოსწავლეებს შედარებით გაუჭირდათ ენერგიის მრავალსაფეხურიანი ურთიერთგარდაქმნის სქემების გაანალიზება და სათბურის ეფექტის ეკოლოგიური შედეგების ზუსტი ფიზიკური დასაბუთება.
            </p>
            <p>
              <strong>• შემდგომი ნაბიჯები საგაკვეთილო პროცესში:</strong> რეკომენდებულია პრაქტიკული ენერგეტიკული ჯაჭვების მოდელირება, განმამტკიცებელი ვიზუალური სქემების გამოყენება და მხარდაჭერის საჭიროების მქონე მოსწავლეებთან ინდივიდუალური კონსულტაციების ჩატარება.
            </p>
          </div>

          {/* Student summary list */}
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-900">
              V. მოსწავლეთა საკლასო რეესტრი:
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-[11px] text-left">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-1 font-bold">№</th>
                  <th className="border border-slate-300 p-1 font-bold">ჟურნალის №</th>
                  <th className="border border-slate-300 p-1 font-bold">კლასი</th>
                  <th className="border border-slate-300 p-1 font-bold">განმსაზღვრელი ქულა</th>
                  <th className="border border-slate-300 p-1 font-bold">10-ბალიანი ნიშანი</th>
                  <th className="border border-slate-300 p-1 font-bold">განმავითარებელი დონე</th>
                </tr>
              </thead>
              <tbody>
                {scopedSubmissions.map((sub, idx) => {
                  const sSumm = getSummativeAssessment(sub.score);
                  return (
                    <tr key={sub.id}>
                      <td className="border border-slate-300 p-1">{idx + 1}</td>
                      <td className="border border-slate-300 p-1 font-bold">№ {sub.studentNumber}</td>
                      <td className="border border-slate-300 p-1">{sub.studentClass}</td>
                      <td className="border border-slate-300 p-1 font-bold">{sub.score} / 100</td>
                      <td className="border border-slate-300 p-1 font-black text-center">{sSumm.grade10} / 10</td>
                      <td className="border border-slate-300 p-1">{sub.performanceLevel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-8 text-xs font-bold border-t border-slate-400">
            <span>ანალიზი მოამზადა ფიზიკის მასწავლებელმა: _________________________</span>
            <span>თარიღი: _________________________</span>
          </div>
        </div>
      )}

      {/* ===================== PRINT LAYOUT 3: RECOMMENDATION RUBRIC & ACTION PLAN ===================== */}
      {printMode === 'class_plan' && (
        <div className="hidden print:block space-y-6">
          <div className="border-b-2 border-slate-900 pb-3">
            <h1 className="text-xl font-black text-slate-900">
              საკლასო შედეგების ანალიზზე დაფუძნებული რეკომენდაციის რუბრიკა და სამოქმედო გეგმა
            </h1>
            <p className="text-xs font-bold text-slate-600">
              საგანი: ფიზიკა • {selectedClassFilter === 'all' ? 'სრული საკლასო ნაკადი (VIII კლასი)' : selectedClassFilter} • თარიღი: {new Date().toLocaleDateString('ka-GE')}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-3 border border-slate-300 rounded-lg text-xs grid grid-cols-4 gap-2">
            <div>
              <span className="font-bold text-slate-600 block">სულ მოსწავლე:</span>
              <span className="font-black">{totalSubmissions}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">საშუალო ქულა:</span>
              <span className="font-black">{averageScore} / 100 ({averageGrade10} / 10 ქულა)</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">გაფართოებული დონე:</span>
              <span className="font-black">{advancedCount} ({advancedPct}%)</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">მხარდაჭერის საჭიროება:</span>
              <span className="font-black">{supportCount} ({supportPct}%)</span>
            </div>
          </div>

          {/* Rubric: 3 Levels */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-300 pb-1">
              I. რეკომენდაციების რუბრიკა მოსწავლეთა მიღწევის დონეების მიხედვით
            </h2>

            <div className="border border-slate-300 p-3 rounded-lg text-xs space-y-1.5">
              <div className="font-black text-slate-900 flex justify-between">
                <span>1. გაფართოებული / შემოქმედებითი დონე (80-100 ქულა, 8-10 ნიშანი) — {advancedCount} მოსწავლე ({advancedPct}%)</span>
                <span>მიღწევა: მაღალი</span>
              </div>
              <p><strong>• დიაგნოსტიკა:</strong> მოსწავლეები თავისუფლად ერკვევიან ენერგიის ცნებებში, ზუსტად განასხვავებენ ენერგორესურსებს და ფლობენ მიზეზ-შედეგობრივ კავშირებს.</p>
              <p><strong>• მასწავლებლის რეკომენდაცია და მიდგომა:</strong> შეთავაზეთ კომპლექსური, ოლიმპიადის ტიპის ამოცანები, დამოუკიდებელი კვლევითი პროექტები ენერგოეფექტურობაზე, ჩართეთ ისინი თანატოლთა სწავლებაში (Peer-tutoring).</p>
            </div>

            <div className="border border-slate-300 p-3 rounded-lg text-xs space-y-1.5">
              <div className="font-black text-slate-900 flex justify-between">
                <span>2. დამოუკიდებელი დონე (60-70 ქულა, 6-7 ნიშანი) — {independentCount} მოსწავლე ({independentPct}%)</span>
                <span>მიღწევა: საშუალო</span>
              </div>
              <p><strong>• დიაგნოსტიკა:</strong> მოსწავლეები დამოუკიდებლად ხსნიან სტანდარტულ დავალებებს, თუმცა სირთულეები აქვთ ენერგიის მრავალსაფეხურიან გარდაქმნასა და ეკოლოგიურ შედეგებში.</p>
              <p><strong>• მასწავლებლის რეკომენდაცია და მიდგომა:</strong> ცოდნის გამყარება პრაქტიკული მაგალითებით, გრაფიკული სქემების შედგენა, შეცდომების თვითანალიზის წახალისება და ენერგეტიკული ჯაჭვების მოდელირება.</p>
            </div>

            <div className="border border-slate-300 p-3 rounded-lg text-xs space-y-1.5">
              <div className="font-black text-slate-900 flex justify-between">
                <span>3. საჭიროებს მხარდაჭერას დონე (0-50 ქულა, 1-5 ნიშანი) — {supportCount} მოსწავლე ({supportPct}%)</span>
                <span>მიღწევა: საბაზისო / დაბალი</span>
              </div>
              <p><strong>• დიაგნოსტიკა:</strong> მოსწავლეებს უჭირთ საბაზისო ცნებების (კინეტიკური/პოტენციური ენერგია, წიაღისეული რესურსები) გარჩევა და სწორი დასკვნების გამოტანა.</p>
              <p><strong>• მასწავლებლის რეკომენდაცია და მიდგომა:</strong> ინდივიდუალური და მცირეჯგუფური კონსულტაციები, მარტივი საყრდენი ბარათები (Cheat sheets), ცნებების ვიზუალიზაცია და გამარტივებული სავარჯიშოები.</p>
            </div>
          </div>

          {/* Action Plan */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-300 pb-1">
              II. მასწავლებლის პედაგოგიური სამოქმედო გეგმა კლასისთვის
            </h2>
            <div className="border border-slate-300 p-3 rounded-lg text-xs space-y-2">
              <p><strong>• ეტაპი 1 (მოკლევადიანი, 1-2 კვირა):</strong> ტესტის ტიპური შეცდომების საკლასო ანალიზი და დისკუსია. ინდივიდუალური გასაუბრება მხარდაჭერის საჭიროების მქონე მოსწავლეებთან.</p>
              <p><strong>• ეტაპი 2 (საშუალოვადიანი, 3-4 კვირა):</strong> ვირტუალური ლაბორატორიის გამოყენება ენერგიის ურთიერთგარდაქმნის საილუსტრაციოდ; დიფერენცირებული ჯგუფური მუშაობა.</p>
              <p><strong>• ეტაპი 3 (მონიტორინგი და შეფასება):</strong> განმამტკიცებელი 5-წუთიანი ფორმატიული ტესტირება და შედეგების პროგრესის დაფიქსირება.</p>
              {customPlanNote && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <strong>• მასწავლებლის პერსონალური გეგმა და დამატებითი ჩანაწერი:</strong>
                  <p className="whitespace-pre-line mt-1">{customPlanNote}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-8 text-xs font-bold border-t border-slate-400">
            <span>პედაგოგის ხელმოწერა: _________________________</span>
            <span>თარიღი: _________________________</span>
          </div>
        </div>
      )}

      {/* ===================== REGULAR INTERACTIVE DASHBOARD ===================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGame}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ტესტირებაზე დაბრუნება</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 flex-wrap">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span>მასწავლებლის შეფასების ჟურნალი</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                ბლოკი 2: მასწავლებელი
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              მოსწავლეთა ნამუშევრები, დავალების ანალიზი და რეკომენდაციის რუბრიკა
            </p>
          </div>
        </div>

        {/* Action Buttons for Printing, Sharing with Colleagues, and Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Share with Colleagues Button */}
          <button
            onClick={() => setIsShareColleaguesOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer ring-2 ring-blue-400/30"
            title="ამ რესურსის გაზიარება კოლეგებისთვის (სხვა მასწავლებლებისთვის)"
          >
            <Users className="w-4 h-4 text-blue-200" />
            <span>კოლეგებისთვის გაზიარება</span>
          </button>

          {submissions.length > 0 && (
            <>
              <button
                onClick={handlePrintSingle}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="არჩეული მოსწავლის ბარათის ამობეჭდვა"
              >
                <Printer className="w-4 h-4" />
                <span>მოსწავლის ბარათის ამობეჭდვა</span>
              </button>

              <button
                onClick={handlePrintClassAnalysis}
                className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="კლასში ჩატარებული ტესტური დავალების ანალიზის ამობეჭდვა"
              >
                <BarChart3 className="w-4 h-4 text-indigo-200" />
                <span>დავალების ანალიზის ამობეჭდვა</span>
              </button>

              <button
                onClick={handlePrintClassPlan}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="რეკომენდაციის რუბრიკისა და სამოქმედო გეგმის ამობეჭდვა"
              >
                <Target className="w-4 h-4 text-amber-200" />
                <span>რეკომენდაციის ამობეჭდვა</span>
              </button>

              <button
                onClick={handlePrintClassList}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="მთლიანი საკლასო უწყისის ამობეჭდვა"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>საკლასო უწყისი</span>
              </button>
            </>
          )}

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer ring-2 ring-violet-400/30"
              title="ტესტის ლინკის გაგზავნა კლასის ჩატში (Teams, Zoom, Classroom)"
            >
              <Share2 className="w-4 h-4 text-violet-200" />
              <span>ტესტის გაგზავნა ჩატში</span>
            </button>
          )}

          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="block text-[10px] font-bold text-blue-700 uppercase">ნამუშევრები</span>
            <span className="text-sm font-black text-blue-900">{totalSubmissions}</span>
          </div>

          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="block text-[10px] font-bold text-indigo-700 uppercase">საშუალო ქულა</span>
            <span className="text-sm font-black text-indigo-900">{averageScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Teacher Resource Sharing Banner for Colleagues */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-700/60 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Users className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>გაუზიარეთ ეს სასწავლო რესურსი თქვენს კოლეგებს</span>
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-full text-[10px] font-bold">
                მასწავლებელთა ქსელი
              </span>
            </h3>
            <p className="text-xs text-blue-100/90 font-medium">
              🔓 ღია რესურსი რეგისტრაციის გარეშე — სხვა მასწავლებლებსაც შეეძლებათ პირდაპირ გამოიყენონ ეს ტესტირება, სიმულაციები და შეფასების ჟურნალი თავიანთ კლასებში.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsShareColleaguesOpen(true)}
          className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 active:bg-blue-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-blue-700" />
          <span>რესურსის გაზიარება კოლეგებთან</span>
        </button>
      </div>

      {/* Screen Tabs: 3 Views */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>1. მოსწავლეთა ნამუშევრები ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. ტესტური დავალების შედეგების ანალიზი</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>3. რეკომენდაციის რუბრიკა და გეგმა</span>
          </button>
        </div>

        {/* Class Filter Dropdown if multiple classes exist */}
        {availableClasses.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold">კლასი:</span>
            <select
              value={selectedClassFilter}
              onChange={e => setSelectedClassFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus:outline-emerald-600"
            >
              <option value="all">ყველა კლასი ({submissions.length})</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>{cls} კლასი</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 print:hidden">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">ჟურნალში ნამუშევრები ჯერ არ არის</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            მოსწავლეების მიერ ტესტის შესრულებისთანავე აქ გამოჩნდება მათი შედეგები, განმსაზღვრელი და განმავითარებელი შეფასებები.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>სადემონსტრაციო კლასის (VIII-ა / VIII-ბ) ჩატვირთვა</span>
              </button>
            )}
            <button
              onClick={onBackToGame}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              ტესტირების დაწყება
            </button>
          </div>
        </div>
      ) : activeTab === 'submissions' ? (
        /* ===================== TAB 1: INDIVIDUAL STUDENT SUBMISSIONS VIEW ===================== */
        <div className="space-y-4">
          {/* TOP QUICK NUMBER PICKER: Click on student's number to open! */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm print:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-emerald-600" />
                <span>მოსწავლეთა ნუმერაცია — დააწკაპუნეთ ნომერზე ნამუშევრის გასახსნელად:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-bold">
                სულ {filteredSubmissions.length} მოსწავლე
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredSubmissions.map((sub, idx) => {
                const isSelected = sub.id === (selectedSubmission?.id);
                const sSumm = getSummativeAssessment(sub.score);
                const dotColor = sub.performanceLevel === 'გაფართოებული / შემოქმედებითი'
                  ? 'bg-emerald-500'
                  : sub.performanceLevel === 'დამოუკიდებელი'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      setTimeout(() => {
                        const el = document.getElementById('student-detail-sheet');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                    title={`მოსწავლე № ${sub.studentNumber} (${sub.studentClass}) • ქულა: ${sub.score} • ნიშანი: ${sSumm.grade10}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : dotColor}`} />
                    <span>№ {sub.studentNumber}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
                      isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {sSumm.grade10} ქ.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: List on Left + Full Submission Sheet on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Submissions List (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-4 flex flex-col max-h-[750px] print:hidden">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ძებნა ჟურნალის № ან კლასით..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-600"
                />
              </div>

              {/* 3-Level Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => setLevelFilter('all')}
                  className={`flex-1 py-1 px-1 rounded-lg transition-all ${
                    levelFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ყველა ({submissions.length})
                </button>
                <button
                  onClick={() => setLevelFilter('გაფართოებული / შემოქმედებითი')}
                  className={`flex-1 py-1 px-1 rounded-lg transition-all ${
                    levelFilter === 'გაფართოებული / შემოქმედებითი' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                  title="გაფართოებული / შემოქმედებითი"
                >
                  გაფართოებული
                </button>
                <button
                  onClick={() => setLevelFilter('დამოუკიდებელი')}
                  className={`flex-1 py-1 px-1 rounded-lg transition-all ${
                    levelFilter === 'დამოუკიდებელი' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  დამოუკიდებელი
                </button>
                <button
                  onClick={() => setLevelFilter('საჭიროებს მხარდაჭერას')}
                  className={`flex-1 py-1 px-1 rounded-lg transition-all ${
                    levelFilter === 'საჭიროებს მხარდაჭერას' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
                  }`}
                  title="საჭიროებს მხარდაჭერას"
                >
                  მხარდაჭერა
                </button>
              </div>

              {/* Submissions List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredSubmissions.map((sub, idx) => {
                  const isSelected = sub.id === (selectedSubmission?.id);
                  const badge = getLevelBadge(sub.performanceLevel);
                  const sSumm = getSummativeAssessment(sub.score);

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmissionId(sub.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                              № {sub.studentNumber}
                            </span>
                            <span className="font-bold text-slate-800 text-xs">
                              {sub.studentClass}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">
                            {sub.completedAt}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-sm text-slate-900">
                            {sub.score} <span className="text-xs text-slate-400">/ 100</span>
                            <span className="ml-1 text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-900 rounded font-black">
                              {sSumm.grade10} ქ.
                            </span>
                          </div>
                          <span className={`block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${badge?.color || 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                            {badge?.short || 'დამოუკიდებელი'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-medium">{sub.correctCount}/10 სწორი პასუხი</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmissionId(sub.id);
                            setActiveTab('submissions');
                            setTimeout(() => {
                              const el = document.getElementById('student-detail-sheet');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 50);
                          }}
                          className={`font-black flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                          }`}
                          title={`მოსწავლე № ${sub.studentNumber}-ის ნამუშევრის გახსნა`}
                        >
                          <span>გახსნა</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">{filteredSubmissions.length} ნამუშევარი</span>
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                >
                  სიის გასუფთავება
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Assessment Sheet for Single Student (8 Cols) */}
            {selectedSubmission && (
              <div
                id="student-detail-sheet"
                className={`lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 overflow-hidden ${printMode !== 'single' ? 'print:hidden' : 'print:block print:shadow-none print:border-none print:p-0'}`}
              >
                {/* Header on print */}
                <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black">ფიზიკის სასწავლო ტესტირების შეფასების ბარათი</h1>
                      <p className="text-xs text-slate-600">თემა: „ენერგია და გარემო“ • VIII კლასი</p>
                    </div>
                    <div className="text-right text-xs font-bold">
                      <div>ჟურნალის №: {selectedSubmission.studentNumber}</div>
                      <div>კლასი: {selectedSubmission.studentClass}</div>
                      <div>თარიღი: {selectedSubmission.completedAt}</div>
                    </div>
                  </div>
                </div>

                {/* Header on screen */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 print:border-slate-300">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg">
                        ჟურნალის № {selectedSubmission.studentNumber}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                        კლასი: {selectedSubmission.studentClass}
                      </span>
                      <span className="text-xs text-slate-400">{selectedSubmission.completedAt}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">
                      მოსწავლე № {selectedSubmission.studentNumber}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">{selectedSubmission.score}</span>
                      <span className="text-sm font-bold text-slate-400"> / 100</span>
                      {selectedSummative && (
                        <span className="block text-xs font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1">
                          10-ბალიანი ნიშანი: {selectedSummative.grade10} / 10
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 print:hidden">
                      <button
                        onClick={handlePrintSingle}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                        title="ამობეჭდვა"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleCopyReport}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                        title="შეფასების ბარათის კოპირება"
                      >
                        {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onDeleteSubmission(selectedSubmission.id)}
                        className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        title="წაშლა"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= 1. განმსაზღვრელი შეფასება (SUMMATIVE ASSESSMENT) ================= */}
                {selectedSummative && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-2.5 print:bg-white print:border-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-600 text-white flex items-center gap-1.5 print:bg-slate-200 print:text-slate-900">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>განმსაზღვრელი შეფასება (ნიშანი)</span>
                      </span>
                      <span className="text-xs font-extrabold text-indigo-900 print:text-slate-800">
                        ეროვნული 10-ბალიანი სისტემა
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">10-ბალიანი ნიშანი</span>
                        <span className="text-2xl font-black text-indigo-900">
                          {selectedSummative.grade10} <span className="text-xs text-slate-400">/ 10</span>
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ტესტის ქულა</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">
                          {selectedSubmission.score} / 100
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">({selectedSubmission.correctCount}/10 სწორი)</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center print:border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">მიღწევის დონე</span>
                        <span className="text-xs font-black text-slate-800 block mt-1">
                          {selectedSummative.gradeDescription}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                          {selectedSummative.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= 2. განმავითარებელი შეფასება (FORMATIVE ASSESSMENT) ================= */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-2.5 print:bg-white print:border-slate-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getLevelBadge(selectedSubmission?.performanceLevel)?.color || 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                        დონე: {selectedSubmission?.performanceLevel || 'დამოუკიდებელი'}
                      </span>
                      <span className="text-xs font-black text-amber-950 print:text-slate-900">
                        განმავითარებელი შეფასება / კომენტარი
                      </span>
                    </div>
                    {isSavedNote && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 print:hidden">
                        <Check className="w-3.5 h-3.5" /> შენახულია!
                      </span>
                    )}
                  </div>

                  <textarea
                    value={teacherNote}
                    onChange={e => setTeacherNote(e.target.value)}
                    rows={4}
                    placeholder="ჩაწერეთ მასწავლებლის განმავითარებელი კომენტარი და რეკომენდაცია..."
                    className="w-full p-3 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 leading-relaxed focus:outline-emerald-600 print:border-none print:p-0 print:text-xs"
                  />

                  <div className="flex justify-end print:hidden">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>შეფასების შენახვა</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Breakdown of All 10 Questions */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    მოსწავლის პასუხების გარჩევა (10 დავალება):
                  </h3>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 print:max-h-none print:overflow-visible">
                    {selectedSubmission.answers.map((ans, idx) => (
                      <div
                        key={ans.questionId || idx}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white print:p-2 print:mb-2 print:border-slate-300 shadow-xs"
                      >
                        {/* ONLY THE QUESTION IS GREEN */}
                        <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-600 mb-3 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                              დავალება #{idx + 1} • {ans.topic}
                            </span>
                            <span className="text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
                              {ans.isCorrect ? 'სწორია (+10 ქულა)' : 'არასწორია (0 ქულა)'}
                            </span>
                          </div>
                          <h4 className="font-black text-emerald-950 text-xs sm:text-sm">
                            {ans.questionText}
                          </h4>
                        </div>

                        {/* ANSWERS: STRICTLY NEUTRAL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase mb-0.5">
                              მოსწავლის პასუხი:
                            </span>
                            <span className={`font-semibold ${ans.isCorrect ? 'text-slate-900' : 'text-rose-600'}`}>
                              {ans.selectedText}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase mb-0.5">
                              სწორი პასუხი:
                            </span>
                            <span className="font-semibold text-slate-900">
                              {ans.correctText}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed print:bg-white print:border-slate-300">
                          <span className="font-bold text-slate-800">განმარტება: </span>
                          {ans.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature line on single student print */}
                <div className="hidden print:flex justify-between pt-6 text-xs font-bold border-t border-slate-400 mt-6">
                  <span>მასწავლებლის ხელმოწერა: _________________________</span>
                  <span>თარიღი: _________________________</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'analysis' ? (
        /* ===================== TAB 2: INTERACTIVE CLASS TASK ANALYSIS VIEW ===================== */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                პედაგოგიური რეზიუმე
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                კლასში ჩატარებული ტესტური დავალების ანალიზი
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ფიზიკა • {selectedClassFilter === 'all' ? 'VIII კლასი' : selectedClassFilter} • თემა: „ენერგია და გარემო“ • მონაწილე: {totalSubmissions} მოსწავლე
              </p>
            </div>

            <button
              onClick={handlePrintClassAnalysis}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ანალიზის ამობეჭდვა</span>
            </button>
          </div>

          {/* Cards: Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">საშუალო ქულა</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">{averageScore} <span className="text-sm text-slate-400">/ 100</span></span>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">განმსაზღვრელი მაჩვენებელი</span>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
              <span className="text-[11px] font-bold text-indigo-700 uppercase block">10-ბალიანი საშუალო</span>
              <span className="text-3xl font-black text-indigo-900 mt-1 block">{averageGrade10} <span className="text-sm text-indigo-400">/ 10</span></span>
              <span className="text-[11px] font-semibold text-indigo-700 mt-1 block">ეროვნული სკალა</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-700 uppercase block">გაფართოებული დონე</span>
              <span className="text-3xl font-black text-emerald-900 mt-1 block">{advancedPct}%</span>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">{advancedCount} მოსწავლე</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-700 uppercase block">დამოუკიდებელი დონე</span>
              <span className="text-3xl font-black text-amber-900 mt-1 block">{independentPct}%</span>
              <span className="text-[11px] font-semibold text-amber-700 mt-1 block">{independentCount} მოსწავლე</span>
            </div>
          </div>

          {/* 3-Level Distribution Bar */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>სამდონიანი შეფასების გადანაწილება კლასში:</span>
            </h3>

            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${advancedPct}%` }} className="bg-emerald-500" title={`გაფართოებული: ${advancedPct}%`} />
              <div style={{ width: `${independentPct}%` }} className="bg-amber-500" title={`დამოუკიდებელი: ${independentPct}%`} />
              <div style={{ width: `${supportPct}%` }} className="bg-rose-500" title={`მხარდაჭერა: ${supportPct}%`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">გაფართოებული / შემოქმედებითი</span>
                  <span className="text-[11px] text-slate-500">{advancedCount} მოსწავლე ({advancedPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">დამოუკიდებელი</span>
                  <span className="text-[11px] text-slate-500">{independentCount} მოსწავლე ({independentPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-rose-200">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">საჭიროებს მხარდაჭერას</span>
                  <span className="text-[11px] text-slate-500">{supportCount} მოსწავლე ({supportPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Success Rate */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              თემატური კომპეტენციების წარმატება:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(topicStats).map(([topic, data]) => {
                const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={topic} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">თემა: „{topic}“</span>
                      <span className="text-slate-900 font-black">{pct}% ({data.correct}/{data.total} სწორი)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${
                          pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pedagogical Conclusions & Class Recommendations */}
          <div className="p-5 bg-amber-50/70 border-2 border-amber-200 rounded-2xl space-y-2.5 text-xs">
            <h3 className="font-black text-amber-950 text-sm flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>მასწავლებლის დასკვნა და რეკომენდაციები კლასისთვის:</span>
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              კლასის საერთო შედეგი ({averageScore}% საშუალო ქულა) აჩვენებს, რომ მოსწავლეებმა კარგად გაითავისეს ენერგიის ძირითადი ცნებები. შემდგომ გაკვეთილებზე რეკომენდებულია მეტი დრო დაეთმოს კომპლექსურ პრაქტიკულ ამოცანებსა და ენერგიის შენახვის კანონის გამოყენებას რეალურ ყოფით სიტუაციებში.
            </p>
          </div>
        </div>
      ) : (
        /* ===================== TAB 3: RECOMMENDATION RUBRIC & ACTION PLAN FOR TEACHER ===================== */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm print:hidden animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                პედაგოგიური გეგმა და მეთოდიკა
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-600" />
                <span>შედეგებზე დაფუძნებული რეკომენდაციის რუბრიკა და სამოქმედო გეგმა</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {selectedClassFilter === 'all' ? 'სრული საკლასო კონტინგენტი (VIII კლასი)' : `${selectedClassFilter} კლასის გაანალიზებული შედეგები`} • {totalSubmissions} მოსწავლე
              </p>
            </div>

            <button
              onClick={handlePrintClassPlan}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>რუბრიკისა და გეგმის ამობეჭდვა</span>
            </button>
          </div>

          {/* Quick Context Summary Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-indigo-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                {averageScore}%
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">
                  კლასის წარმატების დონე: {averageGrade10} / 10 ქულა (საშუალო)
                </span>
                <span className="text-slate-600 font-medium text-[11px]">
                  გაფართოებული: {advancedPct}% • დამოუკიდებელი: {independentPct}% • მხარდაჭერა: {supportPct}%
                </span>
              </div>
            </div>

            <span className="px-3 py-1 bg-white border border-amber-300 text-amber-900 font-bold rounded-xl text-xs">
              საგანი: ფიზიკა • VIII კლასი
            </span>
          </div>

          {/* RUBRIC: 3 Detailed Level Cards with Guidance & Resources */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>I. დიფერენცირებული რეკომენდაციების რუბრიკა მიღწევის დონეების მიხედვით:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Advanced Level */}
              <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black">
                    გაფართოებული / შემოქმედებითი
                  </span>
                  <span className="text-xs font-black text-emerald-900">
                    {advancedCount} მოსწ. ({advancedPct}%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block text-[11px] uppercase">დიაგნოსტიკა:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      მოსწავლეები 100%-ით ან 80-90%-ით სწორად პასუხობენ ენერგიის რთულ გარდაქმნებს, ზუსტად განასხვავებენ ენერგორესურსებს.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-800 block text-[11px] uppercase">რეკომენდაცია მასწავლებელს:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      შეთავაზეთ ოლიმპიადის ტიპის ამოცანები, კვლევითი პროექტები ენერგოდამზოგავ ტექნოლოგიებზე და ჩართეთ თანატოლთა სწავლებაში (Peer-tutoring).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-200">
                    <span className="font-bold text-slate-600 block text-[11px]">სასწავლო რესურსები:</span>
                    <span className="text-[11px] text-emerald-950 font-bold block mt-0.5">
                      • კომპლექსური ფიზიკის ამოცანები, სიმულაციური ლაბორატორია.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Independent Level */}
              <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-black">
                    დამოუკიდებელი
                  </span>
                  <span className="text-xs font-black text-amber-900">
                    {independentCount} მოსწ. ({independentPct}%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block text-[11px] uppercase">დიაგნოსტიკა:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      საბაზისო კითხვებს დამოუკიდებლად ხსნიან, მაგრამ უჭირთ ენერგიის მრავალსაფეხურიანი გარდაქმნა და სათბურის ეფექტი.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 block text-[11px] uppercase">რეკომენდაცია მასწავლებელს:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      გამოიყენეთ გრაფიკული სქემები, შეცდომების თვითანალიზის ბარათები, პრაქტიკული ენერგეტიკული ჯაჭვების შედგენა.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-200">
                    <span className="font-bold text-slate-600 block text-[11px]">სასწავლო რესურსები:</span>
                    <span className="text-[11px] text-amber-950 font-bold block mt-0.5">
                      • ვიზუალური ბარათები, ენერგიის გარდაქმნის სქემები.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Needs Support Level */}
              <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-black">
                    საჭიროებს მხარდაჭერას
                  </span>
                  <span className="text-xs font-black text-rose-900">
                    {supportCount} მოსწ. ({supportPct}%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block text-[11px] uppercase">დიაგნოსტიკა:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      უჭირთ კინეტიკური და პოტენციური ენერგიის განმარტება, ერევათ ბუნებრივი და ხელოვნური სინათლის წყაროები.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-rose-800 block text-[11px] uppercase">რეკომენდაცია მასწავლებელს:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      ჩაატარეთ ინდივიდუალური კონსულტაციები, მიეცით საყრდენი ბარათები და მარტივი ყოფითი მაგალითებით გაიმეორეთ ცნებები.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-200">
                    <span className="font-bold text-slate-600 block text-[11px]">სასწავლო რესურსები:</span>
                    <span className="text-[11px] text-rose-950 font-bold block mt-0.5">
                      • საყრდენი ცხრილები, ილუსტრირებული მინი-ტესტები.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Plan Section */}
          <div className="space-y-3 pt-2">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>II. მასწავლებლის ეტაპობრივი სამოქმედო გეგმა კლასისთვის (Action Plan):</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center font-black">1</span>
                  <span>მოკლევადიანი ეტაპი (1-2 კვ.)</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">შეცდომების ანალიზი და გამეორება</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  • ტესტში დაშვებული ტიპური შეცდომების საკლასო გარჩევა.<br />
                  • ინდივიდუალური 15-წუთიანი შეხვედრები მხარდაჭერის საჭიროების მქონე მოსწავლეებთან.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center font-black">2</span>
                  <span>საშუალოვადიანი ეტაპი (3-4 კვ.)</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">დიფერენცირებული პრაქტიკა</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  • ენერგიის ურთიერთგარდაქმნის სიმულაციური მოდელირება.<br />
                  • შერეული წყვილების მუშაობა (გაფართოებული + დამოუკიდებელი დონე) თანატოლთა სწავლებისთვის.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center font-black">3</span>
                  <span>მონიტორინგის ეტაპი</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">პროგრესის შემოწმება</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  • მოკლე 5-წუთიანი განმამტკიცებელი ტესტირების ჩატარება.<br />
                  • განმავითარებელი კომენტარების განახლება და პროგრესის დაფიქსირება ჟურნალში.
                </p>
              </div>
            </div>
          </div>

          {/* Customizable Teacher Plan Note */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-600" />
                <span>მასწავლებლის ინდივიდუალური ჩანაწერი და მორგებული გეგმა კლასისთვის:</span>
              </span>
              {isSavedPlanNote && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> გეგმა შენახულია!
                </span>
              )}
            </div>

            <textarea
              value={customPlanNote}
              onChange={e => setCustomPlanNote(e.target.value)}
              rows={3}
              placeholder="ჩაწერეთ თქვენი კონკრეტული სამოქმედო გეგმა ამ კლასისთვის..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 leading-relaxed focus:outline-emerald-600"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSavePlanNote}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>გეგმის შენახვა</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share with Colleagues Modal */}
      <ShareWithColleaguesModal
        isOpen={isShareColleaguesOpen}
        onClose={() => setIsShareColleaguesOpen(false)}
      />
    </div>
  );
};
