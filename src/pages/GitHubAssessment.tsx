// GitHubAssessment.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Trophy, Star, Target, Zap, Award, Flame } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useProgress } from '../context/ProgressContext';

// ==================== Assessment Page ====================
export default function GitHubAssessment() {
  const navigate = useNavigate();
  const { points, achievements, unlockAchievement } = useProgress();

  const levels = [
    { id: 'beginner', title: 'Beginner', icon: <Target className="text-green-500" size={48} />, desc: 'New to Git? Learn basics, repos, commits, and push.', color: 'border-green-500', bg: 'bg-green-50' },
    { id: 'intermediate', title: 'Intermediate', icon: <Star className="text-blue-500" size={48} />, desc: 'Know basics? Master branches, merging, rebasing, and PRs.', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: 'advanced', title: 'Advanced', icon: <Trophy className="text-yellow-600" size={48} />, desc: 'Expert? CI/CD, GitHub Actions, hooks, and security.', color: 'border-yellow-500', bg: 'bg-yellow-50' }
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="min-h-screen bg-neo-white p-6 md:p-12">
      <Toaster position="top-center" />
      {/* Header with gamification stats */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-wrap justify-between items-center gap-4 bg-white border-4 border-neo-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <Flame className="text-orange-500" size={32} />
          <span className="text-3xl font-black">{points} XP</span>
        </div>
        <div className="flex items-center gap-3">
          <Award className="text-purple-600" size={32} />
          <span className="text-2xl font-black">{earnedCount}/{achievements.length} Achievements</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/github-simulator')} className="gap-2">
          <Zap size={18} /> Open Simulator
        </Button>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-7xl font-black uppercase mb-4 tracking-tighter bg-gradient-to-r from-neo-black to-gray-700 bg-clip-text text-transparent">GitHub Masterclass</h1>
        <p className="text-xl font-bold text-gray-600 uppercase">Choose your skill level → Get a personalized roadmap + earn XP</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {levels.map((l) => (
          <Card key={l.id} className={`p-8 border-4 ${l.color} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer`} onClick={() => navigate(`/github-roadmap/${l.id}`)}>
            <div className={`mb-6 p-4 rounded-full ${l.bg} border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              {l.icon}
            </div>
            <h3 className="text-4xl font-black uppercase mb-4">{l.title}</h3>
            <p className="font-bold text-gray-600 mb-8">{l.desc}</p>
            <Button variant="primary" className="w-full font-black uppercase py-4 text-lg">
              Start Path →
            </Button>
          </Card>
        ))}
      </div>

      {/* Achievements showcase */}
      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-black uppercase border-b-4 border-neo-black inline-block pb-2 mb-6">🏅 Your Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map(ach => (
            <div key={ach.id} className={`p-3 border-2 ${ach.earned ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-100 border-gray-300 opacity-60'} text-center rounded-lg`}>
              <div className="text-3xl">{ach.emoji}</div>
              <div className="font-black text-sm">{ach.name}</div>
              <div className="text-xs text-gray-500">{ach.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}