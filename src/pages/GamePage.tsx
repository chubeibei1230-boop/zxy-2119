import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import GameHeader from '@/components/layout/GameHeader';
import EventCards from '@/components/planning/EventCards';
import TargetSelector from '@/components/planning/TargetSelector';
import ResourceSlider from '@/components/execution/ResourceSlider';
import AllocationPreview from '@/components/execution/AllocationPreview';
import ScorePanel from '@/components/review/ScorePanel';
import EventReview from '@/components/review/EventReview';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { MAX_ROUNDS } from '@/types/game';

export default function GamePage() {
  const navigate = useNavigate();
  const { gameState, setFocusTarget, goToPhase, confirmAllocation, nextRound } = useGameStore();

  if (!gameState) {
    navigate('/');
    return null;
  }

  const { phase, currentRoundEvents, focusTarget, currentAllocation, roundHistory, currentRound } = gameState;

  const lastRound = roundHistory[roundHistory.length - 1];

  const totalAllocated = Object.values(currentAllocation).reduce((a, b) => a + b, 0);
  const canExecute = focusTarget !== null && totalAllocated > 0 && totalAllocated <= gameState.totalSupplyPoints;

  const handlePlanningConfirm = () => {
    if (focusTarget) {
      goToPhase('execution');
    }
  };

  const handleExecutionConfirm = () => {
    if (canExecute) {
      confirmAllocation();
    }
  };

  const handleNextRound = () => {
    nextRound();
    if (gameState.isGameOver) {
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-zinc-100">
      <GameHeader />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {phase === 'planning' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-500 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                策划阶段
              </h2>
              <p className="text-zinc-500 text-sm">查看本回合事件，选择重点目标小组</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventCards events={currentRoundEvents} />
              <TargetSelector />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePlanningConfirm}
                disabled={!focusTarget}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  focusTarget
                    ? 'bg-amber-500/20 border border-amber-500/60 text-amber-400 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]'
                    : 'bg-zinc-800/30 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                确认目标，进入执行
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {phase === 'execution' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-500 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                执行阶段
              </h2>
              <p className="text-zinc-500 text-sm">
                为各小组分配补给点数（重点目标: {focusTarget ? (
                  <span className="text-amber-400">{gameState.teams[focusTarget].name}</span>
                ) : '未选择'}）
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ResourceSlider />
              </div>
              <div>
                <AllocationPreview />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleExecutionConfirm}
                disabled={!canExecute}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  canExecute
                    ? 'bg-amber-500/20 border border-amber-500/60 text-amber-400 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]'
                    : 'bg-zinc-800/30 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                确认分配，进入复盘
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {phase === 'review' && lastRound && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-500 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                复盘阶段
              </h2>
              <p className="text-zinc-500 text-sm">查看本回合结算结果</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScorePanel />
              <EventReview events={lastRound.events} roundState={lastRound} />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleNextRound}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-amber-500/20 border border-amber-500/60 text-amber-400 font-semibold text-lg transition-all duration-300 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
              >
                {currentRound >= MAX_ROUNDS ? '查看最终结算' : '进入下一回合'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
