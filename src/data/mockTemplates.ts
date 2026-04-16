import { Template } from '../types';

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'AI Content Generator',
    description: 'Automatically generate blog posts using GPT-4 and publish to WordPress.',
    authorId: 'user1',
    authorName: 'Alex Rivera',
    category: 'AI',
    tags: ['GPT-4', 'WordPress', 'Automation'],
    workflowJson: '{"nodes": [], "connections": {}}',
    stars: 124,
    downloads: 450,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 1000000,
  },
  {
    id: '2',
    title: 'Slack to Google Sheets',
    description: 'Log all messages from a specific Slack channel to a Google Sheet for archiving.',
    authorId: 'user2',
    authorName: 'Sarah Chen',
    category: 'DevOps',
    tags: ['Slack', 'Google Sheets', 'Logging'],
    workflowJson: '{"nodes": [], "connections": {}}',
    stars: 89,
    downloads: 1200,
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 2000000,
  },
  {
    id: '3',
    title: 'E-commerce Order Sync',
    description: 'Sync Shopify orders with QuickBooks for automated accounting.',
    authorId: 'user3',
    authorName: 'Mike Johnson',
    category: 'Sales',
    tags: ['Shopify', 'QuickBooks', 'Finance'],
    workflowJson: '{"nodes": [], "connections": {}}',
    stars: 210,
    downloads: 890,
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 3000000,
  },
  {
    id: '4',
    title: 'Social Media Scheduler',
    description: 'Schedule posts across Twitter, LinkedIn, and Facebook from a single Airtable base.',
    authorId: 'user1',
    authorName: 'Alex Rivera',
    category: 'Marketing',
    tags: ['Airtable', 'Twitter', 'LinkedIn'],
    workflowJson: '{"nodes": [], "connections": {}}',
    stars: 156,
    downloads: 670,
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 4000000,
  },
  {
    id: '5',
    title: 'GitHub Issue Notifier',
    description: 'Get notified in Discord whenever a new issue is opened in your repository.',
    authorId: 'user4',
    authorName: 'Emma Wilson',
    category: 'DevOps',
    tags: ['GitHub', 'Discord', 'Notifications'],
    workflowJson: '{"nodes": [], "connections": {}}',
    stars: 45,
    downloads: 320,
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now() - 5000000,
  }
];

// Function to generate more mock data for "1000+" feel
export const generateMockTemplates = (count: number): Template[] => {
  const templates: Template[] = [...MOCK_TEMPLATES];
  const authors = ['Alex Rivera', 'Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'Chris Lee', 'Pat Taylor'];
  const categories: any[] = ['AI', 'Marketing', 'Sales', 'DevOps', 'Personal', 'Other'];
  
  for (let i = 6; i <= count; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    templates.push({
      id: i.toString(),
      title: `${category} Workflow #${i}`,
      description: `This is a highly efficient ${category.toLowerCase()} automation workflow designed to save you hours of manual work.`,
      authorId: `user${Math.floor(Math.random() * 10)}`,
      authorName: author,
      category: category,
      tags: [category, 'Automation', 'n8n'],
      workflowJson: '{"nodes": [], "connections": {}}',
      stars: Math.floor(Math.random() * 500),
      downloads: Math.floor(Math.random() * 2000),
      createdAt: Date.now() - Math.floor(Math.random() * 10000000),
      updatedAt: Date.now() - Math.floor(Math.random() * 10000000),
    });
  }
  return templates;
};
