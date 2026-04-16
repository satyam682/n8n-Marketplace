import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface IdeaListItem {
  Idea_Name: string;
  Complexity: string;
  Pitch: string;
  Tools: string;
}

export default function ECommerceIdea() {
  const [ideas, setIdeas] = useState<IdeaListItem[]>([]);

  useEffect(() => {
    // Path: public/ecommerce_automations_updated.csv
    Papa.parse("/ecommerce_automations_updated.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Headers ma space hoy ke underscore, banne handle thase
        const filteredData = (results.data as any[])
          .map(item => ({
            Idea_Name: item['Idea_Name'] || item['Idea Name'] || '',
            Complexity: item['Complexity'] || 'Medium',
            Pitch: item['Pitch'] || '',
            Tools: item['Tools'] || ''
          }))
          .filter(item => item.Idea_Name !== '');
        
        setIdeas(filteredData);
      },
    });
  }, []);

  return (
    <div className="p-8 bg-neo-white min-h-screen mt-10">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-black uppercase border-b-8 border-neo-black inline-block bg-yellow-300 px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          50+ E-commerce n8n Ideas
        </h1>
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {ideas.map((idea, index) => (
          <Link to={`/ecommerce-detail/${index}`} key={index}>
            <Card className="p-6 h-full flex flex-col justify-between border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-white group cursor-pointer">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-neo-black text-neo-white px-3 py-1 text-[10px] font-black uppercase border-2 border-neo-black">
                    ID: {index + 1}
                  </span>
                  <span className="bg-green-400 border-2 border-neo-black px-2 py-0.5 text-[10px] font-black uppercase">
                    {idea.Complexity}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                  {idea.Idea_Name}
                </h3>
                
                <p className="text-gray-800 font-bold text-sm italic mb-4">
                   "{idea.Pitch}"
                </p>
                
                <div className="flex flex-wrap gap-2">
                    {idea.Tools && idea.Tools.split(',').map((tool, i) => (
                        <span key={i} className="text-[10px] border-2 border-neo-black px-2 py-0.5 font-black bg-blue-100 uppercase">
                            {tool.trim()}
                        </span>
                    ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-4 border-neo-black">
                <Button variant="primary" className="w-full font-black uppercase tracking-wider py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-300 transition-colors">
                  View Strategy →
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}