import { Swords, Heart, AlertTriangle, Zap, Clock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { GamePhase } from '@/types/game';
import { MAX_ROUNDS } from '@/types/game';

const PHASE_LABELS: Record<GamePhase, string> = {
  planning: '策划',
  execution: '执行',
  review: '复盘',
};

function getMoraleColor(value: number): string {
  if (value >= 67) return 'bg-green-500';
  if (value >= 34) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMoraleTextColor(value: number): string {
  if (value >= 67) return 'text-green-500';
  if (value >= 34) return 'text-amber-500';
  return 'text-red-500';
}

function getRiskColor(value: number): string {
  if (value <= 33) return 'bg-green-500';
  if (value <= 66) return 'bg-amber-500';
  return 'bg-red-500';
}

function getRiskTextColor(value: number): string {
  if (value <= 33) return 'text-green-500';
  if (value <= 66) return 'text-amber-500';
  return 'text-red-500';
}

function getPhaseIcon(phase: GamePhase) {
  switch (phase) {
    case 'planning':
      return <Clock className="w-4 h-4" />;
    case 'execution':
      return <Zap className="w-4 h-4" />;
    case 'review':
      return <Swords className="w-4 h-4" />;
  }
}

export default function GameHeader() {
  const gameState = useGameStore((s) => s.gameState);

  if (!gameState) return null;

  const { currentRound, totalSupplyPoints, globalMorale, globalRisk, phase } = gameState;

  return (
    <header className="relative bg-[#0f1923] border-b border-amber-500/30 px-6 py-3">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-500" />
          <span className="text-amber-500 font-bold text-sm tracking-wide">
            回合 {currentRound}/{MAX_ROUNDS}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium">
            补给 {totalSupplyPoints}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <Heart className={`w-4 h-4 ${getMoraleTextColor(globalMorale)}`} />
          <span className={`text-xs font-medium ${getMoraleTextColor(globalMorale)} w-8`}>
            {globalMorale}
          </span>
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getMoraleColor(globalMorale)}`}
              style={{ width: `${globalMorale}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <AlertTriangle className={`w-4 h-4 ${getRiskTextColor(globalRisk)}`} />
          <span className={`text-xs font-medium ${getRiskTextColor(globalRisk)} w-8`}>
            {globalRisk}
          </span>
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getRiskColor(globalRisk)}`}
              style={{ width: `${globalRisk}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1">
          {getPhaseIcon(phase)}
          <span className="text-amber-500 text-sm font-semibold">
            {PHASE_LABELS[phase]}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
    </header>
  );
}
