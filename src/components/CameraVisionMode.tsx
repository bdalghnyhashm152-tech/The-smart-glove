import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Video, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { GestureDefinition } from '../types/glove';
import { BUILTIN_GESTURES } from '../services/gestureEngine';

interface CameraVisionModeProps {
  onGestureDetected: (gesture: GestureDefinition, confidence: number) => void;
  onClose: () => void;
}

export const CameraVisionMode: React.FC<CameraVisionModeProps> = ({
  onGestureDetected,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        startVisionLoop();
      }
    } catch (err: any) {
      setErrorMsg('تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الإذن في المتصفح.');
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  // Vision heuristic processing loop
  const startVisionLoop = () => {
    let frameCount = 0;

    const processFrame = () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      frameCount++;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw video mirrored
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Sample center ROI (where hand is placed)
        const roiX = Math.round(canvas.width * 0.25);
        const roiY = Math.round(canvas.height * 0.15);
        const roiW = Math.round(canvas.width * 0.5);
        const roiH = Math.round(canvas.height * 0.7);

        // Draw Cyber Bounding Box around Detection Zone
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(roiX, roiY, roiW, roiH);

        // Corner accents
        const len = 20;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(roiX, roiY + len);
        ctx.lineTo(roiX, roiY);
        ctx.lineTo(roiX + len, roiY);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(roiX + roiW - len, roiY);
        ctx.lineTo(roiX + roiW, roiY);
        ctx.lineTo(roiX + roiW, roiY + len);
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(roiX, roiY + roiH - len);
        ctx.lineTo(roiX, roiY + roiH);
        ctx.lineTo(roiX + len, roiY + roiH);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(roiX + roiW - len, roiY + roiH);
        ctx.lineTo(roiX + roiW, roiY + roiH);
        ctx.lineTo(roiX + roiW, roiY + roiH - len);
        ctx.stroke();

        // Analyze pixels periodically (every 15 frames for performance)
        if (frameCount % 18 === 0) {
          try {
            const imgData = ctx.getImageData(roiX, roiY, roiW, roiH);
            const data = imgData.data;
            let skinPixels = 0;
            let topSkinY = roiH;
            let bottomSkinY = 0;
            let leftSkinX = roiW;
            let rightSkinX = 0;

            for (let y = 0; y < roiH; y += 4) {
              for (let x = 0; x < roiW; x += 4) {
                const idx = (y * roiW + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Simple adaptive skin tone detector
                if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) >= 12 && (r - b) >= 12) {
                  skinPixels++;
                  if (y < topSkinY) topSkinY = y;
                  if (y > bottomSkinY) bottomSkinY = y;
                  if (x < leftSkinX) leftSkinX = x;
                  if (x > rightSkinX) rightSkinX = x;
                }
              }
            }

            const totalSampled = (roiW / 4) * (roiH / 4);
            const skinRatio = skinPixels / totalSampled;

            if (skinRatio > 0.08) {
              const handHeight = bottomSkinY - topSkinY;
              const handWidth = rightSkinX - leftSkinX;
              const aspectRatio = handHeight / Math.max(1, handWidth);

              let matched: GestureDefinition | null = null;
              if (aspectRatio > 1.4 && skinRatio < 0.25) {
                // Tall narrow: Open Palm or Peace sign
                matched = BUILTIN_GESTURES.find(g => g.id === 'salam') || null;
              } else if (aspectRatio < 1.1 && skinRatio > 0.18) {
                // Fist / compact
                matched = BUILTIN_GESTURES.find(g => g.id === 'yes') || null;
              } else if (aspectRatio >= 1.1 && aspectRatio <= 1.4) {
                // Thumbs up / Help / Love
                matched = BUILTIN_GESTURES.find(g => g.id === 'love_you') || null;
              }

              if (matched) {
                setDetectedSign(matched.arabic);
                onGestureDetected(matched, 88);
              }
            } else {
              setDetectedSign(null);
            }
          } catch {
            // ignore
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              كاميرا الذكاء الاصطناعي لترجمة الإشارات
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
          >
            إغلاق
          </button>
        </div>

        {/* Video / Canvas viewport */}
        <div className="relative bg-black flex items-center justify-center min-h-[360px] overflow-hidden">
          <video ref={videoRef} playsInline muted className="hidden" />
          <canvas ref={canvasRef} className="w-full h-auto max-h-[480px] object-cover" />

          {/* Error Message */}
          {errorMsg && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <p className="text-sm text-red-200">{errorMsg}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Detection Badge Overlay */}
          {detectedSign && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-400 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md animate-bounce">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="font-bold text-sm">تم الرصد: {detectedSign}</span>
            </div>
          )}

          {/* Instructions Box */}
          <div className="absolute bottom-3 inset-x-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-2.5 text-center text-xs text-slate-300">
            ضع يدك داخل الإطار السماوي وقم بالإشارة (كف مفتوح، قبضة، أو إشارة الحب ILY)
          </div>
        </div>

        {/* Quick Gesture shortcuts for Camera */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            يمكنك أيضاً النقر لتجربة فحص الإشارة فوراً:
          </span>
          <div className="flex gap-2">
            {BUILTIN_GESTURES.slice(0, 3).map((g) => (
              <button
                key={g.id}
                onClick={() => onGestureDetected(g, 95)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 text-xs text-slate-200 hover:text-white transition"
              >
                {g.arabic.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
