import { create } from 'zustand';
import type { GameState, GamePhase, TeamId, Allocation, Inheritance } from '@/types/game';
import {
  TEAM_IDS,
  TEAM_CONFIG,
  BASE_SUPPLY,
  INITIAL_MORALE,
  INITIAL_RISK,
  MAX_ROUNDS,
  MAX_MORALE,
} from '@/types/game';
import { generateEvents } from '@/engine/eventGenerator';
import {
  resolveRound,
  applyRoundToTeams,
  calculateGlobalMorale,
  calculateGlobalRisk,
  calculateFinalScore,
  checkGameEnd,
} from '@/engine/scoreCalculator';
import { saveGame, loadGame, clearSave, loadInheritance, saveInheritance, hasSaveData } from '@/utils/saveManager';

interface GameStore {
  gameState: GameState | null;
  inheritance: Inheritance;
  hasSave: boolean;
  finalScore: { score: number; rating: string; strategyPoints: number } | null;
  gameOverReason: string;

  initNewGame: (useInheritedPoints: boolean) => void;
  continueGame: () => boolean;
  setFocusTarget: (teamId: TeamId) => void;
  setAllocation: (allocation: Allocation) => void;
  confirmAllocation: () => void;
  nextRound: () => void;
  goToPhase: (phase: GamePhase) => void;
  endGame: () => void;
  returnToMenu: () => void;
  checkHasSave: () => void;
}

function createInitialGameState(inheritedPoints: number): GameState {
  const teams = {} as GameState['teams'];
  for (const teamId of TEAM_IDS) {
    teams[teamId] = {
      teamId,
      name: TEAM_CONFIG[teamId].name,
      icon: TEAM_CONFIG[teamId].icon,
      allocatedPoints: 0,
      efficiency: 1.0,
      morale: INITIAL_MORALE,
      risk: INITIAL_RISK,
    };
  }

  const totalSupply = BASE_SUPPLY + inheritedPoints;
  const events = generateEvents(1);

  return {
    currentRound: 1,
    phase: 'planning',
    totalSupplyPoints: totalSupply,
    baseSupplyPoints: totalSupply,
    globalMorale: INITIAL_MORALE,
    globalRisk: INITIAL_RISK,
    teams,
    currentRoundEvents: events,
    focusTarget: null,
    currentAllocation: { communication: 0, catering: 0, medical: 0, maintenance: 0 },
    roundHistory: [],
    inheritedStrategyPoints: inheritedPoints,
    isGameOver: false,
    isVictory: false,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  inheritance: loadInheritance() || { strategyPoints: 0, bestRating: 'D', totalPlaythroughs: 0, bestScore: 0 },
  hasSave: hasSaveData(),
  finalScore: null,
  gameOverReason: '',

  checkHasSave: () => {
    set({ hasSave: hasSaveData() });
  },

  initNewGame: (useInheritedPoints: boolean) => {
    const inh = get().inheritance;
    const points = useInheritedPoints ? inh.strategyPoints : 0;
    const state = createInitialGameState(points);
    set({ gameState: state, finalScore: null, gameOverReason: '' });
    saveGame(state);
  },

  continueGame: () => {
    const data = loadGame();
    if (data) {
      set({ gameState: data.gameState, finalScore: null, gameOverReason: '' });
      return true;
    }
    return false;
  },

  setFocusTarget: (teamId: TeamId) => {
    const gs = get().gameState;
    if (!gs) return;
    const updated = { ...gs, focusTarget: teamId };
    set({ gameState: updated });
    saveGame(updated);
  },

  setAllocation: (allocation: Allocation) => {
    const gs = get().gameState;
    if (!gs) return;
    const updated = { ...gs, currentAllocation: allocation };
    set({ gameState: updated });
  },

  confirmAllocation: () => {
    const gs = get().gameState;
    if (!gs || gs.phase !== 'execution') return;

    const roundResult = resolveRound(
      gs.currentRound,
      gs.currentRoundEvents,
      gs.focusTarget,
      gs.currentAllocation,
      gs.teams
    );

    const updatedTeams = applyRoundToTeams(gs.teams, roundResult, gs.currentRoundEvents);
    const globalMorale = calculateGlobalMorale(updatedTeams);
    const globalRisk = calculateGlobalRisk(updatedTeams);

    const updated: GameState = {
      ...gs,
      phase: 'review',
      teams: updatedTeams,
      globalMorale,
      globalRisk,
      roundHistory: [...gs.roundHistory, roundResult],
    };

    set({ gameState: updated });
    saveGame(updated);
  },

  nextRound: () => {
    const gs = get().gameState;
    if (!gs) return;

    const endCheck = checkGameEnd(gs.currentRound + 1, gs.globalMorale, gs.globalRisk, MAX_ROUNDS);
    if (endCheck.ended) {
      const score = calculateFinalScore(gs.roundHistory, gs.globalMorale, gs.globalRisk);
      const updated: GameState = {
        ...gs,
        isGameOver: true,
        isVictory: endCheck.victory,
        currentRound: gs.currentRound + 1,
      };

      const inh = get().inheritance;
      if (endCheck.victory) {
        const newStrategyPoints = inh.strategyPoints + score.strategyPoints;
        const newBestScore = Math.max(inh.bestScore, score.score);
        const newBestRating = compareRatings(score.rating, inh.bestRating) ? score.rating as any : inh.bestRating;
        const newInheritance: Inheritance = {
          strategyPoints: newStrategyPoints,
          bestRating: newBestRating,
          totalPlaythroughs: inh.totalPlaythroughs + 1,
          bestScore: newBestScore,
        };
        saveInheritance(newInheritance);
        set({ inheritance: newInheritance });
      } else {
        const newInheritance: Inheritance = {
          ...inh,
          totalPlaythroughs: inh.totalPlaythroughs + 1,
        };
        saveInheritance(newInheritance);
        set({ inheritance: newInheritance });
      }

      clearSave();
      set({ gameState: updated, finalScore: score, gameOverReason: endCheck.reason || '' });
      return;
    }

    const nextRoundNum = gs.currentRound + 1;
    const events = generateEvents(nextRoundNum);
    const updated: GameState = {
      ...gs,
      currentRound: nextRoundNum,
      phase: 'planning',
      currentRoundEvents: events,
      focusTarget: null,
      currentAllocation: { communication: 0, catering: 0, medical: 0, maintenance: 0 },
      totalSupplyPoints: gs.baseSupplyPoints,
    };

    set({ gameState: updated });
    saveGame(updated);
  },

  goToPhase: (phase: GamePhase) => {
    const gs = get().gameState;
    if (!gs) return;
    const updated = { ...gs, phase };
    set({ gameState: updated });
    saveGame(updated);
  },

  endGame: () => {
    const gs = get().gameState;
    if (!gs) return;
    const score = calculateFinalScore(gs.roundHistory, gs.globalMorale, gs.globalRisk);
    set({ finalScore: score, gameOverReason: '手动结束演练' });
  },

  returnToMenu: () => {
    set({ gameState: null, finalScore: null, gameOverReason: '' });
    get().checkHasSave();
  },
}));

function compareRatings(a: string, b: string): boolean {
  const order = ['S', 'A', 'B', 'C', 'D'];
  return order.indexOf(a) < order.indexOf(b);
}
