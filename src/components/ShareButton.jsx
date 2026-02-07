/**
 * Share Button Component
 * Uses Web Share API with fallback to copy link
 * Batch 3: Includes haptic feedback
 */

import React from 'react';
import { Share2 } from 'lucide-react';
import { useShare, useClipboard, useVibration } from '../hooks/useBrowserFeatures';
import { useToast } from './ToastContainer';

const ShareButton = ({ title, text, url, className = '', style: customStyle = {} }) => {
  const { share, canShare } = useShare();
  const { copyToClipboard } = useClipboard();
  const { showSuccess, showError } = useToast();
  const { vibrate, canVibrate } = useVibration();

  const handleShare = async () => {
    // Haptic feedback on mobile
    if (canVibrate) {
      vibrate(10);
    }
    const shareData = {
      title: title || 'Roma Mart',
      text: text || 'Check out Roma Mart!',
      url: url || window.location.href
    };

    if (canShare) {
      const result = await share(shareData);
      if (result.success) {
        showSuccess('Shared successfully!');
      } else if (result.error !== 'Share cancelled') {
        // Fallback to copy link
        const copyResult = await copyToClipboard(shareData.url);
        if (copyResult.success) {
          showSuccess('Link copied to clipboard!');
        } else {
          showError('Failed to share');
        }
      }
    } else {
      // No Web Share API - copy to clipboard
      const copyResult = await copyToClipboard(shareData.url);
      if (copyResult.success) {
        showSuccess('Link copied to clipboard!');
      } else {
        showError('Failed to copy link');
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg font-inter font-semibold transform transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent', ...customStyle }}
      aria-label={`Share ${title || 'this page'}`}
    >
      <Share2 size={18} />
      <span>Share</span>
    </button>
  );
};

export default ShareButton;
