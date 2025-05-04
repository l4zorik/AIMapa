/**
 * Discord Login Button Component
 * Verze 0.4.0
 */

class DiscordLoginButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        // Přidání event listenerů
        this.addEventListeners();
        
        // Kontrola stavu autentizace
        this.updateButtonState();
        
        // Poslouchání na změny stavu autentizace
        document.addEventListener('discordAuthStateChanged', () => {
            this.updateButtonState();
        });
    }

    disconnectedCallback() {
        // Odstranění event listenerů
        this.removeEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                
                .discord-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    text-decoration: none;
                    border: none;
                    outline: none;
                    min-width: 140px;
                }
                
                .login-button {
                    background-color: #5865F2;
                    color: white;
                }
                
                .login-button:hover {
                    background-color: #4752C4;
                }
                
                .logout-button {
                    background-color: #36393F;
                    color: white;
                }
                
                .logout-button:hover {
                    background-color: #2F3136;
                }
                
                .discord-icon {
                    margin-right: 8px;
                    width: 18px;
                    height: 18px;
                }
            </style>
            
            <button class="discord-button login-button" id="discordButton">
                <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path fill="white" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                <span id="buttonText">Přihlásit se přes Discord</span>
            </button>
        `;
    }

    addEventListeners() {
        const button = this.shadowRoot.getElementById('discordButton');
        button.addEventListener('click', this.handleButtonClick.bind(this));
    }

    removeEventListeners() {
        const button = this.shadowRoot.getElementById('discordButton');
        button.removeEventListener('click', this.handleButtonClick.bind(this));
    }

    handleButtonClick() {
        if (window.DiscordAuth) {
            if (window.DiscordAuth.isAuthenticated()) {
                // Odhlášení
                window.DiscordAuth.logout();
            } else {
                // Přihlášení
                window.DiscordAuth.login();
            }
        } else {
            console.error('DiscordAuth není k dispozici');
        }
    }

    updateButtonState() {
        if (!window.DiscordAuth) {
            return;
        }

        const button = this.shadowRoot.getElementById('discordButton');
        const buttonText = this.shadowRoot.getElementById('buttonText');

        if (window.DiscordAuth.isAuthenticated()) {
            // Uživatel je přihlášen - zobrazit odhlašovací tlačítko
            button.classList.remove('login-button');
            button.classList.add('logout-button');
            buttonText.textContent = 'Odhlásit se';
        } else {
            // Uživatel není přihlášen - zobrazit přihlašovací tlačítko
            button.classList.remove('logout-button');
            button.classList.add('login-button');
            buttonText.textContent = 'Přihlásit se přes Discord';
        }
    }
}

// Registrace komponenty
customElements.define('discord-login-button', DiscordLoginButton);
