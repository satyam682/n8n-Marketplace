import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Upload, Plus, X, Info, Code, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Publish() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [workflowJson, setWorkflowJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const id = Math.random().toString(36).substring(2, 15);
      await api.publishTemplate({
        id,
        title,
        description,
        category,
        tags,
        workflowJson,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish template. Please check your JSON and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
          Share Your <br /> <span className="bg-neo-black text-neo-white px-4">Masterpiece</span>
        </h1>
        <p className="text-lg md:text-xl font-bold">
          Help the community by sharing your most useful n8n workflows.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <Card className="neo-shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Basic Information</CardTitle>
            <CardDescription className="text-sm md:text-base">Tell us about your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-black uppercase">Workflow Title</label>
              <Input 
                placeholder="e.g. AI Content Generator" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 md:h-14"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-black uppercase">Description</label>
              <textarea 
                className="neo-input w-full min-h-[120px] md:min-h-[150px] font-medium py-3 text-sm md:text-base"
                placeholder="Explain what this workflow does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase">Category</label>
                <select 
                  className="neo-input w-full h-12 font-bold uppercase text-sm md:text-base"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  required
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase">Tags (Press Enter)</label>
                <Input 
                  placeholder="e.g. automation, slack" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="h-12"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <span key={tag} className="bg-neo-black text-neo-white px-2 py-1 text-[10px] font-bold uppercase flex items-center gap-1">
                      {tag}
                      <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Workflow JSON</CardTitle>
            <CardDescription className="text-sm md:text-base">Paste your exported n8n workflow JSON here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-neo-gray p-4 neo-border flex items-start gap-3 mb-4">
              <Info className="shrink-0 mt-1 w-4.5 h-4.5 md:w-5 md:h-5" />
              <p className="text-xs md:text-sm font-bold">
                To export your workflow in n8n: Open your workflow, click the menu icon, 
                and select "Export as File" or "Copy to Clipboard".
              </p>
            </div>
            <div className="relative">
              <Code className="absolute right-4 top-4 text-neo-black/20 w-5 h-5 md:w-6 md:h-6" />
              <textarea 
                className="neo-input w-full min-h-[250px] md:min-h-[300px] font-mono text-xs md:text-sm p-4 bg-zinc-50"
                placeholder='{ "nodes": [...], "connections": {...} }'
                value={workflowJson}
                onChange={(e) => setWorkflowJson(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
          <Button variant="outline" type="button" className="h-12 md:h-14 w-full sm:w-auto" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="h-14 md:h-16 text-lg md:text-xl gap-2 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                Publish Workflow
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
