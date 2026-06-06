import type { RoundState, GameState, GameReport, RoundSnapshot, ReportSummary, TeamId } from '@/types/game';
import { TEAM_CONFIG, MAX_MORALE, MAX_RISK } from '@/types/game';

export function generateRoundSnapshots(
  roundHistory: RoundState[],
  finalGameState: GameState
): RoundSnapshot[] {
  const snapshots: RoundSnapshot[] = [];
  
  let runningMorale = finalGameState.globalMorale;
  let runningRisk = finalGameState.globalRisk;
  let runningTeams = { ...finalGameState.teams };
  
  for (let i = roundHistory.length - 1; i >= 0; i--) {
    const round = roundHistory[i];
    
    const teamsSnapshot: Record<TeamId, { morale: number; risk: number; efficiency: number; allocatedPoints: number }> = {} as any;
    for (const teamId of Object.keys(runningTeams) as TeamId[]) {
      teamsSnapshot[teamId] = {
        morale: runningTeams[teamId].morale,
        risk: runningTeams[teamId].risk,
        efficiency: runningTeams[teamId].efficiency,
        allocatedPoints: runningTeams[teamId].allocatedPoints,
      };
    }
    
    snapshots.unshift({
      roundNumber: round.roundNumber,
      events: round.events,
      focusTarget: round.focusTarget,
      allocation: round.allocation,
      taskCompleted: round.taskCompleted,
      moraleDelta: round.moraleDelta,
      riskDelta: round.riskDelta,
      completionRate: round.completionRate,
      globalMorale: runningMorale,
      globalRisk: runningRisk,
      teams: teamsSnapshot,
    });
    
    runningMorale = Math.max(0, Math.min(MAX_MORALE, runningMorale - round.moraleDelta));
    runningRisk = Math.max(0, Math.min(MAX_RISK, runningRisk - round.riskDelta));
    
    const prevRound = roundHistory[i - 1];
    if (prevRound) {
      const newTeams: typeof runningTeams = {} as any;
      for (const teamId of Object.keys(runningTeams) as TeamId[]) {
        const team = runningTeams[teamId];
        const wasCompleted = prevRound.taskCompleted[teamId];
        newTeams[teamId] = {
          ...team,
          morale: wasCompleted
            ? Math.max(0, Math.min(MAX_MORALE, team.morale - 10 - (teamId === prevRound.focusTarget ? 5 : 0)))
            : Math.max(0, Math.min(MAX_MORALE, team.morale + 15)),
          risk: wasCompleted
            ? Math.max(0, Math.min(MAX_RISK, team.risk + 5))
            : Math.max(0, Math.min(MAX_RISK, team.risk - 10)),
          efficiency: wasCompleted
            ? Math.max(0.3, team.efficiency - 0.05)
            : Math.min(1, team.efficiency + 0.1),
        };
      }
      runningTeams = newTeams;
    }
  }
  
  return snapshots;
}

export function generateReportSummary(rounds: RoundSnapshot[]): ReportSummary {
  if (rounds.length === 0) {
    return {
      bestRound: 1,
      bestRoundReason: '无数据',
      mostDangerousRound: 1,
      mostDangerousRoundReason: '无数据',
    };
  }
  
  let bestRound = rounds[0];
  let bestScore = -Infinity;
  
  let mostDangerousRound = rounds[0];
  let mostDangerousScore = -Infinity;
  
  for (const round of rounds) {
    const roundScore = round.completionRate * 100 + (round.moraleDelta > 0 ? round.moraleDelta : 0) - (round.riskDelta > 0 ? round.riskDelta : 0);
    if (roundScore > bestScore) {
      bestScore = roundScore;
      bestRound = round;
    }
    
    const dangerScore = round.riskDelta + (round.moraleDelta < 0 ? Math.abs(round.moraleDelta) : 0);
    if (dangerScore > mostDangerousScore) {
      mostDangerousScore = dangerScore;
      mostDangerousRound = round;
    }
  }
  
  const completedTeams = Object.entries(bestRound.taskCompleted)
    .filter(([, completed]) => completed)
    .map(([id]) => TEAM_CONFIG[id as TeamId].name);
  
  const bestReason = completedTeams.length > 0
    ? `${completedTeams.join('、')}任务全部完成，士气提升${bestRound.moraleDelta > 0 ? bestRound.moraleDelta : 0}点`
    : '资源分配均衡，风险控制良好';
  
  const failedTeams = Object.entries(mostDangerousRound.taskCompleted)
    .filter(([, completed]) => !completed)
    .map(([id]) => TEAM_CONFIG[id as TeamId].name);
  
  const dangerReason = failedTeams.length > 0
    ? `${failedTeams.join('、')}任务失败，风险上升${mostDangerousRound.riskDelta}点`
    : '突发事件频发，士气大幅下降';
  
  return {
    bestRound: bestRound.roundNumber,
    bestRoundReason: bestReason,
    mostDangerousRound: mostDangerousRound.roundNumber,
    mostDangerousRoundReason: dangerReason,
  };
}

export function generateSuggestions(
  rounds: RoundSnapshot[],
  finalTeams: GameState['teams'],
  victory: boolean
): string[] {
  const suggestions: string[] = [];
  
  const avgCompletion = rounds.reduce((sum, r) => sum + r.completionRate, 0) / rounds.length;
  if (avgCompletion < 0.5) {
    suggestions.push('整体任务完成率偏低，建议每回合确保至少2个小组的资源投入达到阈值');
  } else if (avgCompletion < 0.75) {
    suggestions.push('任务完成率中等，可尝试优化资源分配策略，优先保障重点目标');
  }
  
  const teamPerformances: Record<TeamId, number> = {} as any;
  for (const teamId of Object.keys(TEAM_CONFIG) as TeamId[]) {
    const completedRounds = rounds.filter(r => r.taskCompleted[teamId]).length;
    teamPerformances[teamId] = completedRounds / rounds.length;
  }
  
  const worstTeam = (Object.entries(teamPerformances) as [TeamId, number][])
    .sort((a, b) => a[1] - b[1])[0];
  
  if (worstTeam[1] < 0.5) {
    suggestions.push(`${TEAM_CONFIG[worstTeam[0]].name}表现较弱，建议在后续演练中优先保障该小组的资源供给`);
  }
  
  const highRiskRounds = rounds.filter(r => r.globalRisk > 60).length;
  if (highRiskRounds > rounds.length / 2) {
    suggestions.push('风险控制不佳，多回合处于高风险状态，建议增加对风险较高小组的资源投入');
  }
  
  const lowMoraleRounds = rounds.filter(r => r.globalMorale < 40).length;
  if (lowMoraleRounds > 0) {
    suggestions.push('士气曾出现过低谷，建议在关键回合通过完成任务来提升整体士气');
  }
  
  const focusDistribution: Record<string, number> = {};
  for (const round of rounds) {
    if (round.focusTarget) {
      focusDistribution[round.focusTarget] = (focusDistribution[round.focusTarget] || 0) + 1;
    }
  }
  
  const focusCount = Object.keys(focusDistribution).length;
  if (focusCount <= 1) {
    suggestions.push('重点目标选择较为单一，可尝试在不同回合关注不同小组，平衡发展');
  }
  
  if (!victory) {
    suggestions.push('本次演练未能通关，建议复盘各回合决策，优化资源分配策略');
  } else if (suggestions.length === 0) {
    suggestions.push('演练表现优秀！可尝试挑战更高难度的资源分配策略');
  }
  
  return suggestions.slice(0, 4);
}

export function generateGameReport(
  gameState: GameState,
  score: number,
  rating: string,
  victory: boolean,
  reason: string
): GameReport {
  const rounds = generateRoundSnapshots(gameState.roundHistory, gameState);
  const summary = generateReportSummary(rounds);
  
  const finalTeams: GameReport['finalTeams'] = {} as any;
  for (const teamId of Object.keys(gameState.teams) as TeamId[]) {
    const team = gameState.teams[teamId];
    finalTeams[teamId] = {
      morale: team.morale,
      risk: team.risk,
      efficiency: team.efficiency,
    };
  }
  
  const suggestions = generateSuggestions(rounds, gameState.teams, victory);
  const avgCompletionRate = rounds.length > 0
    ? rounds.reduce((sum, r) => sum + r.completionRate, 0) / rounds.length
    : 0;
  
  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    score,
    rating: rating as any,
    victory,
    reason,
    totalRounds: rounds.length,
    avgCompletionRate,
    finalMorale: gameState.globalMorale,
    finalRisk: gameState.globalRisk,
    finalTeams,
    rounds,
    summary,
    suggestions,
  };
}
