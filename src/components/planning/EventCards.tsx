import { Zap, BatteryLow, Route, Siren } from 'lucide-react';
import type { GameEvent, EventType } from '@/types/game';
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

const EVENT_GLOW_COLORS: Record<EventType, string> = {
  power_shortage: 'shadow-yellow-500/30',
  fatigue: 'shadow-blue-500/30',
  route_blocked: 'shadow-orange-500/30',
  emergency: 'shadow-red-500/30',
};

interface EventCardsProps {
  events: GameEvent[];
}

export default function EventCards({ events }: EventCardsProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-amber-500 tracking-wide">本回合事件</h2>
      <div className="space-y-3">
        {events.map((event) => {
          const Icon = EVENT_ICONS[event.type];
          const borderColor = EVENT_BORDER_COLORS[event.type];
          const glowColor = EVENT_GLOW_COLORS[event.type];

          return (
            <div
              key={event.id}
              className={`relative bg-[#0f1923] border-l-4 ${borderColor} rounded-r-lg p-4 shadow-lg ${glowColor} animate-pulse-slow`}
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
                      士气影响: <span className="text-blue-400 font-medium">{event.moraleImpact > 0 ? '+' : ''}{event.moraleImpact}</span>
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
