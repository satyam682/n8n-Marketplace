// GitHubRoadmap.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ChevronLeft, PlayCircle, BookOpen, Terminal, CheckCircle, Circle, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import toast from 'react-hot-toast';

// Detailed roadmap content with videos and docs
const roadmapData: Record<string, any> = {
  beginner: {
    title: "🌱 Beginner Path",
    steps: [
      { name: "Install Git & Setup", desc: "Install Git on your system, configure user.name and user.email", video: "https://www.youtube.com/embed/8JJ101D3knE", doc: "https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" },
      { name: "Create GitHub Account", desc: "Sign up on GitHub, set up SSH keys", video: "https://www.youtube.com/embed/3RjQznt-8kE", doc: "https://docs.github.com/en/get-started/signing-up-for-github" },
      { name: "Your First Repository", desc: "Create a repo, clone it locally", video: "https://www.youtube.com/embed/2RrsY6rJR-M", doc: "https://docs.github.com/en/repositories/creating-and-managing-repositories" },
      { name: "Commit & Push", desc: "Make changes, commit, and push to remote", video: "https://www.youtube.com/embed/SWYqp7iY_Tc", doc: "https://git-scm.com/docs/git-commit" }
    ]
  },
  intermediate: {
    title: "⚡ Intermediate Path",
    steps: [
      { name: "Branching & Merging", desc: "Create branches, switch, merge without conflicts", video: "https://www.youtube.com/embed/H5GJfcp3p4Q", doc: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell" },
      { name: "Handling Merge Conflicts", desc: "Resolve conflicts like a pro", video: "https://www.youtube.com/embed/JtIX3HJKwko", doc: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts" },
      { name: "Pull Requests", desc: "Open, review, and merge PRs on GitHub", video: "https://www.youtube.com/embed/kJr-P5LD2Aw", doc: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests" },
      { name: "Rebasing vs Merging", desc: "Understand rebase and interactive rebase", video: "https://www.youtube.com/embed/f1wnYdLEpgI", doc: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing" },
      { name: "Stashing & Cherry-pick", desc: "Save work in progress, pick specific commits", video: "https://www.youtube.com/embed/0L2bCJ-f0MA", doc: "https://git-scm.com/docs/git-stash" }
    ]
  },
  advanced: {
    title: "🚀 Advanced Path",
    steps: [
      { name: "GitHub Actions CI/CD", desc: "Automate tests and deployment", video: "https://www.youtube.com/embed/R8_veQiYBjI", doc: "https://docs.github.com/en/actions" },
      { name: "Git Hooks", desc: "Custom scripts for automation", video: "https://www.youtube.com/embed/qnY7r-6Ziqs", doc: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks" },
      { name: "Security & Secrets", desc: "Manage secrets, dependabot, code scanning", video: "https://www.youtube.com/embed/L5rVH1KGBCY", doc: "https://docs.github.com/en/code-security" },
      { name: "Git Reflog & Recovery", desc: "Recover lost commits and undo mistakes", video: "https://www.youtube.com/embed/lX9-hidEw2M", doc: "https://git-scm.com/docs/git-reflog" },
      { name: "Monorepo Strategies", desc: "Using submodules, sparse-checkout, or Nx", video: "https://www.youtube.com/embed/8lCEc2f9h_k", doc: "https://git-scm.com/book/en/v2/Git-Tools-Submodules" }
    ]
  }
};

export default function GitHubRoadmap() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { completeStep, isStepCompleted, points, levelProgress, unlockAchievement } = useProgress();
  const data = roadmapData[level || 'beginner'];
  const currentLevel = level || 'beginner';
  const progressPercent = levelProgress[currentLevel] || 0;

  const handleComplete = (idx: number, stepName: string) => {
    if (!isStepCompleted(currentLevel, idx)) {
      completeStep(currentLevel, idx, stepName);
      toast.success(`🎉 Step completed: ${stepName}`, { icon: '✅' });
      // Check if all steps done for intermediate/advanced to unlock achievements
      const totalSteps = data.steps.length;
      let completedCount = 0;
      for (let i = 0; i < totalSteps; i++) {
        if (isStepCompleted(currentLevel, i) || i === idx) completedCount++;
      }
      if (completedCount === totalSteps) {
        if (currentLevel === 'intermediate') unlockAchievement('roadmap_intermediate');
        if (currentLevel === 'advanced') unlockAchievement('roadmap_advanced');
      }
    } else {
      toast('Already completed!', { icon: '⚠️' });
    }
  };

  return (
    <div className="min-h-screen bg-neo-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with progress */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <Button onClick={() => navigate('/github-assessment')} variant="ghost" className="border-4 border-neo-black font-black uppercase bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ChevronLeft /> Back to Levels
          </Button>
          <div className="bg-white border-4 border-neo-black p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="text-yellow-500" />
            <span className="font-black text-xl">{points} XP</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Timeline */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black uppercase border-b-4 border-neo-black pb-2">{data.title}</h2>
              <div className="bg-gray-200 rounded-full h-4 w-32 overflow-hidden border-2 border-neo-black">
                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            {data.steps.map((step: any, i: number) => {
              const completed = isStepCompleted(currentLevel, i);
              return (
                <div key={i} className="flex gap-4 items-start group">
                  <div className={`w-12 h-12 flex items-center justify-center font-black text-xl border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${completed ? 'bg-green-500 text-white' : 'bg-neo-black text-white'}`}>
                    {completed ? <CheckCircle size={24} /> : i + 1}
                  </div>
                  <div className={`bg-white border-4 border-neo-black p-5 w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${completed ? 'opacity-80' : 'hover:shadow-none hover:translate-x-1'}`}>
                    <h4 className="text-xl font-black uppercase flex justify-between">
                      {step.name}
                      {completed && <CheckCircle className="text-green-500" size={22} />}
                    </h4>
                    <p className="font-bold text-gray-600 mt-2">{step.desc}</p>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => window.open(step.doc, '_blank')} className="text-sm py-1">
                        <BookOpen size={16} /> Docs
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(step.video, '_blank')} className="text-sm py-1">
                        <PlayCircle size={16} /> Watch
                      </Button>
                      {!completed && (
                        <Button variant="primary" size="sm" onClick={() => handleComplete(i, step.name)} className="text-sm py-1">
                          Mark Complete (+20 XP)
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Simulator & Resources */}
          <div className="space-y-6">
            <div className="bg-yellow-300 border-4 border-neo-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black uppercase flex items-center gap-2 mb-4 text-xl"><Terminal size={24}/> Practice in Simulator</h3>
              <p className="font-bold mb-4">Test your skills with our interactive terminal.</p>
              <Button onClick={() => navigate('/github-simulator')} className="w-full bg-neo-black text-white font-black hover:bg-gray-800 text-lg">
                Launch Simulator →
              </Button>
            </div>
            <div className="bg-white border-4 border-neo-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black uppercase flex items-center gap-2 mb-4 text-blue-600"><PlayCircle size={22}/> Quick Video Guide</h3>
              <div className="aspect-video bg-gray-900 border-2 border-neo-black flex items-center justify-center">
                <iframe className="w-full h-full" src={data.steps[0]?.video} title="Guide" allowFullScreen></iframe>
              </div>
            </div>
            <div className="bg-purple-100 border-4 border-neo-black p-4 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black">💡 Pro tip: Use the simulator to practice commands before marking complete!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}