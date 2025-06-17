import { useState } from 'react';
import SettingsMenu from './components/settings-menu'
import { YouTubeLayoutForm } from './components/YouTubeLayoutForm'

export interface LayoutSettings {
  maxWidth: number;
  minWidth: number;
  rowMargin: number;
  itemsPerRow: number;
  itemMargin: number;
  combineMargins: boolean;
  hideShorts: boolean;
}

function App() {
  const [settings, setSettings] = useState<LayoutSettings>(() => ({
    maxWidth: 360,
    minWidth: 280,
    rowMargin: 24,
    itemsPerRow: 4,
    itemMargin: 24,
    combineMargins: false,
    hideShorts: false
  }));

  const resetToDefault = () => {
    setSettings({
      maxWidth: 700,
      minWidth: 327,
      rowMargin: 32,
      itemsPerRow: 3,
      itemMargin: 16,
      combineMargins: false,
      hideShorts: false
    });
  };

  return (
    <div className="bg-background p-6 font-display">
      <div className='items-center flex justify-between mb-6'>
        <h1 className='text-2xl font-bold '>YouTube Layout Settings</h1>
        <SettingsMenu
          resetToDefault={resetToDefault}
        />
      </div>
      <YouTubeLayoutForm
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  )
}

export default App