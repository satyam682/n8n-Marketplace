// context/ProgressContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// --- Types and Initial Data ---
type Achievement = {
  id: string;
  name: string;
  emoji: string;
  earned: boolean;
  description: string;
};

type ProgressContextType = {
  points: number;
  addPoints: (amount: number, reason: string) => void;
  completedSteps: Record<string, boolean>;
  completeStep: (level: string, stepIndex: number, stepName: string) => void;
  isStepCompleted: (level: string, stepIndex: number) => boolean;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  levelProgress: Record<string, number>;
};

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_init', name: 'Repo Starter', emoji: '🚀', earned: false, description: 'Run git init in simulator' },
  { id: 'first_commit', name: 'Commit Crusader', emoji: '📦', earned: false, description: 'Make your first commit' },
  { id: 'branch_master', name: 'Branch Wizard', emoji: '🌿', earned: false, description: 'Create and switch branches' },
  { id: 'pr_sim', name: 'Pull Request Pro', emoji: '🔄', earned: false, description: 'Simulate a PR' },
  { id: 'roadmap_beginner', name: 'Novice Graduate', emoji: '🎓', earned: false, description: 'Complete all beginner steps' },
  { id: 'roadmap_intermediate', name: 'Git Gladiator', emoji: '⚔️', earned: false, description: 'Complete intermediate path' },
  { id: 'roadmap_advanced', name: 'Git Guru', emoji: '🧙', earned: false, description: 'Master advanced Git' },
  { id: 'sim_master', name: 'Terminal Titan', emoji: '💻', earned: false, description: 'Use 5 different simulator commands' },
];

// --- Create Context ---
// We create the context with a default value of 'null'. This makes the error in the hook very clear.
const ProgressContext = createContext<ProgressContextType | null>(null);

// --- Provider Component ---
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>({ beginner: 0, intermediate: 0, advanced: 0 });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPoints = localStorage.getItem('git_points');
    if (storedPoints) setPoints(parseInt(storedPoints));
    const steps = localStorage.getItem('git_completed_steps');
    if (steps) setCompletedSteps(JSON.parse(steps));
    const ach = localStorage.getItem('git_achievements');
    if (ach) setAchievements(JSON.parse(ach));
    const prog = localStorage.getItem('git_level_progress');
    if (prog) setLevelProgress(JSON.parse(prog));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('git_points', points.toString());
    localStorage.setItem('git_completed_steps', JSON.stringify(completedSteps));
    localStorage.setItem('git_achievements', JSON.stringify(achievements));
    localStorage.setItem('git_level_progress', JSON.stringify(levelProgress));
  }, [points, completedSteps, achievements, levelProgress]);

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => prev + amount);
    toast.success(`+${amount} XP • ${reason}`, { icon: '✨', duration: 2000 });
  };

  const completeStep = (level: string, stepIndex: number, stepName: string) => {
    const key = `${level}_step_${stepIndex}`;
    if (completedSteps[key]) return;
    setCompletedSteps(prev => ({ ...prev, [key]: true }));
    addPoints(20, `Completed: ${stepName}`);

    // Update level progress
    const levelStepsCount = { beginner: 4, intermediate: 5, advanced: 5 };
    const total = levelStepsCount[level as keyof typeof levelStepsCount];
    const completedCount = Object.keys(completedSteps).filter(k => k.startsWith(level) && completedSteps[k]).length + 1;
    const newPercent = Math.min(100, Math.floor((completedCount / total) * 100));
    setLevelProgress(prev => ({ ...prev, [level]: newPercent }));

    // Unlock achievements for completing a whole level
    if (level === 'beginner' && newPercent === 100) unlockAchievement('roadmap_beginner');
    if (level === 'intermediate' && newPercent === 100) unlockAchievement('roadmap_intermediate');
    if (level === 'advanced' && newPercent === 100) unlockAchievement('roadmap_advanced');
  };

  const isStepCompleted = (level: string, stepIndex: number) => {
    return !!completedSteps[`${level}_step_${stepIndex}`];
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const ach = prev.find(a => a.id === id);
      if (ach?.earned) return prev;
      toast.success(`🏆 Achievement Unlocked: ${ach?.name} ${ach?.emoji}`, { duration: 3000 });
      return prev.map(a => a.id === id ? { ...a, earned: true } : a);
    });
  };

  // This is the value that will be provided to any consuming component
  const value: ProgressContextType = {
    points,
    addPoints,
    completedSteps,
    completeStep,
    isStepCompleted,
    achievements,
    unlockAchievement,
    levelProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// --- Custom Hook with Explicit Error Handling ---
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  // This is the critical line: If context is null, the component is not wrapped properly.
  if (context === null) {
    throw new Error('❌ useProgress must be used within a ProgressProvider ❌');
  }
  return context;
};