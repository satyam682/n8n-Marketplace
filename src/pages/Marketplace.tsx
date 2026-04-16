import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TemplateCard } from '../components/TemplateCard';
import { CATEGORIES, SortOption, Category, Template } from '../types';
import { api } from '../services/api';

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTemplates({
          category: selectedCategory,
          search: searchQuery,
          sort: sortBy
        });
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchTemplates, 300);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="mb-12 md:mb-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-grow text-center lg:text-left">
          <div className="inline-block bg-neo-black text-neo-white px-4 py-1 neo-border mb-6 font-black uppercase tracking-widest text-xs md:text-sm">
            Community Powered
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            The <span className="underline decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Marketplace</span> <br /> 
            For n8n Experts
          </h1>
          <p className="text-lg md:text-xl font-bold max-w-2xl mb-8">
            Discover, download, and share over 1,000+ n8n workflow templates. 
            Join the largest community of automation builders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Button className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl w-full sm:w-auto">Browse All</Button>
            <Button variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl w-full sm:w-auto">Publish Yours</Button>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-1/3 max-w-md">
          <div className="neo-card bg-neo-black text-neo-white p-6 md:p-8 rotate-0 lg:rotate-3 hover:rotate-0 transition-transform cursor-default">
            <div className="flex justify-between items-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-neo-white rounded-full"></div>
              <div className="bg-neo-white text-neo-black px-2 py-1 text-[10px] md:text-xs font-black uppercase">Featured</div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase mb-4">AI Agent Builder</h3>
            <p className="font-bold opacity-80 mb-6 text-sm md:text-base">The most downloaded workflow this week. Automate your customer support with GPT-4o.</p>
            <div className="flex justify-between items-center">
              <span className="font-black">4.9 ★</span>
              <Button variant="secondary" size="sm">Get it</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-20">
        {[
          { label: 'Templates', value: '1,240+' },
          { label: 'Active Users', value: '15k+' },
          { label: 'Downloads', value: '850k+' },
          { label: 'Countries', value: '120+' }
        ].map((stat, i) => (
          <div key={i} className="neo-card bg-neo-white text-center p-3 md:p-4">
            <span className="block text-2xl md:text-4xl font-black uppercase tracking-tighter">{stat.value}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase opacity-60">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-black" size={20} />
            <Input 
              placeholder="Search templates..." 
              className="pl-12 h-12 md:h-14 text-base md:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="neo-input h-12 md:h-14 font-bold uppercase flex-grow md:flex-grow-0"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="downloads">Most Downloaded</option>
            </select>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 md:h-14 md:w-14 shrink-0"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <ListIcon size={20} /> : <LayoutGrid size={20} />}
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-none whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
        }>
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center neo-card">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="font-black uppercase">Loading Templates...</p>
            </div>
          ) : templates.length > 0 ? (
            templates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center neo-card">
              <h3 className="text-2xl font-black uppercase mb-2">No templates found</h3>
              <p className="font-bold">Try adjusting your search or filters.</p>
              <Button 
                variant="primary" 
                className="mt-6"
                onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More Placeholder */}
        {!isLoading && templates.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="px-12 py-4 text-xl">
              Load More Templates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
