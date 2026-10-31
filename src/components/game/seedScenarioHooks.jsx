import { base44 } from '@/api/base44Client';
import { PACK_SEED_HOOKS } from './packSeedHooks';

export async function seedScenarioHooks() {
  try {
    // Fetch existing hooks
    const existingHooks = await base44.entities.ScenarioHooks.list();
    
    // Build unique key set from existing hooks
    const existingKeys = new Set();
    existingHooks.forEach(hook => {
      const key = `${hook.packId}|${hook.minAge}|${hook.maxAge}|${hook.topic}|${(hook.hookText || '').slice(0, 60)}`;
      existingKeys.add(key);
    });
    
    let created = 0;
    let skipped = 0;
    
    // Process seed hooks sequentially
    for (const seedHook of PACK_SEED_HOOKS) {
      const key = `${seedHook.packId}|${seedHook.minAge}|${seedHook.maxAge}|${seedHook.topic}|${(seedHook.hookText || '').slice(0, 60)}`;
      
      if (existingKeys.has(key)) {
        skipped++;
        continue;
      }
      
      // Create missing hook
      await base44.entities.ScenarioHooks.create(seedHook);
      created++;
      existingKeys.add(key);
    }
    
    return { created, skipped };
  } catch (error) {
    console.error('Seed scenario hooks failed:', error);
    throw error;
  }
}

export async function resetCoparentingScenarioHooks() {
  try {
    const PACK_ID = "pack_coparenting_v1";
    
    // 1. Get new hooks from local file
    const newHooks = PACK_SEED_HOOKS.filter(h => h.packId === PACK_ID);
    
    // 2. Delete existing
    let deletedCount = 0;
    try {
      const delResult = await base44.entities.ScenarioHooks.deleteMany({ packId: PACK_ID });
      deletedCount = delResult?.deleted ?? delResult?.count ?? delResult ?? 0;
    } catch (e) {
      console.warn("deleteMany failed, falling back to iterative delete", e);
      const old = await base44.entities.ScenarioHooks.filter({ packId: PACK_ID });
      for (const row of old) {
        await base44.entities.ScenarioHooks.delete(row.id);
      }
      deletedCount = old.length;
    }

    // 3. Create new
    if (newHooks.length > 0) {
      await base44.entities.ScenarioHooks.bulkCreate(newHooks);
    }

    return { deleted: deletedCount, created: newHooks.length };
  } catch (error) {
    console.error('Reset co-parenting hooks failed:', error);
    throw error;
  }
}