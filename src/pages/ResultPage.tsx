import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import CircularProgress from '@/components/common/CircularProgress';
import { Home, RotateCcw, Star, Trophy, AlertTriangle, CheckCircle2, FileText, Users, TrendingUp, Zap } from 'lucide-react';
import { TEAM_CONFIG, TEAM_IDS } from '@/types/game';

export default function ResultPage() {
  const navigate = useNavigate();
  const { gameState, finalScore, gameOverReason, returnToMenu, inheritance, currentReport } = useGameStore();

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

  const getStatusColor = (value: number, type: 'morale' | 'risk' | 'efficiency') => {
    if (type === 'morale') {
      return value > 60 ? 'text-green-400' : value > 30 ? 'text-amber-400' : 'text-red-400';
    }
    if (type === 'risk') {
      return value < 40 ? 'text-green-400' : value < 70 ? 'text-amber-400' : 'text-red-400';
    }
    return value > 0.7 ? 'text-green-400' : value > 0.4 ? 'text-amber-400' : 'text-red-400';
  };

  const handleViewReport = () => {
    if (currentReport) {
      navigate(`/report/${currentReport.id}`);
    }
  };

  const avgCompletion = gameState.roundHistory.length > 0
    ? Math.round(gameState.roundHistory.reduce((s, r) => s + r.completionRate, 0) / gameState.roundHistory.length * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0f18] py-10 px-4">
      <div className="absolute inset-0 pointer-events-none">
        {isVictory ? (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
        )}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
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

        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-2 ${ratingGlows[rating] || ''} ${isVictory ? 'border-amber-500/40 bg-amber-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
            <div>
              <div className={`text-5xl font-bold ${ratingColors[rating] || 'text-zinc-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {rating}
              </div>
              <div className="text-zinc-500 text-xs mt-1 text-center">综合评级</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {score}
            </div>
            <div className="text-zinc-500 text-xs">得分</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {avgCompletion}%
            </div>
            <div className="text-zinc-500 text-xs">完成率</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <div className="w-5 h-5 mx-auto mb-2 flex items-center justify-center">
              <CircularProgress value={gameState.globalMorale} size={20} color={gameState.globalMorale > 50 ? '#22c55e' : '#f59e0b'} />
            </div>
            <div className={`text-xl font-bold ${getStatusColor(gameState.globalMorale, 'morale')}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {gameState.globalMorale}
            </div>
            <div className="text-zinc-500 text-xs">士气</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <div className="w-5 h-5 mx-auto mb-2 flex items-center justify-center">
              <CircularProgress value={100 - gameState.globalRisk} size={20} color={gameState.globalRisk < 40 ? '#22c55e' : '#f59e0b'} />
            </div>
            <div className={`text-xl font-bold ${getStatusColor(gameState.globalRisk, 'risk')}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {gameState.globalRisk}
            </div>
            <div className="text-zinc-500 text-xs">风险</div>
          </div>
        </div>

        {currentReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm">最佳决策回合</span>
                <span className="text-lg font-bold text-green-300 ml-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  第 {currentReport.summary.bestRound} 回合
                </span>
              </div>
              <p className="text-green-300/80 text-xs">{currentReport.summary.bestRoundReason}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-semibold text-sm">最危险回合</span>
                <span className="text-lg font-bold text-red-300 ml-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  第 {currentReport.summary.mostDangerousRound} 回合
                </span>
              </div>
              <p className="text-red-300/80 text-xs">{currentReport.summary.mostDangerousRoundReason}</p>
            </div>
          </div>
        )}

        <div className="bg-[#0f1923] rounded-lg p-5 border border-zinc-800 mb-6">
          <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Users className="w-4 h-4" />
            各小组最终状态
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEAM_IDS.map((teamId) => {
              const team = gameState.teams[teamId];
              const config = TEAM_CONFIG[teamId];
              return (
                <div key={teamId} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                  <div className="text-amber-300 font-medium mb-2 text-xs">{config.name}</div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-xs">士气</span>
                      <span className={`text-xs font-medium ${getStatusColor(team.morale, 'morale')}`}>
                        {team.morale}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${team.morale > 60 ? 'bg-green-500' : team.morale > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${team.morale}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-xs">风险</span>
                      <span className={`text-xs font-medium ${getStatusColor(team.risk, 'risk')}`}>
                        {team.risk}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${team.risk < 40 ? 'bg-green-500' : team.risk < 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${team.risk}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {currentReport && currentReport.suggestions.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 mb-6">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Zap className="w-4 h-4" />
              策略建议
            </h3>
            <ul className="space-y-1.5">
              {currentReport.suggestions.slice(0, 2).map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-200/80 text-xs">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isVictory && strategyPoints > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-amber-400 font-semibold">获得策略点</span>
            </div>
            <div className="text-3xl font-bold text-amber-500 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              +{strategyPoints}
            </div>
            <div className="text-zinc-500 text-xs mt-1 text-center">
              累计策略点: {inheritance.strategyPoints}（可在新周目中使用）
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {currentReport && (
            <button
              onClick={handleViewReport}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-blue-500/20 border border-blue-500/60 text-blue-400 font-semibold transition-all duration-300 hover:bg-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <FileText className="w-5 h-5" />
              查看完整复盘报告
            </button>
          )}
          <button
            onClick={() => { returnToMenu(); navigate('/game'); }}
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
