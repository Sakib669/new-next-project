'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, CheckCircle, AlertCircle, Loader, Image as ImageIcon } from 'lucide-react';

// tsrfc pattern follow করা হয়েছে 
interface AgendaItem {
  id: string;
  title: string;
  time: string;
}

interface SuccessState {
  show: boolean;
  eventId?: string;
}

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessState>({ show: false });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { id: '1', title: '', time: '' },
  ]);
  const [tags, setTags] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    overview: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: 'Online',
    audience: '',
    organizer: '',
    image: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems((prev) => [...prev, { id: Date.now().toString(), title: '', time: '' }]);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAgendaItem = (id: string, field: 'title' | 'time', value: string) => {
    setAgendaItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      const tagsArray = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      form.append('tags', JSON.stringify(tagsArray));
      form.append('agenda', JSON.stringify(agendaItems.map(({ title, time }) => ({ title, time }))));

      const response = await fetch('/api/events', { method: 'POST', body: form });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to create event');

      setSuccess({ show: true, eventId: data.event._id });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B0F1A]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/events" className="p-2 rounded-lg hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold text-white">
              Create New Event
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Success/Error Alerts */}
        {success.show && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
            <CheckCircle size={20} />
            <p className="font-medium text-sm">Event successfully published!</p>
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Image */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <ImageIcon size={14} /> Banner Image
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-full md:w-64 h-40 bg-slate-950 rounded-xl border-2 border-dashed border-slate-800 overflow-hidden flex items-center justify-center hover:border-blue-500/50 transition-colors cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-600">
                    <Plus className="mx-auto mb-2" size={24} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Upload Image</span>
                  </div>
                )}
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-slate-300 font-medium">Event Thumbnail</p>
                <p className="text-xs text-slate-500 mt-1">Select a visual for your event. Max 5MB.</p>
              </div>
            </div>
          </section>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">General Info</h3>
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Event Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Write a short description..." rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-600" />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="date" onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-sm text-slate-300" />
                <input type="time" name="time" onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-sm text-slate-300" />
              </div>
              <input name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Venue/Platform" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" />
              <select name="mode" onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-slate-400">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Agenda */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Event Agenda</h2>
              <button type="button" onClick={addAgendaItem} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
                <Plus size={14} /> Add Step
              </button>
            </div>
            <div className="space-y-3">
              {agendaItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <input placeholder="Time" value={item.time} onChange={(e) => updateAgendaItem(item.id, 'time', e.target.value)} className="w-1/3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  <input placeholder="Activity" value={item.title} onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  {agendaItems.length > 1 && (
                    <button type="button" onClick={() => removeAgendaItem(item.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors"><X size={18} /></button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-6 pt-4">
            <Link href="/events" className="text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors">Discard</Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-xl shadow-blue-900/20"
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : 'Create Event'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}