import { useState, useRef } from "react";
import { X, Mic, Upload, Languages, Send, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TranslationModalProps {
  onClose: () => void;
  riderPhone?: string;
}

const TranslationModal = ({ onClose, riderPhone }: TranslationModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
    }
  };

  const translateAudio = async () => {
    if (!audioBlob) {
      toast({
        description: "Please record or upload audio first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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
      setTranslatedText(data.transcript);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Error",
        description: "Failed to translate audio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      toast({
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const sendToUser = async () => {
    if (!translatedText) {
      toast({
        description: "Please translate some audio first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // In a real app, this would be an API call to your SMS/messaging service
      // For demo purposes, we'll just simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "Translation has been sent to the user",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message to user",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Languages className="h-5 w-5 text-driver-primary" />
            <h2 className="text-xl font-semibold">Audio Translation</h2>
          </div>

          <div className="space-y-6">
            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="flex items-center space-x-2"
              >
                <Mic className="h-4 w-4" />
                <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("audio-upload")?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Audio</span>
                </Button>
              </div>
            </div>

            {/* Audio Status */}
            {audioBlob && (
              <div className="text-center text-sm text-gray-500">
                Audio {isRecording ? "recording..." : "ready for translation"}
              </div>
            )}

            {/* Translate Button */}
            <Button
              onClick={translateAudio}
              disabled={!audioBlob || isLoading}
              className="w-full"
            >
              {isLoading ? "Translating..." : "Translate Audio"}
            </Button>

            {/* Translation Result */}
            {translatedText && (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Translation Result
                    </label>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={sendToUser}
                        disabled={isSending}
                        className="flex items-center space-x-1 text-driver-primary"
                      >
                        <Send className="h-4 w-4" />
                        <span>{isSending ? "Sending..." : "Send to User"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm">
                    {translatedText}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal; 
