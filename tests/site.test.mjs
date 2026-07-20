import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('Russian and English dictionaries expose the same complete key set', async () => {
  const { translations } = await import(new URL('../script.js', import.meta.url));
  const ruKeys = Object.keys(translations.ru).sort();
  const enKeys = Object.keys(translations.en).sort();
  assert.deepEqual(ruKeys, enKeys);
  for (const key of ['nav.work', 'hero.title', 'case1.title', 'case2.title', 'case3.title', 'contact.title']) {
    assert.ok(ruKeys.includes(key), `missing translation: ${key}`);
    assert.ok(translations.ru[key]);
    assert.ok(translations.en[key]);
  }
});

test('document has semantic landmarks, language controls, and three cases', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main[\s>]/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /data-language="ru"/);
  assert.match(html, /data-language="en"/);
  assert.equal((html.match(/<article[\s>]/g) || []).length, 3);
  assert.match(html, /id="work"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="contact"/);
});

test('presentation includes responsive, focus, and reduced-motion rules', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('styles.css', root), 'utf8')
  ]);
  assert.match(html, /rel="stylesheet" href="styles\.css"/);
  assert.match(css, /--accent\s*:/);
  assert.match(css, /@media\s*\(/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test('release metadata and contact wiring are present', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /<meta name="theme-color" content="#[0-9a-fA-F]{6}">/);
  assert.match(html, /<meta property="og:title" content="[^"]+">/);
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /href="mailto:hello@avolkova\.design"/);
  assert.match(html, /<script type="module" src="script\.js"><\/script>/);
});

test('setLanguage updates copy, document language, controls, and persistence', async () => {
  const { setLanguage, translations } = await import(new URL('../script.js', import.meta.url));
  const copyNode = { dataset: { i18n: 'hero.title' }, textContent: '' };
  const ruButton = { dataset: { language: 'ru' }, setAttribute(name, value) { this[name] = value; } };
  const enButton = { dataset: { language: 'en' }, setAttribute(name, value) { this[name] = value; } };
  const saved = {};
  globalThis.document = {
    documentElement: { lang: 'ru' },
    querySelectorAll(selector) { return selector === '[data-i18n]' ? [copyNode] : [ruButton, enButton]; }
  };
  globalThis.localStorage = { setItem(key, value) { saved[key] = value; } };
  setLanguage('en');
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(copyNode.textContent, translations.en['hero.title']);
  assert.equal(ruButton['aria-pressed'], 'false');
  assert.equal(enButton['aria-pressed'], 'true');
  assert.equal(saved['portfolio-language'], 'en');
  delete globalThis.document;
  delete globalThis.localStorage;
});
