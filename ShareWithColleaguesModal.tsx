import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  X, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Send, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Mail
} from 'lucide-react';

interface ShareWithColleaguesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWithColleaguesModal: React.FC<ShareWithColleaguesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'detailed' | 'short'>('detailed');

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const colleagueUrl = `${baseUrl}?role=teacher`;

  const detailedMessage = `📚 ძვირფასო კოლეგებო!\n\nგიზიარებთ VIII კლასის ფიზიკის ინტერაქტიულ სასწავლო და შესაფასებელ რესურსს თემაზე: „ენერგია და გარემო“ ⚡\n\n🔓 რეგისტრაცია არ არის საჭირო — ბმული იხსნება პირდაპირ, ყოველგვარი ანგარიშის, ავტორიზაციისა და პაროლების გარეშე!\n\n📌 რესურსის ძირითადი შესაძლებლობები:\n1. 🧪 ინტერაქტიული ქვიზი მოსწავლეებისთვის (10 საკვანძო კითხვა ენერგიის გარდაქმნაზე, განახლებად რესურსებსა და ეკოლოგიაზე);\n2. 📊 ავტომატური განმავითარებელი შეფასება 3 დონით:\n   • საჭიროებს მხარდაჭერას (0-50 ქულა)\n   • დამოუკიდებელი (60-70 ქულა)\n   • გაფართოებული / შემოქმედებითი (80-100 ქულა)\n3. 🎓 მასწავლებლის ელექტრონული ჟურნალი:\n   • თითოეული მოსწავლის ინდივიდუალური ბარათი და პასუხების დეტალური ანალიზი;\n   • კლასის საერთო შედეგების ანალიტიკა და სარეკომენდაციო რუბრიკა;\n   • საკლასო უწყისის, მოსწავლის ბარათისა და ანალიზის მზა ამობეჭდვის (Print) ფუნქცია;\n4. 🔗 ტესტის გაგზავნა მოსწავლეებისთვის პირდაპირი ლინკით — მოსწავლეები ხედავენ მხოლოდ ტესტს, ხოლო მასწავლებლის ბლოკი მათთვის სრულად დაცული და დამალულია.\n\n🔗 რესურსის პირდაპირი ბმული მასწავლებლებისთვის:\n👉 ${colleagueUrl}\n\nწარმატებულ და ნაყოფიერ სასწავლო პროცესს გისურვებთ!`;

  const shortMessage = `⚡ კოლეგებო, გაეცანით და გამოიყენეთ VIII კლასის ფიზიკის ინტერაქტიული რესურსი „ენერგია და გარემო“ (ტესტირება + ავტომატური შეფასების ჟურნალი მასწავლებლებისთვის):\n👉 ${colleagueUrl}\n🔓 რეგისტრაცია არ არის საჭირო — იხსნება პირდაპირ!`;

  const messageToCopy = selectedFormat === 'detailed' ? detailedMessage : shortMessage;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(colleagueUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('ფიზიკის სასწავლო რესურსი: ენერგია და გარემო (VIII კლასი)');
    const body = encodeURIComponent(detailedMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-blue-100 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black uppercase">
                  კოლეგებისთვის
                </span>
                <span className="text-xs text-slate-400 font-medium">სასწავლო რესურსი</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                რესურსის გაზიარება კოლეგებისთვის
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                გაუზიარეთ ეს ინსტრუმენტი სხვა მასწავლებლებს, რათა გამოიყენონ თავიანთ კლასებში
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights for Colleagues */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs">
              <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
              <span>მზა ჟურნალი</span>
            </div>
            <p className="text-[11px] text-blue-950 leading-snug">
              ავტომატური შეფასება, სტატისტიკა და საკლასო უწყისები.
            </p>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs">
              <Send className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>მოსწავლის ლინკი</span>
            </div>
            <p className="text-[11px] text-emerald-950 leading-snug">
              მოსწავლეებს ეგზავნებათ მხოლოდ ტესტი; ჟურნალი დაცულია.
            </p>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-900 font-black text-xs">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>3 დონე</span>
            </div>
            <p className="text-[11px] text-indigo-950 leading-snug">
              ეროვნული სასწავლო გეგმის შესაბამისი განმავითარებელი რუბრიკა.
            </p>
          </div>
        </div>

        {/* Direct Link Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🔗 რესურსის პირდაპირი ბმული კოლეგებისთვის:</span>
            </span>
            {copiedLink && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> ბმული დაკოპირებულია!
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-slate-700 select-all truncate">
              {colleagueUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'დაკოპირდა' : 'ბმულის კოპირება'}</span>
            </button>
          </div>
        </div>

        {/* Message Format Selector & Ready Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>მზა სარეკომენდაციო წერილი კოლეგებისთვის:</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedFormat('detailed')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedFormat === 'detailed' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                სრული აღწერა
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('short')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedFormat === 'short' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                მოკლე ბმული
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-44 overflow-y-auto">
            {messageToCopy}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={handleCopyText}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                copiedText
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'ტექსტი დაკოპირებულია!' : 'მთლიანი ტექსტის კოპირება ჩატისთვის'}</span>
            </button>

            <button
              onClick={handleEmailShare}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 cursor-pointer border border-slate-200 transition-colors"
              title="ელ-ფოსტით გაგზავნა"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>ელ-ფოსტით გაგზავნა</span>
            </button>
          </div>
        </div>

        {/* Direct Access & No Registration Note */}
        <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px] leading-relaxed">
            <p>
              <strong>🔓 რეგისტრაციის გარეშე პირდაპირი წვდომა:</strong> ვისთანაც მივა ეს ლინკი, ყველა კოლეგას შეუძლია მისი გახსნა ყოველგვარი რეგისტრაციის, ავტორიზაციისა და პაროლის გარეშე. რესურსი მყისიერად მზადაა გამოსაყენებლად!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            დახურვა
          </button>
        </div>
      </div>
    </div>
  );
};
