import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import CircularProgress from '@/components/common/CircularProgress';
import { Home, RotateCcw, Star, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ResultPage() {
  const navigate = useNavigate();
  const { gameState, finalScore, gameOverReason, returnToMenu, inheritance } = useGameStore();

  if (!gameState || !finalScore) {
    navigate('/');
    return null;
  }

  const { score, rating, strategyPoints } = finalScore;
  const isVictory = gameState.isVictory;

  const ratingColors: Record<string, string> = {
    S: 'text-yellow-400',
    A: 'text-amber-500',
    B: 'text-blue-400',
    C: 'text-zinc-400',
    D: 'text-red-400',
  };

  const ratingGlows: Record<string, string> = {
    S: 'shadow-[0_0_40px_rgba(250,204,21,0.4)]',
    A: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    B: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]',
    C: '',
    D: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        {isVictory ? (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
        )}
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="mb-8">
          {isVictory ? (
            <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          ) : (
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className={isVictory ? 'text-amber-500' : 'text-red-500'}>
              {isVictory ? '演练完成' : '演练失败'}
            </span>
          </h1>
          <p className="text-zinc-500">{gameOverReason}</p>
        </div>

        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-2 mb-6 ${ratingGlows[rating] || ''} ${isVictory ? 'border-amber-500/40 bg-amber-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <div>
            <div className={`text-5xl font-bold ${ratingColors[rating] || 'text-zinc-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {rating}
            </div>
            <div className="text-zinc-500 text-xs mt-1">综合评级</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800">
            <CircularProgress
              value={Math.round(gameState.roundHistory.reduce((s, r) => s + r.completionRate, 0) / gameState.roundHistory.length * 100)}
              size={64}
              color="#f59e0b"
            />
            <div className="text-zinc-400 text-xs mt-2">完成率</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800">
            <CircularProgress
              value={gameState.globalMorale}
              size={64}
              color={gameState.globalMorale > 50 ? '#22c55e' : gameState.globalMorale > 25 ? '#f59e0b' : '#ef4444'}
            />
            <div className="text-zinc-400 text-xs mt-2">士气</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800">
            <CircularProgress
              value={100 - gameState.globalRisk}
              size={64}
              color={gameState.globalRisk < 40 ? '#22c55e' : gameState.globalRisk < 70 ? '#f59e0b' : '#ef4444'}
            />
            <div className="text-zinc-400 text-xs mt-2">安全度</div>
          </div>
        </div>

        <div className="bg-[#0f1923] rounded-lg p-5 border border-zinc-800 mb-6">
          <div className="text-zinc-400 text-sm mb-2">综合得分</div>
          <div className="text-3xl font-bold text-amber-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {score}
          </div>
          <div className="text-zinc-600 text-xs mt-1">满分100</div>
        </div>

        {isVictory && strategyPoints > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-amber-400 font-semibold">获得策略点</span>
            </div>
            <div className="text-3xl font-bold text-amber-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              +{strategyPoints}
            </div>
            <div className="text-zinc-500 text-xs mt-1">
              累计策略点: {inheritance.strategyPoints}（可在新周目中使用）
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => { returnToMenu(); }}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-amber-500/20 border border-amber-500/60 text-amber-400 font-semibold transition-all duration-300 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <RotateCcw className="w-5 h-5" />
            再来一局
          </button>
          <button
            onClick={() => { returnToMenu(); navigate('/'); }}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 font-medium transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-600"
          >
            <Home className="w-5 h-5" />
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
