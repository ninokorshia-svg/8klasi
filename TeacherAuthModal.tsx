import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'teachers') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                მასწავლებლის ავტორიზაცია
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                დაცული გვერდი მასწავლებლისთვის
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>შეიყვანეთ კოდური სიტყვა:</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="ჩაწერეთ: Teachers"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold text-slate-800 transition-all ${
                error
                  ? 'border-rose-400 bg-rose-50/50 focus:outline-rose-500'
                  : 'border-slate-200 bg-slate-50 focus:bg-white focus:outline-amber-600'
              }`}
            />
            {error && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>კოდური სიტყვა არასწორია! გამოიყენეთ: Teachers</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 font-medium">
              მასწავლებლის ჟურნალში შესასვლელად გამოიყენეთ სიტყვა: <strong className="text-slate-600">Teachers</strong>
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>შესვლა</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
