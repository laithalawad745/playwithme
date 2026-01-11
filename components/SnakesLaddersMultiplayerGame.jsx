// components/SnakesLaddersMultiplayerGame.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PlayerWheel from './PlayerWheel';
import { showSuccessToast, showErrorToast, showInfoToast } from './ToastNotification';

export default function SnakesLaddersMultiplayerGame({
  roomId,
  pusher,
  isHost,
  playerId,
  playerName,
  allPlayers,
  onGameEnd,
  boardData // استلام الخريطة هنا
}) {
  const [players, setPlayers] = useState(
    allPlayers.map(p => ({ ...p, position: 1 }))
  );
  
  // استخدام السلالم والثعابين القادمة من المضيف
const myBoard = boardData?.[playerId] || { ladders: {}, snakes: {} };
const ladders = myBoard.ladders;
const snakes = myBoard.snakes;
  
  const [gamePhase, setGamePhase] = useState('spinning');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [stepsInput, setStepsInput] = useState('');
  const [winner, setWinner] = useState(null);
  const [channel, setChannel] = useState(null);

  // ✅ استخدام useRef للحفاظ على القيمة الحالية
  const currentTurnIndexRef = useRef(0);
  const playersRef = useRef(players);

  // ✅ تحديث الـ refs عند تغيير القيم
  useEffect(() => {
    currentTurnIndexRef.current = currentTurnIndex;
  }, [currentTurnIndex]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);


  // إعداد Pusher
  useEffect(() => {
    if (pusher && roomId) {
      const gameChannel = pusher.subscribe(`snakes-${roomId}`);
      setChannel(gameChannel);

      gameChannel.bind('wheel-spun', (data) => {
        const selected = playersRef.current.find(p => p.id === data.selectedPlayerId);
        setSelectedPlayer(selected);
        setGamePhase('waiting_for_steps');
      });

      gameChannel.bind('steps-submitted', (data) => {
        setGamePhase('moving');
        movePlayer(data.playerId, data.steps);
      });

      gameChannel.bind('positions-updated', (data) => {
        setPlayers(data.players);
      });

      gameChannel.bind('turn-ended', (data) => {
        setCurrentTurnIndex(data.nextTurnIndex);
        setGamePhase('spinning');
        setSelectedPlayer(null);
        setStepsInput('');
      });

      gameChannel.bind('game-won', (data) => {
        const winnerPlayer = playersRef.current.find(p => p.id === data.winnerId);
        setWinner(winnerPlayer);
        setGamePhase('finished');
        showSuccessToast(` ${winnerPlayer?.name} فاز باللعبة!`);
      });

      return () => {
        gameChannel.unbind_all();
        pusher.unsubscribe(`snakes-${roomId}`);
      };
    }
  }, [pusher, roomId]);

  const currentPlayer = players[currentTurnIndex];
  const isMyTurn = currentPlayer?.id === playerId;

  const handleWheelPlayerSelected = (player) => {
    setSelectedPlayer(player);
    
    fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: `snakes-${roomId}`,
        event: 'wheel-spun',
        data: {
          selectedPlayerId: player.id,
          selectedPlayerName: player.name
        }
      })
    }).catch(console.error);

    setGamePhase('waiting_for_steps');
  };

  const submitSteps = () => {
    const steps = parseInt(stepsInput);
    
    if (!steps || steps < 1 || steps > 6) {
      showErrorToast('الرجاء إدخال رقم من 1 إلى 6');
      return;
    }


    fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: `snakes-${roomId}`,
        event: 'steps-submitted',
        data: {
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          steps: steps,
          submittedBy: selectedPlayer.name
        }
      })
    }).catch(console.error);

    setStepsInput('');
  };

  // ✅ تحريك اللاعب - استخدام ref
const movePlayer = (playerIdToMove, steps) => {

    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(p => ({ ...p }));
      const playerIndex = newPlayers.findIndex(p => p.id === playerIdToMove);
      
      if (playerIndex === -1) {
        return prevPlayers;
      }

      // ✅ استخدام خريطة اللاعب الذي يتحرك
      const playerBoard = boardData?.[playerIdToMove] || { ladders: {}, snakes: {} };
      const playerLadders = playerBoard.ladders;
      const playerSnakes = playerBoard.snakes;

      const oldPosition = newPlayers[playerIndex].position;
      let newPosition = oldPosition + steps;


      if (newPosition >= 100) {
        newPosition = 100;
        newPlayers[playerIndex].position = newPosition;
        

        fetch('/api/pusher/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: `snakes-${roomId}`,
            event: 'positions-updated',
            data: { players: newPlayers }
          })
        }).catch(console.error);

        setTimeout(() => {
          fetch('/api/pusher/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: `snakes-${roomId}`,
              event: 'game-won',
              data: {
                winnerId: playerIdToMove,
                winnerName: newPlayers[playerIndex].name
              }
            })
          }).catch(console.error);
        }, 500);

        return newPlayers;
      }

      // ✅ استخدام خريطة اللاعب
      if (playerLadders[newPosition]) {
        const ladderEnd = playerLadders[newPosition];
        newPosition = ladderEnd;
      }

      if (playerSnakes[newPosition]) {
        const snakeEnd = playerSnakes[newPosition];
        newPosition = snakeEnd;
      }

      newPlayers[playerIndex].position = newPosition;

      fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `snakes-${roomId}`,
          event: 'positions-updated',
          data: { players: newPlayers }
        })
      }).catch(console.error);

      if (isHost) {
        setTimeout(() => {
          const currentIdx = currentTurnIndexRef.current;
          const allPlayersList = playersRef.current;
          
          const nextIndex = (currentIdx + 1) % allPlayersList.length;
          const nextPlayer = allPlayersList[nextIndex];
          
          
          fetch('/api/pusher/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: `snakes-${roomId}`,
              event: 'turn-ended',
              data: { 
                nextTurnIndex: nextIndex,
                totalPlayers: allPlayersList.length,
                nextPlayerName: nextPlayer?.name
              }
            })
          }).catch(console.error);
        }, 2000);
      }

      return newPlayers;
    });
};

  const renderBoard = () => {
    const cells = [];
    
    const myPlayer = players.find(p => p.id === playerId);
    const myPosition = myPlayer?.position || 1;
    
    // ✅ استخدام خريطتي أنا فقط
    const myBoard = boardData?.[playerId] || { ladders: {}, snakes: {} };
    const myLadders = myBoard.ladders;
    const mySnakes = myBoard.snakes;
    
    for (let row = 0; row < 10; row++) {
      const isEvenRow = row % 2 === 0;
      
      for (let col = 0; col < 10; col++) {
        const cellNumber = isEvenRow 
          ? (100 - row * 10 - col)
          : (100 - row * 10 - (9 - col));

        const isMyPosition = myPosition === cellNumber;

        cells.push(
          <div
            key={`${row}-${col}-${cellNumber}`}
            className={`relative aspect-square border border-white/20 flex flex-col items-center justify-center ${
              cellNumber === 100 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : cellNumber === 1 
                  ? 'bg-gradient-to-br from-green-400 to-blue-500'
                  : myLadders[cellNumber] // ✅ خريطتي
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30'
                    : mySnakes[cellNumber] // ✅ خريطتي
                      ? 'bg-gradient-to-br from-red-500/30 to-pink-500/30'
                      : 'bg-white/5'
            }`}
          >
            <span className="text-white/60 text-[10px] font-bold absolute top-0.5 left-0.5">
              {cellNumber}
            </span>

            {myLadders[cellNumber] && (
              <div className="text-center">
                <span className="text-base">🪜</span>
                <div className="text-[8px] text-green-300">→{myLadders[cellNumber]}</div>
              </div>
            )}

            {mySnakes[cellNumber] && (
              <div className="text-center">
                <span className="text-base">🐍</span>
                <div className="text-[8px] text-red-300">→{mySnakes[cellNumber]}</div>
              </div>
            )}

            {isMyPosition && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg animate-pulse"
                  style={{ backgroundColor: myPlayer?.color }}
                  title={`${myPlayer?.name} - المربع ${myPosition}`}
                >
                  I
                </div>
              </div>
            )}

            {cellNumber === 100 && <span className="text-2xl">🏆</span>}
            {cellNumber === 1 && <span className="text-xl">🚀</span>}
          </div>
        );
      }
    }
    
    return cells;
};

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1e] to-[#0a0a0f]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl md:text-2xl font-black text-white">
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

        <div className="mb-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex flex-wrap gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                  player.id === currentPlayer?.id
                    ? 'border-yellow-400 bg-yellow-500/20 ring-2 ring-yellow-400/50'
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: player.color }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {player.name}
                    {player.id === playerId && ' (أنت)'}
                  </p>
                  {player.id === playerId && (
                    <p className="text-gray-400 text-xs">المربع: {player.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="grid grid-cols-10 gap-1">
                {renderBoard()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-xl mb-3">الدور الحالي</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: currentPlayer?.color }}
                >
                  {currentTurnIndex + 1}
                </div>
                <p className="text-2xl font-bold text-white">{currentPlayer?.name}</p>
              </div>
              {isMyTurn && (
                <p className="text-green-400 font-semibold animate-pulse"> دورك الآن!</p>
              )}
            </div>

            {gamePhase === 'spinning' && isMyTurn && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 text-center">
                  دور العجلة لاختيار لاعب
                </h3>
                <PlayerWheel
                  players={players}
                  currentPlayerId={playerId}
                  onPlayerSelected={handleWheelPlayerSelected}
                />
              </div>
            )}

            {gamePhase === 'spinning' && !isMyTurn && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <div className="animate-pulse">
                  <p className="text-yellow-400 font-bold mb-2"> انتظر دورك</p>
                  <p className="text-gray-400 text-sm">دور {currentPlayer?.name} الآن</p>
                </div>
              </div>
            )}

            {gamePhase === 'waiting_for_steps' && selectedPlayer?.id === playerId && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 text-center">
                  حدد عدد الخطوات لـ {currentPlayer?.name}
                </h3>
                <p className="text-gray-400 text-center mb-4">من 1 إلى 6</p>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:border-green-500 mb-4"
                  placeholder="0"
                />
                <button
                  onClick={submitSteps}
                  disabled={!stepsInput}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                   إرسال
                </button>
              </div>
            )}

            {gamePhase === 'waiting_for_steps' && selectedPlayer?.id !== playerId && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <div className="animate-pulse">
                  <p className="text-yellow-400 font-bold mb-2"> في انتظار</p>
                  <p className="text-white">{selectedPlayer?.name}</p>
                  <p className="text-gray-400 text-sm">لإدخال الخطوات...</p>
                </div>
              </div>
            )}

            {gamePhase === 'moving' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <div className="animate-bounce">
                  <p className="text-green-400 font-bold text-lg mb-2"> جاري التحرك...</p>
                  <p className="text-white">{currentPlayer?.name}</p>
                </div>
              </div>
            )}

            {gamePhase === 'finished' && winner && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                  {winner.name} فاز!
                </h2>
                <button
                  onClick={onGameEnd}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold transition-all"
                >
                  العودة للرئيسية
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}