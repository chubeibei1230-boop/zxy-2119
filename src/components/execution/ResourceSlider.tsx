import { Star, Radio, UtensilsCrossed, HeartPulse, Wrench } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { Allocation, TeamId } from '@/types/game';
import { TEAM_IDS, TEAM_CONFIG, FOCUS_THRESHOLD, NORMAL_THRESHOLD } from '@/types/game';

const ICON_MAP: Record<string, any> = {
  Radio,
  UtensilsCrossed,
  HeartPulse,
  Wrench,
};

function getSliderColor(teamId: TeamId, value: number, focusTarget: TeamId | null): string {
  const threshold = teamId === focusTarget ? FOCUS_THRESHOLD : NORMAL_THRESHOLD;
  if (value >= threshold) return '#22c55e';
  if (value === 0) return '#f59e0b';
  return '#ef4444';
}

export default function ResourceSlider() {
  const gameState = useGameStore((s) => s.gameState);
  const setAllocation = useGameStore((s) => s.setAllocation);

  if (!gameState) return null;

  const { currentAllocation, totalSupplyPoints, focusTarget } = gameState;

  const totalUsed = TEAM_IDS.reduce((sum, id) => sum + currentAllocation[id], 0);
  const remaining = totalSupplyPoints - totalUsed;

  const handleChange = (teamId: TeamId, value: number) => {
    const newAllocation: Allocation = { ...currentAllocation, [teamId]: value };
    setAllocation(newAllocation);
  };

  return (
    <div className="bg-[#0f1923] rounded-lg border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-500 font-bold text-sm tracking-wide">资源分配</h3>
        <span className="text-amber-500 font-mono text-sm">
          剩余补给: <span className={remaining === 0 ? 'text-green-500' : remaining < 2 ? 'text-red-500' : 'text-amber-500'}>{remaining}</span>
        </span>
      </div>

      <div className="space-y-3">
        {TEAM_IDS.map((teamId) => {
          const config = TEAM_CONFIG[teamId];
          const Icon = ICON_MAP[config.icon];
          const value = currentAllocation[teamId];
          const isFocus = teamId === focusTarget;
          const threshold = isFocus ? FOCUS_THRESHOLD : NORMAL_THRESHOLD;
          const maxForTeam = totalSupplyPoints - totalUsed + value;
          const color = getSliderColor(teamId, value, focusTarget);
          const thresholdPercent = (threshold / totalSupplyPoints) * 100;

          return (
            <div key={teamId} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-20 shrink-0">
                <Icon size={16} className="text-gray-400" />
                <span className="text-gray-300 text-xs">{config.name}</span>
                {isFocus && <Star size={12} className="text-amber-500 fill-amber-500" />}
              </div>

              <div className="relative flex-1">
                <input
                  type="range"
                  min={0}
                  max={maxForTeam}
                  step={1}
                  value={value}
                  onChange={(e) => handleChange(teamId, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700/60"
                  style={{
                    accentColor: color,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-3 w-px bg-white/40 pointer-events-none"
                  style={{ left: `${thresholdPercent}%` }}
                />
              </div>

              <span className="font-mono text-sm w-6 text-right" style={{ color }}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
