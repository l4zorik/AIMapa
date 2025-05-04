/**
 * Testy dostupnosti (accessibility)
 * Verze 0.3.8.7
 */

const { axe } = require('jest-axe');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Test dostupnosti HTML souborů
 */
async function testAccessibility() {
  console.log('Testování dostupnosti (accessibility)...');

  try {
    const publicDir = path.resolve(__dirname, '../../public');
    const htmlFiles = fs.readdirSync(publicDir)
      .filter(file => file.endsWith('.html'));

    if (htmlFiles.length === 0) {
      throw new Error('Žádné HTML soubory k testování');
    }

    const results = {};

    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(publicDir, htmlFile);
      const html = fs.readFileSync(htmlPath, 'utf8');

      // Vytvoření DOM z HTML
      const dom = new JSDOM(html);

      // Spuštění axe testu
      console.log(`Testování souboru ${htmlFile}...`);

      // Nastavení globálních proměnných pro axe
      global.window = dom.window;
      global.document = dom.window.document;
      global.navigator = dom.window.navigator;

      // Spuštění axe testu
      const axeResults = await axe(dom.window.document.documentElement.outerHTML);

      // Zpracování výsledků
      results[htmlFile] = {
        violations: axeResults.violations.length,
        passes: axeResults.passes.length,
        incomplete: axeResults.incomplete.length,
        inapplicable: axeResults.inapplicable.length,
        details: axeResults.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.length
        }))
      };

      // Výpis výsledků
      console.log(`Soubor ${htmlFile}:`);
      console.log(`- Porušení: ${results[htmlFile].violations}`);
      console.log(`- Úspěšné testy: ${results[htmlFile].passes}`);
      console.log(`- Neúplné testy: ${results[htmlFile].incomplete}`);
      console.log(`- Neaplikovatelné testy: ${results[htmlFile].inapplicable}`);

      if (results[htmlFile].violations > 0) {
        console.log('Detaily porušení:');
        results[htmlFile].details.forEach(detail => {
          console.log(`  - ${detail.id} (${detail.impact}): ${detail.description}`);
          console.log(`    Nápověda: ${detail.help}`);
          console.log(`    URL: ${detail.helpUrl}`);
          console.log(`    Počet uzlů: ${detail.nodes}`);
        });
      }
    }

    // Celkové výsledky
    const totalViolations = Object.values(results).reduce((sum, result) => sum + result.violations, 0);

    return {
      success: totalViolations === 0,
      message: totalViolations === 0
        ? 'Všechny testy dostupnosti prošly'
        : `Nalezeno ${totalViolations} porušení dostupnosti`,
      results
    };
  } catch (error) {
    console.error('Test dostupnosti selhal:', error);

    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testAccessibility().then(result => {
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testAccessibility
};
