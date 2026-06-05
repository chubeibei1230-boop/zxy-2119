import type {
  Allocation,
  GameEvent,
  Rating,
  RoundState,
  TeamId,
  TeamState,
} from '@/types/game';
import {
  FOCUS_BONUS,
  FOCUS_MORALE_BONUS,
  FOCUS_THRESHOLD,
  MORALE_GAIN,
  MORALE_LOSS,
  NORMAL_THRESHOLD,
  UNDERFUNDED_RISK,
  BASE_RISK_PER_ROUND,
  MAX_MORALE,
  MAX_RISK,
  INITIAL_MORALE,
} from '@/types/game';

export function resolveRound(
  roundNumber: number,
  events: GameEvent[],
  focusTarget: TeamId | null,
  allocation: Allocation,
  teams: Record<TeamId, TeamState>
): RoundState {
  const taskCompleted: Record<TeamId, boolean> = {} as Record<TeamId, boolean>;
  let totalCompleted = 0;
  const teamIds = Object.keys(allocation) as TeamId[];

  for (const teamId of teamIds) {
    const points = allocation[teamId];
    const isFocus = teamId === focusTarget;
    const threshold = isFocus ? FOCUS_THRESHOLD : NORMAL_THRESHOLD;
    const effectivePoints = isFocus ? points * (1 + FOCUS_BONUS) : points;
    taskCompleted[teamId] = effectivePoints >= threshold;
    if (taskCompleted[teamId]) totalCompleted++;
  }

  const completionRate = totalCompleted / teamIds.length;

  let moraleDelta = 0;
  let riskDelta = BASE_RISK_PER_ROUND;

  for (const teamId of teamIds) {
    if (taskCompleted[teamId]) {
      moraleDelta += MORALE_GAIN;
    } else {
      moraleDelta += MORALE_LOSS;
      riskDelta += UNDERFUNDED_RISK;
    }
    if (teamId === focusTarget) {
      moraleDelta += FOCUS_MORALE_BONUS;
    }
  }

  for (const event of events) {
    moraleDelta += event.moraleImpact;
    riskDelta += Math.round(event.impact * 20);
  }

  return {
    roundNumber,
    events,
    focusTarget,
    allocation,
    taskCompleted,
    moraleDelta,
    riskDelta,
    completionRate,
  };
}

export function applyRoundToTeams(
  teams: Record<TeamId, TeamState>,
  roundState: RoundState,
  events: GameEvent[]
): Record<TeamId, TeamState> {
  const updated = { ...teams };
  const teamIds = Object.keys(updated) as TeamId[];

  for (const teamId of teamIds) {
    const team = { ...updated[teamId] };
    const isCompleted = roundState.taskCompleted[teamId];

    team.allocatedPoints = roundState.allocation[teamId];
    team.efficiency = isCompleted
      ? Math.min(1, team.efficiency + 0.05)
      : Math.max(0.3, team.efficiency - 0.1);

    const eventImpact = events
      .filter((e) => e.affectedTeam === teamId)
      .reduce((sum, e) => sum + e.moraleImpact, 0);

    team.morale = isCompleted
      ? Math.min(MAX_MORALE, team.morale + MORALE_GAIN + (teamId === roundState.focusTarget ? FOCUS_MORALE_BONUS : 0))
      : Math.max(0, team.morale + MORALE_LOSS);

    team.morale = Math.max(0, Math.min(MAX_MORALE, team.morale + eventImpact));
    team.risk = isCompleted
      ? Math.max(0, team.risk - 5)
      : Math.min(MAX_RISK, team.risk + UNDERFUNDED_RISK);

    updated[teamId] = team;
  }

  return updated;
}

export function calculateGlobalMorale(teams: Record<TeamId, TeamState>): number {
  const teamIds = Object.keys(teams) as TeamId[];
  const avg = teamIds.reduce((sum, id) => sum + teams[id].morale, 0) / teamIds.length;
  return Math.round(Math.max(0, Math.min(MAX_MORALE, avg)));
}

export function calculateGlobalRisk(teams: Record<TeamId, TeamState>): number {
  const teamIds = Object.keys(teams) as TeamId[];
  const avg = teamIds.reduce((sum, id) => sum + teams[id].risk, 0) / teamIds.length;
  return Math.round(Math.max(0, Math.min(MAX_RISK, avg)));
}

export function calculateFinalScore(
  roundHistory: RoundState[],
  globalMorale: number,
  globalRisk: number
): { score: number; rating: Rating; strategyPoints: number } {
  const avgCompletion =
    roundHistory.reduce((sum, r) => sum + r.completionRate, 0) / roundHistory.length;
  const completionScore = avgCompletion * 40;
  const moraleScore = (globalMorale / MAX_MORALE) * 30;
  const riskScore = ((MAX_RISK - globalRisk) / MAX_RISK) * 30;
  const total = Math.round(completionScore + moraleScore + riskScore);

  let rating: Rating;
  let strategyPoints: number;
  if (total >= 85) { rating = 'S'; strategyPoints = 5; }
  else if (total >= 70) { rating = 'A'; strategyPoints = 4; }
  else if (total >= 55) { rating = 'B'; strategyPoints = 3; }
  else if (total >= 40) { rating = 'C'; strategyPoints = 2; }
  else { rating = 'D'; strategyPoints = 1; }

  return { score: total, rating, strategyPoints };
}

export function checkGameEnd(
  currentRound: number,
  globalMorale: number,
  globalRisk: number,
  maxRounds: number
): { ended: boolean; victory: boolean; reason?: string } {
  if (globalMorale <= 0) {
    return { ended: true, victory: false, reason: '士气归零，应急演练失败' };
  }
  if (globalRisk >= MAX_RISK) {
    return { ended: true, victory: false, reason: '风险爆表，应急演练失败' };
  }
  if (currentRound > maxRounds) {
    return { ended: true, victory: true, reason: '所有回合完成，应急演练结束' };
  }
  return { ended: false, victory: false };
}
