import { Link } from 'react-router-dom';
import agentsData from '../data/agents_data.json';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Cpu, Zap, Star } from 'lucide-react';

export default function AgentList() {
  return (
    <div className="p-8 bg-neo-white min-h-screen mt-10">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-black uppercase border-b-8 border-neo-black inline-block bg-white px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Top 10 Agentic AI (2026)
        </h1>
        <p className="mt-4 font-bold text-gray-600 uppercase italic">Beyond Automation: Autonomous Decision Making</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {agentsData.map((agent) => (
          <Link to={`/agent-detail/${agent.id}`} key={agent.id}>
            <Card className="p-6 h-full border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all bg-white flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-neo-black text-neo-white px-3 py-1 text-[10px] font-black uppercase border-2 border-neo-black">
                    {agent.framework}
                  </span>
                  <div className="flex items-center gap-1 bg-yellow-300 border-2 border-neo-black px-2 py-0.5 text-[10px] font-black uppercase">
                    <Star size={12} fill="currentColor" /> ROI: {agent.roi_score}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter group-hover:text-blue-600 leading-tight">
                  {agent.name}
                </h3>
                <p className="font-bold text-gray-700 text-sm mb-4 leading-snug">"{agent.pitch}"</p>
                
                <div className="bg-blue-50 border-2 border-neo-black p-3 mb-4">
                  <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Time Saved</p>
                  <p className="text-sm font-black">{agent.time_saved}</p>
                </div>
              </div>

              <Button variant="primary" className="w-full font-black uppercase py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                View Architecture →
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}