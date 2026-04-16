import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import agentsData from '../data/agents_data.json';
import { Button } from '../components/Button';
import { 
  ChevronLeft, Brain, Workflow, Terminal, 
  IndianRupee, Timer, Star, ShieldCheck, 
  Cpu, Rocket 
} from 'lucide-react';

export default function AgentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);

  useEffect(() => {
    // ID thi exact agent find kariye
    const selectedAgent = agentsData.find(a => a.id === Number(id));
    if (selectedAgent) {
      setAgent(selectedAgent);
    }
  }, [id]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-neo-white flex flex-col items-center justify-center font-black">
        <h2 className="text-3xl uppercase mb-4">Agent System Offline</h2>
        <Button onClick={() => navigate('/agent-list')} variant="primary">Back to Hub</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 border-4 border-neo-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase hover:bg-yellow-300 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} /> Return to Agent Hub
        </Button>

        <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-neo-black p-8 md:p-12 text-white border-b-4 border-neo-black">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-600 text-white px-4 py-1 text-xs font-black uppercase border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                {agent.framework}
              </span>
              <span className="bg-purple-600 text-white px-4 py-1 text-xs font-black uppercase border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                {agent.type}
              </span>
              <span className="bg-yellow-400 text-neo-black px-4 py-1 text-xs font-black uppercase border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <Star size={14} fill="currentColor" /> ROI: {agent.roi_score}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter mb-6">
              {agent.name}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-yellow-300 italic max-w-2xl">
              "{agent.pitch}"
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-4 border-neo-black p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-blue-600 text-white p-3 border-2 border-neo-black">
                  <Timer size={32} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-blue-600">Human Time Saved</p>
                  <p className="text-2xl font-black uppercase">{agent.time_saved}</p>
                </div>
              </div>
              
              <div className="bg-green-50 border-4 border-neo-black p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-green-600 text-white p-3 border-2 border-neo-black">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-green-600">Reliability Status</p>
                  <p className="text-2xl font-black uppercase">Autonomous / Verified</p>
                </div>
              </div>
            </div>

            {/* Core Logic Section */}
            <div className="grid md:grid-cols-2 gap-10 text-neo-black">
              <section className="space-y-4">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 underline decoration-4 underline-offset-4">
                  <Cpu className="text-red-600" /> The Problem
                </h3>
                <div className="border-4 border-neo-black p-6 bg-red-50 text-lg font-bold leading-snug">
                  {agent.problem}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 underline decoration-4 underline-offset-4 text-green-700">
                  <Brain className="text-green-600" /> Agent Intelligence
                </h3>
                <div className="border-4 border-neo-black p-6 bg-green-50 text-lg font-bold leading-snug">
                  {agent.how_it_works}
                </div>
              </section>
            </div>

            {/* Tech Stack Terminal Look */}
            <section className="bg-gray-50 border-4 border-neo-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-neo-black p-3 flex justify-between items-center border-b-4 border-neo-black">
                <h3 className="text-white font-black uppercase text-xs flex items-center gap-2">
                  <Terminal size={16} /> Stack_Architecture.exe
                </h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-4">
                  {agent.tech_stack.split(',').map((tech: string, i: number) => (
                    <div 
                      key={i} 
                      className="bg-white border-4 border-neo-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600 hover:text-white transition-all cursor-default"
                    >
                      {tech.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-yellow-300 border-4 border-neo-black p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h2 className="text-4xl font-black uppercase mb-2">Setup Investment</h2>
                <p className="font-bold text-neo-black/80 max-w-sm italic">
                  One-time implementation of the multi-agent system with API integrations.
                </p>
              </div>
              <div className="bg-white border-4 border-neo-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1 text-5xl md:text-6xl font-black">
                  <IndianRupee size={48} strokeWidth={4} />
                  {agent.price_inr}
                </div>
              </div>
            </section>

            {/* CTA Button */}
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full text-3xl py-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-widest hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-4 group"
            >
              Initialize Agentic Deploy <Rocket size={32} className="group-hover:animate-bounce" />
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}