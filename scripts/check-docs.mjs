import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'PRD.md', 'ARCHITECTURE.md', 'ARCHIRECTURE.md',
  'ARCHITECTURE-ESSETIALS.md', 'AGENTS.md', 'README.md',
  'docs/RISK-REVIEW.md', 'docs/VALIDATION.md', 'docs/SKILLS.md',
];
for (const file of required) {
  if (!(await readFile(resolve(root, file), 'utf8')).trim()) {
    throw new Error(`Required document is empty: ${file}`);
  }
}

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'work', '.git'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await inspect(path);
    else if (entry.name.endsWith('.md')) {
      const contents = await readFile(path, 'utf8');
      if (contents.includes(String.fromCodePoint(0x2014))) {
        throw new Error(`Em dash found in ${path}`);
      }
    }
  }
}
await inspect(root);
console.log('Required documents exist and Markdown contains no em dashes.');
