// Define message types
interface LayoutProperties {
  maxWidth: number;
  minWidth: number;
  rowMargin: number;
  itemsPerRow: number;
  itemMargin: number;
}

interface UpdateLayoutMessage {
  type: 'UPDATE_LAYOUT';
  properties: LayoutProperties;
}

// Function to apply settings
function applySettings(settings: any) {
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
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(
  (
    message: { type: string; settings: any },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.type === 'UPDATE_LAYOUT') {
      const { settings } = message;
      applySettings(settings);
      localStorage.setItem('youtubeLayoutSettings', JSON.stringify(settings));
    }
  }
);

// Function to check and apply settings
function checkAndApplySettings() {
  const savedSettings = localStorage.getItem('youtubeLayoutSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    applySettings(settings);
  }
}

// Apply settings immediately if the grid is already present
checkAndApplySettings();

// Watch for YouTube's grid element to be added to the DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const gridElement = document.querySelector('ytd-rich-grid-renderer');
      if (gridElement) {
        checkAndApplySettings();
        observer.disconnect();
        break;
      }
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 