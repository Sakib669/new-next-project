'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (error) setError('');
  };

  const addAgendaItem = () => {
    setAgendaItems((prev) => [
      ...prev,
      { id: Date.now().toString(), title: '', time: '' },
    ]);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAgendaItem = (id: string, field: 'title' | 'time', value: string) => {
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Event description is required');
      return;
    }
    if (!formData.venue.trim()) {
      setError('Event venue is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Event location is required');
      return;
    }
    if (!formData.date) {
      setError('Event date is required');
      return;
    }
    if (!formData.time) {
      setError('Event time is required');
      return;
    }
    if (!formData.organizer.trim()) {
      setError('Organizer name is required');
      return;
    }
    if (!formData.image) {
      setError('Event image is required');
      return;
    }
    if (agendaItems.some((item) => !item.title.trim() || !item.time.trim())) {
      setError('All agenda items must have a title and time');
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData();

      // Add basic fields
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('overview', formData.overview);
      form.append('venue', formData.venue);
      form.append('location', formData.location);
      form.append('date', formData.date);
      form.append('time', formData.time);
      form.append('mode', formData.mode);
      form.append('audience', formData.audience);
      form.append('organizer', formData.organizer);

      // Add image
      if (formData.image) {
        form.append('image', formData.image);
      }

      // Add tags as JSON array
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      form.append('tags', JSON.stringify(tagsArray));

      // Add agenda as JSON array
      const agendaData = agendaItems.map((item) => ({
        title: item.title,
        time: item.time,
      }));
      form.append('agenda', JSON.stringify(agendaData));

      const response = await fetch('/api/events', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      setSuccess({ show: true, eventId: data.event._id });
      setFormData({
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
        image: null,
      });
      setImagePreview('');
      setTags('');
      setAgendaItems([{ id: '1', title: '', time: '' }]);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess({ show: false });
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Create New Event
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success.show && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">Event Created Successfully!</h3>
              <p className="text-sm text-green-800 mt-1">
                Your event has been created and is now live.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Image Upload Section */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Event Image</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl mb-2">📷</div>
                        <p className="text-xs text-slate-500">No image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Input */}
                <div className="flex-1 flex flex-col justify-center">
                  <label className="block">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium">
                      Choose Image
                    </span>
                  </label>
                  <p className="text-sm text-slate-500 mt-3">
                    PNG, JPG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Conference 2026"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your event in detail..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 resize-none"
                    required
                  />
                </div>

                {/* Overview */}
                <div className="sm:col-span-2">
                  <label htmlFor="overview" className="block text-sm font-medium text-slate-700 mb-2">
                    Overview
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="A brief overview of the event..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Location & Schedule Section */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Location & Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Venue */}
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-slate-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="e.g., Convention Center"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, USA"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Mode */}
                <div>
                  <label htmlFor="mode" className="block text-sm font-medium text-slate-700 mb-2">
                    Mode
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                {/* Audience */}
                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-2">
                    Audience
                  </label>
                  <input
                    type="text"
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    placeholder="e.g., Developers, Students"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Organizer & Tags Section */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Organizer & Tags</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Organizer */}
                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-slate-700 mb-2">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Community"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., technology, conference, 2026"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {tags
                      .split(',')
                      .filter((tag) => tag.trim().length > 0).length > 0 && (
                      <span>
                        {tags
                          .split(',')
                          .filter((tag) => tag.trim().length > 0)
                          .length}{' '}
                        tag(s) added
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Agenda Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Event Agenda *</h2>
                <button
                  type="button"
                  onClick={addAgendaItem}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {agendaItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    {/* Index */}
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-medium flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* Title */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateAgendaItem(item.id, 'title', e.target.value)
                        }
                        placeholder="e.g., Keynote Speech"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                        required
                      />
                    </div>

                    {/* Time */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) =>
                          updateAgendaItem(item.id, 'time', e.target.value)
                        }
                        placeholder="e.g., 10:00 AM - 11:00 AM"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                        required
                      />
                    </div>

                    {/* Remove Button */}
                    {agendaItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(item.id)}
                        className="mt-auto sm:mt-0 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center gap-1 sm:w-auto"
                      >
                        <X size={18} />
                        <span className="sm:hidden text-sm">Remove</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
              <Link
                href="/events"
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}