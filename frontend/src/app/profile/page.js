"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Mock profile state seeded with user data or defaults
  const [profile, setProfile] = useState({
    name: user?.name || "Student User",
    username: "student_xx",
    institution: "University of Technology",
    age: "21",
    bio: "Passionate learner looking for guidance in computer science and mathematics.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">My Profile</h1>
          <p className="text-zinc-500">Manage your personal information and student account settings.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="secondary">
            Edit Profile
          </Button>
        )}
      </div>

      {savedMessage && (
        <div className="mb-6 rounded-default bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
          Profile updated successfully!
        </div>
      )}

      <div className="rounded-default border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-zinc-100">
          <img
            src={profile.avatar}
            alt="Profile Avatar"
            className="h-24 w-24 rounded-full bg-orange-100 border-2 border-primary p-1 shadow-sm"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-secondary">{profile.name}</h2>
            <p className="text-sm font-medium text-primary">@{profile.username}</p>
            <p className="text-sm text-zinc-500 mt-1">{profile.institution} • Age {profile.age}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full rounded-default border border-zinc-300 px-4 py-2.5 text-secondary focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full rounded-default border border-zinc-300 px-4 py-2.5 text-secondary focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Institution Name</label>
                <input
                  type="text"
                  name="institution"
                  value={profile.institution}
                  onChange={handleChange}
                  className="w-full rounded-default border border-zinc-300 px-4 py-2.5 text-secondary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  className="w-full rounded-default border border-zinc-300 px-4 py-2.5 text-secondary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Bio / Learning Goals</label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={handleChange}
                className="w-full rounded-default border border-zinc-300 px-4 py-2.5 text-secondary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">Save Changes</Button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-default border border-zinc-300 px-6 py-3 font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Bio</h3>
              <p className="mt-1 text-zinc-700">{profile.bio}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Institution</h3>
                <p className="mt-1 font-medium text-secondary">{profile.institution}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Age</h3>
                <p className="mt-1 font-medium text-secondary">{profile.age} years old</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}