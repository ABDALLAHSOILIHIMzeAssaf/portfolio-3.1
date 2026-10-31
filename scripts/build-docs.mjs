// Génère public/docs/manifest.json : scan d'un dossier FIGÉ (aucune entrée utilisateur), PDF uniquement.
import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'docs'); // codé en dur
const NAME_OK = /^[\p{L}\p{N} _().,'’+-]{1,120}\.pdf$/iu;

const files = readdirSync(DOCS_DIR)
  .filter((n) => NAME_OK.test(n) && !n.includes('..') && statSync(join(DOCS_DIR, n)).isFile())
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

writeFileSync(join(DOCS_DIR, 'manifest.json'), JSON.stringify({ files }, null, 2) + '\n');
console.log(`manifest.json : ${files.length} document(s)`);
