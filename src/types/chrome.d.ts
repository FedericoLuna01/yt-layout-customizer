/// <reference types="chrome"/>

declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      active: boolean;
    }

    function query(queryInfo: { active: boolean; currentWindow: boolean }): Promise<Tab[]>;
    function sendMessage(tabId: number, message: any): Promise<any>;
  }

  namespace runtime {
    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => void | boolean | Promise<any>
      ): void;
    };
  }
} 