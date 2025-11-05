import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateWithAIModal = ({isOpen, onClose}) => {

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Please paste some text to generate an invoice.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text });
      const invoiceData = response.data;
      
      toast.success('Invoice data extracted successfully!');
      onClose();
      
      // Navigate to create invoice page with the parsed data
      navigate('/invoices/new', { state: { aiData: invoiceData } });

    } catch (error) {
      toast.error('Failed to generate invoice from text.');
      console.error('AI parsing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if(!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="card-clean max-w-2xl w-full p-8 relative text-left transform transition-all z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4FADC0]/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#4FADC0]" />
              </div>
              Create Invoice with AI
            </h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Paste any text that contains invoice details (like client name, items, quantities, and prices) and the AI will attempt to create an invoice from it.
            </p>
            <div>
              <TextareaField 
                name="invoiceText"
                label="Paste Invoice Text Here"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., 'Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 logo for $800'"
                rows={10}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleGenerate} isLoading={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Invoice'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWithAIModal