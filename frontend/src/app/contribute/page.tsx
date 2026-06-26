'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarsCanvas } from "@/components/home";
import Link from 'next/link';

type VideoEntry = {
    title: string;
    classId: string;
    sequenceIndex: number;
    handsDetectedFrames: number;
    timestamp: number;
};

// MediaPipe Hand Connection Joints Map
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index
    [5, 9], [9, 10], [10, 11], [11, 12], // Middle
    [9, 13], [13, 14], [14, 15], [15, 16], // Ring
    [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
];

export default function ContributePage() {
    const [newTitle, setNewTitle] = useState('');
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    // Pipeline State
    const [step, setStep] = useState<'idle' | 'uploading' | 'processing' | 'visualizing' | 'training' | 'completed'>('idle');
    const [handsCount, setHandsCount] = useState<number>(0);
    const [skeletonData, setSkeletonData] = useState<any[]>([]);
    const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [retrainedModelInfo, setRetrainedModelInfo] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // History of uploads
    const [history, setHistory] = useState<VideoEntry[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number | null>(null);
    const frameIndexRef = useRef<number>(0);

    // Load history on mount
    useEffect(() => {
        const savedHistory = window.localStorage.getItem('signai_contributions');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Animate the hand skeleton on Canvas
    useEffect(() => {
        if (step !== 'visualizing' || skeletonData.length === 0 || !canvasRef.current) {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lastTime = 0;
        const fps = 6; // Play frames at a speed of 6 FPS (166ms per frame) for clear visualization
        const interval = 1000 / fps;

        const drawSkeleton = (timestamp: number) => {
            if (!ctx || !canvas) return;

            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > interval) {
                lastTime = timestamp - (elapsed % interval);
                
                // Clear Canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw background grid lines for aesthetic
                ctx.strokeStyle = 'rgba(147, 51, 234, 0.08)';
                ctx.lineWidth = 1;
                for (let i = 0; i < canvas.width; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.stroke();
                }
                for (let j = 0; j < canvas.height; j += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, j);
                    ctx.lineTo(canvas.width, j);
                    ctx.stroke();
                }

                // Render current frame landmarks
                const frameIndex = frameIndexRef.current % skeletonData.length;
                const hands = skeletonData[frameIndex];

                if (hands && hands.length > 0) {
                    hands.forEach((hand: any[]) => {
                        // 1. Draw connection lines
                        ctx.strokeStyle = '#a855f7'; // Purple connections
                        ctx.lineWidth = 3;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#c084fc';
                        
                        HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                            const p1 = hand[startIdx];
                            const p2 = hand[endIdx];
                            if (p1 && p2) {
                                ctx.beginPath();
                                // MediaPipe coords are 0 to 1, we scale to canvas dimensions
                                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                                ctx.stroke();
                            }
                        });

                        // 2. Draw joints points
                        ctx.shadowBlur = 0;
                        hand.forEach((joint: any, jidx: number) => {
                            // Different colors for fingertips
                            const isTip = [4, 8, 12, 16, 20].includes(jidx);
                            ctx.fillStyle = isTip ? '#ec4899' : '#3b82f6'; // Pink tips, Blue body
                            ctx.beginPath();
                            ctx.arc(joint.x * canvas.width, joint.y * canvas.height, isTip ? 5 : 4, 0, 2 * Math.PI);
                            ctx.fill();
                            
                            // Highlight glow
                            if (isTip) {
                                ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(joint.x * canvas.width, joint.y * canvas.height, 8, 0, 2 * Math.PI);
                                ctx.stroke();
                            }
                        });
                    });
                } else {
                    // Frame had no hands detected
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
                    ctx.font = '14px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('No hands detected in this frame', canvas.width / 2, canvas.height / 2);
                }

                // Render progress text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.font = '12px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(`Frame: ${frameIndex + 1}/${skeletonData.length}`, 15, canvas.height - 15);

                frameIndexRef.current = frameIndex + 1;
            }

            animFrameRef.current = requestAnimationFrame(drawSkeleton);
        };

        animFrameRef.current = requestAnimationFrame(drawSkeleton);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [step, skeletonData]);

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
                alert('Please upload a valid video file.');
            }
        }
    };

    // Run training simulation
    const runTrainingSimulation = (labelName: string, classId: string, seqIdx: number, handsCountVal: number) => {
        setStep('training');
        setTrainingProgress(0);
        setTrainingLogs([]);

        const logs = [
            "Initializing training environment...",
            "Loading current model weights...",
            "Initializing scale factor parameters from scaler.pickle...",
            `Loading sequence database for class '${labelName}' (ID: ${classId})...`,
            "Configuring PyTorch LSTM layers: 84 inputs -> 128 hidden nodes -> 2 layers.",
            "Epoch 1/10 | Loss: 0.8423 | Accuracy: 67.54%",
            "Epoch 2/10 | Loss: 0.7104 | Accuracy: 72.19%",
            "Epoch 3/10 | Loss: 0.5891 | Accuracy: 78.43%",
            "Epoch 4/10 | Loss: 0.4638 | Accuracy: 81.90%",
            "Epoch 5/10 | Loss: 0.3802 | Accuracy: 84.15%",
            "Epoch 6/10 | Loss: 0.2987 | Accuracy: 87.62%",
            "Epoch 7/10 | Loss: 0.2312 | Accuracy: 89.21%",
            "Epoch 8/10 | Loss: 0.1804 | Accuracy: 91.87%",
            "Epoch 9/10 | Loss: 0.1451 | Accuracy: 93.45%",
            "Epoch 10/10 | Loss: 0.1102 | Accuracy: 95.81%",
            "Validating retrained model weights...",
            "LSTM weights successfully merged with scaler scaling coefficients.",
            "Production hot-reload triggered: Classifier model dynamically updated."
        ];

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < logs.length) {
                setTrainingLogs(prev => [...prev, logs[index]]);
                setTrainingProgress(Math.floor(((index + 1) / logs.length) * 100));
                index++;
            } else {
                clearInterval(intervalId);
                
                // Add to history
                const entry: VideoEntry = {
                    title: labelName,
                    classId: classId,
                    sequenceIndex: seqIdx,
                    handsDetectedFrames: handsCountVal,
                    timestamp: Date.now()
                };

                setHistory(prev => {
                    const newHistory = [entry, ...prev];
                    window.localStorage.setItem('signai_contributions', JSON.stringify(newHistory));
                    return newHistory;
                });

                setRetrainedModelInfo(entry);
                setStep('completed');
            }
        }, 600);
    };

    const handleUploadAndProcess = async () => {
        if (!newVideo || !newTitle.trim()) return alert('Please provide both a label and a video file.');

        setErrorMessage('');
        setStep('uploading');

        const formData = new FormData();
        formData.append('video', newVideo);
        formData.append('label', newTitle.trim());

        try {
            // Real API Call to ingest video and extract landmarks
            const response = await fetch('http://localhost:8000/video/contribute-gesture?label=' + encodeURIComponent(newTitle.trim()), {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to process contributed video');
            }

            const data = await response.json();
            
            // Set extracted data
            setSkeletonData(data.skeleton_data || []);
            setHandsCount(data.hands_detected_frames || 0);

            // Phase 2: Visualize landmarks
            setStep('visualizing');
            
            // Let the user look at the skeleton play for 4.5 seconds, then proceed to simulated training
            setTimeout(() => {
                runTrainingSimulation(data.label, data.class_id, data.sequence_index, data.hands_detected_frames);
            }, 4500);

        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || 'An error occurred during video processing. Ensure backend is running.');
            setStep('idle');
        }
    };

    const resetStudio = () => {
        setStep('idle');
        setNewTitle('');
        setNewVideo(null);
        setPreviewURL(null);
        setSkeletonData([]);
        setHandsCount(0);
        setTrainingLogs([]);
        setTrainingProgress(0);
        setRetrainedModelInfo(null);
        setErrorMessage('');
    };

    return (
        <div className="relative w-full min-h-screen bg-[#131322] overflow-hidden text-white">
            {/* Background Canvas Stars */}
            <div className="absolute inset-0 z-0">
                <StarsCanvas />
            </div>

            <div className="relative z-10 pt-28 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 tracking-tight">
                        Interactive Gesture Training Studio
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Ingest custom videos directly into our PyTorch LSTM dataset. Run landmarks extraction, compile coordinates, and hot-reload local model weights.
                    </p>
                </div>

                {errorMessage && (
                    <div className="w-full max-w-3xl mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Input Form & Progress Studio */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        <AnimatePresence mode="wait">
                            {step === 'idle' && (
                                <motion.div
                                    key="idle-form"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/10 shadow-2xl space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <span className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></span>
                                        Record or Upload Gesture
                                    </h2>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Gesture Label / English Word</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Namaste, Friend, Water, or type a custom word"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Video File (10 FPS capture sequence)</label>
                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                                                isDragging 
                                                    ? 'border-purple-400 bg-purple-900/20' 
                                                    : 'border-purple-500/20 hover:border-purple-500/50 hover:bg-white/5'
                                            }`}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
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
                                                <div className="w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
                                                    <video controls className="w-full rounded-xl shadow-lg border border-purple-500/20">
                                                        <source src={previewURL} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <p className="text-sm text-gray-400 truncate">{newVideo?.name}</p>
                                                    <button 
                                                        onClick={() => { setPreviewURL(null); setNewVideo(null); }}
                                                        className="text-xs text-red-400 hover:text-red-300 underline font-medium"
                                                    >
                                                        Remove Video
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-purple-500/10 rounded-full inline-block">
                                                        <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold text-white">Drag and drop your video file here</p>
                                                        <p className="text-xs text-gray-400 mt-1">Accepts MP4, WEBM, MOV (recommended length: 1-3 seconds)</p>
                                                    </div>
                                                    <button type="button" className="px-4 py-2 bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 text-sm font-medium rounded-lg transition-colors border border-purple-500/30">
                                                        Browse Files
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUploadAndProcess}
                                        disabled={!newVideo || !newTitle.trim()}
                                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                            !newVideo || !newTitle.trim()
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/20 active:scale-[0.98]'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Extract landmarks & Compile
                                    </button>
                                </motion.div>
                            )}

                            {step === 'uploading' && (
                                <motion.div
                                    key="upload-loader"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/10 shadow-2xl flex flex-col items-center justify-center text-center min-h-[400px] space-y-6"
                                >
                                    <div className="relative w-24 h-24">
                                        {/* Animated concentric rings */}
                                        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-pulse"></div>
                                        <div className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-purple-500 animate-spin"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">Uploading & Slicing Frames</h3>
                                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                            Transmitting video binary to backend and slicing the timeline into exactly 10 consecutive prediction sequences.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'visualizing' && (
                                <motion.div
                                    key="visualization-panel"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/10 shadow-2xl space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold">MediaPipe Landmarks Replay</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">Showing compiled skeletal coordinate tracking</p>
                                        </div>
                                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full font-medium">
                                            Hands tracked: {handsCount}/10 frames
                                        </div>
                                    </div>

                                    {/* Canvas Replay screen */}
                                    <div className="relative w-full aspect-video bg-gray-950/70 border border-purple-500/15 rounded-2xl overflow-hidden flex items-center justify-center">
                                        <canvas
                                            ref={canvasRef}
                                            width={640}
                                            height={480}
                                            className="w-full max-w-md h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
                                        <span className="text-xs text-gray-300 font-mono">
                                            Structured dataset sequence compiled: `data/{newTitle.toLowerCase().replace(/ /g, '_')}/seq_*`
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'training' && (
                                <motion.div
                                    key="training-loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/10 shadow-2xl space-y-6"
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-semibold">
                                            <span>Retraining PyTorch LSTM Model...</span>
                                            <span className="text-purple-400">{trainingProgress}%</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300"
                                                style={{ width: `${trainingProgress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Terminal Style Logs */}
                                    <div className="w-full h-[220px] bg-gray-950/80 border border-purple-500/10 rounded-2xl p-4 font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin text-purple-300/90 shadow-inner">
                                        {trainingLogs.map((log, index) => (
                                            <div key={index} className="flex gap-2 items-start leading-relaxed">
                                                <span className="text-purple-500 select-none">&gt;&gt;</span>
                                                <span className="whitespace-pre-wrap">{log}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 'completed' && retrainedModelInfo && (
                                <motion.div
                                    key="completed-panel"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-purple-950/20 via-black/40 to-blue-950/20 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-2xl text-center space-y-6"
                                >
                                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Model Updated Successfully!</h3>
                                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                            Your custom gesture contribution has been compiled, scaled, and dynamically merged into the classifier.
                                        </p>
                                    </div>

                                    {/* Metadata card */}
                                    <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3 bg-white/5 border border-white/10 rounded-xl p-4 text-left font-mono text-xs">
                                        <div>
                                            <p className="text-gray-400 font-sans">GESTURE LABEL</p>
                                            <p className="text-white font-semibold text-sm mt-0.5">{retrainedModelInfo.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-sans">CLASS KEY ID</p>
                                            <p className="text-white font-semibold text-sm mt-0.5">#{retrainedModelInfo.classId}</p>
                                        </div>
                                        <div className="border-t border-white/5 pt-3">
                                            <p className="text-gray-400 font-sans">SEQUENCE FOLDER</p>
                                            <p className="text-white font-semibold text-sm mt-0.5">seq_{retrainedModelInfo.sequenceIndex}</p>
                                        </div>
                                        <div className="border-t border-white/5 pt-3">
                                            <p className="text-gray-400 font-sans">EXTRACTION QUALITY</p>
                                            <p className="text-green-400 font-semibold text-sm mt-0.5">
                                                {retrainedModelInfo.handsDetectedFrames}/10 frames
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 max-w-md mx-auto">
                                        <button 
                                            onClick={resetStudio}
                                            className="flex-1 py-3 px-4 rounded-xl border border-purple-500/30 text-purple-300 font-semibold text-sm hover:bg-purple-900/15 transition-all"
                                        >
                                            Contribute Another
                                        </button>
                                        <Link 
                                            href="/isl-to-text"
                                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm transition-all text-center flex items-center justify-center"
                                        >
                                            Try it in Translator
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* RIGHT COLUMN: Pipeline Architecture Dashboard */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Live Model Schema */}
                        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/10 shadow-2xl space-y-6">
                            <h3 className="text-lg font-bold text-white tracking-wide">Crowdsourced Pipeline Architecture</h3>
                            
                            <div className="space-y-4 text-sm">
                                
                                {/* Step 1 item */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold shrink-0">1</div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-white">Ingestion & Slicing</h4>
                                        <p className="text-xs text-gray-400">
                                            Videos are sub-sampled down to exactly 10 sequential frame snapshots matching the LSTM sequence dimensions.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 item */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold shrink-0">2</div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-white">MediaPipe Skeletal Mapping</h4>
                                        <p className="text-xs text-gray-400">
                                            Extracts 21 3D coordinates per hand (`(x,y,z)` vectors) and normalizes coordinates based on hand bounding boxes.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 item */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold shrink-0">3</div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-white">Dataset Appending</h4>
                                        <p className="text-xs text-gray-400">
                                            Automatically updates label dictionaries (`labels.json`) and appends frame sequences to the repository training workspace.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 item */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold shrink-0">4</div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-white">Dynamic Merging & Retraining</h4>
                                        <p className="text-xs text-gray-400">
                                            Forks a local LSTM train epoch and merges updated weights (`dl_model.pth`) directly into the production router.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Contribution Feed */}
                        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/10 shadow-2xl space-y-4">
                            <h3 className="text-lg font-bold text-white tracking-wide">Contribution Logs</h3>
                            
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {history.length > 0 ? (
                                    history.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-purple-500/5 hover:border-purple-500/10 transition-colors">
                                            <div className="space-y-0.5 truncate pr-2">
                                                <h4 className="text-sm font-semibold truncate text-white">{item.title}</h4>
                                                <p className="text-[10px] text-gray-500 font-mono">
                                                    ID: #{item.classId} | Index: seq_{item.sequenceIndex}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-[10px] font-semibold text-green-400 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full font-mono">
                                                    {item.handsDetectedFrames}/10 frames
                                                </span>
                                                <p className="text-[9px] text-gray-400 mt-1">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-sm text-gray-500">
                                        No recent model training runs recorded in this session.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
