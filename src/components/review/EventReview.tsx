import { Zap, BatteryLow, Route, Siren } from 'lucide-react';
import type { GameEvent, EventType, RoundState } from '@/types/game';
import { EVENT_CONFIG, TEAM_CONFIG } from '@/types/game';

const EVENT_ICONS: Record<EventType, React.ElementType> = {
  power_shortage: Zap,
  fatigue: BatteryLow,
  route_blocked: Route,
  emergency: Siren,
};

const EVENT_BORDER_COLORS: Record<EventType, string> = {
  power_shortage: 'border-yellow-500',
  fatigue: 'border-blue-500',
  route_blocked: 'border-orange-500',
  emergency: 'border-red-500',
};

interface EventReviewProps {
  events: GameEvent[];
  roundState: RoundState;
}

export default function EventReview({ events, roundState }: EventReviewProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-amber-500 tracking-wide">事件影响回顾</h2>
      <div className="space-y-3">
        {events.map((event) => {
          const Icon = EVENT_ICONS[event.type];
          const borderColor = EVENT_BORDER_COLORS[event.type];
          const teamCompleted = roundState.taskCompleted[event.affectedTeam];
          const overcame = teamCompleted;

          return (
            <div
              key={event.id}
              className={`relative bg-[#0f1923] border-l-4 ${borderColor} rounded-r-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-amber-400">
                      {EVENT_CONFIG[event.type].label}
                    </span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-gray-400">
                      {TEAM_CONFIG[event.affectedTeam].name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      影响值: <span className="text-red-400 font-medium">-{event.impact}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      士气影响:{' '}
                      <span className="text-blue-400 font-medium">
                        {event.moraleImpact > 0 ? '+' : ''}
                        {event.moraleImpact}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        overcame ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {overcame ? '克服事件 ✓' : '未能克服 ✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
