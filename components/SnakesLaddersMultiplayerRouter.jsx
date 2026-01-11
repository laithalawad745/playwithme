// components/SnakesLaddersMultiplayerRouter.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import SnakesLaddersMultiplayerSetup from './SnakesLaddersMultiplayerSetup';
import SnakesLaddersMultiplayerGame from './SnakesLaddersMultiplayerGame';
import ToastNotification from './ToastNotification';

export default function SnakesLaddersMultiplayerRouter({ roomIdFromUrl = null }) {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [pusher, setPusher] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(roomIdFromUrl);
  const [allPlayers, setAllPlayers] = useState([]);
const [boardConfig, setBoardConfig] = useState({ ladders: {}, snakes: {} });
  // إعداد Pusher
  useEffect(() => {
    const pusherClient = new Pusher('39e929ae966aeeea6ca3', {
      cluster: 'us2',
      encrypted: true
    });

    pusherClient.connection.bind('connected', () => {
    });

    pusherClient.connection.bind('error', (err) => {
    });

    setPusher(pusherClient);

    // إنشاء Player ID فريد
    const newPlayerId = 'player_' + Math.random().toString(36).substr(2, 9);
    setPlayerId(newPlayerId);

    if (roomIdFromUrl) {
      setCurrentRoomId(roomIdFromUrl);
    }

    return () => {
      pusherClient.disconnect();
    };
  }, [roomIdFromUrl]);

  // بدء اللعبة
const handleStartGame = (roomId, host, name, players, playerBoards) => {
    setCurrentRoomId(roomId);
    setIsHost(host);
    setPlayerName(name);
    setAllPlayers(players);
    setBoardConfig(playerBoards || {}); // ✅ تخزين كل الخرائط
    setGameState('playing');
};

  // العودة للرئيسية
  const goHome = () => {
    window.location.href = '/';
  };

  // شاشة التحميل
  if (!pusher) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        <ToastNotification />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1e] to-[#0a0a0f]">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl text-center">
            <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-2">جاري تحميل السلم والثعبان...</h3>
            <p className="text-gray-400">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'setup') {
    return (
      <>
        <ToastNotification />
        <SnakesLaddersMultiplayerSetup
          onStartGame={handleStartGame}
          pusher={pusher}
          playerId={playerId}
          roomIdFromUrl={currentRoomId}
        />
      </>
    );
  }

  if (gameState === 'playing') {
    return (
      <>
        <ToastNotification />
        <SnakesLaddersMultiplayerGame
          roomId={currentRoomId}
          pusher={pusher}
          isHost={isHost}
          playerId={playerId}
          playerName={playerName}
          allPlayers={allPlayers}
          onGameEnd={goHome}
          boardData={boardConfig}
        />
      </>
    );
  }

  return null;
}