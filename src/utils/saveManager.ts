import type { GameState, Inheritance, SaveData, GameReport } from '@/types/game';

const SAVE_KEY = 'emergency_drill_save';
const INHERITANCE_KEY = 'emergency_drill_inheritance';
const REPORTS_KEY = 'emergency_drill_reports';

export function saveGame(state: GameState): void {
  const data: SaveData = {
    gameState: state,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save game');
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function saveInheritance(data: Inheritance): void {
  try {
    localStorage.setItem(INHERITANCE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save inheritance');
  }
}

export function loadInheritance(): Inheritance | null {
  try {
    const raw = localStorage.getItem(INHERITANCE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Inheritance;
  } catch {
    return null;
  }
}

export function hasSaveData(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function saveReport(report: GameReport): void {
  try {
    const reports = loadReports();
    reports.unshift(report);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(0, 20)));
  } catch {
    console.error('Failed to save report');
  }
}

export function loadReports(): GameReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GameReport[];
  } catch {
    return [];
  }
}

export function loadReport(id: string): GameReport | null {
  const reports = loadReports();
  return reports.find(r => r.id === id) || null;
}
