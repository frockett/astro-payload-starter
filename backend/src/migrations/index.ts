import * as migration_20250616_041259_add_drafts from './20250616_041259_add_drafts';

export const migrations = [
  {
    up: migration_20250616_041259_add_drafts.up,
    down: migration_20250616_041259_add_drafts.down,
    name: '20250616_041259_add_drafts'
  },
];
