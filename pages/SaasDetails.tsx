import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Button } from '../components/Button';
import { ChevronLeft, Zap, Target, CheckCircle, IndianRupee, Loader2, TrendingUp } from 'lucide-react';

export default function SaasDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Important: Path and Filter MUST be the same as List Page
    Papa.parse("/saas_automations.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanData = (results.data as any[])
          .filter(item => item['Idea_Name'] || item['Idea Name'])
          .map(item => ({
            ...item,
            Idea_Name: item['Idea_Name'] || item['Idea Name']
          }));
        
        const idx = Number(id);
        if (!isNaN(idx) && cleanData[idx]) {
          setIdea(cleanData[idx]);
        }
        setIsLoading(false);
      },
      error: () => setIsLoading(false)
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neo-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-neo-black mb-4" size={48} strokeWidth={3} />
        <h2 className="text-2xl font-black uppercase">Fetching Data...</h2>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-neo-white p-12 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black uppercase mb-6 text-red-600 border-4 border-neo-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          Strategy Not Found!
        </h2>
        <Button onClick={() => navigate('/ecommerce-ideas')} variant="primary">Back to Ideas</Button>
      </div>
    );
  }

  // Headers check to avoid undefined issues
  const getVal = (key: string) => idea[key] || idea[key.replace('_', ' ')] || "N/A";

  return (
    <div className="min-h-screen bg-neo-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 border-4 border-neo-black bg-white hover:bg-yellow-300 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} /> Back
        </Button>

        <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-neo-black p-8 text-neo-white border-b-4 border-neo-black">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-yellow-300 text-neo-black px-3 py-1 font-black uppercase text-xs border-2 border-white">
                {getVal('Complexity')}
              </span>
              <span className="bg-blue-400 text-neo-black px-3 py-1 font-black uppercase text-xs border-2 border-white flex items-center gap-1 text-[10px]">
                <TrendingUp size={14} /> ROI: {getVal('ROI_Level')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter mb-4">
              {getVal('Idea_Name')}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-yellow-300 italic">"{getVal('Pitch')}"</p>
          </div>

          <div className="p-8 space-y-10 text-neo-black font-bold">
            <div className="grid md:grid-cols-2 gap-8">
              <section className="border-4 border-neo-black p-6 bg-red-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-4 border-b-2 border-neo-black pb-2 text-red-600">
                  <Target strokeWidth={3} /> Problem
                </h2>
                <p className="text-lg leading-snug font-bold">{getVal('Problem_Solved')}</p>
              </section>

              <section className="border-4 border-neo-black p-6 bg-green-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-4 border-b-2 border-neo-black pb-2 text-green-600">
                  <CheckCircle strokeWidth={3} /> Solution
                </h2>
                <p className="text-lg leading-snug font-bold">{getVal('Solution')}</p>
              </section>
            </div>

            <section>
              <h2 className="text-2xl font-black uppercase underline decoration-4 mb-6 flex items-center gap-2">
                <Zap fill="currentColor" /> Tech Stack
              </h2>
              <div className="flex flex-wrap gap-4">
                {getVal('Tools') !== "N/A" && getVal('Tools').split(',').map((tool: string, i: number) => (
                  <div key={i} className="bg-white border-4 border-neo-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm">
                    {tool.trim()}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-yellow-300 border-4 border-neo-black p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black uppercase">Estimated Setup</h2>
              <div className="flex items-center gap-1 text-5xl font-black">
                <IndianRupee size={40} strokeWidth={4} /> {getVal('Price_INR')}
              </div>
            </section>

            <Button variant="primary" size="lg" className="w-full text-2xl py-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Get This Automation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}