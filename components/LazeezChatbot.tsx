
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Send, Sparkles, User, Bot, Loader2, Minimize2, Plus, Check, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { RESTAURANTS } from '../constants';
import { useCart } from './CartContext';
import { MenuItem } from '../types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  suggestions?: MenuItem[];
}

const SuggestionItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { items, addToCart, removeFromCart } = useCart();
  const [added, setAdded] = useState(false);
  
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 hover:border-red-200 transition-colors">
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
        <div className="text-[10px] text-gray-500 truncate">₹{item.price}</div>
      </div>
      
      {quantity === 0 ? (
        <button 
          onClick={handleAdd}
          disabled={added}
          className={`p-2 rounded-lg transition-all ${added ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
          title={added ? "Added" : "Add to Cart"}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      ) : (
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden h-8">
           <button 
             onClick={() => removeFromCart(item.id)}
             className="px-2 h-full hover:bg-gray-200 text-gray-600 flex items-center justify-center"
           >
             <Minus size={12} />
           </button>
           <span className="px-2 text-xs font-bold text-gray-800">{quantity}</span>
           <button 
             onClick={() => addToCart(item)}
             className="px-2 h-full hover:bg-gray-200 text-green-600 flex items-center justify-center"
           >
             <Plus size={12} />
           </button>
        </div>
      )}
    </div>
  );
};

export const LazeezChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: "Hi! I'm **Lazeez AI**. Tell me how you're feeling (e.g., 'stressed', 'party mood', 'sick'), and I'll suggest the perfect food from our menu that you can add directly to your cart!" 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const model = 'gemini-2.5-flash';
      
      // Prepare menu context
      const allItems = RESTAURANTS.flatMap(r => r.menu.map(m => ({
        ...m, 
        restaurantName: r.name,
        contextString: `${m.id}: ${m.name} (${r.name}) - ${m.description} - ₹${m.price}`
      })));

      const menuContext = allItems.map(i => i.contextString).join('\n');

      const systemPrompt = `You are Lazeez AI, a food concierge.
      Analyze the user's mood/request and recommend 2-3 specific items from the MENU_ITEMS list below.
      
      Rules:
      1. Return a JSON object with:
         - "reply": A witty, empathetic, conversational message (max 40 words) formatted in Markdown.
         - "item_ids": An array of the exact IDs of the recommended items.
      2. Only recommend items present in the list.
      
      MENU_ITEMS:
      ${menuContext}
      
      User says: ${userMessage.text}`;

      const result = await ai.models.generateContent({
        model: model,
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              item_ids: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            }
          }
        }
      });

      const responseText = result.text;
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(responseText || "{}");
      } catch (e) {
        parsedResponse = { reply: "I found some options but got confused. Try again?", item_ids: [] };
      }

      const suggestedItems = parsedResponse.item_ids 
        ? allItems.filter(item => parsedResponse.item_ids.includes(item.id))
        : [];

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        text: parsedResponse.reply,
        suggestions: suggestedItems
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "Oops! My brain froze like a Kulfi. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">AI</div>
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300 max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Lazeez AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] opacity-90">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 min-h-[300px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-red-100'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-gray-600" /> : <Sparkles size={14} className="text-red-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gray-800 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    <ReactMarkdown 
                      components={{
                        strong: ({node, ...props}) => <span className="font-bold text-red-600" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Suggested Items Cards */}
                {msg.role === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="ml-10 flex flex-col gap-2 w-[85%]">
                    {msg.suggestions.map((item) => (
                      <SuggestionItem key={item.id} item={item} />
                    ))}
                  </div>
                )}

              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                   <Loader2 size={14} className="text-red-600 animate-spin" />
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="I'm feeling..." 
              className="flex-1 bg-gray-100 text-gray-800 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};