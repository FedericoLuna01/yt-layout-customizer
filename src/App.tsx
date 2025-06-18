import { useState } from 'react';
import SettingsMenu from './components/settings-menu'
import { YouTubeLayoutForm } from './components/YouTubeLayoutForm'
import { Separator } from './components/ui/separator';

export interface LayoutSettings {
  maxWidth: number;
  minWidth: number;
  rowMargin: number;
  itemsPerRow: number;
  itemMargin: number;
  combineMargins: boolean;
  hideShorts: boolean;
  applyInSubscriptions: boolean;
}

function App() {
  const [settings, setSettings] = useState<LayoutSettings>(() => ({
    maxWidth: 360,
    minWidth: 280,
    rowMargin: 24,
    itemsPerRow: 4,
    itemMargin: 24,
    combineMargins: false,
    hideShorts: false,
    applyInSubscriptions: true
  }));

  const resetToDefault = () => {
    setSettings({
      maxWidth: 700,
      minWidth: 327,
      rowMargin: 32,
      itemsPerRow: 3,
      itemMargin: 16,
      combineMargins: false,
      hideShorts: false,
      applyInSubscriptions: true
    });
  };

  return (
    <div className=" p-6 font-display bg-gradient-to-t from-primary/10 from-5%">
      <div className='items-center flex justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <img src="/icon.png" alt="" className='w-12 h-12' />
          <div className='flex flex-col'>
            <h1 className='text-xl font-bold '>YouTube Layout</h1>
            <p className='text-muted-foreground'>Customize your viewing experience</p>
          </div>
        </div>
        <SettingsMenu
          resetToDefault={resetToDefault}
        />
      </div>
      <YouTubeLayoutForm
        settings={settings}
        setSettings={setSettings}
      />
      <Separator className='mt-4' />
      <div>
        <p className='text-xs leading-none text-muted-foreground mt-4'>
          This extension is open source and available on <a href="https://github.com/FedericoLuna01/yt-layout-customizer" className='text-primary underline' target="_blank" rel="noopener noreferrer">GitHub</a>. If you have any issues or suggestions, please open an issue on the repository.
        </p>
      </div>
    </div>
  )
}

export default App