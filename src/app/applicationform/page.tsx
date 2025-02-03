// app/compose/page.js
"use client";
import { useState, useRef } from "react";
import {
  Send,
  Sparkles,
  Eraser,
  Copy,
  User,
  AtSign,
  Paperclip,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function EmailComposer() {
  const [emailBody, setEmailBody] = useState("");
  const [mood, setMood] = useState("professional");
  const [showCopied, setShowCopied] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const searchParams = useSearchParams();
  const emailid = searchParams.get("emailid");
  const applicant = searchParams.get("applicant");
  const author = searchParams.get("author");
  const subject = searchParams.get("subject");
  const task_id = searchParams.get("task_id");

  const moodEmojis = {
    professional: "👔",
    friendly: "😊",
    formal: "🎩",
    casual: "✌️",
    excited: "🎉",
  };

  const moodQuotes = {
    professional: [
      "I hope this email finds you well.",
      "I appreciate your time in reviewing this matter.",
      "Thank you for your continued collaboration.",
      "Looking forward to your valuable input.",
      "I wanted to touch base regarding...",
    ],
    friendly: [
      "Hope you're having a fantastic day! ☀️",
      "Just thought I'd drop you a quick note...",
      "It was great catching up last time!",
      "Hope you're doing well! I wanted to share...",
      "Hey there! Quick question for you...",
    ],
    formal: [
      "I trust this correspondence finds you well.",
      "I am writing to formally request...",
      "Please find attached the requested documentation.",
      "With reference to our previous discussion...",
      "I am pleased to inform you that...",
    ],
    casual: [
      "Hey! Quick update for you...",
      "Just wanted to let you know...",
      "BTW, I was thinking about...",
      "Here's what's new on my end...",
      "FYI - got some news to share...",
    ],
    excited: [
      "I've got amazing news to share! 🎉",
      "You won't believe what just happened! ✨",
      "I'm thrilled to announce that...",
      "Guess what?! We just...",
      "Super excited to tell you about...",
    ],
  };



  // Helper functions
  const getInspiration = () => {
    const inspirations = [
      "Don't forget to mention something you appreciate about the recipient!",
      "Try starting with an interesting fact or story.",
      "Consider adding a thought-provoking question.",
      "Maybe include a relevant quote?",
      "How about mentioning a shared memory or experience?",
    ];
    setInspiration(
      inspirations[Math.floor(Math.random() * inspirations.length)]
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const insertQuote = (quote) => {
    const personalizedQuote = recipient?.name
      ? quote.replace("you", recipient.name)
      : quote;

    setEmailBody((prevBody) => {
      if (prevBody.trim() === "") {
        return personalizedQuote;
      }
      return `${prevBody}\n\n${personalizedQuote}`;
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type.startsWith("audio/")) return "🎵";
    if (type.includes("pdf")) return "📄";
    if (type.includes("document")) return "📝";
    if (type.includes("spreadsheet")) return "📊";
    return "📎";
  };

  const handleapply = async () => {
    const email_res = await fetch("/api/sendmail", {
      method: "POST",
      body: JSON.stringify({
        sender: applicant, 
        reciever: author,
        body: emailBody, 
        subject: subject, 
      }),
    });

    /*if(email_res.ok) {
      const res = await fetch(`/api/taskapplication/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ applicant: applicant }),
      });
    }*/

      if(email_res.ok) {
        const data = await email_res.json();
        const email_id = data.result._id;

        const res = await fetch(`/api/taskapplication/${task_id}`, {
          method: "PUT",
          body: JSON.stringify({ applicant: applicant, email_id: email_id}),
        });

        const response = await res.json();
        alert(response.message);
      }

    
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-800">
          ✨ Application form ✨ <br></br> {subject}
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
          {/* Recipient Section */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                TO
                <User className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium text-purple-900">{author}</div>
                  <div className="text-sm text-purple-600">task creator</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                FROM
                <AtSign className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium text-purple-900">{applicant}</div>
                  <div className="text-sm text-purple-600">applicant email</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(moodEmojis).map(([moodName, emoji]) => (
              <button
                key={moodName}
                onClick={() => setMood(moodName)}
                className={`px-4 py-2 rounded-full transition-all ${
                  mood === moodName
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {emoji} {moodName}
              </button>
            ))}
          </div>

          <div className="bg-purple-50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-purple-800">
              Suggested openings for {mood} tone:
            </div>
            <div className="flex flex-wrap gap-2">
              {moodQuotes[mood].map((quote, index) => (
                <button
                  key={index}
                  onClick={() => insertQuote(quote)}
                  className="text-sm px-3 py-1.5 bg-white border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                >
                  {quote}
                </button>
              ))}
            </div>
          </div>

          {/* File Attachment Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Paperclip size={20} />
                Add Attachments
              </label>
              {attachments.length > 0 && (
                <span className="text-sm text-gray-500">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getFileIcon(attachment.type)}
                      </span>
                      <div>
                        <div className="text-sm font-medium truncate max-w-xs">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attachment.size}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 hover:bg-red-50 rounded-full group"
                    >
                      <X
                        size={16}
                        className="text-gray-400 group-hover:text-red-500"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Start typing your magical email here..."
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setEmailBody("")}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                title="Clear text"
              >
                <Eraser size={20} />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Copy to clipboard"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={getInspiration}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Sparkles size={20} />
              Need inspiration?
            </button>

            <button
              onClick={handleapply}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!emailBody.trim()}
            >
              <Send size={20} />
              Send with Magic
            </button>
          </div>

          {inspiration && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm italic">
              💡 {inspiration}
            </div>
          )}

          {showCopied && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-600">
              ✓ Copied to clipboard!
            </div>
          )}
        </div>

        <div className="text-center text-sm text-purple-600">
          Characters: {emailBody.length} • Words:{" "}
          {emailBody.trim() ? emailBody.trim().split(/\s+/).length : 0}
          {attachments.length > 0 && ` • Attachments: ${attachments.length}`}
        </div>
      </div>
    </div>
  );
}
