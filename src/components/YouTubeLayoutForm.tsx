import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface LayoutSettings {
  maxWidth: number;
  minWidth: number;
  rowMargin: number;
  itemsPerRow: number;
  itemMargin: number;
  combineMargins: boolean;
}

export function YouTubeLayoutForm() {
  const [settings, setSettings] = useState<LayoutSettings>(() => {
    const saved = localStorage.getItem('youtubeLayoutSettings');
    return saved ? JSON.parse(saved) : {
      maxWidth: 360,
      minWidth: 280,
      rowMargin: 24,
      itemsPerRow: 4,
      itemMargin: 24,
      combineMargins: false
    };
  });

  // Function to update YouTube layout
  const updateYouTubeLayout = (newSettings: LayoutSettings) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_LAYOUT',
          settings: {
            maxWidth: newSettings.maxWidth,
            minWidth: newSettings.minWidth,
            rowMargin: newSettings.rowMargin,
            itemsPerRow: newSettings.itemsPerRow,
            itemMargin: newSettings.itemMargin
          }
        });
      }
    });
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('youtubeLayoutSettings', JSON.stringify(settings));
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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>YouTube Layout Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxWidth">Max Width</Label>
            <Input
              id="maxWidth"
              type="number"
              value={settings.maxWidth}
              onChange={(e) => handleInputChange('maxWidth', e.target.value)}
            />
            <Slider
              value={[settings.maxWidth]}
              min={200}
              max={600}
              step={1}
              onValueChange={(value) => handleSliderChange('maxWidth', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minWidth">Min Width</Label>
            <Input
              id="minWidth"
              type="number"
              value={settings.minWidth}
              onChange={(e) => handleInputChange('minWidth', e.target.value)}
            />
            <Slider
              value={[settings.minWidth]}
              min={200}
              max={400}
              step={1}
              onValueChange={(value) => handleSliderChange('minWidth', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rowMargin">Row Margin</Label>
            <Input
              id="rowMargin"
              type="number"
              value={settings.rowMargin}
              onChange={(e) => handleInputChange('rowMargin', e.target.value)}
            />
            <Slider
              value={[settings.rowMargin]}
              min={0}
              max={48}
              step={1}
              onValueChange={(value) => handleSliderChange('rowMargin', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemsPerRow">Items Per Row</Label>
            <Input
              id="itemsPerRow"
              type="number"
              value={settings.itemsPerRow}
              onChange={(e) => handleInputChange('itemsPerRow', e.target.value)}
            />
            <Slider
              value={[settings.itemsPerRow]}
              min={1}
              max={8}
              step={1}
              onValueChange={(value) => handleSliderChange('itemsPerRow', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemMargin">Item Margin</Label>
            <Input
              id="itemMargin"
              type="number"
              value={settings.itemMargin}
              onChange={(e) => handleInputChange('itemMargin', e.target.value)}
            />
            <Slider
              value={[settings.itemMargin]}
              min={0}
              max={48}
              step={1}
              onValueChange={(value) => handleSliderChange('itemMargin', value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="combineMargins"
              checked={settings.combineMargins}
              onCheckedChange={handleCombineMarginsChange}
            />
            <Label htmlFor="combineMargins">Combinar márgenes</Label>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 