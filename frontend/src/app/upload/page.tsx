'use client';

import { useState } from 'react';

export default function SignUploader() {
    const [video, setVideo] = useState<File | null>(null);
    const [label, setLabel] = useState('');
    const [status, setStatus] = useState('');

    const handleUpload = async () => {
        if (!video || !label.trim()) {
            alert('Please select a video and provide a one-word label.');
            return;
        }

        const formData = new FormData();
        formData.append('video', video);
        formData.append('label', label);

        setStatus('Uploading...');
        const res = await fetch('/api/upload-sign', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setStatus(data.message || 'Upload done');
        setVideo(null);
        setLabel('');
    };

    return (
        <div className="p-4 border rounded max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload New Sign</h2>
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
                className="mb-2"
            />
            <input
                type="text"
                placeholder="e.g. hello"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full p-2 border mb-3"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Upload
            </button>
            {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
        </div>
    );
}