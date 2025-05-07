import React, { useState } from 'react';
import './DocsPage.css';

const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('api-keys');

  const sections = [
    { id: 'api-keys', title: 'API Klíče', icon: 'key' },
    { id: 'map-providers', title: 'Poskytovatelé Map', icon: 'map' },
    { id: 'ai-models', title: 'AI Modely', icon: 'robot' },
    { id: 'security', title: 'Bezpečnost', icon: 'shield-alt' },
    { id: 'pricing', title: 'Ceník a Efektivita', icon: 'dollar-sign' },
    { id: 'faq', title: 'Časté Dotazy', icon: 'question-circle' }
  ];

  return (
    <div className="docs-page">
      <h1>Dokumentace AIMapa</h1>
      <p className="docs-intro">
        Vítejte v dokumentaci aplikace AIMapa. Zde najdete všechny potřebné informace o používání aplikace,
        nastavení API klíčů, poskytovatelích map a dalších důležitých funkcích.
      </p>

      <div className="docs-container">
        <div className="docs-sidebar">
          <nav className="docs-nav">
            <ul>
              {sections.map(section => (
                <li key={section.id}>
                  <button
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <i className={`fas fa-${section.icon}`}></i>
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="docs-content">
          {activeSection === 'api-keys' && (
            <div className="docs-section">
              <h2>API Klíče</h2>
              
              <div className="docs-subsection">
                <h3>Co jsou API klíče?</h3>
                <p>
                  API klíče jsou unikátní identifikátory, které umožňují přístup k různým službám třetích stran.
                  V aplikaci AIMapa používáme API klíče pro přístup k:
                </p>
                <ul>
                  <li>AI modelům (OpenAI, Google Gemini, Anthropic Claude, DeepSeek)</li>
                  <li>Mapovým službám (Mapbox, Google Maps)</li>
                  <li>Dalším službám pro vyhledávání a navigaci</li>
                </ul>
              </div>
              
              <div className="docs-subsection">
                <h3>Jak získat API klíče</h3>
                <p>Pro získání API klíčů je potřeba se zaregistrovat u příslušných poskytovatelů:</p>
                
                <div className="provider-info">
                  <h4>OpenAI API</h4>
                  <p>
                    Registrujte se na <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>,
                    vytvořte si účet a vygenerujte API klíč v sekci API Keys.
                  </p>
                  <div className="provider-pricing">
                    <strong>Ceny:</strong> Od $0.0005 za 1K tokenů (závisí na modelu)
                  </div>
                </div>
                
                <div className="provider-info">
                  <h4>Google AI (Gemini)</h4>
                  <p>
                    Navštivte <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>,
                    přihlaste se pomocí Google účtu a vygenerujte API klíč v sekci API Keys.
                  </p>
                  <div className="provider-pricing">
                    <strong>Ceny:</strong> $0.000125 za 1K vstupních znaků, $0.000375 za 1K výstupních znaků (Gemini Pro)
                  </div>
                </div>
                
                <div className="provider-info">
                  <h4>Anthropic Claude</h4>
                  <p>
                    Registrujte se na <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic Console</a>,
                    vytvořte si účet a vygenerujte API klíč.
                  </p>
                  <div className="provider-pricing">
                    <strong>Ceny:</strong> Od $0.025 za 1K vstupních tokenů, $0.075 za 1K výstupních tokenů (Claude 3)
                  </div>
                </div>
                
                <div className="provider-info">
                  <h4>Mapbox</h4>
                  <p>
                    Registrujte se na <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">Mapbox</a>,
                    vytvořte si účet a vygenerujte API klíč v sekci Access Tokens.
                  </p>
                  <div className="provider-pricing">
                    <strong>Ceny:</strong> Zdarma do 50,000 zobrazení map měsíčně
                  </div>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Bezpečnost API klíčů</h3>
                <div className="security-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div>
                    <strong>Důležité upozornění:</strong>
                    <p>
                      API klíče jsou velmi citlivé údaje, které by nikdy neměly být sdíleny s ostatními nebo ukládány
                      v nezabezpečených místech. V aplikaci AIMapa jsou vaše API klíče:
                    </p>
                    <ul>
                      <li>Ukládány v zašifrované podobě</li>
                      <li>Nikdy nejsou zobrazeny v plném znění</li>
                      <li>Nikdy nejsou odesílány na servery třetích stran</li>
                      <li>Používány pouze pro autorizované požadavky na příslušné API</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Správa API klíčů v aplikaci</h3>
                <p>
                  V aplikaci AIMapa můžete spravovat své API klíče v sekci "Nastavení" na stránce s mapou.
                  Zde můžete:
                </p>
                <ul>
                  <li>Přidat nové API klíče</li>
                  <li>Aktivovat nebo deaktivovat existující klíče</li>
                  <li>Sledovat využití klíčů a limity</li>
                  <li>Nastavit maximální limity nákladů pro jednotlivé požadavky</li>
                </ul>
                <p>
                  Pro maximální bezpečnost doporučujeme:
                </p>
                <ul>
                  <li>Pravidelně obměňovat API klíče</li>
                  <li>Nastavit limity nákladů pro prevenci neočekávaných výdajů</li>
                  <li>Deaktivovat klíče, které aktuálně nepoužíváte</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'map-providers' && (
            <div className="docs-section">
              <h2>Poskytovatelé Map</h2>
              
              <div className="docs-subsection">
                <h3>Dostupní poskytovatelé map</h3>
                <p>
                  AIMapa podporuje několik poskytovatelů mapových podkladů, každý s vlastními výhodami:
                </p>
                
                <div className="provider-cards">
                  <div className="provider-card">
                    <h4>OpenStreetMap</h4>
                    <div className="provider-logo">
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <p>Otevřená a svobodná mapa světa vytvářená komunitou.</p>
                    <div className="provider-features">
                      <span className="feature">Zdarma</span>
                      <span className="feature">Globální pokrytí</span>
                      <span className="feature">Komunitní data</span>
                    </div>
                  </div>
                  
                  <div className="provider-card">
                    <h4>Mapy.cz</h4>
                    <div className="provider-logo">
                      <i className="fas fa-map"></i>
                    </div>
                    <p>České mapové podklady s vynikajícím pokrytím střední Evropy.</p>
                    <div className="provider-features">
                      <span className="feature">Zdarma</span>
                      <span className="feature">Turistické mapy</span>
                      <span className="feature">Detailní ČR/SK</span>
                    </div>
                  </div>
                  
                  <div className="provider-card">
                    <h4>Google Maps</h4>
                    <div className="provider-logo">
                      <i className="fas fa-globe"></i>
                    </div>
                    <p>Nejpopulárnější mapová služba s globálním pokrytím a Street View.</p>
                    <div className="provider-features">
                      <span className="feature">Vyžaduje API klíč</span>
                      <span className="feature">Street View</span>
                      <span className="feature">Satelitní snímky</span>
                    </div>
                  </div>
                  
                  <div className="provider-card">
                    <h4>Mapbox</h4>
                    <div className="provider-logo">
                      <i className="fas fa-map-pin"></i>
                    </div>
                    <p>Přizpůsobitelné mapy s pokročilými funkcemi pro vývojáře.</p>
                    <div className="provider-features">
                      <span className="feature">Vyžaduje API klíč</span>
                      <span className="feature">Vlastní styly</span>
                      <span className="feature">Vektorové dlaždice</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Jak změnit poskytovatele map</h3>
                <p>
                  Poskytovatele map můžete změnit přímo na stránce s mapou pomocí rozbalovacího menu
                  "Poskytovatel mapy" v horní části mapy.
                </p>
                <div className="tip-box">
                  <i className="fas fa-lightbulb"></i>
                  <div>
                    <strong>Tip:</strong> Pro nejlepší výsledky při hledání míst v České republice
                    doporučujeme používat Mapy.cz, které mají nejdetailnější pokrytí této oblasti.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ai-models' && (
            <div className="docs-section">
              <h2>AI Modely</h2>
              
              <div className="docs-subsection">
                <h3>Podporované AI modely</h3>
                <p>
                  AIMapa podporuje několik pokročilých AI modelů pro zpracování přirozeného jazyka
                  a interakci s mapou:
                </p>
                
                <div className="model-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>Poskytovatel</th>
                        <th>Efektivita pro mapy</th>
                        <th>Cena</th>
                        <th>Kontext</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>GPT-4</td>
                        <td>OpenAI</td>
                        <td>92%</td>
                        <td>$0.03/1K vstup, $0.06/1K výstup</td>
                        <td>8K tokenů</td>
                      </tr>
                      <tr>
                        <td>Gemini Pro</td>
                        <td>Google</td>
                        <td>95%</td>
                        <td>$0.000125/1K vstup, $0.000375/1K výstup</td>
                        <td>32K tokenů</td>
                      </tr>
                      <tr>
                        <td>Claude 3</td>
                        <td>Anthropic</td>
                        <td>88%</td>
                        <td>$0.025/1K vstup, $0.075/1K výstup</td>
                        <td>100K tokenů</td>
                      </tr>
                      <tr>
                        <td>DeepSeek Coder</td>
                        <td>DeepSeek</td>
                        <td>82%</td>
                        <td>$0.0002/1K vstup, $0.0006/1K výstup</td>
                        <td>16K tokenů</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Jak vybrat správný model</h3>
                <p>
                  Výběr správného AI modelu závisí na vašich potřebách a rozpočtu:
                </p>
                <ul>
                  <li><strong>Gemini Pro</strong> - Nejlepší poměr cena/výkon pro práci s mapami, vynikající znalost geografických dat</li>
                  <li><strong>GPT-4</strong> - Nejpokročilejší model s vynikajícím porozuměním kontextu, ale dražší</li>
                  <li><strong>Claude 3</strong> - Výborný pro dlouhé konverzace a komplexní dotazy</li>
                  <li><strong>DeepSeek Coder</strong> - Nejlevnější varianta s dobrou základní funkcionalitou</li>
                </ul>
                <div className="tip-box">
                  <i className="fas fa-lightbulb"></i>
                  <div>
                    <strong>Tip:</strong> Pro běžné použití doporučujeme Gemini Pro, který nabízí nejlepší
                    poměr cena/výkon a má vynikající znalosti geografických dat.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="docs-section">
              <h2>Bezpečnost</h2>
              
              <div className="docs-subsection">
                <h3>Zabezpečení API klíčů</h3>
                <p>
                  Bezpečnost vašich API klíčů je naší nejvyšší prioritou. V aplikaci AIMapa jsou implementována
                  následující bezpečnostní opatření:
                </p>
                <ul>
                  <li><strong>Šifrování v klidu</strong> - Všechny API klíče jsou ukládány v zašifrované podobě</li>
                  <li><strong>Maskování klíčů</strong> - API klíče jsou vždy zobrazeny pouze částečně</li>
                  <li><strong>Lokální zpracování</strong> - API klíče jsou používány pouze lokálně ve vašem prohlížeči</li>
                  <li><strong>Bezpečné API volání</strong> - Všechna API volání jsou prováděna přes zabezpečené HTTPS spojení</li>
                  <li><strong>Limity nákladů</strong> - Možnost nastavit maximální limity nákladů pro prevenci zneužití</li>
                </ul>
              </div>
              
              <div className="docs-subsection">
                <h3>Doporučení pro bezpečnost</h3>
                <div className="security-tips">
                  <div className="security-tip">
                    <i className="fas fa-key"></i>
                    <div>
                      <strong>Pravidelně obměňujte API klíče</strong>
                      <p>Doporučujeme pravidelně generovat nové API klíče a rušit staré.</p>
                    </div>
                  </div>
                  
                  <div className="security-tip">
                    <i className="fas fa-user-lock"></i>
                    <div>
                      <strong>Používejte silné heslo</strong>
                      <p>Pro váš účet v aplikaci AIMapa i pro účty u poskytovatelů API.</p>
                    </div>
                  </div>
                  
                  <div className="security-tip">
                    <i className="fas fa-shield-alt"></i>
                    <div>
                      <strong>Nastavte limity využití</strong>
                      <p>U poskytovatelů API nastavte maximální limity využití pro prevenci zneužití.</p>
                    </div>
                  </div>
                  
                  <div className="security-tip">
                    <i className="fas fa-eye-slash"></i>
                    <div>
                      <strong>Nesdílejte API klíče</strong>
                      <p>Nikdy nesdílejte své API klíče s ostatními uživateli nebo na veřejných místech.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pricing' && (
            <div className="docs-section">
              <h2>Ceník a Efektivita</h2>
              
              <div className="docs-subsection">
                <h3>Ceník API poskytovatelů</h3>
                <p>
                  Používání externích API služeb může být spojeno s náklady. Zde je přehled cen
                  jednotlivých poskytovatelů:
                </p>
                
                <div className="pricing-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Poskytovatel</th>
                        <th>Služba</th>
                        <th>Cena</th>
                        <th>Bezplatný limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>OpenAI</td>
                        <td>GPT-4</td>
                        <td>$0.03/1K vstup, $0.06/1K výstup</td>
                        <td>Žádný</td>
                      </tr>
                      <tr>
                        <td>Google</td>
                        <td>Gemini Pro</td>
                        <td>$0.000125/1K vstup, $0.000375/1K výstup</td>
                        <td>$10 kredit při registraci</td>
                      </tr>
                      <tr>
                        <td>Anthropic</td>
                        <td>Claude 3</td>
                        <td>$0.025/1K vstup, $0.075/1K výstup</td>
                        <td>Žádný</td>
                      </tr>
                      <tr>
                        <td>DeepSeek</td>
                        <td>DeepSeek Coder</td>
                        <td>$0.0002/1K vstup, $0.0006/1K výstup</td>
                        <td>Omezený počet požadavků</td>
                      </tr>
                      <tr>
                        <td>Mapbox</td>
                        <td>Maps API</td>
                        <td>$0.50 za 1000 zobrazení nad limit</td>
                        <td>50,000 zobrazení/měsíc</td>
                      </tr>
                      <tr>
                        <td>Google</td>
                        <td>Maps API</td>
                        <td>$7 za 1000 zobrazení</td>
                        <td>$200 kredit/měsíc</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Efektivita modelů pro práci s mapou</h3>
                <p>
                  Různé AI modely mají různou efektivitu při práci s mapovými daty a geografickými dotazy.
                  Naše hodnocení efektivity je založeno na:
                </p>
                <ul>
                  <li>Přesnosti geografických znalostí</li>
                  <li>Schopnosti porozumět komplexním dotazům o lokacích</li>
                  <li>Efektivitě při plánování tras</li>
                  <li>Poměru cena/výkon</li>
                </ul>
                
                <div className="efficiency-chart">
                  <div className="chart-bar">
                    <div className="chart-label">Gemini Pro</div>
                    <div className="chart-value" style={{ width: '95%' }}>95%</div>
                  </div>
                  <div className="chart-bar">
                    <div className="chart-label">GPT-4</div>
                    <div className="chart-value" style={{ width: '92%' }}>92%</div>
                  </div>
                  <div className="chart-bar">
                    <div className="chart-label">Claude 3</div>
                    <div className="chart-value" style={{ width: '88%' }}>88%</div>
                  </div>
                  <div className="chart-bar">
                    <div className="chart-label">DeepSeek</div>
                    <div className="chart-value" style={{ width: '82%' }}>82%</div>
                  </div>
                </div>
              </div>
              
              <div className="docs-subsection">
                <h3>Optimalizace nákladů</h3>
                <p>
                  Pro optimalizaci nákladů při používání AI modelů doporučujeme:
                </p>
                <ul>
                  <li>Nastavit maximální limit nákladů na jeden požadavek</li>
                  <li>Používat Gemini Pro pro nejlepší poměr cena/výkon</li>
                  <li>Formulovat dotazy stručně a jasně</li>
                  <li>Využívat cachování odpovědí pro opakované dotazy</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="docs-section">
              <h2>Časté Dotazy</h2>
              
              <div className="faq-list">
                <div className="faq-item">
                  <div className="faq-question">
                    <i className="fas fa-question-circle"></i>
                    <h3>Jsou moje API klíče v bezpečí?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Ano, vaše API klíče jsou v aplikaci AIMapa maximálně zabezpečeny. Jsou ukládány v zašifrované podobě,
                      nikdy nejsou zobrazeny v plném znění a jsou používány pouze lokálně ve vašem prohlížeči.
                      Nikdy nejsou odesílány na naše servery ani sdíleny s třetími stranami.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <i className="fas fa-question-circle"></i>
                    <h3>Kolik mě bude stát používání AI funkcí?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Náklady závisí na vybraném AI modelu a četnosti používání. Například při použití
                      Gemini Pro stojí typický dotaz a odpověď přibližně $0.001 - $0.005. Můžete nastavit
                      maximální limit nákladů na jeden požadavek, aby nedošlo k neočekávaným výdajům.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <i className="fas fa-question-circle"></i>
                    <h3>Který mapový poskytovatel je nejlepší?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Záleží na vašich potřebách. Pro Českou republiku a okolí doporučujeme Mapy.cz,
                      které mají nejdetailnější pokrytí této oblasti. Pro globální použití je
                      OpenStreetMap dobrou bezplatnou volbou, zatímco Google Maps nabízí nejkvalitnější
                      satelitní snímky a Street View.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <i className="fas fa-question-circle"></i>
                    <h3>Jak mohu optimalizovat náklady na AI?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Pro optimalizaci nákladů doporučujeme:
                    </p>
                    <ul>
                      <li>Používat Gemini Pro, který má nejlepší poměr cena/výkon</li>
                      <li>Formulovat dotazy stručně a jasně</li>
                      <li>Nastavit maximální limit nákladů na jeden požadavek</li>
                      <li>Využívat cachování odpovědí pro opakované dotazy</li>
                    </ul>
                  </div>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <i className="fas fa-question-circle"></i>
                    <h3>Proč je můj API klíč označen jako neplatný?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>
                      API klíč může být označen jako neplatný z několika důvodů:
                    </p>
                    <ul>
                      <li>Klíč nemá správný formát pro daného poskytovatele</li>
                      <li>Klíč byl zrušen nebo deaktivován poskytovatelem</li>
                      <li>Překročili jste limit požadavků nebo kredit u poskytovatele</li>
                      <li>Klíč nemá dostatečná oprávnění pro požadované operace</li>
                    </ul>
                    <p>
                      Zkontrolujte platnost klíče v administraci příslušného poskytovatele a případně
                      vygenerujte nový klíč.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
