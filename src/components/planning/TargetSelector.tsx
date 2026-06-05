import { Radio, UtensilsCrossed, HeartPulse, Wrench } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { TeamId } from '@/types/game';
import { TEAM_IDS, TEAM_CONFIG } from '@/types/game';

const TEAM_ICONS: Record<TeamId, React.ElementType> = {
  communication: Radio,
  catering: UtensilsCrossed,
  medical: HeartPulse,
  maintenance: Wrench,
};

export default function TargetSelector() {
  const gameState = useGameStore((s) => s.gameState);
  const setFocusTarget = useGameStore((s) => s.setFocusTarget);

  if (!gameState) return null;

  const isPlanning = gameState.phase === 'planning';

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-amber-500 tracking-wide">选择本回合重点目标</h2>
      <div className="grid grid-cols-2 gap-3">
        {TEAM_IDS.map((teamId) => {
          const team = gameState.teams[teamId];
          const Icon = TEAM_ICONS[teamId];
          const isSelected = gameState.focusTarget === teamId;

          return (
            <button
              key={teamId}
              onClick={() => isPlanning && setFocusTarget(teamId)}
              disabled={!isPlanning}
              className={`
                relative bg-[#0f1923] rounded-lg p-4 border-2 transition-all duration-200
                ${isSelected
                  ? 'border-amber-500 shadow-lg shadow-amber-500/30'
                  : 'border-gray-700 hover:border-gray-500'
                }
                ${isPlanning ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-not-allowed opacity-60'}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500/20' : 'bg-gray-800'}`}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-semibold ${isSelected ? 'text-amber-400' : 'text-gray-300'}`}>
                  {TEAM_CONFIG[teamId].name}
                </span>
                <div className="w-full space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>效率</span>
                    <span className="text-gray-300">{(team.efficiency * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>士气</span>
                    <span className="text-gray-300">{team.morale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>风险</span>
                    <span className="text-gray-300">{team.risk}</span>
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
