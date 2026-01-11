// components/PlayerWheel.jsx
'use client';

import React, { useState, useEffect } from 'react';

export default function PlayerWheel({ players, currentPlayerId, onPlayerSelected }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // تصفية اللاعبين (استبعاد اللاعب الحالي)
  const eligiblePlayers = players.filter(p => p.id !== currentPlayerId);

  // دوران العجلة
  const spinWheel = () => {
    if (spinning || eligiblePlayers.length === 0) return;

    setSpinning(true);
    setSelectedPlayer(null);

    // اختيار لاعب عشوائي
    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    const selectedPlayerData = eligiblePlayers[randomIndex];

    // حساب زاوية الدوران
    const segmentAngle = 360 / eligiblePlayers.length;
    const targetRotation = 360 * 5 + (randomIndex * segmentAngle) + (segmentAngle / 2);

    setRotation(targetRotation);

    // بعد انتهاء الدوران
    setTimeout(() => {
      setSpinning(false);
      setSelectedPlayer(selectedPlayerData);
      onPlayerSelected(selectedPlayerData);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* العجلة */}
      <div className="relative w-80 h-80 mb-8">
        {/* المؤشر */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500"></div>
        </div>

        {/* العجلة الدوارة */}
        <div
          className="w-full h-full rounded-full border-8 border-white/20 shadow-2xl relative overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          {eligiblePlayers.map((player, index) => {
            const segmentAngle = 360 / eligiblePlayers.length;
            const startAngle = index * segmentAngle;

            return (
              <div
                key={player.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${startAngle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`
                }}
              >
                <div
                  className="w-full h-full flex items-start justify-center pt-8"
                  style={{ backgroundColor: player.color }}
                >
                  <div
                    className="text-white font-bold text-lg"
                    style={{
                      transform: `rotate(${segmentAngle / 2}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    {player.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* الدائرة المركزية مع تأثير الدوران */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-800 shadow-xl flex items-center justify-center">
            {spinning && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* خطوط دوارة */}
                <div className="absolute w-full h-full animate-spin">
                  <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-gradient-to-b from-orange-500 to-transparent -translate-x-1/2 -translate-y-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-gradient-to-t from-red-500 to-transparent -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-1 bg-gradient-to-r from-yellow-500 to-transparent -translate-y-1/2 -translate-x-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-1 bg-gradient-to-l from-orange-500 to-transparent -translate-y-1/2"></div>
                </div>
                {/* دائرة نابضة */}
                <div className="absolute w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
            {!spinning && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* زر الدوران */}
      {!selectedPlayer && (
        <button
          onClick={spinWheel}
          disabled={spinning || eligiblePlayers.length === 0}
          className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all ${
            spinning
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105'
          } text-white shadow-lg`}
        >
          {spinning ? 'جاري الدوران...' : 'دور العجلة!'}
        </button>
      )}

      {/* النتيجة */}
      {selectedPlayer && (
        <div className="text-center animate-bounce">
          <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl">
            <p className="text-white text-xl mb-2">اللاعب المختار:</p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: selectedPlayer.color }}
              ></div>
              <p className="text-3xl font-bold text-yellow-400">{selectedPlayer.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}