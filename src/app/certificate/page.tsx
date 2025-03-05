// pages/certificate.tsx
'use client'
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';

interface CertificateData {
  recipientName: string;
  taskDescription: string;
  issuerName: string;
  issueDate: string;
  signatureUrl: string;
  selectedEmoji: string;
}

// Emoji options for certificate
const emojiOptions = [
  "🏆", "🎓", "⭐", "🌟", "🥇", "👑", "🎯", "💯", "🔥", "✨", 
  "📚", "💻", "🖋️", "🧠", "🚀", "🌈", "💪", "🎉", "🎊", "👏"
];

export default function Certificate() {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    recipientName: 'John Doe',
    taskDescription: 'Successfully completed all assigned tasks with excellence',
    issuerName: 'Jane Smith',
    issueDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    signatureUrl: '',
    selectedEmoji: '🏆'
  });

  const [customizing, setCustomizing] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCertificateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignature = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };
    
    const draw = (e: MouseEvent) => {
      if (!isDrawing || !ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };
    
    const stopDrawing = () => {
      isDrawing = false;
      if (canvas) {
        setCertificateData(prev => ({
          ...prev,
          signatureUrl: canvas.toDataURL()
        }));
      }
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Cleanup function
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const cleanupFunction = handleSignature();
      
      // Return cleanup function if one was provided
      return cleanupFunction;
    }
  }, [canvasRef]);

  const generateCertificate = () => {
    setCustomizing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Certificate of Completion 🏆</title>
        <meta name="description" content="Certificate of Completion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {customizing ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">✨ Certificate Customizer ✨</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">👤 Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={certificateData.recipientName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">📝 Task Description</label>
              <textarea
                name="taskDescription"
                value={certificateData.taskDescription}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">🔏 Issuer Name</label>
              <input
                type="text"
                name="issuerName"
                value={certificateData.issuerName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">📅 Issue Date</label>
              <input
                type="text"
                name="issueDate"
                value={certificateData.issueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">🏅 Award Emoji</label>
              <select
                name="selectedEmoji"
                value={certificateData.selectedEmoji}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {emojiOptions.map((emoji, index) => (
                  <option key={index} value={emoji}>
                    {emoji} {emoji === "🏆" ? "Trophy" : 
                           emoji === "🎓" ? "Graduation" : 
                           emoji === "⭐" ? "Star" : 
                           emoji === "🌟" ? "Glowing Star" :
                           emoji === "🥇" ? "Gold Medal" :
                           emoji === "👑" ? "Crown" :
                           emoji === "🎯" ? "Target" :
                           emoji === "💯" ? "100 Points" :
                           emoji === "🔥" ? "Fire" :
                           emoji === "✨" ? "Sparkles" :
                           emoji === "📚" ? "Books" :
                           emoji === "💻" ? "Computer" :
                           emoji === "🖋️" ? "Pen" :
                           emoji === "🧠" ? "Brain" :
                           emoji === "🚀" ? "Rocket" :
                           emoji === "🌈" ? "Rainbow" :
                           emoji === "💪" ? "Strength" :
                           emoji === "🎉" ? "Party" :
                           emoji === "🎊" ? "Confetti" :
                           emoji === "👏" ? "Applause" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">✍️ Signature</label>
              <canvas 
                ref={canvasRef} 
                width={300} 
                height={100} 
                className="border border-gray-300 bg-white w-full"
              />
              <p className="text-sm text-gray-500 mt-1">Click and drag to sign</p>
            </div>
            <button
              onClick={generateCertificate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              🚀 Generate Certificate
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
          <div className="bg-white p-12 rounded-lg shadow-lg max-w-4xl w-full border-8 border-double border-blue-700">
            <div className="text-center">
              <div className="text-6xl mb-4">{certificateData.selectedEmoji}</div>
              <h1 className="text-4xl font-bold text-blue-800 mb-2">Certificate of Completion</h1>
              <div className="w-32 h-1 bg-blue-800 mx-auto mb-8"></div>
              
              <p className="text-lg mb-6">This certifies that</p>
              <h2 className="text-3xl font-bold text-blue-800 font-serif mb-6">{certificateData.recipientName}</h2>
              
              <p className="text-lg mb-10 px-8">
                has {certificateData.taskDescription}
              </p>
              
              <div className="flex justify-between items-end mt-16 px-12">
                <div className="text-center">
                  <div className="w-48 h-px bg-gray-400 mb-2"></div>
                  <p>📅 Date: {certificateData.issueDate}</p>
                </div>
                
                <div className="text-center">
                  {certificateData.signatureUrl && (
                    <img 
                      src={certificateData.signatureUrl} 
                      alt="Signature" 
                      className="h-16 mb-2" 
                    />
                  )}
                  <div className="w-48 h-px bg-gray-400 mb-2"></div>
                  <p>🔏 {certificateData.issuerName}</p>
                </div>
              </div>
              
              <div className="mt-12 mb-6 text-center">
                <p className="text-sm text-gray-500">✅ Officially Certified ✅</p>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-30">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1E40AF" strokeWidth="2" />
                  <path d="M30,50 L45,65 L70,35" stroke="#1E40AF" strokeWidth="3" fill="none" />
                </svg>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-8 left-8 text-4xl opacity-30">✨</div>
              <div className="absolute top-8 right-8 text-4xl opacity-30">✨</div>
              <div className="absolute bottom-8 left-8 text-4xl opacity-30">✨</div>
              <div className="absolute bottom-8 right-8 text-4xl opacity-30">✨</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}