"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { StarsCanvas } from "@/components/home";
import Link from "next/link";
import Image from "next/image";

interface DetectedGesture {
  gesture: string;
  confidence: number;
  timestamp: number;
}

export default function ISLToTextPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedText, setDetectedText] = useState<string>("");
  const [recentGestures, setRecentGestures] = useState<DetectedGesture[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      console.error("Camera access error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
    setIsProcessing(false);
  }, [stream]);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');

      try {
        setIsProcessing(true);
        const response = await fetch('http://localhost:8000/video/predict-gesture', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.gesture && result.gesture !== 'No gesture detected') {
            const newGesture: DetectedGesture = {
              gesture: result.gesture,
              confidence: result.confidence || 0,
              timestamp: Date.now()
            };

            setRecentGestures(prev => {
              const updated = [newGesture, ...prev.slice(0, 4)];
              return updated;
            });

            setDetectedText(prev => {
              const words = prev.split(' ').filter(word => word.length > 0);
              if (words[words.length - 1] !== result.gesture) {
                return prev + (prev ? ' ' : '') + result.gesture;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.8);
  }, [isStreaming]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isStreaming && !isProcessing) {
      intervalId = setInterval(captureFrame, 1000); // Capture every second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming, isProcessing, captureFrame]);

  const clearText = () => {
    setDetectedText("");
    setRecentGestures([]);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(detectedText);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <main className="relative z-0 w-full min-h-screen bg-gradient-to-b from-[#1e0257] to-[#2a065e]">
      <StarsCanvas />
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            ISL to Text Converter
          </h1>
          <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto">
            Use your webcam to convert Indian Sign Language gestures into text in real-time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Video Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 bg-gray-900 rounded-lg object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Camera Off</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  Processing...
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex gap-4 mt-6">
              {!isStreaming ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Stop Camera
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            
            {/* Detected Text */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Detected Text</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 min-h-32 mb-4">
                <p className="text-white text-lg leading-relaxed">
                  {detectedText || "Start using gestures to see text appear here..."}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearText}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Clear
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!detectedText}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Recent Gestures */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Gestures</h3>
              <div className="space-y-2">
                {recentGestures.length > 0 ? (
                  recentGestures.map((gesture, index) => (
                    <div
                      key={gesture.timestamp}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        index === 0 ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-gray-700/30'
                      }`}
                    >
                      <span className="text-white font-medium">{gesture.gesture}</span>
                      <span className="text-gray-400 text-sm">
                        {(gesture.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No gestures detected yet</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}