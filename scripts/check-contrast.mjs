/*
 * check-contrast.mjs — Gate deterministico de acessibilidade (WCAG 2.1 AA).
 *
 * Le docs/shared/tokens/tokens.css, extrai as custom properties de cor (HSL) dos
 * blocos :root (light) e .dark (dark) e verifica o contraste dos principais pares
 * texto/fundo. Falha (exit 1) se algum par de texto normal ficar abaixo de 4.5:1.
 *
 * Uso: node scripts/check-contrast.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(__dirname, '../docs/shared/tokens/tokens.css');
const css = readFileSync(cssPath, 'utf8');

// Pares [textToken, bgToken] que devem atender AA (texto normal >= 4.5:1).
const PAIRS = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['muted-foreground', 'muted'],
  ['destructive-foreground', 'destructive'],
  ['success-foreground', 'success'],
  ['warning-foreground', 'warning'],
  ['info-foreground', 'info'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-primary-foreground', 'sidebar-primary'],
];

const AA_NORMAL = 4.5;

function extractBlock(name) {
  // name: ':root' ou '.dark'
  const re = new RegExp(`${name.replace('.', '\\.')}\\s*\\{([\\s\\S]*?)\\}`);
  const m = css.match(re);
  if (!m) throw new Error(`Bloco ${name} nao encontrado em tokens.css`);
  const vars = {};
  for (const line of m[1].split('\n')) {
    const v = line.match(/--([\w-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (v) vars[v[1]] = [Number(v[2]), Number(v[3]), Number(v[4])];
  }
  return vars;
}

function relLum([h, s, l]) {
  h /= 360; s /= 100; l /= 100;
  const k = (n) => (n + h * 12) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
}

function ratio(a, b) {
  const L1 = relLum(a), L2 = relLum(b);
  const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

let failures = 0;
for (const mode of [':root', '.dark']) {
  const vars = extractBlock(mode);
  console.log(`\n== ${mode === ':root' ? 'LIGHT' : 'DARK'} ==`);
  for (const [fg, bg] of PAIRS) {
    if (!vars[fg] || !vars[bg]) continue;
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= AA_NORMAL;
    if (!ok) failures++;
    console.log(`  ${ok ? 'OK ' : 'XX '} ${fg} / ${bg}: ${r.toFixed(2)}:1`);
  }
}

if (failures) {
  console.error(`\nFALHA: ${failures} par(es) abaixo de ${AA_NORMAL}:1 (WCAG AA texto normal).`);
  process.exit(1);
}
console.log(`\nOK: todos os pares atendem WCAG 2.1 AA (>= ${AA_NORMAL}:1).`);
