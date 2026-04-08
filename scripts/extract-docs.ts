/**
 * scripts/extract-docs.ts
 *
 * One-time dev tool: extracts text from every PDF in src/core/docs/,
 * writes a .txt file per PDF into tmp/extracted/, then deletes the entire
 * src/core/docs/ directory so PDFs never reach the app bundle.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/extract-docs.ts
 *
 * After running:
 *   1. Read tmp/extracted/*.txt and fill the matching src/core/knowledge/ module.
 *   2. Delete tmp/extracted/ once all modules are populated.
 */

import * as fs from 'fs';
import * as path from 'path';
import pdfParse = require('pdf-parse');

const DOCS_DIR = path.resolve(__dirname, '../src/core/docs');
const OUT_DIR  = path.resolve(__dirname, '../tmp/extracted');

async function main() {
    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`❌  ${DOCS_DIR} does not exist — nothing to extract.`);
        process.exit(1);
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });

    const pdfs = fs.readdirSync(DOCS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));

    if (pdfs.length === 0) {
        console.warn('⚠️  No PDF files found in src/core/docs/');
        process.exit(0);
    }

    console.log(`\n📂  Found ${pdfs.length} PDFs — extracting to ${OUT_DIR}\n`);

    let ok = 0;
    let failed = 0;

    for (const file of pdfs.sort()) {
        const inputPath  = path.join(DOCS_DIR, file);
        const outputPath = path.join(OUT_DIR, file.replace(/\.pdf$/i, '.txt'));

        try {
            const buffer = fs.readFileSync(inputPath);
            const { text, numpages } = await pdfParse(buffer);

            // Normalise whitespace: collapse 3+ newlines to 2, trim
            const cleaned = text.replace(/\n{3,}/g, '\n\n').trim();

            const header = [
                '='.repeat(72),
                `SOURCE : ${file}`,
                `PAGES  : ${numpages}`,
                `CHARS  : ${cleaned.length}`,
                '='.repeat(72),
                '',
            ].join('\n');

            fs.writeFileSync(outputPath, header + cleaned, 'utf8');
            console.log(`  ✅  ${file.padEnd(55)} → ${numpages} page(s), ${cleaned.length.toLocaleString()} chars`);
            ok++;
        } catch (err) {
            console.error(`  ❌  ${file} — ${(err as Error).message}`);
            failed++;
        }
    }

    console.log(`\n📝  Extracted ${ok}/${pdfs.length} files${failed ? ` (${failed} failed)` : ''}.`);

    if (ok > 0 && failed === 0) {
        // Remove the docs directory — content now lives in knowledge modules.
        fs.rmSync(DOCS_DIR, { recursive: true, force: true });
        console.log(`🗑️   Removed src/core/docs/ — PDFs no longer needed.\n`);
        console.log('Next steps:');
        console.log('  1. Review tmp/extracted/*.txt');
        console.log('  2. Fill each src/core/knowledge/<topic>.ts module with the relevant content.');
        console.log('  3. Delete tmp/extracted/ once all modules are populated.');
        console.log('  4. Uninstall pdf-parse: npm uninstall --save-dev pdf-parse @types/pdf-parse\n');
    } else if (failed > 0) {
        console.warn('\n⚠️  Some PDFs failed — src/core/docs/ has NOT been deleted.');
        console.warn('   Fix the errors above and re-run the script.\n');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
