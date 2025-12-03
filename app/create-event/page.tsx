"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

// Mock interface based on your database model
interface IEventForm {
  title: string;
  description: string;
  overview: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  audience: string;
  organizer: string;
  agenda: string[];
  tags: string[];
  image: string | null;
}

const CreateEventForm = () => {
  // --- 1. State Management (No changes here) ---
  const [formData, setFormData] = useState<IEventForm>({
    title: "",
    description: "",
    overview: "",
    date: "",
    time: "",
    location: "",
    mode: "In-Person",
    audience: "General Public",
    organizer: "",
    agenda: [],
    tags: [],
    image: null,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentAgendaItem, setCurrentAgendaItem] = useState("");

  // --- 2. Handlers (No changes here) ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, currentTag] }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddAgenda = () => {
    if (currentAgendaItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        agenda: [...prev.agenda, currentAgendaItem],
      }));
      setCurrentAgendaItem("");
    }
  };

  const handleRemoveAgenda = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted (Static Data):", formData);
    alert("Event Created! Check console for data object.");
  };

  // --- Glassy Styles Definition ---
  // We define these common styles here to keep the JSX clean
  const glassContainerBtn = " bg-[#12121280]/50 rounded-md bg-clip-padding backdrop-filter backdrop-blur-xl border-b border-border-dark";
  const glassInput = "w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all backdrop-blur-sm";
  const labelStyle = "font-medium text-gray-200";
  const sectionHeaderStyle = "text-xl font-semibold text-white border-b border-white/10 pb-2";

  return (
    // Main container with glass effect
    <div className={`w-full max-w-4xl mx-auto p-8 rounded-2xl ${glassContainerBtn}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">Create Event</h1>
        <p className="text-gray-300 mt-2">
          Fill in the details below to publish your new event.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* --- Header Section --- */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionHeaderStyle}>
            General Information
          </h2>

          <div className="flex flex-col gap-2">
            <label className={labelStyle}>Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Next.js Conf 2025"
              value={formData.title}
              onChange={handleChange}
              className={glassInput}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelStyle}>Short Description</label>
            <textarea
              name="description"
              placeholder="A brief catchy description..."
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className={`${glassInput} resize-none`}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelStyle}>Full Overview</label>
            <textarea
              name="overview"
              placeholder="Detailed explanation of the event..."
              value={formData.overview}
              onChange={handleChange}
              rows={5}
              className={glassInput}
              required
            />
          </div>
        </section>

        {/* --- Media Section --- */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionHeaderStyle}>Event Media</h2>
          <div className="flex flex-col gap-2">
            <label className={labelStyle}>Cover Image</label>
            <div className="flex items-center gap-4">
              {/* Stylized file input using Tailwind file utilities */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-white/10 file:text-white
                  hover:file:bg-white/20 cursor-pointer"
              />
            </div>
            {formData.image && (
              <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* --- Details / Logistics --- */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionHeaderStyle}>Logistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={glassInput}
                // "color-scheme: dark" tells the browser to render the calendar picker in dark mode
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Time</label>
              <input
                type="text"
                name="time"
                placeholder="e.g. 10:00 AM - 2:00 PM"
                value={formData.time}
                onChange={handleChange}
                className={glassInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Casablanca, Morocco"
                value={formData.location}
                onChange={handleChange}
                className={glassInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                // Note: we force options to have dark bg for readability in dropdown
                className={`${glassInput} appearance-none bg-[url('/icons/chevron-down.svg')] bg-no-repeat bg-right-4`}
              >
                <option className="bg-gray-900 text-white" value="In-Person">In-Person</option>
                <option className="bg-gray-900 text-white" value="Online">Online</option>
                <option className="bg-gray-900 text-white" value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Audience</label>
              <input
                type="text"
                name="audience"
                placeholder="e.g. Developers, Designers"
                value={formData.audience}
                onChange={handleChange}
                className={glassInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelStyle}>Organizer Name</label>
              <input
                type="text"
                name="organizer"
                placeholder="Company or Individual Name"
                value={formData.organizer}
                onChange={handleChange}
                className={glassInput}
                required
              />
            </div>
          </div>
        </section>

        {/* --- Dynamic Lists (Agenda & Tags) --- */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionHeaderStyle}>
            Additional Details
          </h2>

          {/* Agenda Input */}
          <div className="flex flex-col gap-2">
            <label className={labelStyle}>Agenda Items</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Add an agenda item"
                value={currentAgendaItem}
                onChange={(e) => setCurrentAgendaItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAgenda())}
                className={`${glassInput} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                // Glassy button
                className={`px-6 py-3 rounded-lg font-medium ${glassContainerBtn}`}
              >
                Add
              </button>
            </div>
            {/* Agenda List Display */}
            {formData.agenda.length > 0 && (
              <ul className="mt-3 space-y-2">
                {formData.agenda.map((item, index) => (
                  <li
                    key={index}
                    // Glassy list item
                    className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg text-white backdrop-blur-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAgenda(index)}
                      className="text-red-300 hover:text-red-200 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tags Input */}
          <div className="flex flex-col gap-2 mt-4">
            <label className={labelStyle}>Tags</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className={`${glassInput} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                 className={`px-6 py-3 rounded-lg font-medium ${glassContainerBtn}`}
              >
                Add
              </button>
            </div>
            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  // Glassy Tag Pill (Blue tint)
                  className="bg-blue-500/20 text-blue-100 border border-blue-400/30 px-3 py-1 rounded-full text-sm flex items-center gap-2 backdrop-blur-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            // Semi-transparent green button with blur
            className="w-full bg-green-900 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg backdrop-blur-md border border-green-400/20"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;