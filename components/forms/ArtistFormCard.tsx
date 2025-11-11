'use client'
import React, { useState, useEffect } from "react";
import { artistAPI } from "@/lib/artistapi";

interface Artist {
    Artist_id: number;
    Artist_name: string;
    Country: string;
    youtube_url?: string;
}

interface ArtistFormCardProps {
    onClose: () => void;
    editingArtist?: Artist | null;
    onSuccess?: () => void;
}

export default function ArtistFormCard({ onClose, editingArtist, onSuccess }: ArtistFormCardProps) {
    const [artistName, setArtistName] = useState("");
    const [country, setCountry] = useState("");
    const [youtubeURL, setYoutubeURL] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingArtist) {
            setArtistName(editingArtist.Artist_name);
            setCountry(editingArtist.Country);
            setYoutubeURL(editingArtist.youtube_url || "");
        } else {
            setArtistName("");
            setCountry("");
            setYoutubeURL("");
        }
    }, [editingArtist]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!artistName || !country) {
            alert("Please fill all required fields");
            return;
        }

        const payload = {
            Artist_name: artistName,
            Country: country,
            youtube_url: youtubeURL || undefined,
        };

        try {
            setSaving(true);
            if (editingArtist) {
                await artistAPI.update(editingArtist.Artist_id, payload);
                alert("Artist updated successfully!");
            } else {
                await artistAPI.create(payload);
                alert("Artist created successfully!");
            }

            if (onSuccess) onSuccess();
            else onClose();
        } catch (error) {
            console.error("Error saving artist:", error);
            alert(`Failed to ${editingArtist ? "update" : "create"} artist`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block mb-2 font-medium">Artist Name *</label>
                <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Enter artist name"
                />
            </div>
            <div>
                <label className="block mb-2 font-medium">Country *</label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Enter country"
                />
            </div>
            <div>
                <label className="block mb-2 font-medium">YouTube URL</label>
                <input
                    type="url"
                    value={youtubeURL}
                    onChange={(e) => setYoutubeURL(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter YouTube URL (optional)"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="flex-1 p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving || !artistName || !country}
                    className="flex-1 p-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : editingArtist ? "Update Artist" : "Create Artist"}
                </button>
            </div>
        </form>
    );
}
