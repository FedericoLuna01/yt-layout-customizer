import type { LayoutSettings } from "@/App";

// Function to apply settings
function applySettings(settings: LayoutSettings) {
  const gridElement = document.querySelector('ytd-rich-grid-renderer') as HTMLElement;
  if (!gridElement) return;

  gridElement.style.setProperty(
    '--ytd-rich-grid-item-max-width',
    `${settings.maxWidth}px`
  );
  gridElement.style.setProperty(
    '--ytd-rich-grid-item-min-width',
    `${settings.minWidth}px`
  );
  gridElement.style.setProperty(
    '--ytd-rich-grid-row-margin',
    `${settings.rowMargin}px`
  );
  gridElement.style.setProperty(
    '--ytd-rich-grid-items-per-row',
    settings.itemsPerRow.toString()
  );
  gridElement.style.setProperty(
    '--ytd-rich-grid-item-margin',
    `${settings.itemMargin}px`
  );

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

// Watch for YouTube's grid element to be added to the DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const gridElement = document.querySelector('ytd-rich-grid-renderer');
      if (gridElement) {
        checkAndApplySettings();
      }
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});
