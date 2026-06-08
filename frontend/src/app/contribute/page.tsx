'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from "@/utils/motion";

type Video = {
    title: string;
    url: string;
    timestamp: number;
};

export default function ContributePage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const handleUpload = () => {
        if (!newVideo || !newTitle) return alert('Please provide both title and video file.');

        const videoURL = URL.createObjectURL(newVideo);
        const newEntry: Video = {
            title: newTitle,
            url: videoURL,
            timestamp: Date.now()
        };
        setVideos((prev) => [newEntry, ...prev]);

        // Reset form
        setNewTitle('');
        setNewVideo(null);
        setPreviewURL(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setNewVideo(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setNewVideo(file);
                setPreviewURL(URL.createObjectURL(file));
            } else {
                alert('Please upload a video file');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#181826] overflow-hidden">
            {/* Plain background without HeroBackground or StarsCanvas */}

            <div className="relative z-10 pt-32 pb-16 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
                >
                    Contribute to SignAI
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-gray-200 max-w-xl text-center mb-12"
                >
                    Help us improve our sign language database by contributing your videos
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-3xl bg-white/10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-white/10 mb-12"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-white">Upload Your Sign Language Video</h2>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-medium mb-2">Video Title</label>
                        <input
                            type="text"
                            placeholder="Enter descriptive title (e.g. 'Hello in ISL')"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-medium mb-2">Video File</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-purple-400 bg-purple-900/30' : 'border-white/30 hover:border-white/50'}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => document.getElementById('videoInput')?.click()}
                        >
                            <input
                                id="videoInput"
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {previewURL ? (
                                <div className="max-w-md mx-auto">
                                    <video controls className="w-full rounded-lg shadow-lg">
                                        <source src={previewURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <p className="mt-3 text-white">{newVideo?.name}</p>
                                </div>
                            ) : (
                                <div className="text-white">
                                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-lg">Drag and drop your video here or click to browse</p>
                                    <p className="text-sm mt-2 text-gray-300">Supports MP4, WebM, and other video formats</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpload}
                            disabled={!newVideo || !newTitle}
                            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg text-white ${!newVideo || !newTitle ?
                                'bg-gray-500 cursor-not-allowed' :
                                'bg-[#181826]'}`}
                        >
                            Upload Video
                        </motion.button>
                    </div>
                </motion.div>

                {videos.length > 0 && (
                    <motion.div
                        variants={fadeIn("up", "spring", 0.5, 0.75)}
                        initial="hidden"
                        animate="show"
                        className="w-full max-w-6xl"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Your Uploaded Videos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video, idx) => (
                                <motion.div
                                    key={video.timestamp}
                                    variants={fadeIn("up", "spring", idx * 0.2, 0.75)}
                                    className="bg-white/10 backdrop-filter backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-lg"
                                >
                                    <video controls className="w-full aspect-video">
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="p-4">
                                        <h3 className="text-white font-medium text-lg truncate">{video.title}</h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            {new Date(video.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Simple gradient at bottom instead of complex elements */}
        </div>
    );
}
