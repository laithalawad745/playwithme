// components/NavBar.jsx
import React from 'react';

export default function NavBar({ 
  currentTurn,
  timer,
  timerActive,
  toggleTimer,
  resetTimer,
  currentChoiceQuestion,
  usingPitHelper,
  isAbsiMode
}) {
  
  // تحويل الثواني إلى تنسيق mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700 p-3">
      <div className="text-center">
        <div className={`inline-flex items-center px-4 md:px-8 py-2 md:py-4 rounded-2xl font-bold text-lg md:text-2xl shadow-lg transition-all duration-500 ${
          currentTurn === 'red' 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/25'
        }`}>
          
          {/* معلومات الفريق */}
          <div className="flex flex-col items-center">
            <span className="text-sm md:text-base opacity-90">دور</span>
            <span>{currentTurn === 'red' ? 'الفريق الأحمر' : 'الفريق الأزرق'}</span>
          </div>

          {/* التوقيت في المنتصف */}
          <div className="mx-4 md:mx-8 flex flex-col items-center">
            <div className={`text-2xl md:text-3xl font-mono font-bold px-3 py-1 rounded-lg ${
              currentChoiceQuestion 
                ? 'bg-purple-600/50 text-purple-100'
                : 'bg-black/30 text-white'
            }`}>
              {currentChoiceQuestion ? 'اختيارات' : formatTime(timer)}
            </div>
            
            {/* أزرار التحكم بالتوقيت */}
            {!currentChoiceQuestion && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={toggleTimer}
                  className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold transition-all duration-300 ${
                    timerActive 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {timerActive ? '⏸ إيقاف' : '▶ تشغيل'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold bg-slate-600 hover:bg-slate-700 text-white transition-all duration-300"
                >
                   إعادة
                </button>
              </div>
            )}
          </div>

          {/* المؤشرات الإضافية */}
          <div className="flex flex-col items-center gap-1">
            {usingPitHelper && (
              <span className="px-2 md:px-3 py-1 bg-orange-500 rounded-full text-xs md:text-sm animate-pulse">
                الحفرة مُفعلة
              </span>
            )}
            {isAbsiMode && (
              <span className="px-2 md:px-3 py-1 bg-yellow-500 rounded-full text-xs md:text-sm">
                 مباراة كاملة
              </span>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}