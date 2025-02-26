"use client"; // Use client-side rendering
import { useState } from "react";

export default function HuggingFaceAI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async () => {
    if (!prompt) return;

    setLoading(true);
    setResponse("");

    const HF_API_KEY = "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"; // Replace with your key

    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await res.json();
    console.log(data);
    setResponse(data[0]?.generated_text || "Error generating response.");
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Ask AI (Hugging Face)</h2>
      <textarea
        className="w-full border p-2 mb-2"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={fetchResponse}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Response"}
      </button>
      {response && <p className="mt-2 text-green-600">{response}</p>}
    </div>
  );
}
