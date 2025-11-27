
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, Sparkles, Send, Loader2, Smile, Frown, PartyPopper, BatteryLow } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { RESTAURANTS } from '../constants';
import { DishCard } from './DishCard';
import { MenuItem } from '../types';

export const AIRecommendations: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    performSearch(query);
  };

  const performSearch = async (searchText: string) => {
    setLoading(true);
    setResponse('');
    setRecommendedItems([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const model = 'gemini-2.5-flash';
      
      // Flatten menu for context
      const allItems = RESTAURANTS.flatMap(r => r.menu.map(m => ({
        ...m, 
        restaurantName: r.name,
        contextString: `ID:${m.id} | Dish:${m.name} | Rest:${r.name} | Desc:${m.description} | Price:₹${m.price} | Tags:${r.cuisineTags.join(',')}`
      })));

      // Limit context size if needed, but Flash handles large context well. 
      // We'll send the whole menu context for best accuracy.
      const menuContext = allItems.map(i => i.contextString).join('\n');

      const systemPrompt = `You are "Lazeez AI", a food expert for Delhi NCR. 
      The user will tell you how they are feeling or what they want to eat.
      
      Your task:
      1. Analyze the User's Query/Mood.
      2. Select 3-4 distinct items from the provided MENU_LIST that perfectly match the mood.
      3. Return a JSON object containing:
         - "explanation": A conversational, appetizing message describing why you picked these (max 150 words). Use Markdown for emphasis.
         - "item_ids": An array of the exact IDs of the recommended items from the menu list.

      MENU_LIST:
      ${menuContext}
      `;

      const finalPrompt = `${systemPrompt}\n\nUser Mood/Query: ${searchText}`;

      const result = await ai.models.generateContent({
        model: model,
        contents: finalPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              item_ids: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            }
          }
        }
      });

      const jsonResponse = JSON.parse(result.text || "{}");
      
      setResponse(jsonResponse.explanation || "Here are some suggestions for you!");
      
      if (jsonResponse.item_ids && Array.isArray(jsonResponse.item_ids)) {
         const suggestions = allItems.filter(item => jsonResponse.item_ids.includes(item.id));
         setRecommendedItems(suggestions);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setResponse("Oops! It seems my taste buds are offline (API Error). Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-[80vh]">
      <div className="text-center mb-10">
         <div className="inline-block p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="text-white w-8 h-8" />
         </div>
         <h1 className="text-3xl font-bold text-gray-900 mb-2">Mood & Food Matcher</h1>
         <p className="text-gray-500">Tell me how you're feeling, and I'll find the perfect Delhi dish for you.</p>
      </div>

      {/* Mood Chips */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
         <button 
            onClick={() => { setQuery("I'm feeling Happy & Celebratory!"); performSearch("Happy & Celebratory"); }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors"
         >
            <Smile size={18} /> Happy
         </button>
         <button 
            onClick={() => { setQuery("I'm feeling Sad and need comfort food."); performSearch("Sad, need comfort food"); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
         >
            <Frown size={18} /> Low / Sad
         </button>
         <button 
            onClick={() => { setQuery("I'm feeling energetic and want to party!"); performSearch("Energetic, party mode"); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
         >
            <PartyPopper size={18} /> Party Mode
         </button>
         <button 
            onClick={() => { setQuery("I'm tired and hungry."); performSearch("Tired and super hungry"); }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
         >
            <BatteryLow size={18} /> Tired
         </button>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl mx-auto">
         <input 
           type="text" 
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Or type here... e.g. 'Stressed about exams', 'Missing home', 'Spicy food'" 
           className="w-full pl-6 pr-14 py-4 text-lg rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
         />
         <button 
           type="submit" 
           disabled={loading}
           className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
         </button>
      </form>

      {response && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in">
           <div className="prose prose-red max-w-none text-center mx-auto mb-8">
             <ReactMarkdown>{response}</ReactMarkdown>
           </div>

           {recommendedItems.length > 0 && (
             <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 justify-center">
                  <Sparkles className="text-yellow-500" size={20} /> 
                  Top Picks for You
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedItems.map(item => (
                    <div key={item.id} className="h-full border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <DishCard item={item} />
                    </div>
                  ))}
                </div>
             </div>
           )}
           
           <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 italic">AI generated recommendations based on your mood.</p>
           </div>
        </div>
      )}
    </div>
  );
};
