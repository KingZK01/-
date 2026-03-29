/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, Circle, GraduationCap, LayoutDashboard, ListTodo, Info, ChevronDown, ChevronUp, FileText, BookA, Target, BrainCircuit, PenTool, Lightbulb, Play, Pause, Volume2 } from 'lucide-react';
import { lessons, Lesson, LessonType } from './data/lessons';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'guidelines'>('schedule');
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const toggleLesson = (id: number) => {
    setCompletedLessons(prev => {
      const newCompleted = prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id];
      localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  const semester1Lessons = lessons.filter(l => l.semester === 1);
  const semester2Lessons = lessons.filter(l => l.semester === 2);

  const calculateProgress = (semLessons: Lesson[]) => {
    const completed = semLessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / semLessons.length) * 100);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">رهنمود و تقسیم‌اوقات تدریس قرآن‌کریم</h1>
              <p className="text-emerald-100 mt-1">صنف ششم - مکاتب امارت اسلامی افغانستان</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Note about 5th vs 6th grade */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3 text-amber-800">
          <Info className="w-6 h-6 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed">
            <strong>یادداشت:</strong> شما در درخواست خود «صنف پنجم» ذکر کرده بودید، اما کتابی که ارسال نمودید مربوط به <strong>«صنف ششم»</strong> می‌باشد. این برنامه بر اساس محتویات کتاب صنف ششم ساخته شده است.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'schedule'
                ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            تقسیم‌اوقات درسی
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'guidelines'
                ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            رهنمود تدریس
          </button>
        </div>

        {activeTab === 'schedule' ? (
          <div className="space-y-8">
            {/* Semester 1 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">چهار و نیم ماه اول (امتحان وسط سال)</h2>
                  <p className="text-sm text-slate-500 mt-1">شامل {semester1Lessons.length} درس (تلاوت و حفظ)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-slate-600">{calculateProgress(semester1Lessons)}% تکمیل</div>
                  <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${calculateProgress(semester1Lessons)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {semester1Lessons.map(lesson => (
                  <LessonRow 
                    key={lesson.id} 
                    lesson={lesson} 
                    isCompleted={completedLessons.includes(lesson.id)}
                    onToggle={() => toggleLesson(lesson.id)}
                  />
                ))}
              </div>
            </section>

            {/* Semester 2 */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">چهار و نیم ماه دوم (امتحان سالانه)</h2>
                  <p className="text-sm text-slate-500 mt-1">شامل {semester2Lessons.length} درس (تلاوت و حفظ)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-slate-600">{calculateProgress(semester2Lessons)}% تکمیل</div>
                  <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${calculateProgress(semester2Lessons)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {semester2Lessons.map(lesson => (
                  <LessonRow 
                    key={lesson.id} 
                    lesson={lesson} 
                    isCompleted={completedLessons.includes(lesson.id)}
                    onToggle={() => toggleLesson(lesson.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-emerald-600" />
              یادداشت و رهنمود تدریس
            </h2>
            
            <div className="prose prose-slate prose-emerald max-w-none">
              <blockquote className="border-r-4 border-emerald-500 bg-emerald-50 p-4 rounded-l-lg text-emerald-900 font-medium mb-8">
                رسول الله ﷺ می‌فرماید: «خَیْرُکُم مَن تَعَلَّمَ القُرآنَ وَ عَلَّمَهُ» بهترین شما کسی است که قرآن را می‌آموزد و برای دیگران می‌آموزاند.
              </blockquote>

              <p className="text-slate-700 leading-relaxed mb-6">
                معلمین محترم در تدریس این مضمون سعی ورزند تا به هدف عالی آموزش درست قرآن‌کریم برای شاگردان دست یابند. جهت تدریس درست مضمون آموزش قرآن‌کریم، نکات مهم قرار ذیل تقدیم می‌گردد:
              </p>

              <ul className="space-y-4 text-slate-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۱</span>
                  <p>این مضمون مشتمل است بر بخش‌های معلومات در مورد قرآن‌کریم، روخوانی و حفظ سوره‌های (الضحی، الشرح، التین و العلق) می‌باشد.</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۲</span>
                  <div>
                    <p className="mb-2">مضمون آموزش قرآن‌کریم دارای هفتاد و هفت درس بوده، و در هفتاد و هشت ساعت درسی در یک سال تعلیمی طور ذیل تقسیم گردیده است:</p>
                    <ul className="list-disc list-inside pr-4 space-y-2 text-slate-600">
                      <li>برای بخش حفظ سوره‌های فوق هشت ساعت درسی، و برای دروس متباقی هفتاد ساعت درسی در نظر گرفته شده است.</li>
                      <li>حفظ سورۀ الضحی و الشرح قبل از امتحان چهارونیم ماه و حفظ سورۀ التین و العلق بعد از امتحان چهارونیم ماه تعیین گردیده است.</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۳</span>
                  <p>شاگردان باید در مضمون آموزش قرآن‌کریم، نطق صحیح حروف هجا را بیاموزند.</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۴</span>
                  <p>برای شاگردان تلقین شود تا در تلاوت و حمل کتاب آموزش قرآن‌کریم آداب آن را رعایت نمایند.</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۵</span>
                  <p>معلم محترم در جریان تدریس مضمون آموزش قرآن‌کریم از مهربانی کار گرفته، همواره شاگردان را همکاری و تشویق می‌کند و از هر نوع توهین و تحقیر به آن‌ها خود داری می‌نماید.</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function LessonRow({ lesson, isCompleted, onToggle }: { key?: React.Key, lesson: Lesson, isCompleted: boolean, onToggle: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (verseNumber: number, audioUrl: string) => {
    if (playingVerse === verseNumber) {
      // Pause if currently playing
      audioRef.current?.pause();
      setPlayingVerse(null);
    } else {
      // Play new verse
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingVerse(null);
      audio.play();
      audioRef.current = audio;
      setPlayingVerse(verseNumber);
    }
  };

  // Cleanup audio on unmount or when expanded state changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isExpanded]);

  const getTypeColor = (type: LessonType) => {
    switch (type) {
      case 'hifz': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'tajweed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getTypeName = (type: LessonType) => {
    switch (type) {
      case 'hifz': return 'حفظ';
      case 'tajweed': return 'احکام / معلومات';
      case 'review': return 'مراجعه / تکرار';
      default: return 'تلاوت';
    }
  };

  return (
    <div className={`transition-colors ${isCompleted ? 'opacity-75 bg-slate-50/50' : 'bg-white'}`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-400 w-6">#{lesson.id}</span>
              <h3 className={`font-medium ${isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                {lesson.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-1.5 mr-9">
              <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${getTypeColor(lesson.type)}`}>
                {getTypeName(lesson.type)}
              </span>
              <span className="text-xs text-slate-400">صفحه {lesson.page}</span>
            </div>
          </div>
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 mr-9 ml-4">
          <div className="space-y-4 mt-4">
            
            {lesson.verses && lesson.verses.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4 text-sm">
                  <Volume2 className="w-4 h-4 text-sky-500" />
                  تلاوت آیات
                </h4>
                <div className="space-y-4">
                  {lesson.verses.map((verse, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex-1 text-right">
                        <p className="text-xl leading-loose font-arabic text-slate-800" dir="rtl">
                          {verse.text}
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-slate-300 text-[10px] text-slate-500 mr-2 font-sans">
                            {verse.numberInSurah}
                          </span>
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-center justify-center sm:justify-start gap-2 sm:border-r border-slate-200 sm:pr-4">
                        <button
                          onClick={() => handlePlayAudio(verse.numberInSurah, verse.audio)}
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            playingVerse === verse.numberInSurah
                              ? 'bg-sky-100 text-sky-600 shadow-inner'
                              : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:border-sky-300 hover:text-sky-500'
                          }`}
                        >
                          {playingVerse === verse.numberInSurah ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.content && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  محتوای درس
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {lesson.content}
                </p>
              </div>
            )}

            {lesson.practiceWords && lesson.practiceWords.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-sm">
                  <BookA className="w-4 h-4 text-emerald-500" />
                  کلمات تمرینی
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.practiceWords.map((word, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-lg text-lg font-arabic">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lesson.tajweedRule && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  قاعده تجویدی / رهنمود
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {lesson.tajweedRule}
                </p>
              </div>
            )}

            {lesson.activities && lesson.activities.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2 text-sm">
                  <Target className="w-4 h-4 text-purple-500" />
                  فعالیت‌ها
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {lesson.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.evaluation && lesson.evaluation.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2 text-sm">
                  <BrainCircuit className="w-4 h-4 text-rose-500" />
                  ارزیابی
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {lesson.evaluation.map((evalItem, idx) => (
                    <li key={idx}>{evalItem}</li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.homework && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2 text-sm">
                  <PenTool className="w-4 h-4 text-indigo-500" />
                  کارخانگی
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {lesson.homework}
                </p>
              </div>
            )}

            {/* Fallback if no details are present */}
            {!lesson.content && (!lesson.verses || lesson.verses.length === 0) && (!lesson.practiceWords || lesson.practiceWords.length === 0) && !lesson.tajweedRule && (!lesson.activities || lesson.activities.length === 0) && (!lesson.evaluation || lesson.evaluation.length === 0) && !lesson.homework && (
              <div className="text-center py-4 text-slate-400 text-sm">
                جزئیات بیشتری برای این درس ثبت نشده است.
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;

