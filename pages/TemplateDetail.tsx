import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Download, Share2, Calendar, User, Tag, ArrowLeft, ExternalLink, Code, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Template } from '../types';
import { api } from '../services/api';
import { format } from 'date-fns';

export function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getTemplate(id);
        setTemplate(data);
      } catch (err) {
        setError('Template not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handleDownload = () => {
    if (!template) return;
    const blob = new Blob([template.workflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" size={64} />
        <h2 className="text-2xl font-black uppercase">Loading Template...</h2>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl font-black uppercase mb-4">Template Not Found</h2>
        <p className="text-xl font-bold mb-8">The template you are looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 font-black uppercase mb-6 md:mb-8 hover:translate-x-[-4px] transition-transform text-sm md:text-base">
        <ArrowLeft className="w-4.5 h-4.5 md:w-5 md:h-5" strokeWidth={3} />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <header>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-neo-black text-neo-white text-[10px] md:text-xs font-black px-3 py-1 uppercase neo-border">
                {template.category}
              </span>
              <span className="text-xs md:text-sm font-bold opacity-60 flex items-center gap-1">
                <Calendar size={14} />
                Published on {format(template.createdAt, 'MMM dd, yyyy')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              {template.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <span key={tag} className="bg-neo-gray border-2 border-neo-black px-2 md:px-3 py-1 text-xs md:text-sm font-bold uppercase">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="neo-card bg-neo-white p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black uppercase mb-4 border-b-4 border-neo-black pb-2 w-fit">Description</h2>
            <p className="text-base md:text-lg font-medium leading-relaxed mb-8">
              {template.description}
            </p>
            
            <h2 className="text-xl md:text-2xl font-black uppercase mb-4 border-b-4 border-neo-black pb-2 w-fit">Workflow Preview</h2>
            <div className="aspect-video bg-neo-gray neo-border flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
              <Code className="text-neo-black/20 group-hover:scale-110 transition-transform w-12 h-12 md:w-16 md:h-16" />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="bg-neo-white text-xs md:text-sm">
                  View JSON
                </Button>
              </div>
            </div>
          </div>

          <div className="neo-card bg-neo-black text-neo-white p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black uppercase mb-4 border-b-4 border-neo-white pb-2 w-fit">How to use</h2>
            <ol className="list-decimal list-inside space-y-3 md:space-y-4 font-bold text-base md:text-lg">
              <li>Click the "Download Template" button to save the JSON file.</li>
              <li>Open your n8n instance and create a new workflow.</li>
              <li>Go to the workflow menu and select "Import from File".</li>
              <li>Select the downloaded JSON file.</li>
              <li>Configure your credentials and you're ready to go!</li>
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="neo-shadow-lg lg:sticky lg:top-28">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <Button variant="primary" className="w-full h-14 md:h-16 text-lg md:text-xl gap-3" onClick={handleDownload}>
                  <Download className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                  Download JSON
                </Button>
                {template.downloadUrl && (
                  <Button
                    variant="secondary"
                    className="w-full h-12 md:h-14 text-base md:text-lg gap-3"
                    onClick={() => window.open(template.downloadUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                    Download from n8n
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2 text-sm">
                    <Star size={18} strokeWidth={3} />
                    Star ({template.stars})
                  </Button>
                  <Button variant="outline" className="gap-2 text-sm">
                    <Share2 size={18} strokeWidth={3} />
                    Share
                  </Button>
                </div>
              </div>

              <div className="border-t-2 border-neo-black pt-6 space-y-4">
                <div className="flex items-center justify-between font-bold">
                  <span className="opacity-60 uppercase text-[10px] md:text-xs">Downloads</span>
                  <span className="text-sm md:text-base">{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="opacity-60 uppercase text-[10px] md:text-xs">Stars</span>
                  <span className="text-sm md:text-base">{template.stars.toLocaleString()}</span>
                </div>
                {template.score && (
                  <div className="flex items-center justify-between font-bold">
                    <span className="opacity-60 uppercase text-[10px] md:text-xs">Score</span>
                    <span className="text-sm md:text-base flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {template.score}/10
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold">
                  <span className="opacity-60 uppercase text-[10px] md:text-xs">Version</span>
                  <span className="text-sm md:text-base">v1.0.0</span>
                </div>
              </div>

              <div className="border-t-2 border-neo-black pt-6">
                <span className="opacity-60 uppercase text-[10px] md:text-xs font-black block mb-4">Published By</span>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-neo-black rounded-full flex items-center justify-center text-neo-white text-lg md:text-xl font-black neo-border overflow-hidden">
                    {template.authorPhoto ? (
                      <img src={template.authorPhoto} alt={template.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      template.authorName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-black uppercase leading-none text-sm md:text-base">{template.authorName}</h4>
                    <Link to={`/profile/${template.authorId}`} className="text-[10px] md:text-xs font-bold hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="neo-card bg-neo-gray p-6">
            <h4 className="font-black uppercase mb-2 flex items-center gap-2 text-sm">
              <ExternalLink size={16} />
              n8n Official
            </h4>
            <p className="text-[10px] md:text-xs font-bold mb-4">
              Need help with n8n? Check out the official documentation or community forum.
            </p>
            <Button variant="ghost" size="sm" className="w-full text-[10px] md:text-xs">
              Visit n8n.io
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
