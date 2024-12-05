import { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface PreCallChecklistProps {
  onReady: () => void;
}

export default function PreCallChecklist({ onReady }: PreCallChecklistProps) {
  const [devices, setDevices] = useState<{
    audio: MediaDeviceInfo[];
    video: MediaDeviceInfo[];
  }>({ audio: [], video: [] });
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [isTestingVideo, setIsTestingVideo] = useState(false);

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          audio: devices.filter(d => d.kind === 'audioinput'),
          video: devices.filter(d => d.kind === 'videoinput')
        });
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    }

    getDevices();
  }, []);

  const testAudio = async () => {
    setIsTestingAudio(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedAudio }
      });
      // Create audio context and analyzer for testing
      const audioContext = new AudioContext();
      const analyzer = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyzer);
      
      // Cleanup after 3 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsTestingAudio(false);
      }, 3000);
    } catch (error) {
      console.error('Error testing audio:', error);
      setIsTestingAudio(false);
    }
  };

  const testVideo = async () => {
    setIsTestingVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideo }
      });
      // Display video preview
      const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
      
      // Cleanup after 5 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        if (videoElement) {
          videoElement.srcObject = null;
        }
        setIsTestingVideo(false);
      }, 5000);
    } catch (error) {
      console.error('Error testing video:', error);
      setIsTestingVideo(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-900">Pre-call Setup</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Microphone
          </label>
          <select
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {devices.audio.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
          <Button
            onClick={testAudio}
            disabled={isTestingAudio || !selectedAudio}
            className="mt-2"
          >
            {isTestingAudio ? 'Testing...' : 'Test Microphone'}
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Camera
          </label>
          <select
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {devices.video.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
          <Button
            onClick={testVideo}
            disabled={isTestingVideo || !selectedVideo}
            className="mt-2"
          >
            {isTestingVideo ? 'Testing...' : 'Test Camera'}
          </Button>
          {isTestingVideo && (
            <video
              id="videoPreview"
              autoPlay
              playsInline
              muted
              className="mt-2 w-full max-w-md rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onReady}
          disabled={!selectedAudio || !selectedVideo}
          variant="primary"
        >
          Join Call
        </Button>
      </div>
    </div>
  );
}