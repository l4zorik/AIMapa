/**
 * Chat klient pro klientskou část aplikace
 * Verze 0.3.8.7
 */

// Konfigurace
let chatConfig = {
  model: 'gpt-4',
  conversationId: null,
  messages: [],
  isLoading: false
};

// Inicializace chat klienta
async function initChatClient() {
  try {
    // Generování ID konverzace
    chatConfig.conversationId = generateConversationId();
    
    // Načtení historie konverzací, pokud je uživatel přihlášen
    if (await Auth0Client.isAuthenticated()) {
      await loadChatHistory();
    }
    
    console.log('Chat klient byl inicializován');
    
    return chatConfig;
  } catch (error) {
    console.error('Chyba při inicializaci chat klienta:', error);
    throw error;
  }
}

// Odeslání zprávy
async function sendMessage(message, context = {}) {
  try {
    if (!message) {
      throw new Error('Zpráva je povinná');
    }
    
    // Kontrola, zda není již zpracovávána jiná zpráva
    if (chatConfig.isLoading) {
      console.log('Již se zpracovává jiná zpráva, počkejte prosím');
      return;
    }
    
    chatConfig.isLoading = true;
    
    // Přidání zprávy uživatele do UI
    addMessageToUI('user', message);
    
    // Přidání zprávy uživatele do historie
    chatConfig.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Přidání načítacího indikátoru
    const loadingId = addLoadingIndicator();
    
    try {
      // Kontrola, zda je uživatel přihlášen
      const isAuthenticated = await Auth0Client.isAuthenticated();
      
      if (!isAuthenticated) {
        // Pokud uživatel není přihlášen, zobrazíme výzvu k přihlášení
        removeLoadingIndicator(loadingId);
        addMessageToUI('system', 'Pro použití chatu se prosím přihlaste. Přihlášení vám umožní ukládat historii konverzací a využívat pokročilé funkce.');
        chatConfig.isLoading = false;
        return;
      }
      
      // Odeslání požadavku na server
      const response = await fetch('/api/llm/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: message,
          conversationId: chatConfig.conversationId,
          context
        })
      });
      
      if (!response.ok) {
        throw new Error(`Chyba při komunikaci se serverem: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Neznámá chyba při získávání odpovědi');
      }
      
      // Odstranění načítacího indikátoru
      removeLoadingIndicator(loadingId);
      
      // Přidání odpovědi do UI
      addMessageToUI('assistant', data.response.text);
      
      // Přidání odpovědi do historie
      chatConfig.messages.push({
        role: 'assistant',
        content: data.response.text,
        timestamp: new Date().toISOString(),
        model: data.response.model
      });
      
      // Uložení konverzace do lokálního úložiště
      saveConversationToLocalStorage();
      
      // Uložení konverzace do Supabase, pokud je uživatel přihlášen
      if (isAuthenticated) {
        await saveConversationToSupabase();
      }
      
      return data.response;
    } catch (error) {
      // Odstranění načítacího indikátoru
      removeLoadingIndicator(loadingId);
      
      // Přidání chybové zprávy do UI
      addMessageToUI('system', `Chyba: ${error.message}`);
      
      console.error('Chyba při odesílání zprávy:', error);
      throw error;
    } finally {
      chatConfig.isLoading = false;
    }
  } catch (error) {
    console.error('Chyba při odesílání zprávy:', error);
    chatConfig.isLoading = false;
    throw error;
  }
}

// Přidání zprávy do UI
function addMessageToUI(role, content) {
  const chatMessages = document.getElementById('chat-messages');
  
  // Vytvoření elementu zprávy
  const messageElement = document.createElement('div');
  messageElement.className = `message ${role}`;
  
  // Vytvoření obsahu zprávy
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  // Zpracování Markdown
  if (role === 'assistant') {
    messageContent.innerHTML = marked.parse(content);
    
    // Zvýraznění syntaxe kódu
    messageContent.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    messageContent.textContent = content;
  }
  
  // Přidání obsahu zprávy do elementu zprávy
  messageElement.appendChild(messageContent);
  
  // Přidání meta informací
  const messageMeta = document.createElement('div');
  messageMeta.className = 'message-meta';
  messageMeta.textContent = new Date().toLocaleTimeString();
  messageElement.appendChild(messageMeta);
  
  // Přidání elementu zprávy do chatu
  chatMessages.appendChild(messageElement);
  
  // Scrollování na konec chatu
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Přidání načítacího indikátoru
function addLoadingIndicator() {
  const chatMessages = document.getElementById('chat-messages');
  
  // Vytvoření elementu zprávy
  const messageElement = document.createElement('div');
  messageElement.className = 'message assistant loading';
  messageElement.id = `loading-${Date.now()}`;
  
  // Vytvoření obsahu zprávy
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  // Vytvoření načítacího indikátoru
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.textContent = 'AI přemýšlí';
  
  const loadingDots = document.createElement('div');
  loadingDots.className = 'loading-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    loadingDots.appendChild(dot);
  }
  
  loadingElement.appendChild(loadingDots);
  messageContent.appendChild(loadingElement);
  
  // Přidání obsahu zprávy do elementu zprávy
  messageElement.appendChild(messageContent);
  
  // Přidání elementu zprávy do chatu
  chatMessages.appendChild(messageElement);
  
  // Scrollování na konec chatu
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageElement.id;
}

// Odstranění načítacího indikátoru
function removeLoadingIndicator(id) {
  const loadingElement = document.getElementById(id);
  
  if (loadingElement) {
    loadingElement.remove();
  }
}

// Generování ID konverzace
function generateConversationId() {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Uložení konverzace do lokálního úložiště
function saveConversationToLocalStorage() {
  try {
    // Získání existujících konverzací
    const conversations = JSON.parse(localStorage.getItem('chatConversations') || '{}');
    
    // Přidání nebo aktualizace aktuální konverzace
    conversations[chatConfig.conversationId] = {
      id: chatConfig.conversationId,
      messages: chatConfig.messages,
      model: chatConfig.model,
      updatedAt: new Date().toISOString()
    };
    
    // Uložení konverzací do lokálního úložiště
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  } catch (error) {
    console.error('Chyba při ukládání konverzace do lokálního úložiště:', error);
  }
}

// Uložení konverzace do Supabase
async function saveConversationToSupabase() {
  try {
    // Kontrola, zda je uživatel přihlášen
    if (!await Auth0Client.isAuthenticated()) {
      return;
    }
    
    // Získání ID uživatele
    const userProfile = await Auth0Client.getUserProfile();
    const userId = userProfile.sub;
    
    // Získání Supabase klienta
    const supabaseClient = SupabaseClient.getSupabaseClient();
    
    // Uložení konverzace do Supabase
    const { data, error } = await supabaseClient
      .from('conversations')
      .upsert({
        id: chatConfig.conversationId,
        user_id: userId,
        messages: chatConfig.messages,
        model: chatConfig.model,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    console.log('Konverzace byla úspěšně uložena do Supabase');
  } catch (error) {
    console.error('Chyba při ukládání konverzace do Supabase:', error);
  }
}

// Načtení historie konverzací
async function loadChatHistory() {
  try {
    // Kontrola, zda je uživatel přihlášen
    if (!await Auth0Client.isAuthenticated()) {
      return;
    }
    
    // Získání ID uživatele
    const userProfile = await Auth0Client.getUserProfile();
    const userId = userProfile.sub;
    
    // Získání Supabase klienta
    const supabaseClient = SupabaseClient.getSupabaseClient();
    
    // Načtení konverzací z Supabase
    const { data, error } = await supabaseClient
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Aktualizace seznamu konverzací v UI
      updateChatHistoryUI(data);
      
      // Načtení poslední konverzace
      loadConversation(data[0].id);
    }
    
    console.log('Historie konverzací byla úspěšně načtena');
  } catch (error) {
    console.error('Chyba při načítání historie konverzací:', error);
  }
}

// Aktualizace seznamu konverzací v UI
function updateChatHistoryUI(conversations) {
  try {
    const chatHistoryList = document.getElementById('chat-history-list');
    
    // Vyčištění seznamu
    chatHistoryList.innerHTML = '';
    
    // Přidání aktuální konverzace
    const currentChatItem = document.createElement('li');
    currentChatItem.textContent = 'Aktuální chat';
    currentChatItem.className = 'active';
    currentChatItem.addEventListener('click', () => {
      startNewChat();
    });
    chatHistoryList.appendChild(currentChatItem);
    
    // Přidání konverzací do seznamu
    conversations.forEach(conversation => {
      const chatItem = document.createElement('li');
      
      // Získání první zprávy uživatele jako název konverzace
      const firstUserMessage = conversation.messages.find(msg => msg.role === 'user');
      chatItem.textContent = firstUserMessage ? 
        firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '') : 
        `Chat ${new Date(conversation.updated_at).toLocaleDateString()}`;
      
      chatItem.dataset.id = conversation.id;
      chatItem.addEventListener('click', () => {
        // Odstranění třídy active ze všech položek
        document.querySelectorAll('#chat-history-list li').forEach(item => {
          item.classList.remove('active');
        });
        
        // Přidání třídy active k vybrané položce
        chatItem.classList.add('active');
        
        // Načtení konverzace
        loadConversation(conversation.id);
      });
      
      chatHistoryList.appendChild(chatItem);
    });
  } catch (error) {
    console.error('Chyba při aktualizaci seznamu konverzací v UI:', error);
  }
}

// Načtení konverzace
async function loadConversation(conversationId) {
  try {
    // Kontrola, zda je uživatel přihlášen
    if (!await Auth0Client.isAuthenticated()) {
      return;
    }
    
    // Získání ID uživatele
    const userProfile = await Auth0Client.getUserProfile();
    const userId = userProfile.sub;
    
    // Získání Supabase klienta
    const supabaseClient = SupabaseClient.getSupabaseClient();
    
    // Načtení konverzace z Supabase
    const { data, error } = await supabaseClient
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Aktualizace konfigurace
      chatConfig.conversationId = data.id;
      chatConfig.messages = data.messages;
      chatConfig.model = data.model;
      
      // Aktualizace UI
      updateChatUI();
      
      // Aktualizace výběru modelu
      document.getElementById('model-select').value = data.model;
      
      console.log('Konverzace byla úspěšně načtena');
    }
  } catch (error) {
    console.error('Chyba při načítání konverzace:', error);
  }
}

// Aktualizace UI chatu
function updateChatUI() {
  try {
    const chatMessages = document.getElementById('chat-messages');
    
    // Vyčištění chatu
    chatMessages.innerHTML = '';
    
    // Přidání systémové zprávy
    addMessageToUI('system', 'Vítejte v AI Asistentovi! Jak vám mohu pomoci s mapou nebo navigací?');
    
    // Přidání zpráv do UI
    chatConfig.messages.forEach(message => {
      addMessageToUI(message.role, message.content);
    });
  } catch (error) {
    console.error('Chyba při aktualizaci UI chatu:', error);
  }
}

// Zahájení nového chatu
function startNewChat() {
  try {
    // Generování nového ID konverzace
    chatConfig.conversationId = generateConversationId();
    
    // Vyčištění zpráv
    chatConfig.messages = [];
    
    // Aktualizace UI
    updateChatUI();
    
    // Aktualizace seznamu konverzací v UI
    document.querySelectorAll('#chat-history-list li').forEach(item => {
      item.classList.remove('active');
    });
    
    document.querySelector('#chat-history-list li:first-child').classList.add('active');
    
    console.log('Nový chat byl zahájen');
  } catch (error) {
    console.error('Chyba při zahájení nového chatu:', error);
  }
}

// Export chatu
function exportChat() {
  try {
    // Kontrola, zda jsou k dispozici zprávy
    if (chatConfig.messages.length === 0) {
      alert('Není k dispozici žádná konverzace k exportu');
      return;
    }
    
    // Vytvoření obsahu exportu
    let exportContent = `# AI Asistent - Export konverzace\n\n`;
    exportContent += `Datum: ${new Date().toLocaleString()}\n`;
    exportContent += `Model: ${chatConfig.model}\n\n`;
    
    // Přidání zpráv
    chatConfig.messages.forEach(message => {
      exportContent += `## ${message.role === 'user' ? 'Uživatel' : 'AI'}\n\n`;
      exportContent += `${message.content}\n\n`;
      exportContent += `*${new Date(message.timestamp).toLocaleString()}*\n\n`;
      exportContent += `---\n\n`;
    });
    
    // Vytvoření Blob
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    
    // Vytvoření URL
    const url = URL.createObjectURL(blob);
    
    // Vytvoření odkazu
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.md`;
    
    // Kliknutí na odkaz
    a.click();
    
    // Uvolnění URL
    URL.revokeObjectURL(url);
    
    console.log('Chat byl úspěšně exportován');
  } catch (error) {
    console.error('Chyba při exportu chatu:', error);
    alert(`Chyba při exportu chatu: ${error.message}`);
  }
}

// Nastavení modelu
function setModel(model) {
  try {
    chatConfig.model = model;
    
    // Přidání systémové zprávy do UI
    addMessageToUI('system', `Model byl změněn na ${model}`);
    
    console.log(`Model byl změněn na ${model}`);
  } catch (error) {
    console.error('Chyba při nastavení modelu:', error);
  }
}

// Export funkcí
const ChatClient = {
  initChatClient,
  sendMessage,
  startNewChat,
  exportChat,
  setModel
};
