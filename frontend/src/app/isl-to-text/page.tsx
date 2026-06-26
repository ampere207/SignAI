"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { StarsCanvas } from "@/components/home";
import Link from "next/link";

interface DetectedGesture {
  gesture: string;
  confidence: number;
  timestamp: number;
}

interface ChatMessage {
  timestamp: string;
  raw_text: string;
  corrected_text: string;
  kannada_text: string;
  speaker: "deaf" | "hearing";
}

const gestureToKannada: Record<string, string> = {
  "College": "ಕಾಲೇಜು",
  "Doctor": "ವೈದ್ಯರು",
  "Food": "ಆಹಾರ",
  "Friend": "ಸ್ನೇಹಿತ",
  "Go": "ಹೋಗು",
  "Good Morning": "ಶುಭೋದಯ",
  "Good Night": "ಶುಭ ರಾತ್ರಿ",
  "Good": "ಒಳ್ಳೆಯದು",
  "Happy": "ಸಂತೋಷ",
  "He": "ಅವನು",
  "Hello": "ಹಲೋ",
  "Help": "ಸಹಾಯ",
  "Home": "ಮನೆ",
  "Hospital": "ಆಸ್ಪತ್ರೆ",
  "I": "ನಾನು",
  "Namaste": "ನಮಸ್ತೆ",
  "No": "ಇಲ್ಲ",
  "She": "ಅವಳು",
  "Sleep": "ನಿದ್ರೆ",
  "Sorry": "ಕ್ಷಮಿಸಿ",
  "Thank You": "ಧನ್ಯವಾದಗಳು",
  "Today": "ಇಂದು",
  "Want": "ಬೇಕು",
  "Water": "ನೀರು",
  "Welcome": "ಸ್ವಾಗತ",
  "What": "ಏನು",
  "When": "ಯಾವಾಗ",
  "Who": "ಯಾರು",
  "Yes": "ಹೌದು",
  "You": "ನೀನು",
  "Ache": "ನೋವು",
  "Bad": "ಕೆಟ್ಟದ್ದು",
  "Beautiful": "ಸುಂದರ",
  "Book": "ಪುಸ್ತಕ",
  "Brother": "ಸಹೋದರ",
  "Cold": "ಶೀತ",
  "Come": "ಬಾ",
  "Deaf": "ಕಿವುಡ",
  "Eat": "ತಿನ್ನು",
  "Family": "ಕುಟುಂಬ",
  "Father": "ತಂದೆ",
  "Fever": "ಜ್ವರ",
  "Give": "ಕೊಡು",
  "Hearing": "ಕೇಳುವಿಕೆ",
  "How": "ಹೇಗೆ",
  "Love": "ಪ್ರೀತಿ",
  "Medicine": "ಔಷಧಿ",
  "Mother": "ತಾಯಿ",
  "Name": "ಹೆಸರು",
  "Please": "ದಯವಿಟ್ಟು",
  "School": "ಶಾಲೆ",
  "Sister": "ಸಹೋದರಿ",
  "Stop": "ನಿಲ್ಲಿಸು",
  "Teacher": "ಶಿಕ್ಷಕ",
  "Thankful": "ಕೃತಜ್ಞ",
  "Time": "ಸಮಯ",
  "Tomorrow": "ನಾಳೆ",
  "Understand": "ಅರ್ಥ ಮಾಡಿಕೊ",
  "Wash": "ತೊಳೆಯಿರಿ",
  "Where": "ಎಲ್ಲಿ"
};

const getKannadaBuffer = (englishText: string): string => {
  if (!englishText) return "";
  return englishText
    .split(" ")
    .map(word => {
      const cleanWord = word.replace(/[!,.?]/g, "");
      return gestureToKannada[cleanWord] || gestureToKannada[word] || word;
    })
    .join(" ");
};

export default function ISLToTextPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedText, setDetectedText] = useState<string>("");
  const [recentGestures, setRecentGestures] = useState<DetectedGesture[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Feature 2: Language state (English vs Kannada)
  const [language, setLanguage] = useState<"English" | "Kannada">("English");

  // Feature 3: Chat history state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  // Initialize state from local storage (equivalent to st.session_state)
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("signai_language");
    if (savedLanguage === "English" || savedLanguage === "Kannada") {
      setLanguage(savedLanguage);
    }
    const savedHistory = window.localStorage.getItem("signai_chat_history");
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
  }, []);

  // Set language and persist
  const handleLanguageChange = (lang: "English" | "Kannada") => {
    setLanguage(lang);
    window.localStorage.setItem("signai_language", lang);
  };

  // Set chat history and persist
  const saveChatHistory = (history: ChatMessage[]) => {
    setChatHistory(history);
    window.localStorage.setItem("signai_chat_history", JSON.stringify(history));
  };

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
          if (result.gesture && result.gesture !== 'No gesture detected' && result.gesture !== 'Buffering...' && (result.confidence || 0) >= 0.85) {
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
      intervalId = setInterval(captureFrame, 100); // Capture frame every 100ms for real-time sliding window
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming, isProcessing, captureFrame]);

  const clearText = () => {
    setDetectedText("");
    setRecentGestures([]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Play audio generated by Kannada TTS
  const playKannadaAudio = (text: string) => {
    try {
      const url = `http://localhost:8000/video/tts?text=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      audio.play().catch(err => {
        console.error("TTS audio play failed:", err);
      });
    } catch (err) {
      console.error("Failed to play TTS audio:", err);
    }
  };

  // Feature 1 & 2: Grammar correction and send to Chat Log
  const handleCorrectAndSend = async () => {
    if (!detectedText.trim()) return;
    setIsSending(true);
    try {
      // 1. Correct Grammar
      const grammarRes = await fetch("http://localhost:8000/video/correct-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: detectedText }),
      });
      if (!grammarRes.ok) throw new Error("Grammar API call failed");
      const grammarData = await grammarRes.json();
      const corrected = grammarData.corrected_text;

      // 2. Translation to Kannada
      let kannada = "";
      if (language === "Kannada") {
        const transRes = await fetch("http://localhost:8000/video/translate-kannada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: corrected }),
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          kannada = transData.translated_text;
        }
      }

      // 3. Create message
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: ChatMessage = {
        timestamp,
        raw_text: detectedText,
        corrected_text: corrected,
        kannada_text: kannada,
        speaker: "deaf"
      };

      const updatedHistory = [...chatHistory, newMsg];
      saveChatHistory(updatedHistory);
      clearText();

      // Trigger automatic TTS playback if in Kannada mode
      if (language === "Kannada" && kannada) {
        playKannadaAudio(kannada);
      }

    } catch (err) {
      console.error("Send message error:", err);
      alert("Failed to process grammar correction or translation.");
    } finally {
      setIsSending(false);
    }
  };

  // Reply from Hearing Person
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      let kannada = "";
      if (language === "Kannada") {
        const transRes = await fetch("http://localhost:8000/video/translate-kannada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: replyText }),
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          kannada = transData.translated_text;
        }
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: ChatMessage = {
        timestamp,
        raw_text: "",
        corrected_text: replyText,
        kannada_text: kannada,
        speaker: "hearing"
      };

      const updatedHistory = [...chatHistory, newMsg];
      saveChatHistory(updatedHistory);
      setReplyText("");

      if (language === "Kannada" && kannada) {
        playKannadaAudio(kannada);
      }
    } catch (err) {
      console.error("Send reply error:", err);
      alert("Failed to translate or send reply.");
    } finally {
      setIsSending(false);
    }
  };

  // Feature 3: Session PDF Export
  const handleExportPDF = async () => {
    if (chatHistory.length === 0) {
      alert("Cannot export empty conversation session.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/video/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_history: chatHistory,
          session_id: "SESSION-" + Date.now().toString().slice(-6)
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `signai_session_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to export session PDF.");
      }
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to export PDF due to network error.");
    }
  };

  const clearChatHistory = () => {
    if (confirm("Are you sure you want to clear the conversation log?")) {
      saveChatHistory([]);
    }
  };

  return (
    <main className="relative z-0 w-full min-h-screen bg-gradient-to-b from-[#1e0257] to-[#2a065e]">
      <StarsCanvas />

      {/* Header with Nav Controls */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Toggle Control */}
            <div className="bg-black/40 border border-purple-500/20 rounded-lg p-1 flex">
              <button
                onClick={() => handleLanguageChange("English")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === "English"
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("Kannada")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === "Kannada"
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
            </div>

            {/* PDF Export Button */}
            <button
              onClick={handleExportPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Session PDF
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
          ISL to Text Conversation
        </h1>
        <p className="text-sm md:text-base text-gray-300 text-center max-w-2xl mx-auto px-4 mb-6">
          Capture signs via webcam, verify or auto-correct grammar, translate, and chat interactively.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Column: Video and Camera (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6">
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

            {/* Recent Gestures Log */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Detected Gestures Feed</h3>
              <div className="space-y-2">
                {recentGestures.length > 0 ? (
                  recentGestures.map((gesture) => (
                    <div
                      key={gesture.timestamp}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-700/30 border border-purple-500/10"
                    >
                      <span className="text-white font-medium">
                        {gesture.gesture}
                        {language === "Kannada" && (
                          <span className="text-red-300 ml-2 text-sm font-normal">
                            ({gestureToKannada[gesture.gesture.replace(/[!,.?]/g, "")] || gesture.gesture})
                          </span>
                        )}
                      </span>
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

          {/* Right Column: Sentence Buffer & Chat History (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Raw Gesture Sentence Buffer */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Gesture Sentence Buffer</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 min-h-[96px] mb-4 border border-purple-500/10">
                <p className="text-white text-lg leading-relaxed font-mono">
                  {detectedText || "Webcam gestures will construct raw sign text here..."}
                </p>
                {language === "Kannada" && detectedText && (
                  <p className="text-red-300 text-lg leading-relaxed font-mono mt-2 border-t border-purple-500/20 pt-2">
                    {getKannadaBuffer(detectedText)}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={clearText}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => copyToClipboard(detectedText)}
                    disabled={!detectedText}
                    className="bg-purple-800 hover:bg-purple-900 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                  >
                    Copy Raw
                  </button>
                </div>

                <button
                  onClick={handleCorrectAndSend}
                  disabled={!detectedText || isSending}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 text-sm"
                >
                  {isSending ? "Processing..." : "Correct & Send"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conversation Log / Chat Area */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-4 border-b border-purple-500/20 pb-3">
                <h3 className="text-xl font-semibold text-white">Conversation Log</h3>
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Clear Log
                  </button>
                )}
              </div>

              {/* Chat Messages scroll area */}
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] mb-4 pr-2 scrollbar-thin">
                {chatHistory.length > 0 ? (
                  chatHistory.map((msg, index) => {
                    const isDeaf = msg.speaker === "deaf";
                    return (
                      <div
                        key={index}
                        className={`flex flex-col max-w-[85%] rounded-xl p-4 ${isDeaf
                          ? "bg-purple-900/30 border border-purple-500/20 mr-auto align-start"
                          : "bg-blue-900/30 border border-blue-500/20 ml-auto align-end text-right"
                          }`}
                      >
                        <div className="flex justify-between items-center gap-6 mb-1 text-[11px] text-gray-400">
                          <span className="font-semibold text-purple-300">
                            {isDeaf ? "Deaf (Gestures)" : "Hearing (Speaker)"}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Raw Prediction (only for Deaf signer) */}
                        {isDeaf && msg.raw_text && (
                          <p className="text-xs text-gray-400 italic mb-1 font-mono">
                            Raw signs: {msg.raw_text}
                          </p>
                        )}

                        {/* Corrected / Typed Text */}
                        <p className="text-white text-base font-medium mb-1">
                          {msg.corrected_text}
                        </p>

                        {/* Kannada Translation (if any) */}
                        {msg.kannada_text && (
                          <div className={`mt-2 p-2 rounded-lg bg-black/30 border border-purple-500/10 flex items-center gap-3 ${isDeaf ? 'justify-start' : 'justify-end'}`}>
                            <span className="text-red-300 font-medium text-sm">
                              {msg.kannada_text}
                            </span>
                            <button
                              onClick={() => playKannadaAudio(msg.kannada_text)}
                              className="text-purple-300 hover:text-white p-1 rounded hover:bg-purple-950 transition-colors"
                              title="Play audio translation"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center py-12">
                    No active chat transcript. Sign words above and click "Correct & Send", or have the hearing speaker type a reply below.
                  </p>
                )}
              </div>

              {/* Hearing Person Input Box */}
              <div className="border-t border-purple-500/20 pt-4 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSending) handleSendReply();
                  }}
                  placeholder="Type a reply for the signer..."
                  className="flex-1 bg-gray-900/50 border border-purple-500/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm"
                >
                  Send
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}