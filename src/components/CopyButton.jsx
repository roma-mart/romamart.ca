/**
 * Copy Button Component
 * Copies text to clipboard with visual feedback
 */

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

const CopyButton = ({ text, label, className = '', showIcon = true }) => {
  const { copyToClipboard } = useClipboard();
  const { showSuccess, showError } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const result = await copyToClipboard(text);
    
    if (result.success) {
      setCopied(true);
      showSuccess(`${label || 'Text'} copied!`);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      showError('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-inter text-sm font-medium transition-all hover:opacity-80 ${className}`}
      aria-label={`Copy ${label || text}`}
    >
      {showIcon && (copied ? <Check size={16} /> : <Copy size={16} />)}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

export default CopyButton;
