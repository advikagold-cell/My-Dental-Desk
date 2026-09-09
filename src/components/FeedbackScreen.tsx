import React, { useState } from 'react';
import { MessageSquare, Send, Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeedbackScreen: React.FC = () => {
  const { showToast, setCurrentScreen } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<'feature' | 'bug' | 'praise' | 'other'>('feature');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitted(true);
    showToast('Thank you for helping improve DentalDesk! Feedback sent.', 'success');
  };

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto w-full">
      <div className="bg-white rounded-3xl p-6 shadow-2xs border border-gray-100">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#9B59D0]/10 text-[#9B59D0] flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-[#2B2D33]">Practitioner Feedback</h2>
            <p className="text-xs text-[#767B87]">
              Help us tailor DentalDesk for clinical chairside workflows
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 text-[#1E8E5A] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2D33]">Feedback Received!</h3>
            <p className="text-xs text-[#767B87] max-w-xs mx-auto">
              We review practitioner feedback with every app update to improve dental practice ergonomics.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="px-6 py-2.5 bg-[#1E88C7] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                Chairside Experience Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 rounded-xl hover:bg-amber-50 text-amber-400 transition-colors"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? 'fill-amber-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'feature', label: 'Feature Request' },
                  { id: 'bug', label: 'Report Issue' },
                  { id: 'praise', label: 'Workflow Praise' },
                  { id: 'other', label: 'General' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`p-2 rounded-xl font-bold border transition-all text-center ${
                      category === cat.id
                        ? 'bg-[#9B59D0] text-white border-[#9B59D0]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                Your Comments & Suggestions
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What features or odontogram improvements would help your practice run smoother?"
                className="w-full p-3 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] focus:outline-none focus:border-[#1E88C7]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#9B59D0] hover:bg-[#8847bd] text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send size={15} />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
