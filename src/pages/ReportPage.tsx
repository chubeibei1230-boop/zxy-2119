import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import {
  Home,
  ArrowLeft,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Heart,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { TEAM_CONFIG, TEAM_IDS, TeamId } from '@/types/game';
import type { RoundSnapshot, RoundState } from '@/types/game';

export default function ReportPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentReport, loadReportById, setCurrentReport } = useGameStore();
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadReportById(id);
    }
    return () => {
      setCurrentReport(null);
    };
  }, [id, loadReportById, setCurrentReport]);

  if (!currentReport) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center">
        <div className="text-zinc-500">加载中...</div>
      </div>
    );
  }

  const {
    score,
    rating,
    victory,
    reason,
    totalRounds,
    avgCompletionRate,
    finalMorale,
    finalRisk,
    finalTeams,
    rounds,
    summary,
    suggestions,
    timestamp,
  } = currentReport;

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

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
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

  const toggleRound = (roundNum: number) => {
    setExpandedRound(expandedRound === roundNum ? null : roundNum);
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-zinc-100 pb-20">
      <div className="sticky top-0 z-20 bg-[#0a0f18]/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              演练复盘报告
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="mb-4">
            {victory ? (
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            )}
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className={victory ? 'text-amber-500' : 'text-red-500'}>
              {victory ? '演练完成' : '演练失败'}
            </span>
          </h1>
          <p className="text-zinc-500 text-sm mb-2">{reason}</p>
          <p className="text-zinc-600 text-xs">{formatDate(timestamp)}</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-2 ${ratingGlows[rating] || ''} ${victory ? 'border-amber-500/40 bg-amber-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
            <div>
              <div className={`text-5xl font-bold ${ratingColors[rating] || 'text-zinc-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {rating}
              </div>
              <div className="text-zinc-500 text-xs mt-1 text-center">综合评级</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {score}
            </div>
            <div className="text-zinc-500 text-xs">综合得分</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {totalRounds}
            </div>
            <div className="text-zinc-500 text-xs">总回合数</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <Heart className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getStatusColor(finalMorale, 'morale')}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {finalMorale}
            </div>
            <div className="text-zinc-500 text-xs">最终士气</div>
          </div>
          <div className="bg-[#0f1923] rounded-lg p-4 border border-zinc-800 text-center">
            <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getStatusColor(finalRisk, 'risk')}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {finalRisk}
            </div>
            <div className="text-zinc-500 text-xs">最终风险</div>
          </div>
        </div>

        <div className="bg-[#0f1923] rounded-lg p-5 border border-zinc-800 mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <TrendingUp className="w-5 h-5" />
            整体趋势
          </h3>
          <div className="h-32 relative">
            <div className="absolute inset-0 flex items-end justify-around gap-2">
              {rounds.map((round) => (
                <div key={round.roundNumber} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end h-20">
                    <div
                      className="flex-1 bg-amber-500/60 rounded-t transition-all duration-300"
                      style={{ height: `${round.completionRate * 100}%` }}
                      title={`完成率: ${Math.round(round.completionRate * 100)}%`}
                    />
                    <div
                      className="flex-1 bg-green-500/60 rounded-t transition-all duration-300"
                      style={{ height: `${round.globalMorale}%` }}
                      title={`士气: ${round.globalMorale}`}
                    />
                    <div
                      className="flex-1 bg-red-500/60 rounded-t transition-all duration-300"
                      style={{ height: `${round.globalRisk}%` }}
                      title={`风险: ${round.globalRisk}`}
                    />
                  </div>
                  <span className="text-zinc-600 text-xs">R{round.roundNumber}</span>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500/60 rounded" />
                <span className="text-zinc-500">完成率</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500/60 rounded" />
                <span className="text-zinc-500">士气</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500/60 rounded" />
                <span className="text-zinc-500">风险</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">最佳决策回合</span>
              <span className="text-2xl font-bold text-green-300 ml-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                第 {summary.bestRound} 回合
              </span>
            </div>
            <p className="text-green-300/80 text-sm">{summary.bestRoundReason}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">最危险回合</span>
              <span className="text-2xl font-bold text-red-300 ml-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                第 {summary.mostDangerousRound} 回合
              </span>
            </div>
            <p className="text-red-300/80 text-sm">{summary.mostDangerousRoundReason}</p>
          </div>
        </div>

        <div className="bg-[#0f1923] rounded-lg p-5 border border-zinc-800 mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Users className="w-5 h-5" />
            各小组最终状态
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM_IDS.map((teamId) => {
              const team = finalTeams[teamId];
              const config = TEAM_CONFIG[teamId];
              return (
                <div key={teamId} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <div className="text-amber-300 font-medium mb-3 text-sm">{config.name}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-xs">士气</span>
                      <span className={`text-sm font-medium ${getStatusColor(team.morale, 'morale')}`}>
                        {team.morale}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${team.morale > 60 ? 'bg-green-500' : team.morale > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${team.morale}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-xs">风险</span>
                      <span className={`text-sm font-medium ${getStatusColor(team.risk, 'risk')}`}>
                        {team.risk}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${team.risk < 40 ? 'bg-green-500' : team.risk < 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${team.risk}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-xs">效率</span>
                      <span className={`text-sm font-medium ${getStatusColor(team.efficiency, 'efficiency')}`}>
                        {Math.round(team.efficiency * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 mb-8">
          <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Zap className="w-5 h-5" />
            策略建议
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-200/80 text-sm">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Target className="w-5 h-5" />
            回合详情
          </h3>
          <div className="space-y-3">
            {rounds.map((round) => (
              <RoundDetail
                key={round.roundNumber}
                round={round}
                expanded={expandedRound === round.roundNumber}
                onToggle={() => toggleRound(round.roundNumber)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundDetail({ round, expanded, onToggle }: {
  round: RoundState;
  expanded: boolean;
  onToggle: () => void;
}) {
  const completedCount = Object.values(round.taskCompleted).filter(Boolean).length;
  const totalTeams = Object.keys(round.taskCompleted).length;

  const getStatusColor = (value: number, type: 'morale' | 'risk') => {
    if (type === 'morale') {
      return value > 60 ? 'bg-green-500' : value > 30 ? 'bg-amber-500' : 'bg-red-500';
    }
    return value < 40 ? 'bg-green-500' : value < 70 ? 'bg-amber-500' : 'bg-red-500';
  };

  const getTextColor = (value: number, type: 'morale' | 'risk') => {
    if (type === 'morale') {
      return value > 60 ? 'text-green-400' : value > 30 ? 'text-amber-400' : 'text-red-400';
    }
    return value < 40 ? 'text-green-400' : value < 70 ? 'text-amber-400' : 'text-red-400';
  };

  return (
    <div className="bg-[#0f1923] rounded-lg border border-zinc-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <span className="text-amber-400 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {round.roundNumber}
            </span>
          </div>
          <div className="text-left">
            <div className="font-medium text-zinc-200">第 {round.roundNumber} 回合</div>
            <div className="text-xs text-zinc-500">
              任务完成: {completedCount}/{totalTeams} · 重点目标: {round.focusTarget ? TEAM_CONFIG[round.focusTarget].name : '无'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className={round.moraleDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
              {round.moraleDelta >= 0 ? '+' : ''}{round.moraleDelta} 士气
            </span>
            <span className={round.riskDelta <= 0 ? 'text-green-400' : 'text-red-400'}>
              {round.riskDelta >= 0 ? '+' : ''}{round.riskDelta} 风险
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-4">
          {round.events.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">突发事件</h4>
              <div className="space-y-2">
                {round.events.map((event, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-red-300">
                    {event.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">资源分配</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TEAM_IDS.map((teamId) => (
                <div
                  key={teamId}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    round.focusTarget === teamId
                      ? 'bg-amber-500/20 border border-amber-500/40'
                      : 'bg-zinc-800/50 border border-zinc-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={round.focusTarget === teamId ? 'text-amber-300' : 'text-zinc-400'}>
                      {TEAM_CONFIG[teamId].name}
                    </span>
                    <span className="font-bold text-zinc-200">{round.allocation[teamId]}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500">
                      {round.taskCompleted[teamId] ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 完成
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> 未完成
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {round.teams && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">各小组状态</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TEAM_IDS.map((teamId) => {
                  const teamState = round.teams[teamId];
                  return (
                    <div
                      key={teamId}
                      className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700/50"
                    >
                      <div className="text-amber-300 font-medium text-xs mb-2">
                        {TEAM_CONFIG[teamId].name}
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">士气</span>
                            <span className={`font-medium ${getTextColor(teamState.morale, 'morale')}`}>
                              {teamState.morale}
                            </span>
                          </div>
                          <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`h-full rounded-full ${getStatusColor(teamState.morale, 'morale')}`}
                              style={{ width: `${teamState.morale}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">风险</span>
                            <span className={`font-medium ${getTextColor(teamState.risk, 'risk')}`}>
                              {teamState.risk}
                            </span>
                          </div>
                          <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`h-full rounded-full ${getStatusColor(teamState.risk, 'risk')}`}
                              style={{ width: `${teamState.risk}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-zinc-500 mb-1">完成率</div>
              <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {Math.round(round.completionRate * 100)}%
              </div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-zinc-500 mb-1">士气变化</div>
              <div className={`text-xl font-bold ${round.moraleDelta >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {round.moraleDelta >= 0 ? '+' : ''}{round.moraleDelta}
              </div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-zinc-500 mb-1">风险变化</div>
              <div className={`text-xl font-bold ${round.riskDelta <= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {round.riskDelta >= 0 ? '+' : ''}{round.riskDelta}
              </div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center">
              <div className="text-xs text-zinc-500 mb-1">士气/风险</div>
              <div className="text-xl font-bold text-zinc-300" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {round.globalMorale}/{round.globalRisk}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
