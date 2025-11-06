import React, { useState, useEffect } from 'react';
import { Loader2, Mail, Copy, Check } from 'lucide-react';
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ReminderModal = ({isOpen, onClose, invoiceId}) => {

  const [reminderText, setReminderText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      const generateReminder = async () => {
        setIsLoading(true);
        setReminderText('');
        try {
          const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, { invoiceId });
          // Backend returns emailContent, not reminderText
          const emailContent = response.data.emailContent || response.data.reminderText || '';
          // Handle case where response.text might be a function
          const text = typeof emailContent === 'function' ? emailContent() : emailContent;
          setReminderText(text || 'No reminder text generated.');
        } catch (error) {
          toast.error('Failed to generate reminder.');
          console.error('AI reminder error:', error);
          setReminderText('Failed to generate reminder. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      generateReminder();
    } else {
      // Reset when modal closes
      setReminderText('');
    }
  }, [isOpen, invoiceId]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reminderText);
    setHasCopied(true);
    toast.success('Reminder copied to clipboard! Paste it into your email client to send.');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleOpenEmailClient = () => {
    if (!reminderText) return;
    
    // Extract subject if it exists in the format "Subject: ..."
    const subjectMatch = reminderText.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Invoice Payment Reminder';
    
    // Remove "Subject: ..." line from body if it exists
    const bodyText = reminderText.replace(/Subject:\s*.+/i, '').trim();
    
    // Open Gmail compose window with pre-filled subject and body
    // Gmail compose URL format: https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=SUBJECT&body=BODY
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, '_blank');
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="card-clean max-w-2xl w-full p-8 relative text-left transform transition-all z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4FADC0]/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#4FADC0]" />
              </div>
              AI-Generated Reminder
            </h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-[#4FADC0] mb-4" />
              <p className="text-[var(--text-secondary)]">Generating reminder email...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#4FADC0]/10 border border-[#4FADC0]/20 rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">What's next?</strong> Copy the reminder text below and paste it into your email client (Gmail, Outlook, etc.) to send it to your client.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Reminder Email Content
                </label>
                <textarea
                  name="reminderText"
                  value={reminderText}
                  readOnly
                  rows={12}
                  className="w-full min-h-[200px] pr-3 py-3 pl-3 border border-white/10 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-vertical focus:outline-none focus:ring-2 focus:ring-[#4FADC0]/60 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            {reminderText && (
              <Button 
                variant="outline" 
                onClick={handleOpenEmailClient}
                disabled={isLoading || !reminderText}
              >
                Open Email
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={handleCopyToClipboard} 
              icon={hasCopied ? Check : Copy} 
              disabled={isLoading || !reminderText}
            >
              {hasCopied ? 'Copied!' : 'Copy Text'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReminderModal