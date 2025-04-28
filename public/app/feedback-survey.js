/**
 * Modul pro zpětnou vazbu a dotazník o používání aplikace
 * Verze 0.3.8.5
 */

const FeedbackSurvey = {
    // Stav dotazníku
    surveyShown: false,

    // Inicializace dotazníku
    init() {
        console.log('Inicializace modulu zpětné vazby...');

        // Kontrola, zda již byl dotazník zobrazen nebo odmítnut
        if (localStorage.getItem('feedbackSurveyCompleted') || localStorage.getItem('feedbackSurveyDeclined') || localStorage.getItem('feedbackSurveyShown')) {
            console.log('Dotazník již byl zobrazen nebo vyplněn, přeskakuji');
            return;
        }

        // Nastavení příznaku, že dotazník byl zobrazen (i když ještě nebyl vyplněn)
        // Toto zajistí, že dotazník se zobrazí pouze jednou
        localStorage.setItem('feedbackSurveyShown', 'true');

        // Zobrazení dotazníku po 60 sekundách používání aplikace
        setTimeout(() => {
            this.showSurvey();
        }, 60000);

        console.log('Modul zpětné vazby byl inicializován');
    },

    // Zobrazení dotazníku
    showSurvey() {
        if (this.surveyShown) {
            return;
        }

        console.log('Zobrazuji dotazník zpětné vazby');
        this.surveyShown = true;

        // Vytvoření překrytí
        const overlay = document.createElement('div');
        overlay.id = 'feedbackOverlay';
        overlay.className = 'feedback-overlay';
        document.body.appendChild(overlay);

        // Vytvoření modálního okna s dotazníkem
        const surveyModal = document.createElement('div');
        surveyModal.id = 'feedbackSurvey';
        surveyModal.className = 'feedback-survey';

        // Obsah dotazníku
        surveyModal.innerHTML = `
            <div class="feedback-header">
                <h2>Krátký dotazník o používání aplikace</h2>
                <button class="feedback-close">&times;</button>
            </div>
            <div class="feedback-content">
                <p>Děkujeme, že používáte naši aplikaci! Rádi bychom znali váš názor, abychom mohli aplikaci dále vylepšovat.</p>

                <form id="feedbackForm">
                    <div class="feedback-question">
                        <label for="usage_daily">Jak často používáte tuto aplikaci?</label>
                        <div class="feedback-options">
                            <label for="usage_daily"><input type="radio" id="usage_daily" name="usage" value="daily"> Denně</label>
                            <label for="usage_weekly"><input type="radio" id="usage_weekly" name="usage" value="weekly"> Několikrát týdně</label>
                            <label for="usage_monthly"><input type="radio" id="usage_monthly" name="usage" value="monthly"> Několikrát měsíčně</label>
                            <label for="usage_rarely"><input type="radio" id="usage_rarely" name="usage" value="rarely"> Zřídka</label>
                            <label for="usage_first"><input type="radio" id="usage_first" name="usage" value="first"> Jsem zde poprvé</label>
                        </div>
                    </div>

                    <div class="feedback-question">
                        <label for="feature_map">Které funkce používáte nejčastěji?</label>
                        <div class="feedback-options">
                            <label for="feature_map"><input type="checkbox" id="feature_map" name="features" value="map"> Mapové funkce</label>
                            <label for="feature_chat"><input type="checkbox" id="feature_chat" name="features" value="chat"> Chat s AI asistentem</label>
                            <label for="feature_routes"><input type="checkbox" id="feature_routes" name="features" value="routes"> Plánování tras</label>
                            <label for="feature_poi"><input type="checkbox" id="feature_poi" name="features" value="poi"> Vyhledávání bodů zájmu</label>
                            <label for="feature_other"><input type="checkbox" id="feature_other" name="features" value="other"> Jiné</label>
                        </div>
                    </div>

                    <div class="feedback-question">
                        <label for="ui_rating_1">Jak byste ohodnotili uživatelské rozhraní aplikace?</label>
                        <div class="feedback-rating">
                            <label for="ui_rating_1"><input type="radio" id="ui_rating_1" name="ui_rating" value="1"> 1</label>
                            <label for="ui_rating_2"><input type="radio" id="ui_rating_2" name="ui_rating" value="2"> 2</label>
                            <label for="ui_rating_3"><input type="radio" id="ui_rating_3" name="ui_rating" value="3"> 3</label>
                            <label for="ui_rating_4"><input type="radio" id="ui_rating_4" name="ui_rating" value="4"> 4</label>
                            <label for="ui_rating_5"><input type="radio" id="ui_rating_5" name="ui_rating" value="5"> 5</label>
                        </div>
                        <div class="rating-labels">
                            <span>Velmi špatné</span>
                            <span>Vynikající</span>
                        </div>
                    </div>

                    <div class="feedback-question">
                        <label for="suggestions">Máte nějaké návrhy na zlepšení?</label>
                        <textarea id="suggestions" name="suggestions" rows="3" placeholder="Vaše návrhy..."></textarea>
                    </div>

                    <div class="feedback-actions">
                        <button type="submit" class="feedback-submit">Odeslat</button>
                        <button type="button" class="feedback-skip">Přeskočit</button>
                    </div>
                </form>
            </div>
        `;

        // Přidání modálního okna do dokumentu
        document.body.appendChild(surveyModal);

        // Zobrazení s animací
        setTimeout(() => {
            overlay.classList.add('show');
            surveyModal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        this.setupEventListeners();
    },

    // Zobrazení dialogu pro odmítnutí dotazníku
    showDeclineDialog() {
        console.log('Zobrazuji dialog pro odmítnutí dotazníku');

        // Skrytí dotazníku
        const surveyModal = document.getElementById('feedbackSurvey');
        surveyModal.classList.add('minimized');

        // Vytvoření dialogu pro odmítnutí
        const declineDialog = document.createElement('div');
        declineDialog.id = 'declineDialog';
        declineDialog.className = 'decline-dialog';

        // Obsah dialogu
        declineDialog.innerHTML = `
            <div class="decline-header">
                <h3>Zrušit dotazník</h3>
            </div>
            <div class="decline-content">
                <p>Rádi bychom znali váš názor, proč nechcete dotazník vyplnit:</p>

                <div class="decline-options">
                    <label for="decline_reason_no_time"><input type="radio" id="decline_reason_no_time" name="decline_reason" value="no_time"> Už to nepotřebuji vyplnit</label>
                    <label for="decline_reason_alternative"><input type="radio" id="decline_reason_alternative" name="decline_reason" value="alternative"> Mám jinou alternativu</label>
                    <label for="decline_reason_expensive"><input type="radio" id="decline_reason_expensive" name="decline_reason" value="expensive"> Je to moc drahé</label>
                    <label for="decline_reason_other"><input type="radio" id="decline_reason_other" name="decline_reason" value="other"> Jiný důvod</label>
                </div>

                <textarea id="declineComment" name="decline_comment" placeholder="Můžete přidat upřesnění důvodu..."></textarea>

                <div class="decline-actions">
                    <button id="declineSubmit" class="decline-submit">Odeslat</button>
                    <button id="declineCancel" class="decline-cancel">Zrušit</button>
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(declineDialog);

        // Zobrazení s animací
        setTimeout(() => {
            declineDialog.classList.add('show');
        }, 10);

        // Event listener pro tlačítko Odeslat
        document.getElementById('declineSubmit').addEventListener('click', () => {
            this.handleDeclineSubmit();
        });

        // Event listener pro tlačítko Zrušit
        document.getElementById('declineCancel').addEventListener('click', () => {
            this.hideDeclineDialog();
        });
    },

    // Skrytí dialogu pro odmítnutí dotazníku
    hideDeclineDialog() {
        console.log('Skrývám dialog pro odmítnutí dotazníku');

        const declineDialog = document.getElementById('declineDialog');
        const surveyModal = document.getElementById('feedbackSurvey');

        if (declineDialog) {
            declineDialog.classList.remove('show');

            setTimeout(() => {
                declineDialog.remove();

                // Obnovení dotazníku
                if (surveyModal) {
                    surveyModal.classList.remove('minimized');
                }
            }, 300);
        }
    },

    // Zpracování odmítnutí dotazníku
    handleDeclineSubmit() {
        console.log('Zpracování odmítnutí dotazníku');

        // Získání důvodu odmítnutí
        const selectedReason = document.querySelector('input[name="decline_reason"]:checked');
        const comment = document.getElementById('declineComment').value;

        // Uložení informace o odmítnutí
        const declineData = {
            reason: selectedReason ? selectedReason.value : 'not_specified',
            comment: comment,
            timestamp: new Date().toISOString()
        };

        console.log('Důvod odmítnutí:', declineData);

        // Uložení do localStorage
        localStorage.setItem('feedbackSurveyDeclined', JSON.stringify(declineData));

        // Skrytí dialogu a dotazníku
        this.closeSurvey();
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro tlačítko zavření
        const closeButton = document.querySelector('.feedback-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.showDeclineDialog();
            });
        }

        // Event listener pro tlačítko přeskočení
        const skipButton = document.querySelector('.feedback-skip');
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                this.showDeclineDialog();
            });
        }

        // Event listener pro odeslání formuláře
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Event listener pro kliknutí mimo dotazník
        const overlay = document.getElementById('feedbackOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.showDeclineDialog();
                }
            });
        }
    },

    // Zpracování odeslání dotazníku
    handleSubmit() {
        console.log('Zpracování odeslání dotazníku');

        // Získání dat z formuláře
        const form = document.getElementById('feedbackForm');
        const formData = new FormData(form);

        // Převod na objekt
        const surveyData = {};
        for (const [key, value] of formData.entries()) {
            if (key === 'features') {
                if (!surveyData[key]) {
                    surveyData[key] = [];
                }
                surveyData[key].push(value);
            } else {
                surveyData[key] = value;
            }
        }

        // Přidání časového razítka
        surveyData.timestamp = new Date().toISOString();

        console.log('Data z dotazníku:', surveyData);

        // Uložení do localStorage
        localStorage.setItem('feedbackSurveyCompleted', JSON.stringify(surveyData));

        // Zobrazení poděkování a zavření dotazníku
        this.showThankYou();
    },

    // Zobrazení poděkování
    showThankYou() {
        console.log('Zobrazení poděkování');

        const surveyModal = document.getElementById('feedbackSurvey');
        if (surveyModal) {
            surveyModal.innerHTML = `
                <div class="feedback-header">
                    <h2>Děkujeme za váš názor!</h2>
                </div>
                <div class="feedback-content thank-you">
                    <p>Vaše zpětná vazba nám pomůže vylepšit aplikaci.</p>
                    <button class="feedback-close-final">Zavřít</button>
                </div>
            `;

            // Event listener pro zavření
            const closeButton = document.querySelector('.feedback-close-final');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.closeSurvey();
                });
            }

            // Automatické zavření po 3 sekundách
            setTimeout(() => {
                this.closeSurvey();
            }, 3000);
        }
    },

    // Zavření dotazníku
    closeSurvey() {
        console.log('Zavírání dotazníku');

        const overlay = document.getElementById('feedbackOverlay');
        const surveyModal = document.getElementById('feedbackSurvey');
        const declineDialog = document.getElementById('declineDialog');

        // Skrytí s animací
        if (overlay) overlay.classList.remove('show');
        if (surveyModal) surveyModal.classList.remove('show');
        if (declineDialog) declineDialog.classList.remove('show');

        // Odstranění po dokončení animace
        setTimeout(() => {
            if (overlay) overlay.remove();
            if (surveyModal) surveyModal.remove();
            if (declineDialog) declineDialog.remove();

            this.surveyShown = false;
        }, 300);
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    FeedbackSurvey.init();
});
