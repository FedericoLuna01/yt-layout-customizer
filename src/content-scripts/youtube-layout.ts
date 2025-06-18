import type { LayoutSettings } from "@/App";

// Function to apply settings
function applySettings(settings: LayoutSettings) {
  // Check if we're on the subscriptions page
  const isSubscriptionsPage = window.location.pathname.includes('/feed/subscriptions');

  // Only apply settings if we're not on subscriptions page OR if applyInSubscriptions is true
  if (!isSubscriptionsPage || settings.applyInSubscriptions) {
    const elements = document.querySelectorAll("ytd-rich-grid-renderer") as NodeListOf<HTMLElement>;
    elements.forEach(element => {
      element.style.setProperty(
        '--ytd-rich-grid-item-max-width',
        `${settings.maxWidth}px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-item-min-width',
        `${settings.minWidth}px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-row-margin',
        `${settings.rowMargin}px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-items-per-row',
        settings.itemsPerRow.toString()
      );
      element.style.setProperty(
        '--ytd-rich-grid-item-margin',
        `${settings.itemMargin}px`
      );
    });
  } else {
    // If we're on subscriptions page and applyInSubscriptions is false, reset styles
    const elements = document.querySelectorAll("ytd-rich-grid-renderer") as NodeListOf<HTMLElement>;
    elements.forEach(element => {
      element.style.setProperty(
        '--ytd-rich-grid-item-max-width',
        `700px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-item-min-width',
        `327px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-row-margin',
        `32px`
      );
      element.style.setProperty(
        '--ytd-rich-grid-items-per-row',
        "3"
      );
      element.style.setProperty(
        '--ytd-rich-grid-item-margin',
        `16px`
      );
    });

    // Return to not apply shorts visibility settings
    return;
  }

  // Apply shorts visibility
  const shortsElements = document.querySelectorAll('ytd-rich-section-renderer');
  shortsElements.forEach(element => {
    (element as HTMLElement).style.display = settings.hideShorts ? 'none' : 'block';
  });
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(
  (
    message: { type: string; settings: LayoutSettings },
  ) => {
    if (message.type === 'UPDATE_LAYOUT') {
      const { settings } = message;
      applySettings(settings);
      chrome.storage.local.set({ youtubeLayoutSettings: settings });
    }
  }
);

// Function to check and apply settings
function checkAndApplySettings() {
  chrome.storage.local.get(['youtubeLayoutSettings'], (result) => {
    if (result.youtubeLayoutSettings) {
      applySettings(result.youtubeLayoutSettings);
    }
  });
}

// Initial check
checkAndApplySettings();

// Setup mutation observer to detect page changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      checkAndApplySettings();
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also check when navigation occurs
window.addEventListener('yt-navigate-finish', () => {
  checkAndApplySettings();
});
