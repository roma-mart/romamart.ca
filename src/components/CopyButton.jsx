/**
 * Copy Button Component
 * Copies text to clipboard with visual feedback
 * Batch 3: Includes haptic feedback
 */

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard, useVibration } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

const CopyButton = ({ text, label, className = '', showIcon = true }) => {
  const { copyToClipboard } = useClipboard();
  const { showSuccess, showError } = useToast();
  const { vibrate, canVibrate } = useVibration();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    // Haptic feedback on mobile
    if (canVibrate) {
      vibrate(10);
    }
    
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
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-md font-inter text-sm font-medium transition-all hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      aria-label={`Copy ${label || text}`}
    >
      {showIcon && (copied ? <Check size={16} /> : <Copy size={16} />)}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

export default CopyButton;
