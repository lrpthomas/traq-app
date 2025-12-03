import Dexie, { type EntityTable } from 'dexie';
import type { Assessment, MediaAttachment, FieldMemory, AppSettings } from '@/types/traq';

// Database instance
const db = new Dexie('TRAQDatabase') as Dexie & {
  assessments: EntityTable<Assessment, 'id'>;
  media: EntityTable<MediaAttachment, 'id'>;
  memory: EntityTable<FieldMemory, 'id'>;
  settings: EntityTable<AppSettings, 'id'>;
};

// Schema definition
db.version(1).stores({
  assessments: 'id, status, createdAt, updatedAt, [header.client], [header.addressTreeLocation]',
  media: 'id, assessmentId, type, createdAt',
  memory: 'id, fieldPath, enabled, lastUsed',
  settings: 'id',
});

export { db };

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  id: 'default',
  defaultTimeFrame: '1 year',
  defaultUnits: {
    diameter: 'in',
    height: 'ft',
    distance: 'ft',
  },
  autoSaveInterval: 30000, // 30 seconds
  enableMemory: true,
  theme: 'system',
  assessorName: '',
};

// Initialize settings if not exist
export async function initializeSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('default');
  if (!existing) {
    await db.settings.add(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return existing;
}
