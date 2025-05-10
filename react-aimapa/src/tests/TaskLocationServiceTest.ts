/**
 * TaskLocationServiceTest - Testovací skript pro automatické přiřazování lokalit
 * Verze 0.4.2
 */

import taskLocationService, {
  Location,
  LocationAssignmentResult,
  LocationAssignmentStats,
  HiddenLocationDescription
} from '../services/TaskLocationService';
import simpleGeminiService from '../services/SimpleGeminiService';

// Testovací data
const testTasks = [
  {
    id: 'test-task-1',
    title: 'Navštívit Pražský hrad',
    description: 'Prohlídka Pražského hradu a katedrály sv. Víta',
    expectedLocation: { lat: 50.0911, lng: 14.4016, name: 'Pražský hrad' }
  },
  {
    id: 'test-task-2',
    title: 'Nakoupit potraviny v Brně',
    description: 'Koupit mléko, chléb a ovoce v obchodě',
    expectedLocation: { lat: 49.1951, lng: 16.6068, name: 'Brno' }
  },
  {
    id: 'test-task-3',
    title: 'Vyzvednout balík',
    description: 'Vyzvednout balík na poště v Ostravě',
    expectedLocation: { lat: 49.8209, lng: 18.2625, name: 'Ostrava' }
  },
  {
    id: 'test-task-4',
    title: 'Schůzka s klientem',
    description: 'Obchodní jednání v Plzni',
    expectedLocation: { lat: 49.7384, lng: 13.3736, name: 'Plzeň' }
  },
  {
    id: 'test-task-5',
    title: 'Výlet na Ještěd',
    description: 'Celodenní výlet na Ještěd a okolí',
    expectedLocation: { lat: 50.7325, lng: 14.9840, name: 'Ještěd' }
  },
  {
    id: 'test-task-6',
    title: 'Dokončit projekt',
    description: 'Dokončit vývoj aplikace',
    expectedLocation: null // Žádná očekávaná lokace
  },
  {
    id: 'test-task-7',
    title: 'Zavolat mamince',
    description: 'Nezapomenout zavolat mamince',
    expectedLocation: null // Žádná očekávaná lokace
  },
  {
    id: 'test-task-8',
    title: 'Návštěva ZOO',
    description: 'Návštěva ZOO v Liberci',
    expectedLocation: { lat: 50.7754, lng: 15.0779, name: 'ZOO Liberec' }
  },
  {
    id: 'test-task-9',
    title: 'Prohlídka Karlova mostu',
    description: 'Procházka po Karlově mostě v Praze',
    expectedLocation: { lat: 50.0865, lng: 14.4115, name: 'Karlův most' }
  },
  {
    id: 'test-task-10',
    title: 'Návštěva pivovaru',
    description: 'Exkurze v pivovaru Plzeňský Prazdroj',
    expectedLocation: { lat: 49.7477, lng: 13.3881, name: 'Pivovar Plzeňský Prazdroj' }
  }
];

// Funkce pro vytvoření testovacího plánu
const createTestPlan = () => {
  const planId = `test-plan-${Date.now()}`;
  
  // Vytvoření plánu
  const plan = {
    id: planId,
    title: 'Testovací plán',
    description: 'Plán pro testování automatického přiřazování lokalit',
    items: testTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: false,
      type: 'task'
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Uložení plánu do localStorage
  const savedPlans = localStorage.getItem('plans');
  let plans = [];
  
  if (savedPlans) {
    plans = JSON.parse(savedPlans);
  }
  
  plans.push(plan);
  localStorage.setItem('plans', JSON.stringify(plans));
  
  return planId;
};

// Funkce pro testování detekce lokací v textu
const testDetectLocationsInText = () => {
  console.log('=== Test detekce lokací v textu ===');
  
  let passed = 0;
  let failed = 0;
  
  testTasks.forEach(task => {
    const titleLocations = taskLocationService.detectLocationsInText(task.title);
    const descriptionLocations = taskLocationService.detectLocationsInText(task.description);
    
    console.log(`Úkol: "${task.title}"`);
    console.log(`Lokace v názvu: ${titleLocations.map(loc => loc.name).join(', ') || 'žádné'}`);
    console.log(`Lokace v popisu: ${descriptionLocations.map(loc => loc.name).join(', ') || 'žádné'}`);
    
    if (task.expectedLocation) {
      const allLocations = [...titleLocations, ...descriptionLocations];
      const found = allLocations.some(loc => 
        loc.name === task.expectedLocation.name ||
        (Math.abs(loc.lat - task.expectedLocation.lat) < 0.001 && 
         Math.abs(loc.lng - task.expectedLocation.lng) < 0.001)
      );
      
      if (found) {
        console.log('✅ Test prošel - očekávaná lokace nalezena');
        passed++;
      } else {
        console.log('❌ Test selhal - očekávaná lokace nenalezena');
        failed++;
      }
    } else {
      if (titleLocations.length === 0 && descriptionLocations.length === 0) {
        console.log('✅ Test prošel - žádná lokace nenalezena (očekáváno)');
        passed++;
      } else {
        console.log('❌ Test selhal - nalezeny lokace, ale žádná nebyla očekávána');
        failed++;
      }
    }
    
    console.log('---');
  });
  
  console.log(`Výsledek: ${passed} testů prošlo, ${failed} testů selhalo`);
  console.log('');
  
  return { passed, failed };
};

// Funkce pro testování generování skrytých popisů lokalit
const testGenerateHiddenLocationDescription = async () => {
  console.log('=== Test generování skrytých popisů lokalit ===');
  
  // Kontrola, zda máme API klíč
  if (!simpleGeminiService.getApiKey()) {
    console.warn('Nelze testovat generování skrytých popisů lokalit - chybí API klíč');
    return { passed: 0, failed: 0, skipped: testTasks.length };
  }
  
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  
  const planId = createTestPlan();
  
  for (const task of testTasks) {
    console.log(`Úkol: "${task.title}"`);
    
    try {
      const hiddenDescription = await taskLocationService.generateHiddenLocationDescription(
        task.id,
        planId,
        task.title,
        task.description
      );
      
      if (hiddenDescription) {
        console.log(`Vygenerován skrytý popis lokality:`);
        console.log(`- Počet navržených lokalit: ${hiddenDescription.suggestedLocations.length}`);
        console.log(`- Jistota: ${hiddenDescription.confidence}%`);
        console.log(`- Klíčová slova: ${hiddenDescription.keywords.join(', ') || 'žádná'}`);
        
        if (task.expectedLocation) {
          // Kontrola, zda některá z navržených lokalit odpovídá očekávané lokaci
          const found = hiddenDescription.suggestedLocations.some(loc => 
            loc.name === task.expectedLocation.name ||
            (Math.abs(loc.lat - task.expectedLocation.lat) < 0.01 && 
             Math.abs(loc.lng - task.expectedLocation.lng) < 0.01)
          );
          
          if (found) {
            console.log('✅ Test prošel - očekávaná lokace nalezena v navržených lokalitách');
            passed++;
          } else {
            console.log('❌ Test selhal - očekávaná lokace nenalezena v navržených lokalitách');
            failed++;
          }
        } else {
          if (hiddenDescription.suggestedLocations.length === 0 || hiddenDescription.confidence < 50) {
            console.log('✅ Test prošel - žádná lokace nenalezena nebo nízká jistota (očekáváno)');
            passed++;
          } else {
            console.log('❌ Test selhal - nalezeny lokace s vysokou jistotou, ale žádná nebyla očekávána');
            failed++;
          }
        }
      } else {
        console.log('Nepodařilo se vygenerovat skrytý popis lokality');
        skipped++;
      }
    } catch (error) {
      console.error('Chyba při generování skrytého popisu lokality:', error);
      skipped++;
    }
    
    console.log('---');
  }
  
  console.log(`Výsledek: ${passed} testů prošlo, ${failed} testů selhalo, ${skipped} testů přeskočeno`);
  console.log('');
  
  return { passed, failed, skipped };
};

// Funkce pro testování automatického přiřazování lokalit
const testAutoAssignLocationsToTasks = async () => {
  console.log('=== Test automatického přiřazování lokalit ===');
  
  let passed = 0;
  let failed = 0;
  
  const planId = createTestPlan();
  
  try {
    // Spuštění automatického přiřazování lokalit
    const result = await taskLocationService.autoAssignLocationsToTasks(
      planId,
      (progress) => {
        console.log(`Průběh: ${progress.processed}/${progress.total} (${progress.updated} aktualizováno, ${progress.skipped} přeskočeno)`);
      }
    );
    
    console.log(`Automatické přiřazování lokalit dokončeno:`);
    console.log(`- Celkem úkolů: ${result.total}`);
    console.log(`- Aktualizováno: ${result.updated}`);
    console.log(`- Přeskočeno: ${result.skipped}`);
    
    // Načtení aktualizovaného plánu
    const savedPlans = localStorage.getItem('plans');
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      const plan = plans.find((p: any) => p.id === planId);
      
      if (plan) {
        // Kontrola přiřazených lokalit
        for (const task of plan.items) {
          const testTask = testTasks.find(t => t.id === task.id);
          
          if (testTask) {
            console.log(`Úkol: "${task.title}"`);
            
            if (task.type === 'location' && task.location) {
              console.log(`Přiřazená lokace: ${task.location.name} (${task.location.lat}, ${task.location.lng})`);
              
              if (testTask.expectedLocation) {
                // Kontrola, zda přiřazená lokace odpovídá očekávané lokaci
                const isMatch = 
                  task.location.name === testTask.expectedLocation.name ||
                  (Math.abs(task.location.lat - testTask.expectedLocation.lat) < 0.01 && 
                   Math.abs(task.location.lng - testTask.expectedLocation.lng) < 0.01);
                
                if (isMatch) {
                  console.log('✅ Test prošel - přiřazená lokace odpovídá očekávané lokaci');
                  passed++;
                } else {
                  console.log('❌ Test selhal - přiřazená lokace neodpovídá očekávané lokaci');
                  failed++;
                }
              } else {
                console.log('❓ Test nelze vyhodnotit - žádná očekávaná lokace');
              }
            } else {
              console.log('❌ Test selhal - úkolu nebyla přiřazena lokace');
              failed++;
            }
            
            console.log('---');
          }
        }
      }
    }
  } catch (error) {
    console.error('Chyba při automatickém přiřazování lokalit:', error);
  }
  
  console.log(`Výsledek: ${passed} testů prošlo, ${failed} testů selhalo`);
  console.log('');
  
  return { passed, failed };
};

// Funkce pro spuštění všech testů
export const runAllTests = async () => {
  console.log('=== Spouštím testy automatického přiřazování lokalit ===');
  console.log('');
  
  const detectResult = testDetectLocationsInText();
  const generateResult = await testGenerateHiddenLocationDescription();
  const assignResult = await testAutoAssignLocationsToTasks();
  
  console.log('=== Souhrn výsledků testů ===');
  console.log(`Detekce lokací v textu: ${detectResult.passed} prošlo, ${detectResult.failed} selhalo`);
  console.log(`Generování skrytých popisů: ${generateResult.passed} prošlo, ${generateResult.failed} selhalo, ${generateResult.skipped} přeskočeno`);
  console.log(`Automatické přiřazování: ${assignResult.passed} prošlo, ${assignResult.failed} selhalo`);
  
  const totalPassed = detectResult.passed + generateResult.passed + assignResult.passed;
  const totalFailed = detectResult.failed + generateResult.failed + assignResult.failed;
  const totalSkipped = generateResult.skipped;
  const totalTests = totalPassed + totalFailed + totalSkipped;
  
  console.log(`Celkem: ${totalPassed} prošlo, ${totalFailed} selhalo, ${totalSkipped} přeskočeno (${totalTests} testů)`);
  console.log(`Úspěšnost: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`);
  
  return {
    detectResult,
    generateResult,
    assignResult,
    totalPassed,
    totalFailed,
    totalSkipped,
    totalTests,
    successRate: Math.round((totalPassed / (totalPassed + totalFailed)) * 100)
  };
};

export default {
  runAllTests
};
