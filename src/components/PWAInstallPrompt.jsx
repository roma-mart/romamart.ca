/**
 * PWA Install Prompt Component
 * Smart install prompt based on user engagement
 * Batch 3: Includes haptic feedback
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import { useLocalStorage, useVibration } from '../hooks/useBrowserFeatures';
import Button from './Button';
import PWAPromptShell from './PWAPromptShell';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);
  const [lastDismissed, setLastDismissed] = useLocalStorage('pwa-install-dismissed', null);
  const [isInstalled, setIsInstalled] = useLocalStorage('pwa-installed', false);
  const [dismissedThisSession, setDismissedThisSession] = useState(
    sessionStorage.getItem('pwa-dismissed-session') === 'true'
  );
  const { vibrate, canVibrate } = useVibration();

  useEffect(() => {
    // Don't show if already installed, dismissed this session, or dismissed recently
    if (isInstalled) return;
    if (dismissedThisSession) return;
    if (lastDismissed && Date.now() - lastDismissed < 7 * 24 * 60 * 60 * 1000) return; // 7 days

    // Don't show if already running as installed PWA (standalone or WCO mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: window-controls-overlay)').matches
      || window.navigator.standalone === true; // iOS Safari
    if (isStandalone) return;

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
      setIsInstalled(true);
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

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <PWAPromptShell
      visible={true}
      onDismiss={handleDismiss}
      icon={
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-weight-bold)',
          }}
        >
          RM
        </div>
      }
      title="Install Roma Mart"
      subtitle="Quick access anytime"
      idPrefix="pwa-install"
      zIndex={10000}
      className="animate-slide-up"
    >
      <p
        id="pwa-install-description"
        className="mb-6 leading-relaxed"
        style={{
          color: 'var(--color-text)',
          fontFamily: 'var(--font-body)',
          fontWeight: 'var(--font-weight-normal)',
        }}
      >
        Install our app for faster access, offline viewing, and a better mobile experience!
      </p>

      {/* Features */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-success-bg)' }}
          >
            <span className="text-lg" style={{ color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>&#x26A1;</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Faster loading times</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-warning-bg)' }}
          >
            <span className="text-lg" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>&#x1F4F1;</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Works offline</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <span className="text-lg" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)' }}>&#x1F3E0;</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-normal)' }}>Add to home screen</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="inverted"
          icon={<Download size={20} />}
          className="flex-1"
          onClick={handleInstall}
          aria-label="Install App"
        >
          Install App
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleDismiss}
          aria-label="Not Now"
        >
          Not Now
        </Button>
      </div>
    </PWAPromptShell>
  );
};

export default PWAInstallPrompt;
