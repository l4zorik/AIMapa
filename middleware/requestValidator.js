/**
 * Middleware pro validaci požadavků
 * Verze 0.3.8.5
 */

const { AppError } = require('./errorHandler');

const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { body, query, params } = req;
            const validationContext = { body, query, params };
            
            // Validace podle schématu
            if (schema.body && body) {
                validateObject(body, schema.body, 'body');
            }
            if (schema.query && query) {
                validateObject(query, schema.query, 'query');
            }
            if (schema.params && params) {
                validateObject(params, schema.params, 'params');
            }

            next();
        } catch (error) {
            next(new AppError(400, 'Chyba validace', error.message));
        }
    };
};

const validateObject = (obj, schema, location) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
        // Kontrola povinných polí
        if (rules.required && !obj[field]) {
            errors.push(`Pole '${field}' v ${location} je povinné`);
            continue;
        }

        if (obj[field]) {
            // Kontrola typu
            if (rules.type && typeof obj[field] !== rules.type) {
                errors.push(`Pole '${field}' v ${location} musí být typu ${rules.type}`);
            }

            // Kontrola délky pro řetězce
            if (rules.type === 'string' && rules.minLength && obj[field].length < rules.minLength) {
                errors.push(`Pole '${field}' v ${location} musí mít minimálně ${rules.minLength} znaků`);
            }

            // Kontrola hodnot pro čísla
            if (rules.type === 'number') {
                if (rules.min !== undefined && obj[field] < rules.min) {
                    errors.push(`Pole '${field}' v ${location} musí být větší než ${rules.min}`);
                }
                if (rules.max !== undefined && obj[field] > rules.max) {
                    errors.push(`Pole '${field}' v ${location} musí být menší než ${rules.max}`);
                }
            }

            // Kontrola formátu emailu
            if (rules.format === 'email' && !validateEmail(obj[field])) {
                errors.push(`Pole '${field}' v ${location} musí být platná emailová adresa`);
            }
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

module.exports = {
    validateRequest
};