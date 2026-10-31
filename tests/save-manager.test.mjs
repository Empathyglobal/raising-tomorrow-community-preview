import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// This module contains plain JavaScript despite its .jsx extension.
const source = await readFile(new URL('../src/components/game/saveManager.jsx', import.meta.url), 'utf8');
const saves = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const MAIN = 'RT_SAVE_MANAGER';
const BACKUP = 'RT_SAVE_MANAGER_BACKUP';

function storageFixture(t) {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const originalError = console.error;
  const values = new Map();
  let failWrites = false;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => {
        if (failWrites) throw new Error('Synthetic storage quota failure');
        values.set(key, String(value));
      },
    },
  });
  console.error = () => {};
  t.after(() => {
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else delete globalThis.localStorage;
    console.error = originalError;
  });
  return { values, failWrites: () => { failWrites = true; } };
}

const family = {
  childName: 'Fictional child', parentName: 'Fictional parent', parentRole: 'dad',
  currentYear: 3, childAvatarPicked: true, diamonds: 37,
  settings: { uiTheme: 'storybook', showCoachNotes: false },
};

test('save/load preserves earned diamonds and settings across independent slots', t => {
  storageFixture(t);
  assert.equal(saves.saveToSlot('slot1', family), true);
  assert.deepEqual(saves.loadFromSlot('slot1'), family);
  assert.equal(saves.renameSlot('slot1', 'Synthetic family'), true);
  assert.equal(saves.saveToSlot('slot1', { ...family, currentYear: 4 }), true);
  assert.equal(saves.saveToSlot('slot2', { ...family, diamonds: 13 }), true);
  assert.equal(saves.setActiveSlotId('slot2'), true);
  assert.equal(saves.getActiveSlotId(), 'slot2');
  assert.equal(saves.listSlots().find(slot => slot.slotId === 'slot1').label, 'Synthetic family');
  assert.equal(saves.loadFromSlot('slot1').diamonds, 37);
  assert.deepEqual(saves.loadFromSlot('slot1').settings, family.settings);
  assert.equal(saves.loadFromSlot('slot2').diamonds, 13);
  assert.equal(saves.deleteSlot('slot2'), true);
  assert.equal(saves.loadFromSlot('slot2'), null);
  assert.equal(saves.loadFromSlot('slot1').currentYear, 4);
});

test('all save mutations report storage failures without changing persisted state', t => {
  const storage = storageFixture(t);
  assert.equal(saves.saveToSlot('slot1', family), true);
  const before = storage.values.get(MAIN);
  storage.failWrites();
  assert.equal(saves.saveToSlot('slot1', { ...family, diamonds: 99 }), false);
  assert.equal(saves.renameSlot('slot1', 'Unpersisted label'), false);
  assert.equal(saves.deleteSlot('slot1'), false);
  assert.equal(saves.setActiveSlotId('slot2'), false);
  assert.equal(storage.values.get(MAIN), before);
});

for (const corruptedMain of ['invalid JSON', 'null', '[]', '{"slots":[]}']) {
  test(`saving recovers the backup before replacing corrupt main: ${corruptedMain}`, t => {
    const storage = storageFixture(t);
    assert.equal(saves.saveToSlot('slot1', family), true);
    storage.values.set(BACKUP, storage.values.get(MAIN));
    storage.values.set(MAIN, corruptedMain);
    assert.equal(saves.saveToSlot('slot2', { ...family, diamonds: 13 }), true);
    assert.deepEqual(saves.loadFromSlot('slot1'), family);
    assert.equal(saves.loadFromSlot('slot2').diamonds, 13);
    const backup = JSON.parse(storage.values.get(BACKUP));
    assert.deepEqual(backup.slots.slot1.snapshot, family);
    assert.equal(backup.slots.slot2, null);
  });
}

test('readable backup survives recovery when repairing storage fails', t => {
  const storage = storageFixture(t);
  assert.equal(saves.saveToSlot('slot1', family), true);
  const backup = storage.values.get(MAIN);
  storage.values.set(BACKUP, backup);
  storage.values.set(MAIN, 'invalid JSON');
  storage.failWrites();
  assert.deepEqual(saves.loadFromSlot('slot1'), family);
  assert.equal(saves.saveToSlot('slot2', { ...family, diamonds: 13 }), false);
  assert.equal(storage.values.get(BACKUP), backup);
  assert.deepEqual(saves.loadFromSlot('slot1'), family);
});
