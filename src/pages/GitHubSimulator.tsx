// GitHubSimulator.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Terminal, RefreshCcw, GitBranch, GitCommit, GitPullRequest, Zap, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import toast from 'react-hot-toast';

type Command = {
  cmd: string;
  output: string;
  points?: number;
  achievement?: string;
};

const commandList: Record<string, Command> = {
  'git init': { cmd: 'git init', output: 'Initialized empty Git repository in /project/.git/', points: 10, achievement: 'first_init' },
  'git add .': { cmd: 'git add .', output: 'Staged all changes for next commit', points: 5 },
  'git add README.md': { cmd: 'git add README.md', output: 'Staged README.md', points: 5 },
  'git commit -m "first commit"': { cmd: 'git commit -m "first commit"', output: '[main (root-commit) a1b2c3d] first commit\n 3 files changed, 42 insertions(+)', points: 15, achievement: 'first_commit' },
  'git branch feature': { cmd: 'git branch feature', output: 'Created branch "feature"', points: 10 },
  'git checkout feature': { cmd: 'git checkout feature', output: 'Switched to branch "feature"', points: 10, achievement: 'branch_master' },
  'git merge feature': { cmd: 'git merge feature', output: 'Already up to date.', points: 10 },
  'git push origin main': { cmd: 'git push origin main', output: 'Uploading objects: 100% (3/3), done.', points: 15 },
  'git pull': { cmd: 'git pull', output: 'Already up to date.', points: 5 },
  'git log --oneline': { cmd: 'git log --oneline', output: 'a1b2c3d first commit\n e4f5g6h Initial', points: 5 },
  'git status': { cmd: 'git status', output: 'On branch main\nnothing to commit, working tree clean', points: 5 },
  'git remote -v': { cmd: 'git remote -v', output: 'origin  https://github.com/user/repo.git (fetch)\norigin  https://github.com/user/repo.git (push)', points: 5 },
  'gh pr create': { cmd: 'gh pr create', output: 'Pull request #42 created: https://github.com/user/repo/pull/42', points: 20, achievement: 'pr_sim' },
  'help': { cmd: 'help', output: 'Available: git init, add ., commit, branch, checkout, merge, push, pull, log, status, remote, gh pr create', points: 0 }
};

export default function GitHubSimulator() {
  const [lines, setLines] = useState<string[]>(["> system_init --github", "> Welcome to Git Simulator!", "> Type 'help' for available commands", ""]);
  const [input, setInput] = useState("");
  const [commandCount, setCommandCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addPoints, unlockAchievement, points } = useProgress();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    let found: Command | undefined;
    // fuzzy match: check if command starts with any known cmd
    for (const key of Object.keys(commandList)) {
      if (trimmed === key.toLowerCase()) {
        found = commandList[key];
        break;
      }
    }
    if (found) {
      setLines(prev => [...prev, `$ ${found.cmd}`, `> ${found.output}`, ""]);
      if (found.points) {
        addPoints(found.points, `Simulator: ${found.cmd}`);
      }
      if (found.achievement) {
        unlockAchievement(found.achievement);
      }
      setCommandCount(prev => prev + 1);
      if (commandCount + 1 === 5) {
        unlockAchievement('sim_master');
      }
    } else {
      setLines(prev => [...prev, `$ ${cmdText}`, `> Command not found: "${cmdText}". Type 'help' for list.`, ""]);
    }
    setInput("");
  };

  const resetSimulator = () => {
    setLines(["> system_init --github", "> Welcome to Git Simulator!", "> Type 'help' for available commands", ""]);
    setCommandCount(0);
    toast("Simulator reset! Start fresh.", { icon: '🔄' });
  };

  return (
    <div className="min-h-screen bg-neo-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-4xl font-black uppercase flex items-center gap-3">
            <Terminal size={44} className="bg-neo-black text-white p-2 rounded-lg" /> Interactive Git Terminal
          </h2>
          <div className="flex gap-3 items-center bg-white border-4 border-neo-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,1)]">
            <Zap className="text-yellow-500" />
            <span className="font-black text-xl">{points} XP</span>
            <Award size={20} />
            <span className="font-bold">{commandCount}/5 commands</span>
          </div>
        </div>

        {/* Terminal window */}
        <div className="bg-neo-black border-4 border-gray-700 rounded-lg p-5 font-mono text-green-400 min-h-[400px] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] mb-6 overflow-y-auto max-h-[500px]">
          {lines.map((l, i) => (
            <div key={i} className="mb-1 leading-relaxed whitespace-pre-wrap">{l}</div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
              className="bg-transparent outline-none text-green-400 font-mono flex-1"
              autoFocus
            />
            <span className="animate-pulse inline-block w-2 h-5 bg-green-400"></span>
          </div>
        </div>

        {/* Quick command buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white border-4 border-neo-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,1)]">
          <Button variant="outline" onClick={() => handleCommand("git init")} className="justify-center"><GitBranch size={16}/> git init</Button>
          <Button variant="outline" onClick={() => handleCommand("git add .")} className="justify-center">git add .</Button>
          <Button variant="outline" onClick={() => handleCommand("git commit -m \"first commit\"")} className="justify-center"><GitCommit size={16}/> commit</Button>
          <Button variant="outline" onClick={() => handleCommand("git branch feature")} className="justify-center">branch</Button>
          <Button variant="outline" onClick={() => handleCommand("gh pr create")} className="justify-center"><GitPullRequest size={16}/> PR</Button>
          <Button variant="outline" onClick={() => handleCommand("git status")} className="justify-center">status</Button>
          <Button variant="outline" onClick={() => handleCommand("git log --oneline")} className="justify-center">log</Button>
          <Button variant="outline" onClick={() => handleCommand("help")} className="justify-center">help</Button>
          <Button variant="outline" onClick={resetSimulator} className="justify-center gap-1"><RefreshCcw size={16}/> reset</Button>
          <Button variant="primary" onClick={() => window.location.href = '/github-assessment'} className="justify-center col-span-2 md:col-span-1">← Back to Levels</Button>
        </div>

        {/* Achievement tip */}
        <div className="mt-6 text-center text-sm font-bold text-gray-600 bg-yellow-100 p-3 border-2 border-neo-black">
          💡 Pro tip: Try all commands to unlock achievements and earn XP!
        </div>
      </div>
    </div>
  );
}