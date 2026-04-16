import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Grid, Heart, Edit3, Calendar, Loader2, Github, Twitter, Globe, Save, X, Camera } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TemplateCard } from '../components/TemplateCard';
import { Template, UserProfile } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'published' | 'starred'>('published');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    photoURL: '',
    github: '',
    twitter: '',
    website: ''
  });

  const isOwnProfile = !id || id === currentUser?.uid;
  const profileId = id || currentUser?.uid;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;
      setIsLoading(true);
      try {
        const [userData, userTemplates] = await Promise.all([
          api.getUserProfile(profileId),
          api.getTemplates({ authorId: profileId }) // Assuming backend supports filtering by authorId
        ]);
        setProfile(userData);
        setTemplates(userTemplates);
        
        if (isOwnProfile) {
          setEditForm({
            displayName: userData.displayName || '',
            bio: userData.bio || '',
            photoURL: userData.photoURL || '',
            github: userData.github || '',
            twitter: userData.twitter || '',
            website: userData.website || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId, isOwnProfile]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const updated = await api.updateUserProfile(currentUser.uid, editForm);
      setProfile(updated);
      updateUser(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-black uppercase mb-4">User Not Found</h2>
        <p className="font-bold mb-8">The profile you're looking for doesn't exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Profile Header */}
      <div className="neo-card bg-neo-white p-6 md:p-8 mb-8 md:mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neo-black translate-x-32 -translate-y-32 rotate-45 opacity-5"></div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-neo-black rounded-full flex items-center justify-center text-neo-white text-4xl md:text-5xl font-black neo-border neo-shadow overflow-hidden">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                profile.displayName.charAt(0)
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-neo-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-neo-white" size={24} />
              </div>
            )}
          </div>
          
          <div className="flex-grow text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-60">Display Name</label>
                    <Input 
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-60">Profile Picture URL</label>
                    <Input 
                      value={editForm.photoURL}
                      onChange={(e) => setEditForm({...editForm, photoURL: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-60">Bio</label>
                  <textarea 
                    className="neo-input w-full min-h-[80px] text-sm font-medium p-3"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1">
                      <Github size={12} /> GitHub
                    </label>
                    <Input 
                      value={editForm.github}
                      onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1">
                      <Twitter size={12} /> Twitter
                    </label>
                    <Input 
                      value={editForm.twitter}
                      onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1">
                      <Globe size={12} /> Website
                    </label>
                    <Input 
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" size="sm" className="gap-2" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(false)}>
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{profile.displayName}</h1>
                  <div className="flex gap-2 justify-center md:justify-start">
                    {isOwnProfile && (
                      <>
                        <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => setIsEditing(true)}>
                          <Edit3 size={14} />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-base md:text-lg font-medium max-w-2xl mb-6">
                  {profile.bio || 'No bio provided.'}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  {profile.github && (
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="neo-border bg-neo-black text-neo-white p-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <Github size={20} />
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="neo-border bg-neo-black text-neo-white p-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <Twitter size={20} />
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="neo-border bg-neo-black text-neo-white p-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <Globe size={20} />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8">
                  <div className="text-center md:text-left">
                    <span className="block text-2xl md:text-3xl font-black uppercase leading-none">{templates.length}</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase opacity-60">Published</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-2xl md:text-3xl font-black uppercase leading-none">0</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase opacity-60">Starred</span>
                  </div>
                  <div className="text-center md:text-left w-full md:w-auto">
                    <span className="block text-xs md:text-sm font-black uppercase leading-none mt-2 flex items-center justify-center md:justify-start gap-1">
                      <Calendar size={14} />
                      Joined {format(profile.createdAt, 'MMM yyyy')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-4 border-neo-black mb-8 overflow-x-auto no-scrollbar">
        <button 
          className={`px-6 md:px-8 py-3 md:py-4 font-black uppercase text-lg md:text-xl transition-all whitespace-nowrap flex-1 md:flex-none ${
            activeTab === 'published' 
            ? 'bg-neo-black text-neo-white' 
            : 'bg-neo-white text-neo-black hover:bg-neo-gray'
          }`}
          onClick={() => setActiveTab('published')}
        >
          <div className="flex items-center justify-center gap-2">
            <Grid className="w-5 h-5 md:w-6 md:h-6" />
            {isOwnProfile ? 'My Workflows' : 'Workflows'}
          </div>
        </button>
        {isOwnProfile && (
          <button 
            className={`px-6 md:px-8 py-3 md:py-4 font-black uppercase text-lg md:text-xl transition-all whitespace-nowrap flex-1 md:flex-none ${
              activeTab === 'starred' 
              ? 'bg-neo-black text-neo-white' 
              : 'bg-neo-white text-neo-black hover:bg-neo-gray'
            }`}
            onClick={() => setActiveTab('starred')}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
              Starred
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.length > 0 ? (
          templates.map(t => <TemplateCard key={t.id} template={t} />)
        ) : (
          <div className="col-span-full py-20 text-center neo-card">
            <h3 className="text-2xl font-black uppercase mb-2">No workflows found</h3>
            <p className="font-bold">This user hasn't published any workflows yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
