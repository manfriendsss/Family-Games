import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

type Cell = 'X' | 'O' | null;
type Winner = 'X' | 'O' | 'DRAW' | null;

interface CaroSetupProps {
  boardSize: 3 | 15;
  onBoardSizeChange: (size: 3 | 15) => void;
  onStart: () => void;
}

export const CaroSetup: React.FC<CaroSetupProps> = ({ boardSize, onBoardSizeChange, onStart }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">Chọn kích thước bàn cờ</h2>
        <p className="text-sm text-gray-500 font-bold">3x3 (tic-tac-toe) hoặc 15x15 (cờ caro).</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        {[3, 15].map((size) => (
          <button
            key={size}
            onClick={() => onBoardSizeChange(size as 3 | 15)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              boardSize === size ? 'border-amber-500 bg-amber-50/40' : 'border-gray-100 bg-white'
            }`}
          >
            <div className="text-lg font-black text-gray-900">{size} x {size}</div>
            <div className="text-xs font-bold text-gray-500">
              {size === 3 ? 'Thắng khi đủ 3 ô liên tiếp' : 'Thắng khi đủ 5 ô liên tiếp'}
            </div>
          </button>
        ))}
      </section>

      <button
        onClick={onStart}
        className="w-full h-16 bg-[#B2FF3D] text-gray-900 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-transform border-4 border-white"
      >
        BẮT ĐẦU VÁN CỜ
      </button>
    </motion.div>
  );
};

interface CaroPlayProps {
  boardSize: 3 | 15;
}

const checkWinnerAt = (board: Cell[][], row: number, col: number, winLen: number): Winner => {
  const mark = board[row][col];
  if (!mark) return null;

  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ] as const;

  for (const [dr, dc] of dirs) {
    let count = 1;

    for (let step = 1; step < winLen; step++) {
      const r = row + dr * step;
      const c = col + dc * step;
      if (r < 0 || c < 0 || r >= board.length || c >= board.length || board[r][c] !== mark) break;
      count++;
    }

    for (let step = 1; step < winLen; step++) {
      const r = row - dr * step;
      const c = col - dc * step;
      if (r < 0 || c < 0 || r >= board.length || c >= board.length || board[r][c] !== mark) break;
      count++;
    }

    if (count >= winLen) return mark;
  }
  return null;
};

export const CaroPlay: React.FC<CaroPlayProps> = ({ boardSize }) => {
  const winLen = boardSize === 3 ? 3 : 5;
  const makeBoard = () => Array.from({ length: boardSize }, () => Array<Cell>(boardSize).fill(null));

  const [board, setBoard] = useState<Cell[][]>(makeBoard);
  const [current, setCurrent] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Winner>(null);

  const isBoardFull = useMemo(() => board.every((r) => r.every((c) => c !== null)), [board]);

  const handleMove = (r: number, c: number) => {
    if (winner || board[r][c]) return;
    const next = board.map((row) => [...row]);
    next[r][c] = current;

    const w = checkWinnerAt(next, r, c, winLen);
    setBoard(next);

    if (w) {
      setWinner(w);
      return;
    }

    if (next.every((row) => row.every((cell) => cell !== null))) {
      setWinner('DRAW');
      return;
    }

    setCurrent(current === 'X' ? 'O' : 'X');
  };

  const resetBoard = () => {
    setBoard(makeBoard());
    setCurrent('X');
    setWinner(null);
  };

  const cellFont = boardSize === 3 ? 'text-4xl' : 'text-sm sm:text-base';
  const boardHeight = boardSize === 3 ? 'min-h-[320px]' : 'min-h-[78svh]';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Lượt hiện tại</p>
          <p className={`font-black text-2xl ${current === 'X' ? 'text-blue-600' : 'text-red-500'}`}>{current}</p>
        </div>
        <button
          onClick={resetBoard}
          className="h-11 px-4 rounded-xl bg-gray-900 text-white font-black text-sm active:scale-95 transition-transform flex items-center gap-2 [touch-action:manipulation]"
        >
          <RotateCcw size={16} /> RESET VÁN
        </button>
      </section>

      <section className={`bg-white rounded-3xl p-3 shadow-sm border border-gray-100 ${boardHeight}`}>
        <div
          className="grid gap-1 w-full h-full"
          style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleMove(r, c)}
                className="aspect-square rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center active:scale-95 transition-transform [touch-action:manipulation]"
              >
                <span className={`font-black ${cellFont} ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-500' : 'text-transparent'}`}>
                  {cell || '·'}
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 90 }).map((_, i) => (
                <span
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${(i * 13) % 100}%`,
                    animationDelay: `${(i % 12) * 0.08}s`,
                  }}
                />
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-gray-100"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Chúc mừng!</h3>
              <p className="text-sm font-bold text-gray-500 mb-4">
                {winner === 'DRAW' ? 'Ván cờ hòa, chơi lại nhé!' : `Người chơi ${winner} đã chiến thắng!`}
              </p>
              <button
                onClick={resetBoard}
                className="w-full h-12 rounded-xl bg-[#B2FF3D] text-gray-900 font-black active:scale-95 transition-transform"
              >
                CHƠI VÁN MỚI
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!winner && isBoardFull && (
        <div className="text-center text-sm font-black text-gray-500">Ván cờ hòa. Hãy reset để chơi lại.</div>
      )}
    </motion.div>
  );
};
