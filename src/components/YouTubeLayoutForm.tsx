import { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { LayoutSettings } from '@/App';
import { BracketsIcon, EyeIcon, Grid3x3Icon, RulerDimensionLineIcon } from 'lucide-react';
import { Separator } from './ui/separator';

export function YouTubeLayoutForm({ settings, setSettings }: {
  settings: LayoutSettings;
  setSettings: React.Dispatch<React.SetStateAction<LayoutSettings>>
}) {
  // Load saved settings when component mounts
  useEffect(() => {
    chrome.storage.local.get(['youtubeLayoutSettings'], (result) => {
      if (result.youtubeLayoutSettings) {
        setSettings(result.youtubeLayoutSettings);
      }
    });
  }, [setSettings]);

  // Function to update YouTube layout
  const updateYouTubeLayout = (newSettings: LayoutSettings) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_LAYOUT', settings: {
            maxWidth: newSettings.maxWidth,
            minWidth: newSettings.minWidth,
            rowMargin: newSettings.rowMargin,
            itemsPerRow: newSettings.itemsPerRow,
            itemMargin: newSettings.itemMargin,
            combineMargins: newSettings.combineMargins,
            hideShorts: newSettings.hideShorts,
            applyInSubscriptions: newSettings.applyInSubscriptions
          }
        });
      }
    });
  };

  // Save settings to chrome.storage.local whenever they change
  useEffect(() => {
    chrome.storage.local.set({ youtubeLayoutSettings: settings });
    updateYouTubeLayout(settings);
  }, [settings]);

  const handleInputChange = (name: keyof LayoutSettings, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSettings(prev => {
        const newSettings = { ...prev, [name]: numValue };
        if (newSettings.combineMargins && (name === 'rowMargin' || name === 'itemMargin')) {
          newSettings.rowMargin = newSettings.itemMargin = numValue;
        }
        return newSettings;
      });
    }
  };

  const handleSliderChange = (name: keyof LayoutSettings, value: number[]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [name]: value[0] };
      if (newSettings.combineMargins && (name === 'rowMargin' || name === 'itemMargin')) {
        newSettings.rowMargin = newSettings.itemMargin = value[0];
      }
      return newSettings;
    });
  };

  const handleCombineMarginsChange = (checked: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, combineMargins: checked };
      if (checked) {
        newSettings.rowMargin = newSettings.itemMargin;
      }
      return newSettings;
    });
  };

  return (
    <div className="w-[350px]">
      <form className="space-y-4">
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <RulerDimensionLineIcon className='size-5' />
            <h2 className='text-lg font-semibold'>
              Thumbnail Dimensions
            </h2>
          </div>
          <div className='ml-7 space-y-4'>
            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label htmlFor="maxWidth">Max Width</Label>
                <Input
                  id="maxWidth"
                  type="number"
                  value={settings.maxWidth}
                  onChange={(e) => handleInputChange('maxWidth', e.target.value)}
                  className='text-sm w-14 text-center'
                />
              </div>
              <Slider
                value={[settings.maxWidth]}
                min={200}
                max={900}
                step={1}
                onValueChange={(value) => handleSliderChange('maxWidth', value)}
              />
            </div>
            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label htmlFor="minWidth">Min Width</Label>
                <Input
                  id="minWidth"
                  type="number"
                  value={settings.minWidth}
                  onChange={(e) => handleInputChange('minWidth', e.target.value)}
                  className='text-sm w-14 text-center'
                />
              </div>
              <Slider
                value={[settings.minWidth]}
                min={200}
                max={400}
                step={1}
                onValueChange={(value) => handleSliderChange('minWidth', value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <Grid3x3Icon className='size-5' />
            <h2 className='text-lg font-semibold'>
              Grid Settings
            </h2>
          </div>
          <div className="space-y-2 ml-7">
            <div className='flex items-center justify-between'>
              <Label htmlFor="itemsPerRow">Items Per Row</Label>
              <Input
                id="itemsPerRow"
                type="number"
                value={settings.itemsPerRow}
                onChange={(e) => handleInputChange('itemsPerRow', e.target.value)}
                className='text-sm w-14 text-center'
              />
            </div>
            <Slider
              value={[settings.itemsPerRow]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => handleSliderChange('itemsPerRow', value)}
            />
          </div>
        </div>

        <Separator />

        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <BracketsIcon className='size-5' />
            <h2 className='text-lg font-semibold'>
              Grid Spacing
            </h2>
          </div>
          <div className="space-y-2 ml-7">
            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label htmlFor="rowMargin">Row Margin</Label>
                <Input
                  id="rowMargin"
                  type="number"
                  value={settings.rowMargin}
                  onChange={(e) => handleInputChange('rowMargin', e.target.value)}
                  className='text-sm w-14 text-center'
                />
              </div>
              <Slider
                value={[settings.rowMargin]}
                min={0}
                max={48}
                step={1}
                onValueChange={(value) => handleSliderChange('rowMargin', value)}
              />
            </div>

            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label htmlFor="itemMargin">Item Margin</Label>
                <Input
                  id="itemMargin"
                  type="number"
                  value={settings.itemMargin}
                  onChange={(e) => handleInputChange('itemMargin', e.target.value)}
                  className='text-sm w-14 text-center'
                />
              </div>
              <Slider
                value={[settings.itemMargin]}
                min={0}
                max={48}
                step={1}
                onValueChange={(value) => handleSliderChange('itemMargin', value)}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-md border gap-2 bg-card">
              <div className='space-y-1'>
                <Label htmlFor="combineMargins">
                  Combine Row and Item Margins
                </Label>
                <p className='text-xs text-muted-foreground'>
                  Merge row and item margins
                </p>
              </div>
              <Switch
                id="combineMargins"
                checked={settings.combineMargins}
                onCheckedChange={handleCombineMarginsChange}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <EyeIcon className='size-5' />
            <h2 className='text-lg font-semibold'>
              Visibility Settings
            </h2>
          </div>
          <div className="space-y-2 ml-7">
            <div className="flex items-center justify-between p-4 rounded-md border gap-2 bg-card">
              <div className='space-y-1'>
                <Label htmlFor="hideShorts">Hide shorts and latest news</Label>
                <p className='text-xs text-muted-foreground'>
                  Remove YouTube Shorts and latest news from the layout
                </p>
              </div>
              <Switch
                id="hideShorts"
                checked={settings.hideShorts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, hideShorts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-md border gap-2 bg-card">
              <div className='space-y-1'>
                <Label htmlFor="applyInSubscriptions">Apply in subscriptions page</Label>
                <p className='text-xs text-muted-foreground'>
                  Use settings on subscriptions page
                </p>
              </div>
              <Switch
                id="applyInSubscriptions"
                checked={settings.applyInSubscriptions}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, applyInSubscriptions: checked }))}
              />
            </div>
          </div>
        </div>
      </form >
    </div>
  );
}