import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Shield, Play, Save, Trophy, Star, X, CheckCircle2, XCircle } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();
  const { initNewGame, continueGame, hasSave, checkHasSave, inheritance, showHistory, toggleHistory, historyRecords } = useGameStore();

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

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const ratingColors: Record<string, string> = {
    S: 'text-yellow-400',
    A: 'text-amber-500',
    B: 'text-blue-400',
    C: 'text-zinc-400',
    D: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/3 blur-[120px] pointer-events-none" />

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={toggleHistory}>
          <div
            className="bg-[#0f1923] border border-zinc-700 rounded-xl w-full max-w-md mx-4 max-h-[70vh] overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-amber-400">历史战绩</h3>
              </div>
              <button onClick={toggleHistory} className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto max-h-[55vh]">
              {historyRecords.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  暂无战绩记录
                </div>
              ) : (
                <div className="space-y-2">
                  {historyRecords.map((record, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-800/40 border border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        {record.victory ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <div className={`text-2xl font-bold ${ratingColors[record.rating] || 'text-zinc-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                            {record.rating}
                          </div>
                          <div className="text-xs text-zinc-500">{formatDate(record.date)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                          {record.score}
                        </div>
                        <div className="text-xs text-zinc-500">{record.victory ? '通关' : '失败'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          onClick={toggleHistory}
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
