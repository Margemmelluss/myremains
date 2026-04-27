
const SUPABASE_URL = 'https://qpdfidabecwtgnsyydun.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YPHjlVieVjOB6L12DJ6D5Q_rHQv-qyG';

// Initialize Supabase Client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const tileForm = document.getElementById('tileForm');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const dateInput = document.getElementById('date');
const charCountSpan = document.getElementById('charCount');
const submitBtn = document.querySelector('.submit-btn');
const formMessage = document.getElementById('formMessage');
const tilesGrid = document.getElementById('tilesGrid');
const loadingMessage = document.getElementById('loadingMessage');

// ============================================================================
// INITIALIZATION
// ============================================================================

// Set today's date as default
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Load existing tiles on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTiles();
});

// ============================================================================
// CHARACTER COUNTER
// ============================================================================

messageInput.addEventListener('input', () => {
    charCountSpan.textContent = messageInput.value.length;
});

// ============================================================================
// FORM SUBMISSION
// ============================================================================

tileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button to prevent double-submission
    submitBtn.disabled = true;
    clearFormMessage();

    try {
        // Validate inputs
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        const date = dateInput.value;

        if (!name || !message || !date) {
            showFormMessage('Please fill in all fields.', 'error');
            submitBtn.disabled = false;
            return;
        }

        if (name.length > 50) {
            showFormMessage('Name is too long (max 50 characters).', 'error');
            submitBtn.disabled = false;
            return;
        }

        if (message.length > 200) {
            showFormMessage('Message is too long (max 200 characters).', 'error');
            submitBtn.disabled = false;
            return;
        }

        // Insert tile into Supabase
        const { error } = await supabase
            .from('tiles')
            .insert([
                {
                    name: name,
                    message: message,
                    date: date,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            showFormMessage('Error adding tile. Please try again.', 'error');
            submitBtn.disabled = false;
            return;
        }

        // Success
        showFormMessage('✓ Tile added! Thank you for sharing.', 'success');
        tileForm.reset();
        dateInput.value = today;
        charCountSpan.textContent = '0';

        // Reload tiles to show the new one
        setTimeout(() => {
            loadTiles();
        }, 500);

    } catch (err) {
        console.error('Unexpected error:', err);
        showFormMessage('An unexpected error occurred.', 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

// ============================================================================
// LOAD TILES FROM SUPABASE
// ============================================================================

async function loadTiles() {
    try {
        loadingMessage.style.display = 'block';
        tilesGrid.innerHTML = '';

        // Fetch tiles from Supabase, ordered by newest first
        const { data: tiles, error } = await supabase
            .from('tiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(500); // Reasonable limit to avoid huge queries

        if (error) {
            console.error('Error fetching tiles:', error);
            loadingMessage.textContent = 'Error loading memories. Please refresh.';
            loadingMessage.style.display = 'block';
            return;
        }

        loadingMessage.style.display = 'none';

        if (!tiles || tiles.length === 0) {
            loadingMessage.textContent = 'No tiles yet. Be the first to share!';
            loadingMessage.style.display = 'block';
            return;
        }

        // Render each tile
        tiles.forEach((tile) => {
            renderTile(tile);
        });

    } catch (err) {
        console.error('Unexpected error loading tiles:', err);
        loadingMessage.textContent = 'An unexpected error occurred.';
        loadingMessage.style.display = 'block';
    }
}

// ============================================================================
// RENDER INDIVIDUAL TILE
// ============================================================================

function renderTile(tile) {
    const tileElement = document.createElement('div');
    tileElement.className = 'tile';
    tileElement.innerHTML = `
        <div class="tile-name">${escapeHTML(tile.name)}</div>
        <div class="tile-message">${escapeHTML(tile.message)}</div>
        <div class="tile-date">${formatDate(tile.date)}</div>
    `;
    tilesGrid.appendChild(tileElement);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function clearFormMessage() {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', options);
}

function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
