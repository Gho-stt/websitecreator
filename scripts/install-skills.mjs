// Instaluje skille dla Claude do .claude/skills (uruchom: npm run skills:install).
// Repozytoria są przypięte do commitów przejrzanych pod kątem bezpieczeństwa
// (brak curl|bash, base64, odczytów .env/~/.ssh). Zmieniając commit, przejrzyj skill ponownie.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SOURCES = [
  { repo: 'anthropics/skills', commit: '2c5958e', paths: ['skills/frontend-design'] },
  { repo: 'pbakaus/impeccable', commit: 'd9c1d71', paths: ['.claude/skills/impeccable'] },
  {
    repo: 'addyosmani/web-quality-skills', commit: 'afa8da9',
    paths: ['performance', 'seo', 'web-quality-audit', 'best-practices', 'accessibility', 'core-web-vitals'].map((s) => `skills/${s}`),
  },
  {
    repo: 'coreyhaines31/marketingskills', commit: '82b15e9',
    paths: ['copywriting', 'copy-editing', 'cro', 'seo-audit', 'ai-seo', 'schema'].map((s) => `skills/${s}`),
  },
  { repo: 'microsoft/playwright-cli', commit: 'ce9b41b', paths: ['skills/playwright-cli'] },
  { repo: 'astrolicious/agent-skills', commit: 'cb4839f', paths: ['skills/astro'] },
  { repo: 'wshobson/agents', commit: '9c61ab2', paths: ['plugins/frontend-mobile-development/skills/tailwind-design-system'] },
];

const root = process.cwd();
const dest = join(root, '.claude', 'skills');
mkdirSync(dest, { recursive: true });
const git = (args, cwd) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] });
const rows = [];

for (const { repo, commit, paths } of SOURCES) {
  const dir = mkdtempSync(join(tmpdir(), 'skill-'));
  console.log(`→ ${repo}@${commit}`);
  git(['clone', '--quiet', '--filter=blob:none', '--no-checkout', `https://github.com/${repo}.git`, dir]);
  git(['checkout', '--quiet', commit], dir);
  for (const p of paths) {
    const name = p.split('/').pop();
    const src = join(dir, p);
    if (!existsSync(src)) { console.warn(`  ! brak ${p}`); continue; }
    rmSync(join(dest, name), { recursive: true, force: true });
    cpSync(src, join(dest, name), { recursive: true });
    rows.push(`| ${name} | ${repo} | ${commit} |`);
  }
  rmSync(dir, { recursive: true, force: true });
}

// Własny skill marki (wersja w repo: claude-skills/marka-klienta)
cpSync(join(root, 'claude-skills', 'marka-klienta'), join(dest, 'marka-klienta'), { recursive: true });
rows.push('| marka-klienta | (własny, claude-skills/) | – |');

writeFileSync(join(dest, 'SOURCES.md'), `# Źródła skilli\n\n| skill | repozytorium | commit |\n|---|---|---|\n${rows.join('\n')}\n`);
console.log(`\nGotowe: ${rows.length} skilli w .claude/skills`);
