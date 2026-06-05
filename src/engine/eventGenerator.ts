import {
  type GameEvent,
  type EventType,
  type TeamId,
  EVENT_CONFIG,
  TEAM_IDS,
} from '@/types/game';

const EVENT_TYPES: EventType[] = ['power_shortage', 'fatigue', 'route_blocked', 'emergency'];

const TEAM_EVENT_MAP: Record<EventType, TeamId[]> = {
  power_shortage: ['communication', 'catering', 'medical', 'maintenance'],
  fatigue: ['communication', 'catering', 'medical', 'maintenance'],
  route_blocked: ['communication', 'catering', 'medical', 'maintenance'],
  emergency: ['communication', 'catering', 'medical', 'maintenance'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateEvents(roundNumber: number): GameEvent[] {
  const count = roundNumber <= 3 ? 1 : (Math.random() < 0.5 ? 1 : 2);
  const events: GameEvent[] = [];
  const usedTypes = new Set<EventType>();

  for (let i = 0; i < count; i++) {
    let eventType: EventType;
    do {
      eventType = pickRandom(EVENT_TYPES);
    } while (usedTypes.has(eventType) && usedTypes.size < EVENT_TYPES.length);
    usedTypes.add(eventType);

    const affectedTeam = pickRandom(TEAM_EVENT_MAP[eventType]);
    const config = EVENT_CONFIG[eventType];
    const description = config.descriptions[TEAM_IDS.indexOf(affectedTeam)] || config.descriptions[0];

    const impactMultiplier = 1 + (roundNumber - 1) * 0.1;
    const baseImpact = eventType === 'emergency' ? 0.25 : 0.15;

    events.push({
      id: generateEventId(),
      type: eventType,
      description,
      affectedTeam,
      impact: Math.round(baseImpact * impactMultiplier * 100) / 100,
      moraleImpact: eventType === 'emergency' ? -5 : -3,
    });
  }

  return events;
}
