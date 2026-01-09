'use client'
import React, { useState } from 'react';

// بيانات اللعبة
const gameData = {
  sports: [
    { id: '1', name: ' راموس', image: '/players/1.jpg' },
    { id: '2', name: ' بالوتيلي', image: '/players/2.jpg' },
    { id: '3', name: ' محرز', image: '/players/3.jpg' },
    { id: '4', name: 'جورج ويا ', image: '/players/4.jpg' },
    { id: '5', name: ' البا', image: '/players/5.jpg' },
    { id: '6', name: ' ابو تريكة', image: '/players/6.jpg' },
    { id: '7', name: ' سواريز', image: '/players/7.jpg' },
    { id: '8', name: ' حمزة الدردور', image: '/players/8.jpg' },
    { id: '9', name: ' عموري', image: '/players/9.jpg' },
    { id: '10', name: ' ريكيلمي', image: '/players/10.jpg' }
  ],
  celebrities: [
    { id: '1', name: ' يويو', image: '/celebrities/1.jpg' },
    { id: '2', name: ' ابو الامير', image: '/celebrities/2.jpg' },
    { id: '3', name: ' سلطي', image: '/celebrities/3.jpg' },
    { id: '4', name: ' الاخوين', image: '/celebrities/4.jpg' },
    { id: '5', name: ' شونق', image: '/celebrities/5.jfif' },
    { id: '6', name: ' ماهر', image: '/celebrities/6.jpg' },
    { id: '7', name: ' دربحة', image: '/celebrities/7.jpg' },
    { id: '8', name: ' ابو الرب', image: '/celebrities/8.jpg' },
    { id: '9', name: ' بلانة', image: '/celebrities/9.jpg' },
    { id: '10', name: ' جو حطاب', image: '/celebrities/10.jpg' }
  ],
  discord: [
    { id: '1', name: ' سكنجت', image: '/discord/1.jpg' },
    { id: '2', name: ' هبيلة', image: '/discord/2.jpg' },
    { id: '3', name: ' موبايلات', image: '/discord/3.jpg' },
    { id: '4', name: ' دواوين', image: '/discord/4.jpg' },
    { id: '5', name: ' العو', image: '/discord/5.jpg' },
    { id: '6', name: ' الصورة تشرح', image: '/discord/6.jpg' },
    { id: '7', name: ' ابو الغيرة', image: '/discord/7.jpg' },
    { id: '8', name: ' هههههههه', image: '/discord/8.jpg' },
    { id: '9', name: ' عندك سناب', image: '/discord/9.jpg' },
    { id: '10', name: ' مصري 100 دولار', image: '/discord/10.jpg' }
  ],
  youtube: [
    { id: '1', name: 'مستر بيست', image: '/youtube/1.jpg' },
    { id: '2', name: 'سبيد ', image: '/youtube/2.jpg' },
    { id: '3', name: 'بندر', image: '/youtube/3.jpg' },
    { id: '4', name: 'ابو فلة', image: '/youtube/4.jpg' },
    { id: '5', name: 'ابو خليل', image: '/youtube/5.jpg' },
    { id: '6', name: 'بشار عربي', image: '/youtube/6.jpg' },
    { id: '7', name: 'البياتي', image: '/youtube/7.jpg' },
    { id: '8', name: 'ابو طلال', image: '/youtube/8.jpg' },
    { id: '9', name: 'محمد عدنان', image: '/youtube/9.jpg' },
    { id: '10', name: 'مليون روسيس', image: '/youtube/10.jpg' }
  ],
  eat: [
    { id: '1', name: 'كفتة', image: '/eat/1.jpg' },
    { id: '2', name: 'قلاية بندورة', image: '/eat/2.jpg' },
    { id: '3', name: 'مقلوبة', image: '/eat/3.jpg' },
    { id: '4', name: 'منسف', image: '/eat/4.jpg' },
    { id: '5', name: 'اذان الشايب', image: '/eat/5.jpg' },
    { id: '6', name: 'مكمورة', image: '/eat/6.jpg' },
    { id: '7', name: 'ملوخية', image: '/eat/7.jpg' },
    { id: '8', name: 'الرشوف', image: '/eat/8.jpg' },
    { id: '9', name: 'دوالي و كوسا', image: '/eat/9.jpg' },
    { id: '10', name: 'صينية بطاطا', image: '/eat/10.jpg' }
  ]
};

export default function RankingGame() {
  const [gamePhase, setGamePhase] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [rankedItems, setRankedItems] = useState(Array(10).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const startGame = (category) => {
    const items = gameData[category];
    setAvailableItems([...items]);
    setRankedItems(Array(10).fill(null));
    setSelectedCategory(category);
    setGamePhase('playing');
    setShowOptions(false);
    setSelectedSlot(null);
  };

  const handleSlotClick = (index) => {
    if (rankedItems[index]) {
      return;
    }
    setSelectedSlot(index);
  };

  const handleImageClick = (item) => {
    if (selectedSlot === null) {
      alert('اختر رقم من الترتيب أولاً!');
      return;
    }

    const newRanked = [...rankedItems];
    newRanked[selectedSlot] = item;
    setRankedItems(newRanked);

    const newAvailable = availableItems.filter(i => i.id !== item.id);
    setAvailableItems(newAvailable);

    setSelectedSlot(null);
  };

  const removeFromRank = (index) => {
    const item = rankedItems[index];
    if (item) {
      const newRanked = [...rankedItems];
      newRanked[index] = null;
      setRankedItems(newRanked);
      setAvailableItems([...availableItems, item]);
      
      if (selectedSlot === index) {
        setSelectedSlot(null);
      }
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (!draggedItem || rankedItems[slotIndex]) {
      setDraggedItem(null);
      return;
    }

    const newRanked = [...rankedItems];
    newRanked[slotIndex] = draggedItem;
    setRankedItems(newRanked);

    const newAvailable = availableItems.filter(i => i.id !== draggedItem.id);
    setAvailableItems(newAvailable);

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const finishRanking = () => {
    const filledCount = rankedItems.filter(i => i !== null).length;
    if (filledCount === 10) {
      setGamePhase('finished');
    } else {
      alert(`لم تقم بترتيب جميع العناصر! (${filledCount}/10)`);
    }
  };

  const resetGame = () => {
    setGamePhase('menu');
    setSelectedCategory(null);
    setAvailableItems([]);
    setRankedItems(Array(10).fill(null));
    setSelectedSlot(null);
  };

  if (gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                لعبة الترتيب
            </h1>
            <p className="text-xl text-blue-200">
              رتب  من الأفضل إلى الأسوأ حسب رأيك!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              اختر فئة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <button
                onClick={() => startGame('sports')}
                className="group p-8 bg-white/5 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-green-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold text-white mb-2">رياضة</h3>
                <p className="text-gray-300">لاعبو كرة القدم</p>
              </button>

              <button
                onClick={() => startGame('celebrities')}
                className="group p-8 bg-white/5 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-yellow-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-white mb-2">مشاهير</h3>
                <p className="text-gray-300">نجوم ومشاهير</p>
              </button>

              <button
                onClick={() => startGame('discord')}
                className="group p-8 bg-white/5 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-purple-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-2">ديسكورد</h3>
                <p className="text-gray-300">أعضاء الفريق</p>
              </button>

              <button
                onClick={() => startGame('youtube')}
                className="group p-8 bg-white/5 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-red-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-2xl font-bold text-white mb-2">يوتيوبرز</h3>
                <p className="text-gray-300">صناع المحتوى</p>
              </button>

              <button
                onClick={() => startGame('eat')}
                className="group p-8 bg-white/5 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-orange-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-4">🍔</div>
                <h3 className="text-2xl font-bold text-white mb-2">أكلات</h3>
                <p className="text-gray-300">أطباق مفضلة</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    const categoryNames = {
      sports: 'رياضة ⚽',
      celebrities: 'مشاهير 🌟',
      discord: 'ديسكورد 🎮',
      youtube: 'يوتيوبرز 📺',
      eat: 'أكلات 🍔'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {categoryNames[selectedCategory]}
            </h2>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="px-4 py-2 bg-purple-500/30 border-2 border-purple-400 text-white rounded-xl font-semibold hover:bg-purple-500/50 transition-all"
              >
                 خيارات
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-500/30 border-2 border-red-400 text-white rounded-xl font-semibold hover:bg-red-500/50 transition-all"
              >
                 القائمة
              </button>
            </div>
          </div>

          {showOptions && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border-2 border-slate-600">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">تغيير الفئة</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => startGame('sports')}
                    className="w-full p-4 bg-green-500/30 border-2 border-green-400 text-white rounded-xl hover:bg-green-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">⚽</span>
                    <span className="font-bold">رياضة</span>
                  </button>
                  <button
                    onClick={() => startGame('celebrities')}
                    className="w-full p-4 bg-yellow-500/30 border-2 border-yellow-400 text-white rounded-xl hover:bg-yellow-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">🌟</span>
                    <span className="font-bold">مشاهير</span>
                  </button>
                  <button
                    onClick={() => startGame('discord')}
                    className="w-full p-4 bg-purple-500/30 border-2 border-purple-400 text-white rounded-xl hover:bg-purple-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">🎮</span>
                    <span className="font-bold">ديسكورد</span>
                  </button>
                  <button
                    onClick={() => startGame('youtube')}
                    className="w-full p-4 bg-red-500/30 border-2 border-red-400 text-white rounded-xl hover:bg-red-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">📺</span>
                    <span className="font-bold">يوتيوبرز</span>
                  </button>
                  <button
                    onClick={() => startGame('eat')}
                    className="w-full p-4 bg-orange-500/30 border-2 border-orange-400 text-white rounded-xl hover:bg-orange-500/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">🍔</span>
                    <span className="font-bold">أكلات</span>
                  </button>
                  <button
                    onClick={() => setShowOptions(false)}
                    className="w-full p-4 bg-gray-500/30 border-2 border-gray-400 text-white rounded-xl hover:bg-gray-500/50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                    الترتيب (من الأفضل إلى الأسوأ)
                </h3>
                <div className="space-y-3">
                  {rankedItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative group flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedSlot === index
                          ? 'bg-cyan-500/30 border-cyan-400 scale-105'
                          : item
                          ? 'bg-white/10 border-white/30 hover:bg-white/20'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-cyan-400'
                      }`}
                    >
                      <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-white ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800' :
                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800' :
                        'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {item ? (
                        <>
                          <div className="flex items-center gap-3 flex-1">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                            />
                            <span className="text-white font-bold">{item.name}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromRank(index);
                            }}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition-all"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-gray-400 text-sm">
                          {selectedSlot === index ? ' اختر صورة من اليمين' : 'انقر للاختيار'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={finishRanking}
                  disabled={rankedItems.filter(i => i !== null).length !== 10}
                  className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-all disabled:cursor-not-allowed"
                >
                   إنهاء الترتيب ({rankedItems.filter(i => i !== null).length}/10)
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 lg:sticky lg:top-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                   الصور المتاحة ({availableItems.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleImageClick(item)}
                      className={`bg-white/10 border-2 rounded-2xl p-4 transition-all cursor-pointer ${
                        selectedSlot !== null
                          ? 'border-cyan-400 hover:bg-cyan-500/30 hover:scale-105'
                          : 'border-white/30 hover:bg-white/20 hover:scale-105'
                      } ${draggedItem?.id === item.id ? 'opacity-50' : ''}`}
                    >
                      <div className="aspect-square rounded-xl mb-3 overflow-hidden bg-slate-700">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-center font-bold text-sm truncate">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
                {availableItems.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3"></p>
                    <p>تم استخدام جميع الصور!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-center mb-8">
            <div className="text-6xl mb-6"></div>
            <h1 className="text-4xl font-black text-white mb-4">
              اكتمل الترتيب!
            </h1>
            <p className="text-gray-300 text-lg">هذا هو ترتيبك النهائي</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-center text-white mb-6">
               الترتيب النهائي
            </h3>
            <div className="space-y-3">
              {rankedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/5 border-2 border-white/20 rounded-xl p-4">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-white ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800' :
                    index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800' :
                    'bg-gradient-to-br from-cyan-500 to-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <img 
                    src={item?.image} 
                    alt={item?.name}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                  />
                  <span className="text-white font-bold text-lg">{item?.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetGame}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all"
            >
               القائمة الرئيسية
            </button>
            <button
              onClick={() => startGame(selectedCategory)}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg transition-all"
            >
               ترتيب جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}