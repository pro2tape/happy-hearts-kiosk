import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from '../constants';
import { Sparkles, Send, X, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';

interface GeminiAssistantProps {
  onClose: () => void;
  onRecommend: (item: MenuItem) => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onClose, onRecommend }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendationText, setRecommendationText] = useState('');
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setRecommendedItems([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const menuContext = JSON.stringify(MENU_ITEMS.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || item.name,
      })));

      const systemInstruction = `
        You are a friendly Barista at 'Happy Hearts Coffee & Prints'.
        Recommend 1 or 2 items from the menu based on the user's mood or request.
        
        The Menu Data is: ${menuContext}
        
        Return ONLY a JSON object with this structure:
        {
          "message": "A short, cheerful message explaining why you picked these.",
          "recommendedIds": ["id1", "id2"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const result = JSON.parse(text);
        setRecommendationText(result.message);
        
        const items = MENU_ITEMS.filter(item => result.recommendedIds.includes(item.id));
        setRecommendedItems(items);
      }

    } catch (err) {
      console.error(err);
      setError('Oops! My brain froze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-brand-orange to-brand-red p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h2 className="font-display font-bold text-xl">AI Barista</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {recommendationText ? (
            <div className="space-y-4">
              <div className="bg-brand-cream p-4 rounded-xl border border-brand-orange/20">
                <p className="text-brand-brown font-medium">"{recommendationText}"</p>
              </div>
              
              <div className="grid gap-3">
                {recommendedItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onRecommend(item)}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:border-brand-orange hover:bg-orange-50 transition-colors text-left group"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-brand-orange group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  setRecommendationText('');
                  setRecommendedItems([]);
                  setPrompt('');
                }}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-800 underline"
              >
                Ask something else
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <p className="text-center text-gray-600 mb-6">
                Tell me what you're craving! E.g., <br/>
                <span className="italic">"Something cold and sweet"</span> or <br/>
                <span className="italic">"I'm hungry for a heavy meal"</span>
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Type here..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-brand-orange/30 rounded-full focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !prompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-orange text-white rounded-full hover:bg-brand-red disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};