import { Star, Download, Tag, User } from 'lucide-react';
import { Template } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="bg-neo-black text-neo-white text-[10px] font-black px-2 py-0.5 uppercase neo-border">
            {template.category}
          </span>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1">
              <Star size={14} fill="currentColor" />
              {template.stars}
            </div>
            {template.score && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {template.score}/10
              </div>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-1">{template.title}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-bold border border-neo-black px-1.5 py-0.5 bg-neo-gray">
              #{tag}
            </span>
          ))}
        </div>
        <Link to={`/profile/${template.authorId}`} className="flex items-center gap-2 text-sm font-bold hover:underline">
          <div className="w-6 h-6 bg-neo-black rounded-full flex items-center justify-center text-neo-white text-[10px] overflow-hidden">
            {template.authorPhoto ? (
              <img src={template.authorPhoto} alt={template.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              template.authorName.charAt(0)
            )}
          </div>
          <span className="truncate">{template.authorName}</span>
        </Link>
      </CardContent>

      <CardFooter className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-bold">
          <Download size={14} />
          {template.downloads}
        </div>
        <Link to={`/template/${template.id}`} className="flex-grow">
          <Button variant="primary" size="sm" className="w-full">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
