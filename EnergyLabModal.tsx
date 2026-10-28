import React, { useState } from 'react';
import { BookOpen, X, Zap, Sun, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface EnergyLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnergyLabModal: React.FC<EnergyLabModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'forms' | 'sources' | 'ecology'>('forms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ენერგიის მოკლე გზამკვლევი</h2>
              <p className="text-xs text-emerald-100 font-medium">მე-8 კლასის ფიზიკის სასწავლო მასალა</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            aria-label="დახურვა"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'forms'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>ენერგიის სახეები</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sources'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-4 h-4 text-emerald-600" />
            <span>განახლებადი vs არაგანახლებადი</span>
          </button>
          <button
            onClick={() => setActiveTab('ecology')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ecology'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <span>ეკოლოგია და CO₂</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          {activeTab === 'forms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h3 className="font-bold text-amber-900 text-base mb-1 flex items-center gap-2">
                  <span className="text-xl">🏃</span> კინეტიკური ენერგია (მოძრაობა)
                </h3>
                <p>
                  ენერგია, რომელიც გააჩნია <strong>მოძრავ სხეულს</strong>. რაც მეტია სხეულის მასა და სიჩქარე, მით მეტია მისი კინეტიკური ენერგია. მაგალითად: მოძრავი ავტომობილი, მორბენალი მდინარე, ქარი, მოძრავი წიგნი.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <h3 className="font-bold text-sky-900 text-base mb-1 flex items-center gap-2">
                  <span className="text-xl">🏔️</span> პოტენციური ენერგია (მარაგი / ურთიერთქმედება)
                </h3>
                <p>
                  <strong>გრავიტაციული:</strong> სიმაღლეზე აწეულ სხეულს (მაგ. კაშხალში დაგუბებულ წყალს, თაროზე დადებულ წიგნს) დედამიწის მიზიდულობის გამო გააჩნია პოტენციური ენერგია.
                  <br />
                  <strong>დრეკადობის:</strong> მოჭიმულ მშვილდს ან შეკუმშულ ზამბარას დეფორმაციის გამო აქვს დრეკადობის პოტენციური ენერგია.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <h3 className="font-bold text-purple-900 text-base mb-1 flex items-center gap-2">
                  <span className="text-xl">🧪</span> ქიმიური და ელექტრული ენერგია
                </h3>
                <p>
                  <strong>ქიმიური:</strong> დაგროვილია ნივთიერების მოლეკულურ ბმებში (ქვანახშირი, ნავთობი, ბუნებრივი აირი, საკვები, ელექტრული ბატარეა). წვის ან ქიმიური რეაქციისას გარდაიქმნება სითბოდ ან ელექტროენერგიად.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white mb-2">
                    განახლებადი წყაროები
                  </span>
                  <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="text-base">☀️</span> <strong>მზე:</strong> ფოტოელემენტებით პირდაპირ დენად გარდაიქმნება.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">💨</span> <strong>ქარი:</strong> ტურბინით ჰაერის კინეტიკურ ენერგიას გარდაქმნის.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">💧</span> <strong>წყალი (ჰესი):</strong> მდინარის ვარდნა ატრიალებს ტურბინას.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">🌋</span> <strong>გეოთერმული:</strong> დედამიწის წიაღის სითბო.
                    </li>
                  </ul>
                  <p className="mt-3 text-[11px] text-emerald-800 bg-white/70 p-2 rounded-xl">
                    ✅ <strong>უპირატესობა:</strong> ბუნებრივად ივსება, ექსპლუატაციისას არ აბინძურებს ჰაერს და არ გამოყოფს CO₂-ს.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white mb-2">
                    არაგანახლებადი (წიაღისეული)
                  </span>
                  <ul className="space-y-2 text-xs text-rose-950 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="text-base">🪨</span> <strong>ქვანახშირი:</strong> უძველესი მცენარეების ნაშთი.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">🛢️</span> <strong>ნავთობი:</strong> ზღვის ორგანიზმებისგან მილიონობით წელში.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">🔥</span> <strong>ბუნებრივი აირი (მეთანი):</strong> მიწისქვეშა გაზი.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-base">☢️</span> <strong>ურანი (ატომური):</strong> შეზღუდული მარაგი.
                    </li>
                  </ul>
                  <p className="mt-3 text-[11px] text-rose-800 bg-white/70 p-2 rounded-xl">
                    ⚠️ <strong>გამოწვევა:</strong> მარაგები იწურება, წვისას ჰაერში გამოყოფს უზარმაზარი რაოდენობით სათბურის აირებს (CO₂).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ecology' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h3 className="font-bold text-teal-900 text-base mb-2">
                  🌡️ რა არის სათბურის ეფექტი და გლობალური დათბობა?
                </h3>
                <p className="text-xs text-teal-950">
                  როდესაც თბოელექტროსადგურებში ან მანქანებში ვწვავთ ნახშირს, ნავთობსა და გაზს, ატმოსფეროში ხვდება <strong>ნახშირორჟანგი (CO₂)</strong>. ეს აირი დედამიწის გარშემო ქმნის „სათბურის ფენას“, რომელიც ხელს უშლის სითბოს კოსმოსში გასვლას, იწვევს მყინვარების დნობასა და კლიმატის კატასტროფულ ცვლილებებს.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h3 className="font-bold text-indigo-900 text-base mb-2">
                  🌱 როგორ გადავარჩინოთ პლანეტა?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 block mb-1">1. მწვანე ენერგია</span>
                    მზისა და ქარის ელექტროსადგურების წილის გაზრდა.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 block mb-1">2. ენერგოეფექტურობა</span>
                    LED ნათურების გამოყენება, გამოუყენებელი ტექნიკის გამორთვა.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 block mb-1">3. ტყეების დაცვა</span>
                    მცენარეები შთანთქავენ CO₂-ს და წარმოქმნიან ჟანგბადს.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>გასაგებია, მზად ვარ ქვიზისთვის</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
