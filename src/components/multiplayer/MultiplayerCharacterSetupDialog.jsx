import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { loadCharacterPresets, saveCharacterPreset, deleteCharacterPreset, makeNewPresetId } from './characterPresets';
import { Trash2 } from 'lucide-react';

export default function MultiplayerCharacterSetupDialog({
  open,
  onOpenChange,
  initialStarterRole = 'dad',
  starterRoleLocked = false,
  onConfirm
}) {
  const [presets, setPresets] = React.useState([]);
  const [selectedPresetId, setSelectedPresetId] = React.useState(null);
  
  const [starterRole, setStarterRole] = React.useState(initialStarterRole);
  
  const [dadName, setDadName] = React.useState('');
  const [dadGender, setDadGender] = React.useState('male');
  const [dadAge, setDadAge] = React.useState(30);
  const [dadAvatar, setDadAvatar] = React.useState(0);
  
  const [momName, setMomName] = React.useState('');
  const [momGender, setMomGender] = React.useState('female');
  const [momAge, setMomAge] = React.useState(28);
  const [momAvatar, setMomAvatar] = React.useState(0);
  
  const [childName, setChildName] = React.useState('');
  const [childGender, setChildGender] = React.useState('boy');
  
  const [saveAsLabel, setSaveAsLabel] = React.useState('');
  const [showSaveInput, setShowSaveInput] = React.useState(false);
  
  React.useEffect(() => {
    if (open) {
      setPresets(loadCharacterPresets());
    }
  }, [open]);
  
  const loadPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    
    const { data } = preset;
    setStarterRole(data.starterRole || 'dad');
    setDadName(data.dad?.name || '');
    setDadGender(data.dad?.genderKey || 'male');
    setDadAge(data.dad?.ageAtBirth || 30);
    setDadAvatar(data.dad?.avatarSpriteIndex || 0);
    setMomName(data.mom?.name || '');
    setMomGender(data.mom?.genderKey || 'female');
    setMomAge(data.mom?.ageAtBirth || 28);
    setMomAvatar(data.mom?.avatarSpriteIndex || 0);
    setChildName(data.child?.name || '');
    setChildGender(data.child?.gender || 'boy');
    
    setSelectedPresetId(presetId);
  };
  
  const deletePreset = (presetId) => {
    deleteCharacterPreset(presetId);
    setPresets(loadCharacterPresets());
    if (selectedPresetId === presetId) {
      setSelectedPresetId(null);
    }
  };
  
  const buildConfig = () => ({
    starterRole,
    dad: {
      name: dadName.trim(),
      ageAtBirth: Math.max(18, Math.min(75, dadAge)),
      genderKey: dadGender,
      avatarSpriteIndex: Math.max(0, Math.min(15, dadAvatar))
    },
    mom: {
      name: momName.trim(),
      ageAtBirth: Math.max(18, Math.min(75, momAge)),
      genderKey: momGender,
      avatarSpriteIndex: Math.max(0, Math.min(15, momAvatar))
    },
    child: {
      name: childName.trim(),
      gender: childGender
    }
  });
  
  const validate = () => {
    const config = buildConfig();
    if (!config.dad.name || !config.mom.name || !config.child.name) {
      alert('Please fill in all names');
      return false;
    }
    return true;
  };
  
  const handlePlay = () => {
    if (!validate()) return;
    onConfirm?.({ action: 'play', config: buildConfig() });
  };
  
  const handleSaveAndPlay = () => {
    if (!validate()) return;
    setShowSaveInput(true);
  };
  
  const confirmSaveAndPlay = () => {
    const label = saveAsLabel.trim() || `Preset ${Date.now()}`;
    const config = buildConfig();
    
    const preset = {
      id: makeNewPresetId(),
      label,
      data: config
    };
    
    saveCharacterPreset(preset);
    setPresets(loadCharacterPresets());
    
    onConfirm?.({ action: 'saveAndPlay', presetLabel: label, config });
    setShowSaveInput(false);
    setSaveAsLabel('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Characters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Load Preset */}
          {presets.length > 0 && (
            <Card className="p-4">
              <Label className="mb-2 block font-semibold">Load Saved Characters</Label>
              <div className="space-y-2">
                {presets.map(preset => (
                  <div key={preset.id} className="flex items-center gap-2">
                    <Button
                      variant={selectedPresetId === preset.id ? 'default' : 'outline'}
                      onClick={() => loadPreset(preset.id)}
                      className="flex-1 justify-start"
                    >
                      {preset.label}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Starter Role */}
          <Card className="p-4">
            <Label className="mb-2 block font-semibold">Who starts?</Label>
            <RadioGroup
              value={starterRole}
              onValueChange={setStarterRole}
              disabled={starterRoleLocked}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dad" id="starter-dad" />
                <Label htmlFor="starter-dad">Dad starts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mom" id="starter-mom" />
                <Label htmlFor="starter-mom">Mom starts</Label>
              </div>
            </RadioGroup>
          </Card>
          
          {/* Dad Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Dad</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={dadName} onChange={e => setDadName(e.target.value)} placeholder="Dad's name" />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup value={dadGender} onValueChange={setDadGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="dad-male" />
                    <Label htmlFor="dad-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="dad-female" />
                    <Label htmlFor="dad-female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Age at birth (18–75)</Label>
                <Input type="number" min={18} max={75} value={dadAge} onChange={e => setDadAge(Number(e.target.value))} />
              </div>
              <div>
                <Label>Avatar</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {Array.from({length: 16}, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setDadAvatar(i)}
                      className={`p-2 rounded border-2 transition ${dadAvatar === i ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <PlayerSpriteAvatar genderKey={dadGender} ageNumber={dadAge} index={i} size={32} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Mom Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Mom</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={momName} onChange={e => setMomName(e.target.value)} placeholder="Mom's name" />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup value={momGender} onValueChange={setMomGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="mom-male" />
                    <Label htmlFor="mom-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="mom-female" />
                    <Label htmlFor="mom-female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Age at birth (18–75)</Label>
                <Input type="number" min={18} max={75} value={momAge} onChange={e => setMomAge(Number(e.target.value))} />
              </div>
              <div>
                <Label>Avatar</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {Array.from({length: 16}, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setMomAvatar(i)}
                      className={`p-2 rounded border-2 transition ${momAvatar === i ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <PlayerSpriteAvatar genderKey={momGender} ageNumber={momAge} index={i} size={32} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Child Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Child</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Child's name" />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup value={childGender} onValueChange={setChildGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boy" id="child-boy" />
                    <Label htmlFor="child-boy">Boy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="girl" id="child-girl" />
                    <Label htmlFor="child-girl">Girl</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>
          
          {/* Save Input */}
          {showSaveInput && (
            <Card className="p-4">
              <Label className="mb-2 block">Preset Name</Label>
              <div className="flex gap-2">
                <Input
                  value={saveAsLabel}
                  onChange={e => setSaveAsLabel(e.target.value)}
                  placeholder="My custom characters"
                />
                <Button onClick={confirmSaveAndPlay}>Save & Play</Button>
                <Button variant="outline" onClick={() => setShowSaveInput(false)}>Cancel</Button>
              </div>
            </Card>
          )}
          
          {/* Footer Buttons */}
          {!showSaveInput && (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleSaveAndPlay}>Save & Play</Button>
              <Button onClick={handlePlay}>Play Now</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}