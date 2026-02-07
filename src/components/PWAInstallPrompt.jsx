/**
 * PWA Install Prompt Component
 * Smart install prompt based on user engagement
 * Batch 3: Includes haptic feedback
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Download } from 'lucide-react';
import { useLocalStorage, useVibration } from '../hooks/useBrowserFeatures';
import Button from './Button';
import { useFocusTrap } from '../hooks/useFocusTrap';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);
  const [lastDismissed, setLastDismissed] = useLocalStorage('pwa-install-dismissed', null);
  const [isInstalled] = useLocalStorage('pwa-installed', false);
  const [dismissedThisSession, setDismissedThisSession] = useState(
    sessionStorage.getItem('pwa-dismissed-session') === 'true'
  );
  const { vibrate, canVibrate } = useVibration();
  const dialogRef = useRef(null);

  useEffect(() => {
    // Don't show if already installed, dismissed this session, or dismissed recently
    if (isInstalled) return;
    if (dismissedThisSession) return;
    if (lastDismissed && Date.now() - lastDismissed < 7 * 24 * 60 * 60 * 1000) return; // 7 days

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (import.meta.env.DEV) {
        console.warn('[PWA] Install prompt available');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled, lastDismissed, dismissedThisSession]);

  useEffect(() => {
    // Track user engagement
    let timeOnSite = 0;
    let pagesViewed = 0;
    let scrolled = false;
    let interacted = false;

    // Time on site
    const timeInterval = setInterval(() => {
      timeOnSite += 1;
    }, 1000);

    // Page views (track URL changes)
    const initialUrl = window.location.href;
    const checkUrlChange = setInterval(() => {
      if (window.location.href !== initialUrl) {
        pagesViewed++;
      }
    }, 500);

    // Scroll detection
    const handleScroll = () => {
      if (window.scrollY > 100 && !scrolled) {
        scrolled = true;
        updateEngagement();
      }
    };

    // Interaction detection (clicks, touches)
    const handleInteraction = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        interacted = true;
        updateEngagement();
      }
    };

    const updateEngagement = () => {
      let score = 0;
      
      // Time on site (max 20 points) - reduced from 30
      if (timeOnSite >= 20) score += 20;
      else score += timeOnSite;
      
      // Pages viewed (15 points per page, max 30) - reduced from 20/40
      score += Math.min(pagesViewed * 15, 30);
      
      // Scrolled (25 points) - increased from 15
      if (scrolled) score += 25;
      
      // Interacted (25 points) - increased from 15
      if (interacted) score += 25;
      
      setEngagementScore(score);
      
      // Show prompt if engagement score >= 30 and prompt is available (lowered from 70)
      // User just needs: 10s + scroll OR 10s + click OR scroll + click
      if (score >= 30 && deferredPrompt && !showPrompt && !dismissedThisSession) {
        if (import.meta.env.DEV) {
          console.warn('[PWA] Engagement threshold met (score: ' + score + '), showing install prompt');
        }
        setShowPrompt(true);
      }
    };

    // Update engagement every 2 seconds
    const engagementInterval = setInterval(updateEngagement, 2000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      clearInterval(timeInterval);
      clearInterval(checkUrlChange);
      clearInterval(engagementInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [deferredPrompt, showPrompt, dismissedThisSession]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Haptic feedback for install action
    if (canVibrate) {
      vibrate([10, 50, 10]); // Double tap pattern
    }

    // Show native install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    if (import.meta.env.DEV) {
      console.warn('[PWA] User choice:', outcome);
    }

    if (outcome === 'accepted') {
      if (import.meta.env.DEV) {
        console.warn('[PWA] User accepted install');
      }
      
      // Track installation
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'pwa_install',
          engagement_score: engagementScore
        });
      }
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setDismissedThisSession(true);
    sessionStorage.setItem('pwa-dismissed-session', 'true');
    setLastDismissed(Date.now());

    // Track dismissal
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pwa_install_dismissed',
        engagement_score: engagementScore
      });
    }
  }, [engagementScore, setLastDismissed]);

  useFocusTrap(dialogRef, showPrompt && !!deferredPrompt, {
    onEscape: handleDismiss,
  });

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,1rem))] md:bottom-[calc(56px+1.5rem)] left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[10000] animate-slide-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div
        className="rounded-2xl shadow-2xl border-2 overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-accent)' }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)' }}>
              RM
            </div>
            <div>
              <h3 id="pwa-install-title" className="font-bold text-lg" style={{ color: 'var(--color-text-on-primary)', fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)' }}>
                Install Roma Mart
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-on-primary)', opacity: 0.8, fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Quick access anytime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDismiss(e);
              }
            }}
            className="transition-colors p-1 rounded-full hover:bg-white/10 focus-visible:bg-white/20"
            style={{ color: 'white' }}
            aria-label="Dismiss install prompt"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="pwa-install-description" className="mb-6 leading-relaxed" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>
            Install our app for faster access, offline viewing, and a better mobile experience!
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-success-bg)' }}>
                <span className="text-lg" style={{ color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>⚡</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Faster loading times</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
                <span className="text-lg" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>📱</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Works offline</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-surface)' }}>
                <span className="text-lg" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>🏠</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Add to home screen</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="action"
              icon={<Download size={20} />}
              className="flex-1 font-bold"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-accent)' }}
              onClick={handleInstall}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleInstall(e);
                }
              }}
              aria-label="Install App"
            >
              Install App
            </Button>
            <Button
              type="button"
              variant="action"
              className="px-4 py-3 font-semibold"
              style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}
              onClick={handleDismiss}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDismiss(e);
                }
              }}
              aria-label="Not Now"
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
