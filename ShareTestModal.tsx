import React, { useState } from 'react';
import { Copy, Check, Share2, MessageSquare, Send, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface ShareTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass?: string;
}

export const ShareTestModal: React.FC<ShareTestModalProps> = ({
  isOpen,
  onClose,
  defaultClass = 'VIII-ა',
}) => {
  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedChatText, setCopiedChatText] = useState(false);

  if (!isOpen) return null;

  // Construct absolute student link with parameters so students land directly in student mode with class preset
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const testUrl = `${baseUrl}?mode=student&class=${encodeURIComponent(selectedClass)}`;

  // Formatted invitation text ready to be pasted straight into Microsoft Teams, Messenger, Zoom, Viber, WhatsApp or Google Classroom chat
  const chatMessage = `⚡ ძვირფასო მოსწავლეებო (${selectedClass})!\nგთხოვთ გადახვიდეთ მოცემულ ბმულზე და შეასრულოთ ფიზიკის ტესტური დავალება „ენერგია ჩვენს გარშემო“:\n👉 ${testUrl}\n\n🔓 რეგისტრაცია არ არის საჭირო! ლინკი იხსნება პირდაპირ ნებისმიერ მოწყობილობაზე (ტელეფონი, კომპიუტერი, პლანშეტი).\n\n📌 ინსტრუქცია:\n1. გადადით ბმულზე (არანაირი რეგისტრაცია ან პაროლი არ გჭირდებათ);\n2. მიუთითეთ თქვენი რიგითი ნომერი ჟურნალში (ან დაიწყეთ პირდაპირ);\n3. შეასრულეთ 10 ტესტური კითხვა და გაეცანით შედეგს!\n\nტესტის დასრულებისთანავე თქვენი ნამუშევარი ავტომატურად გადაეგზავნება მასწავლებელს. წარმატებები!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(testUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyChatMessage = async () => {
    try {
      await navigator.clipboard.writeText(chatMessage);
      setCopiedChatText(true);
      setTimeout(() => setCopiedChatText(false), 2500);
    } catch {
      // Fallback
      setCopiedChatText(true);
      setTimeout(() => setCopiedChatText(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-inner">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                ტესტის გაგზავნა მოსწავლეებისთვის
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                გაუზიარეთ ლინკი ერთიანად მთელ კლასს საერთო ჩატში (Teams, Zoom, Classroom)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Access No Registration Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center gap-2 text-xs text-emerald-900 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>🔓 რეგისტრაციის გარეშე — ვისთანაც მივა ეს ლინკი, ყველა ხსნის მას მარტივად და პირდაპირ!</span>
        </div>

        {/* Class Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            აირჩიეთ კლასი ან ჩაწერეთ:
          </label>
          <div className="flex gap-2">
            {['VIII-ა', 'VIII-ბ', 'VIII-გ'].map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedClass === cls
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
            <input
              type="text"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex-1 focus:bg-white focus:outline-violet-600"
              placeholder="სხვა კლასი..."
            />
          </div>
        </div>

        {/* 1. Direct URL Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>🔗 ტესტის პირდაპირი ლინკი მოსწავლეებისთვის:</span>
            {copiedLink && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> დაკოპირებულია!
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-700 select-all truncate">
              {testUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'კოპირებულია' : 'ლინკის კოპირება'}</span>
            </button>
          </div>
        </div>

        {/* 2. Ready-to-send Chat Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
              <span>მზა შეტყობინება ჩატში ჩასასმელად:</span>
            </span>
            {copiedChatText && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> ტექსტი დაკოპირებულია!
              </span>
            )}
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-36 overflow-y-auto">
            {chatMessage}
          </div>
        </div>

        {/* Privacy & Security Note */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>მოსწავლეთა დაცულობა:</strong> ამ ლინკით შემოსულ მოსწავლეს გაეხსნება მხოლოდ ტესტი და მოსწავლის ბლოკი. მასწავლებლის შეფასების ჟურნალი და პასუხების ანალიტიკა მოსწავლისთვის სრულად დამალული და დაცულია.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={handleCopyChatMessage}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedChatText ? (
              <>
                <Check className="w-4 h-4" />
                <span>ჩატის ტექსტი დაკოპირებულია!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ტექსტის კოპირება ჩატში გასაგზავნად</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            დახურვა
          </button>
        </div>
      </div>
    </div>
  );
};
