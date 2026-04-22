"use client";
import { motion, AnimatePresence } from "framer-motion";

interface CompletionModalProps {
  isOpen: boolean;
  onSelectMood: (emoji: string) => void;
}

const emojis = [
  { icon: "😌", label: "Relieved" },
  { icon: "🤩", label: "Proud" },
  { icon: "🥱", label: "Exhausted" },
];

export function CompletionModal({ isOpen, onSelectMood }: CompletionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="p-8 text-center bg-white shadow-xl rounded-3xl w-80"
          >
            <h2 className="mb-2 text-2xl font-semibold text-slate-800">Great Job! 🎉</h2>
            <p className="mb-6 text-sm text-slate-500">How are you feeling after finishing this?</p>
            <div className="flex justify-center gap-4">
              {emojis.map((emoji) => (
                <button
                  key={emoji.label}
                  onClick={() => onSelectMood(emoji.icon)}
                  className="flex flex-col items-center p-3 transition-transform bg-slate-50 hover:bg-sky-50 rounded-2xl hover:scale-110"
                >
                  <span className="text-4xl">{emoji.icon}</span>
                  <span className="mt-2 text-xs font-medium text-slate-600">{emoji.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}