import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Shield, Play, Save, Trophy, Star } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();
  const { initNewGame, continueGame, hasSave, checkHasSave, inheritance } = useGameStore();

  const handleNewGame = () => {
    initNewGame(inheritance.strategyPoints > 0);
    navigate('/game');
  };

  const handleNewGameNoInherit = () => {
    initNewGame(false);
    navigate('/game');
  };

  const handleContinue = () => {
    if (continueGame()) {
      navigate('/game');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-12 h-12 text-amber-500" />
        </div>
        <h1
          className="text-6xl font-bold text-amber-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Rajdhani, sans-serif', textShadow: '0 0 30px rgba(245,158,11,0.4)' }}
        >
          EMERGENCY DRILL
        </h1>
        <p className="text-lg text-zinc-400 tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          办公楼应急演练 · 回合制资源分配
        </p>
        <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>

      {inheritance.strategyPoints > 0 && (
        <div className="relative z-10 mb-8 px-6 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-500" />
          <span className="text-amber-200 text-sm">
            继承策略点: <span className="text-amber-500 font-bold text-lg">{inheritance.strategyPoints}</span>
          </span>
          <span className="text-zinc-500 text-xs">| 最高评级: {inheritance.bestRating} | 通关次数: {inheritance.totalPlaythroughs}</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-4 w-80">
        <button
          onClick={handleNewGame}
          className="group flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-semibold text-lg transition-all duration-300 hover:bg-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
        >
          <Play className="w-5 h-5" />
          {inheritance.strategyPoints > 0 ? '新周目（含继承）' : '开始演练'}
        </button>

        {inheritance.strategyPoints > 0 && (
          <button
            onClick={handleNewGameNoInherit}
            className="flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 font-medium transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
          >
            新周目（不继承）
          </button>
        )}

        {hasSave && (
          <button
            onClick={handleContinue}
            className="flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 font-medium transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
          >
            <Save className="w-5 h-5" />
            继续演练
          </button>
        )}

        <button
          onClick={() => { checkHasSave(); }}
          className="flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 text-zinc-500 font-medium transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700 hover:text-zinc-400"
        >
          <Trophy className="w-5 h-5" />
          历史战绩
        </button>
      </div>

      <div className="relative z-10 mt-12 text-zinc-600 text-xs text-center max-w-md">
        <p>在办公楼应急演练中扮演策划者、执行者和复盘者</p>
        <p>为通信、餐饮、医疗和维修小组分配有限资源</p>
        <p>应对突发事件，保持士气，控制风险</p>
      </div>
    </div>
  );
}
