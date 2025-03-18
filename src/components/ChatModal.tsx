import { useState, useRef, useEffect } from "react";
import { X, Mic, Send, Languages, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TranslationModal from "./TranslationModal";

interface Message {
  id: string;
  text: string;
  sender: 'driver' | 'rider';
  timestamp: Date;
  isTranslated?: boolean;
}

interface ChatModalProps {
  onClose: () => void;
  riderName: string;
  riderPhone: string;
  needsTranslation?: boolean;
  riderId: string;
}

const ChatModal = ({ onClose, riderName, riderPhone, needsTranslation, riderId }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        handleAudioTranslation(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioTranslation = async (audioBlob: Blob) => {
    const form = new FormData();
    form.append("with_diarization", "false");
    form.append("num_speakers", "1");
    form.append("model", "saaras:flash");
    form.append("file", audioBlob);

    try {
      const response = await fetch("https://api.sarvam.ai/speech-to-text-translate", {
        method: "POST",
        headers: {
          "api-subscription-key": "",
        },
        body: form,
      });

      const data = await response.json();
      if (data.transcript) {
        handleSendMessage(data.transcript, true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate audio",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = (text: string, isTranslated: boolean = false) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'driver',
      timestamp: new Date(),
      isTranslated
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };

  const handleCall = () => {
    toast({
      description: "Calling rider...",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 h-[600px] flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-driver-primary text-white rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {riderName.charAt(0)}
            </div>
            <div>
              <h2 className="font-medium">{riderName}</h2>
              <p className="text-sm opacity-90">Tap to view profile</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {needsTranslation && (
              <button
                onClick={() => setShowTranslation(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Languages className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleCall}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'driver'
                    ? 'bg-driver-primary text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.isTranslated && ' · Translated'}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className="shrink-0"
            >
              <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-driver-primary"
            />
            <Button
              onClick={() => handleSendMessage(newMessage)}
              disabled={!newMessage.trim()}
              className="shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Translation Modal */}
      {showTranslation && (
        <TranslationModal onClose={() => setShowTranslation(false)} />
      )}
    </div>
  );
};

export default ChatModal; 
