// Replace leading "They ..." (and common contractions) with the child's name,
// with basic third-person verb conjugation.
//
// This lets content stay written in neutral "They ..." form while the UI shows
// the specific child's name (e.g., "David repeats...").
export function childNameify(text, childName) {
    if (!text) return text;
    const name = (childName || '').trim();
    if (!name) return text;

    const original = String(text);

    // Handle "They're / They've / They'll / They'd" (including curly apostrophes)
    const contraction = original.match(/^([^A-Za-z]*)(They|they)([''])(re|ve|ll|d)\s+(.+)$/);
    if (contraction) {
        const prefix = contraction[1] || '';
        const suffix = contraction[4];
        const rest = contraction[5] || '';
        const aux =
            suffix === 're' ? 'is' :
            suffix === 've' ? 'has' :
            suffix === 'll' ? 'will' :
            /* 'd' */ 'would';
        return `${prefix}${name} ${aux} ${rest}`;
    }

    const m = original.match(/^([^A-Za-z]*)(They|they)\s+(.+)$/);
    if (!m) return original;

    const prefix = m[1] || '';
    const rest = m[3] || '';
    const parts = rest.split(' ');

    const SKIP = new Set([
        'just', 'really', 'suddenly', 'quietly', 'accidentally', 'secretly',
        'always', 'never', 'often', 'sometimes', 'immediately', 'basically',
        'literally', 'probably', 'maybe', 'still', 'oddly', 'shockingly'
    ]);

    const isVowel = (ch) => ['a', 'e', 'i', 'o', 'u'].includes(ch);

    const toThirdPerson = (verbLower) => {
        const v = verbLower;

        // Aux / irregulars
        if (v === 'are') return 'is';
        if (v === 'were') return 'was';
        if (v === 'have') return 'has';
        if (v === 'do') return 'does';
        if (v === "don't" || v === "don't") return "doesn't";
        if (v === 'go') return 'goes';

        // Modals (no conjugation)
        if ([
            'can', "can't", "can't",
            'will', "won't", "won't",
            'would', 'should', 'could', 'might', 'may', 'must'
        ].includes(v)) {
            return v;
        }

        // Regular rules
        if (v.endsWith('y') && v.length > 1 && !isVowel(v[v.length - 2])) {
            return v.slice(0, -1) + 'ies';
        }
        if (v.endsWith('o') || v.endsWith('s') || v.endsWith('x') || v.endsWith('z') || v.endsWith('ch') || v.endsWith('sh')) {
            return v + 'es';
        }
        return v + 's';
    };

    const applyCase = (template, word) => {
        if (!template) return word;
        if (template.toUpperCase() === template) return word.toUpperCase();
        const isCapitalized = template[0] === template[0].toUpperCase();
        if (isCapitalized) return word[0].toUpperCase() + word.slice(1);
        return word;
    };

    const firstAlphaIndex = (s) => s.search(/[A-Za-z]/);
    const lastAlphaIndex = (s) => {
        for (let i = s.length - 1; i >= 0; i--) {
            if (/[A-Za-z]/.test(s[i])) return i;
        }
        return -1;
    };

    const coreLower = (token) => token.toLowerCase().replace(/[^a-z']/g, '');

    const isSkippable = (w) => {
        if (!w) return true;
        if (SKIP.has(w)) return true;
        if (w.endsWith('ly') && w.length > 2) return true;
        return false;
    };

    for (let i = 0; i < parts.length; i++) {
        const token = parts[i];
        const core = coreLower(token);
        if (!core) continue;
        if (isSkippable(core)) continue;

        const start = firstAlphaIndex(token);
        const end = lastAlphaIndex(token);
        if (start === -1 || end === -1 || end < start) break;

        const before = token.slice(0, start);
        const verbTemplate = token.slice(start, end + 1);
        const after = token.slice(end + 1);

        const conjugatedLower = toThirdPerson(coreLower(verbTemplate));
        const conjugated = applyCase(verbTemplate, conjugatedLower);

        parts[i] = `${before}${conjugated}${after}`;
        break;
    }

    return `${prefix}${name} ${parts.join(' ')}`;
}