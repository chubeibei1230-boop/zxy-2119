import { CheckCircle2, XCircle, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { TeamId } from '@/types/game';
import { TEAM_IDS, TEAM_CONFIG, FOCUS_BONUS, FOCUS_THRESHOLD, NORMAL_THRESHOLD, MORALE_GAIN, MORALE_LOSS, FOCUS_MORALE_BONUS, BASE_RISK_PER_ROUND, UNDERFUNDED_RISK } from '@/types/game';

export default function AllocationPreview() {
  const gameState = useGameStore((s) => s.gameState);

  if (!gameState) return null;

  const { currentAllocation, focusTarget, teams, currentRoundEvents } = gameState;

  const predictions: Record<TeamId, { completed: boolean; threshold: number }> = {} as any;
  let completedCount = 0;

  for (const teamId of TEAM_IDS) {
    const points = currentAllocation[teamId];
    const isFocus = teamId === focusTarget;
    const threshold = isFocus ? FOCUS_THRESHOLD : NORMAL_THRESHOLD;
    const effectivePoints = isFocus ? points * (1 + FOCUS_BONUS) : points;
    const completed = effectivePoints >= threshold;
    predictions[teamId] = { completed, threshold };
    if (completed) completedCount++;
  }

  const completionRate = completedCount / TEAM_IDS.length;

  let moraleDelta = 0;
  let riskDelta = BASE_RISK_PER_ROUND;

  for (const teamId of TEAM_IDS) {
    if (predictions[teamId].completed) {
      moraleDelta += MORALE_GAIN;
    } else {
      moraleDelta += MORALE_LOSS;
      riskDelta += UNDERFUNDED_RISK;
    }
    if (teamId === focusTarget) {
      moraleDelta += FOCUS_MORALE_BONUS;
    }
  }

  for (const event of currentRoundEvents) {
    moraleDelta += event.moraleImpact;
    riskDelta += Math.round(event.impact * 20);
  }

  return (
    <div className="bg-[#0f1923] rounded-lg border border-gray-700/50 p-4">
      <h3 className="text-amber-500 font-bold text-sm tracking-wide mb-3">分配预览</h3>

      <div className="space-y-1.5 mb-3">
        {TEAM_IDS.map((teamId) => {
          const config = TEAM_CONFIG[teamId];
          const pred = predictions[teamId];
          return (
            <div key={teamId} className="flex items-center justify-between py-1 px-2 rounded bg-gray-800/40">
              <span className="text-gray-400 text-xs">{config.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-xs">≥{pred.threshold}</span>
                {pred.completed ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <XCircle size={14} className="text-red-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-700/50 pt-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">完成率</span>
          <span className={completionRate >= 0.75 ? 'text-green-500' : completionRate >= 0.5 ? 'text-amber-500' : 'text-red-500'}>
            {Math.round(completionRate * 100)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">士气变化</span>
          <span className={`flex items-center gap-0.5 ${moraleDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {moraleDelta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {moraleDelta >= 0 ? '+' : ''}{moraleDelta}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">风险变化</span>
          <span className={`flex items-center gap-0.5 ${riskDelta <= BASE_RISK_PER_ROUND ? 'text-green-500' : 'text-red-500'}`}>
            <AlertTriangle size={12} />
            +{riskDelta}
          </span>
        </div>
      </div>
    </div>
  );
}
