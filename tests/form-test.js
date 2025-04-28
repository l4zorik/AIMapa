/**
 * Testovací skript pro ověření formulářů v AIMapa
 * Verze 0.3.8.5
 */

// Funkce pro testování formulářových prvků
function testFormElements() {
    console.log('Testování formulářových prvků...');
    
    const formElements = document.querySelectorAll('input, textarea, select');
    const issues = [];
    
    formElements.forEach((element, index) => {
        const hasId = element.hasAttribute('id');
        const hasName = element.hasAttribute('name');
        const hasLabel = document.querySelector(`label[for="${element.id}"]`);
        
        if (!hasId && !hasName) {
            issues.push({
                element: element,
                issue: 'Chybí atribut id nebo name',
                index: index
            });
        }
        
        if (hasId && !hasLabel) {
            issues.push({
                element: element,
                issue: 'Chybí label pro formulářový prvek',
                index: index
            });
        }
    });
    
    if (issues.length === 0) {
        console.log('Všechny formulářové prvky jsou v pořádku');
    } else {
        console.warn(`Nalezeno ${issues.length} problémů s formulářovými prvky:`);
        issues.forEach(issue => {
            console.warn(`- ${issue.issue} (index: ${issue.index}, element:`, issue.element, ')');
        });
    }
    
    return {
        totalElements: formElements.length,
        issues: issues
    };
}

// Funkce pro testování přístupnosti formulářů
function testFormAccessibility() {
    console.log('Testování přístupnosti formulářů...');
    
    const forms = document.querySelectorAll('form');
    const issues = [];
    
    forms.forEach((form, formIndex) => {
        // Kontrola, zda má formulář tlačítko pro odeslání
        const hasSubmitButton = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
        if (!hasSubmitButton) {
            issues.push({
                form: form,
                issue: 'Chybí tlačítko pro odeslání formuláře',
                formIndex: formIndex
            });
        }
        
        // Kontrola, zda mají všechna povinná pole označení
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach((field, fieldIndex) => {
            const fieldId = field.id;
            const label = document.querySelector(`label[for="${fieldId}"]`);
            
            if (label) {
                const hasRequiredIndicator = label.textContent.includes('*') || label.innerHTML.includes('<span') || field.hasAttribute('aria-required');
                if (!hasRequiredIndicator) {
                    issues.push({
                        form: form,
                        field: field,
                        issue: 'Povinné pole nemá označení hvězdičkou nebo aria-required',
                        formIndex: formIndex,
                        fieldIndex: fieldIndex
                    });
                }
            }
        });
    });
    
    if (issues.length === 0) {
        console.log('Všechny formuláře jsou přístupné');
    } else {
        console.warn(`Nalezeno ${issues.length} problémů s přístupností formulářů:`);
        issues.forEach(issue => {
            console.warn(`- ${issue.issue} (formulář: ${issue.formIndex})`, issue.form);
        });
    }
    
    return {
        totalForms: forms.length,
        issues: issues
    };
}

// Funkce pro testování validace formulářů
function testFormValidation() {
    console.log('Testování validace formulářů...');
    
    const forms = document.querySelectorAll('form');
    const results = [];
    
    forms.forEach((form, formIndex) => {
        // Získání všech vstupních polí
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Kontrola, zda mají vstupní pole validační atributy
        const validationInfo = {
            formIndex: formIndex,
            totalInputs: inputs.length,
            inputsWithValidation: 0,
            validationTypes: {
                required: 0,
                pattern: 0,
                minLength: 0,
                maxLength: 0,
                min: 0,
                max: 0,
                type: 0
            }
        };
        
        inputs.forEach(input => {
            let hasValidation = false;
            
            if (input.hasAttribute('required')) {
                validationInfo.validationTypes.required++;
                hasValidation = true;
            }
            
            if (input.hasAttribute('pattern')) {
                validationInfo.validationTypes.pattern++;
                hasValidation = true;
            }
            
            if (input.hasAttribute('minlength')) {
                validationInfo.validationTypes.minLength++;
                hasValidation = true;
            }
            
            if (input.hasAttribute('maxlength')) {
                validationInfo.validationTypes.maxLength++;
                hasValidation = true;
            }
            
            if (input.hasAttribute('min')) {
                validationInfo.validationTypes.min++;
                hasValidation = true;
            }
            
            if (input.hasAttribute('max')) {
                validationInfo.validationTypes.max++;
                hasValidation = true;
            }
            
            if (input.type !== 'text') {
                validationInfo.validationTypes.type++;
                hasValidation = true;
            }
            
            if (hasValidation) {
                validationInfo.inputsWithValidation++;
            }
        });
        
        results.push(validationInfo);
    });
    
    console.log('Výsledky testování validace formulářů:', results);
    
    return {
        totalForms: forms.length,
        results: results
    };
}

// Funkce pro spuštění všech testů
function runAllTests() {
    console.log('Spouštění všech testů formulářů...');
    
    // Test formulářových prvků
    const elementsResult = testFormElements();
    
    // Test přístupnosti formulářů
    const accessibilityResult = testFormAccessibility();
    
    // Test validace formulářů
    const validationResult = testFormValidation();
    
    console.log('Všechny testy byly dokončeny');
    
    // Vrácení výsledků testů
    return {
        elementsResult,
        accessibilityResult,
        validationResult
    };
}

// Export funkcí pro použití v konzoli prohlížeče
window.FormTest = {
    testFormElements,
    testFormAccessibility,
    testFormValidation,
    runAllTests
};

console.log('Testovací skript pro formuláře byl načten. Použijte FormTest.runAllTests() pro spuštění všech testů.');
