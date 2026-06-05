import { TrendingUp, TrendingDown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { TEAM_CONFIG, TEAM_IDS } from '@/types/game';
import type { TeamId } from '@/types/game';
import CircularProgress from '@/components/common/CircularProgress';

function DeltaIndicator({ value, type }: { value: number; type: 'morale' | 'risk' }) {
  const isMorale = type === 'morale';
  const isPositive = isMorale ? value > 0 : value < 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const label = isMorale ? '士气' : '风险';
  const displayValue = value > 0 ? `+${value}` : `${value}`;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-bold ${colorClass}`}>{displayValue}</span>
    </div>
  );
}

export default function ScorePanel() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState || gameState.roundHistory.length === 0) return null;

  const latestRound = gameState.roundHistory[gameState.roundHistory.length - 1];
  const focusTarget = latestRound.focusTarget;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-amber-500 tracking-wide">回合结算</h2>

      <div className="bg-[#0f1923] rounded-lg p-5 space-y-5">
        <div className="flex items-center justify-center">
          <div className="relative">
            <CircularProgress
              value={latestRound.completionRate * 100}
              size={100}
              strokeWidth={8}
              color="#f59e0b"
              label="完成率"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <DeltaIndicator value={latestRound.moraleDelta} type="morale" />
          <DeltaIndicator value={latestRound.riskDelta} type="risk" />
        </div>
      </div>

      <div className="space-y-2">
        {TEAM_IDS.map((teamId: TeamId, index: number) => {
          const isFocus = teamId === focusTarget;
          const completed = latestRound.taskCompleted[teamId];
          const allocated = latestRound.allocation[teamId];

          return (
            <div
              key={teamId}
              className={`bg-[#0f1923] rounded-lg p-3 flex items-center justify-between border ${
                isFocus ? 'border-amber-500' : 'border-transparent'
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">
                  {TEAM_CONFIG[teamId].name}
                </span>
                {isFocus && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                    聚焦
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">
                  分配: <span className="text-gray-300 font-medium">{allocated}</span>
                </span>
                <span className={completed ? 'text-green-400' : 'text-red-400'}>
                  {completed ? '✓' : '✗'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
