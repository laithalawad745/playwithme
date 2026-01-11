// components/SnakesLaddersMultiplayerSetup.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { showSuccessToast, showErrorToast, showInfoToast } from './ToastNotification';

export default function SnakesLaddersMultiplayerSetup({ 
  onStartGame, 
  pusher, 
  playerId,
  roomIdFromUrl 
}) {
  const [mode, setMode] = useState(roomIdFromUrl ? 'join' : 'choice'); // choice, create, join, waiting, joined
  const [roomId, setRoomId] = useState(roomIdFromUrl || '');
  const [playerName, setPlayerName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState(roomIdFromUrl || '');
  const [players, setPlayers] = useState([]);
  const [channel, setChannel] = useState(null);
  const [isHost, setIsHost] = useState(false);

  // ألوان اللاعبين
  const playerColors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#06b6d4', // cyan
    '#84cc16'  // lime
  ];

  // توليد رقم غرفة
  const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // إنشاء غرفة جديدة
  const createRoom = () => {
    if (!playerName.trim()) {
      showErrorToast('الرجاء إدخال اسمك!');
      return;
    }

    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsHost(true);
    setMode('waiting');

    // إنشاء اللاعب المضيف
    const hostPlayer = {
      id: playerId,
      name: playerName.trim(),
      color: playerColors[0],
      isHost: true,
      position: 0
    };

    setPlayers([hostPlayer]);

    // الاشتراك في القناة
    const channelName = `snakes-${newRoomId}`;
    const roomChannel = pusher.subscribe(channelName);
    setChannel(roomChannel);

    // الاستماع للاعبين الجدد
    roomChannel.bind('player-joined', (data) => {
      if (data.playerId !== playerId) {
        setPlayers(prev => {
          if (prev.find(p => p.id === data.playerId)) return prev;
          
          const newPlayer = {
            id: data.playerId,
            name: data.playerName,
            color: playerColors[prev.length % playerColors.length],
            isHost: false,
            position: 0
          };
          
          return [...prev, newPlayer];
        });
      }
    });

    // الاستماع لبدء اللعبة
roomChannel.bind('game-started', (data) => {
  onStartGame(newRoomId, true, playerName.trim(), data.players, data.playerBoards);
});

    // إرسال presence للمضيف
    setTimeout(() => {
      fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channelName,
          event: 'player-joined',
          data: {
            playerId: playerId,
            playerName: playerName.trim(),
            isHost: true
          }
        })
      }).catch(console.error);
    }, 500);

    showSuccessToast(`تم إنشاء الغرفة: ${newRoomId}`);
  };

  // الانضمام لغرفة
  const joinRoom = () => {
    if (!playerName.trim()) {
      showErrorToast('الرجاء إدخال اسمك!');
      return;
    }

    if (!joinRoomId.trim()) {
      showErrorToast('الرجاء إدخال رقم الغرفة!');
      return;
    }

    const cleanRoomId = joinRoomId.trim().toUpperCase();
    setRoomId(cleanRoomId);
    setIsHost(false);
    setMode('joined');

    // الاشتراك في القناة
    const channelName = `snakes-${cleanRoomId}`;
    const roomChannel = pusher.subscribe(channelName);
    setChannel(roomChannel);

    // الاستماع للاعبين
    roomChannel.bind('player-joined', (data) => {
      if (data.playerId !== playerId) {
        setPlayers(prev => {
          if (prev.find(p => p.id === data.playerId)) return prev;
          
          const newPlayer = {
            id: data.playerId,
            name: data.playerName,
            color: playerColors[prev.length % playerColors.length],
            isHost: data.isHost,
            position: 0
          };
          
          return [...prev, newPlayer];
        });
      }
    });

roomChannel.bind('game-started', (data) => {
  onStartGame(cleanRoomId, false, playerName.trim(), data.players, data.playerBoards);
});
    // إرسال presence
    setTimeout(() => {
      fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channelName,
          event: 'player-joined',
          data: {
            playerId: playerId,
            playerName: playerName.trim(),
            isHost: false
          }
        })
      }).then(() => {
      }).catch(console.error);
    }, 500);
  };

  // نسخ رقم الغرفة
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    showSuccessToast('تم نسخ رقم الغرفة! ');
  };
const generateRandomBoard = () => {
    const newLadders = {};
    const newSnakes = {};
    const occupied = new Set([1, 100]); // المربعات المشغولة

    // دالة مساعدة للحصول على رقم عشوائي
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 1. توليد السلالم (تركيز أكثر في المنتصف: مربعات 20-70)
    const ladderCount = 10; // عدد السلالم
    for (let i = 0; i < ladderCount; i++) {
        // احتمالية 70% أن يكون السلم في المنتصف
        const isMiddle = Math.random() < 0.7;
        let start = isMiddle ? getRandom(20, 60) : getRandom(2, 80);
        let end = start + getRandom(10, 30);
        
        if (end > 99) end = 99;

        if (!occupied.has(start) && !occupied.has(end) && start < end) {
            newLadders[start] = end;
            occupied.add(start);
            occupied.add(end);
        }
    }

    // 2. توليد الثعابين
    const snakeCount = 8;
    for (let i = 0; i < snakeCount; i++) {
        let start = getRandom(20, 98);
        let end = start - getRandom(10, 30);
        
        if (end < 2) end = 2;

        if (!occupied.has(start) && !occupied.has(end) && start > end) {
            newSnakes[start] = end;
            occupied.add(start);
            occupied.add(end);
        }
    }

    return { ladders: newLadders, snakes: newSnakes };
};
  // بدء اللعبة
const startGame = () => {
    if (players.length < 2) {
      showErrorToast('يجب أن يكون هناك لاعبين على الأقل!');
      return;
    }

    // ✅ إنشاء خريطة منفصلة لكل لاعب
    const playerBoards = {};
    players.forEach(player => {
      playerBoards[player.id] = generateRandomBoard();
    });

    fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: channel.name,
        event: 'game-started',
        data: {
          startedBy: playerId,
          players: players,
          playerBoards: playerBoards // ✅ خريطة لكل لاعب
        }
      })
    }).then(() => {
      onStartGame(roomId, true, playerName, players, playerBoards);
    }).catch(console.error);
};
  // الرجوع
  const goBack = () => {
    setMode('choice');
    setPlayerName('');
    setJoinRoomId('');
    if (channel) {
      pusher.unsubscribe(channel.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1e] to-[#0a0a0f]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl md:text-3xl font-black text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
               السلم والثعبان 
            </span>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
          >
            ← رجوع
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            
            {/* اختيار النمط */}
            {mode === 'choice' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-black text-white mb-4">
                     ادخل اسمك  
                  </h1>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">اسمك:</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="أدخل اسمك..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    maxLength={15}
                  />
                </div>

                <button
                  onClick={createRoom}
                  disabled={!playerName.trim()}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105"
                >
                   إنشاء غرفة جديدة
                </button>

                <button
                  onClick={() => setMode('join')}
                  disabled={!playerName.trim()}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105"
                >
                   انضمام لغرفة
                </button>
              </div>
            )}

            {/* الانضمام لغرفة */}
            {mode === 'join' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white">الانضمام لغرفة</h2>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">رقم الغرفة:</label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                    placeholder="أدخل رقم الغرفة..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={goBack}
                    className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-300 rounded-xl font-semibold transition-all"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={joinRoom}
                    disabled={!joinRoomId.trim()}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                  >
                    انضمام
                  </button>
                </div>
              </div>
            )}

            {/* غرفة الانتظار (المضيف) */}
            {mode === 'waiting' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-4">غرفة الانتظار</h2>
                  <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-xl mb-4">
                    <p className="text-gray-300 mb-2">رقم الغرفة:</p>
                    <p className="text-3xl font-mono font-bold text-white tracking-wider mb-3">{roomId}</p>
                    <button
                      onClick={copyRoomId}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 rounded-lg font-semibold transition-all"
                    >
                       نسخ
                    </button>
                  </div>
                </div>

                {/* قائمة اللاعبين */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-3">اللاعبون ({players.length}):</h3>
                  <div className="space-y-2">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: player.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{player.name}</p>
                          {player.isHost && (
                            <span className="text-yellow-400 text-xs"> المضيف</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startGame}
                  disabled={players.length < 2}
                  className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xl transition-all hover:scale-105"
                >
                   ابدأ اللعبة!
                </button>

                {players.length < 2 && (
                  <p className="text-yellow-400 text-center text-sm">
                    ⚠️ في انتظار لاعب واحد على الأقل...
                  </p>
                )}
              </div>
            )}

            {/* تم الانضمام (الضيف) */}
            {mode === 'joined' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">تم الانضمام!</h2>
                  <p className="text-gray-400">في انتظار المضيف لبدء اللعبة...</p>
                </div>

                {/* قائمة اللاعبين */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-3">اللاعبون ({players.length}):</h3>
                  <div className="space-y-2">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: player.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{player.name}</p>
                          {player.isHost && (
                            <span className="text-yellow-400 text-xs"> المضيف</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}