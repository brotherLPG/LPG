const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

const MAP = {
  // Light surfaces (arbitrary hex)
  'bg-[#F8FAFC]': 'bg-gray-950',
  'bg-[#F9FAFB]': 'bg-gray-900',
  'bg-[#E5E7EB]': 'bg-gray-700',
  'bg-[#ECFDF5]': 'bg-emerald-950',
  'bg-[#EEF4FF]': 'bg-blue-950',
  'bg-[#F5F3FF]': 'bg-violet-950',
  'bg-[#FEF2F2]': 'bg-red-950',

  // Light text (arbitrary hex)
  'text-[#6B7280]': 'text-gray-400',
  'text-[#9CA3AF]': 'text-gray-500',
  'text-[#166534]': 'text-green-300',
  'text-[#16A34A]': 'text-green-400',
  'text-[#991B1B]': 'text-red-300',
  'text-[#DC2626]': 'text-red-400',
  'text-[#1E3A8A]': 'text-blue-300',
  'text-[#7C3AED]': 'text-violet-400',
  'text-[#008951]': 'text-emerald-400',
  'text-[#1a56db]': 'text-blue-400',
  'text-[#2563EB]': 'text-blue-400',

  // Light borders (arbitrary hex)
  'border-[#E5E7EB]': 'border-gray-700',

  // Neutral opacity variants
  'bg-slate-50/50': 'bg-gray-800/50',
  'bg-slate-50/60': 'bg-gray-800/60',
  'bg-slate-50/70': 'bg-gray-800/70',
  'bg-slate-50/80': 'bg-gray-800/80',
  'border-slate-200/60': 'border-gray-700/60',
  'border-slate-200/80': 'border-gray-700/80',
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full, out);
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(SRC);
let totalReplacements = 0;
const changedFiles = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;
  let fileReplacements = 0;

  for (const [token, darkToken] of Object.entries(MAP)) {
    const escaped = escapeRegExp(token);
    const re = new RegExp(
      `(?<![\\w-])((?:(?!dark:)[a-zA-Z-]+:)*)${escaped}(?![\\w/-])`,
      'g'
    );
    content = content.replace(re, (match, prefixes) => {
      if (prefixes.includes('dark:')) return match;
      fileReplacements++;
      return `${prefixes}${token} dark:${prefixes}${darkToken}`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles.push({ file: path.relative(SRC, file), count: fileReplacements });
    totalReplacements += fileReplacements;
  }
}

console.log(`Files changed: ${changedFiles.length}`);
console.log(`Total replacements: ${totalReplacements}`);
for (const f of changedFiles) {
  console.log(`  ${f.file}: ${f.count}`);
}
