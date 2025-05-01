// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupProfilePanel();
    loadUserProfile();
    setupNetlifyLinks();
});

// Setup links for Netlify deployment
function setupNetlifyLinks() {
    // Check if we're running on Netlify
    if (window.location.hostname !== 'localhost') {
        // Update profile link
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            profileLink.href = '/profile.html';
        }

        // Update logout link
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.href = '/.netlify/functions/server/logout';
        }
    }
}

// Initialize Leaflet map
function initMap() {
    // Center on Prague, Czech Republic
    const map = L.map('map').setView([50.0755, 14.4378], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add a marker for demonstration
    L.marker([50.0755, 14.4378])
        .addTo(map)
        .bindPopup('Prague, Czech Republic')
        .openPopup();
}

// Setup profile panel toggle
function setupProfilePanel() {
    const profileBtn = document.getElementById('profile-btn');
    const profilePanel = document.getElementById('profile-panel');

    profileBtn.addEventListener('click', () => {
        profilePanel.classList.toggle('hidden');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
        if (!profilePanel.contains(event.target) && event.target !== profileBtn) {
            profilePanel.classList.add('hidden');
        }
    });
}

// Load user profile information
function loadUserProfile() {
    // Determine if we're running on Netlify or locally
    const apiUrl = window.location.hostname === 'localhost'
        ? '/user'
        : '/.netlify/functions/server/user';

    fetch(apiUrl)
        .then(response => response.json())
        .then(user => {
            const userDetails = document.getElementById('user-details');

            // Základní informace z Auth0
            let html = `
                <p><strong>Jméno:</strong> ${user.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                <p><strong>Poslední přihlášení:</strong> ${new Date(user.updated_at).toLocaleString() || 'N/A'}</p>
            `;

            // Přidání informací z Supabase profilu, pokud existují
            if (user.profile) {
                html += `
                    <hr>
                    <h4>Profil z databáze</h4>
                    <p><strong>ID:</strong> ${user.profile.id || 'N/A'}</p>
                    <p><strong>Vytvořeno:</strong> ${new Date(user.profile.created_at).toLocaleString() || 'N/A'}</p>
                    <p><strong>Poslední přihlášení v DB:</strong> ${new Date(user.profile.last_login).toLocaleString() || 'N/A'}</p>
                `;
            }

            userDetails.innerHTML = html;
        })
        .catch(error => {
            console.error('Chyba při načítání uživatelského profilu:', error);
            document.getElementById('user-details').innerHTML = 'Chyba při načítání dat profilu.';
        });
}
