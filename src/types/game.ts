export type TeamId = 'communication' | 'catering' | 'medical' | 'maintenance';

export type GamePhase = 'planning' | 'execution' | 'review';

export type EventType = 'power_shortage' | 'fatigue' | 'route_blocked' | 'emergency';

export type Rating = 'S' | 'A' | 'B' | 'C' | 'D';

export interface GameEvent {
  id: string;
  type: EventType;
  description: string;
  affectedTeam: TeamId;
  impact: number;
  moraleImpact: number;
}

export interface TeamState {
  teamId: TeamId;
  name: string;
  icon: string;
  allocatedPoints: number;
  efficiency: number;
  morale: number;
  risk: number;
}

export interface Allocation {
  communication: number;
  catering: number;
  medical: number;
  maintenance: number;
}

export interface RoundState {
  roundNumber: number;
  events: GameEvent[];
  focusTarget: TeamId | null;
  allocation: Allocation;
  taskCompleted: Record<TeamId, boolean>;
  moraleDelta: number;
  riskDelta: number;
  completionRate: number;
}

export interface GameState {
  currentRound: number;
  phase: GamePhase;
  totalSupplyPoints: number;
  baseSupplyPoints: number;
  globalMorale: number;
  globalRisk: number;
  teams: Record<TeamId, TeamState>;
  currentRoundEvents: GameEvent[];
  focusTarget: TeamId | null;
  currentAllocation: Allocation;
  roundHistory: RoundState[];
  inheritedStrategyPoints: number;
  isGameOver: boolean;
  isVictory: boolean;
}

export interface Inheritance {
  strategyPoints: number;
  bestRating: Rating;
  totalPlaythroughs: number;
  bestScore: number;
}

export interface SaveData {
  gameState: GameState;
  timestamp: number;
}

export const TEAM_CONFIG: Record<TeamId, { name: string; icon: string }> = {
  communication: { name: '通信小组', icon: 'Radio' },
  catering: { name: '餐饮小组', icon: 'UtensilsCrossed' },
  medical: { name: '医疗小组', icon: 'HeartPulse' },
  maintenance: { name: '维修小组', icon: 'Wrench' },
};

export const EVENT_CONFIG: Record<EventType, { label: string; descriptions: string[] }> = {
  power_shortage: {
    label: '电力不足',
    descriptions: [
      '办公区域突发停电，通信设备运行受限',
      '备用电源故障，餐饮加热设备无法使用',
      '电力系统不稳定，医疗设备供电不足',
      '主配电室跳闸，维修工具无法启动',
    ],
  },
  fatigue: {
    label: '人员疲劳',
    descriptions: [
      '通信人员连续值守超过12小时，注意力下降',
      '餐饮组人手不足，配送效率明显降低',
      '医疗组连轴转，诊疗质量出现波动',
      '维修组体力透支，作业速度减慢',
    ],
  },
  route_blocked: {
    label: '路线受阻',
    descriptions: [
      '3楼走廊坍塌，通信线路铺设受阻',
      '消防通道被堵，餐饮配送绕行远路',
      '电梯停运，医疗物资搬运困难',
      '地下管道渗水，维修通道无法通行',
    ],
  },
  emergency: {
    label: '紧急需求',
    descriptions: [
      '指挥部紧急要求建立备用通信链路',
      '被困人员急需食品和饮用水补给',
      '出现伤员，医疗组需要紧急响应',
      '关键设施损坏，维修组需要立即出动',
    ],
  },
};

export const TEAM_IDS: TeamId[] = ['communication', 'catering', 'medical', 'maintenance'];

export const MAX_ROUNDS = 8;
export const BASE_SUPPLY = 10;
export const FOCUS_BONUS = 0.2;
export const MORALE_GAIN = 10;
export const MORALE_LOSS = -15;
export const FOCUS_MORALE_BONUS = 5;
export const BASE_RISK_PER_ROUND = 5;
export const UNDERFUNDED_RISK = 10;
export const FOCUS_THRESHOLD = 3;
export const NORMAL_THRESHOLD = 2;
export const INITIAL_MORALE = 60;
export const INITIAL_RISK = 0;
export const MAX_MORALE = 100;
export const MAX_RISK = 100;
