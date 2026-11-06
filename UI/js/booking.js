import { supabase } from '../../Server/supabase-client.js'
import { checkSession, logout } from '../../Server/app.js'

const modal = document.getElementById('popupDate');
const openBtn = document.getElementById('dateBtn');
const closeBtn = document.getElementById('closeBtn');
const dateInput = document.getElementById('bookDate');
const dateDisplay = document.getElementById('currentDateDisplay');
const shortcutBtns = document.querySelectorAll('.shortcut-btn');

// Helper: Format date to YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

// Helper: Update the display in the navbar
function updateDateDisplay(dateString) {
    const selected = new Date(dateString + 'T00:00:00'); // Force local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selected.getTime() === today.getTime()) {
        dateDisplay.textContent = 'Today';
    } else if (selected.getTime() === tomorrow.getTime()) {
        dateDisplay.textContent = 'Tomorrow';
    } else {
        // Format as "Mon DD" (e.g., Oct 24)
        dateDisplay.textContent = selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Set default date to Today
const todayString = formatDate(new Date());
dateInput.value = todayString;
updateDateDisplay(todayString);

// Modal Open/Close
openBtn.addEventListener('click', () => {
    modal.showModal(); 
});

closeBtn.addEventListener('click', () => {
    modal.close();
});

// Listen for date input changes
dateInput.addEventListener('change', (e) => {
    updateDateDisplay(e.target.value);
});

// Handle Shortcuts
shortcutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const offset = parseInt(btn.dataset.offset);
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + offset);
        
        const formatted = formatDate(newDate);
        dateInput.value = formatted;
        updateDateDisplay(formatted);
    });
});


// --- Grid Generation Logic ---
const times = ['6:30', '7:30', '8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'];
const machines = 7;

function buildGrid(tableId) {
    const table = document.querySelector(`#${tableId}`);
    const tbody = table.querySelector('tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';

    // Add the sticky corner class to the empty top-left cell in the header
    const topLeftTh = table.querySelector('thead th');
    if (topLeftTh) {
        topLeftTh.classList.add('sticky-corner');
    }

    times.forEach((time, r) => {
        const tr = document.createElement('tr');
        
        // 1. Create the Time label cell (Sticky Left)
        const th = document.createElement('th');
        th.textContent = time;
        th.classList.add('sticky-time');
        tr.appendChild(th);
        
        // 2. Create the machine slots
        for (let c = 0; c < machines; c++) {
            const td = document.createElement('td');
            const btn = document.createElement('button');
            
            // Set base classes
            btn.className = 'slot free';
            
            // Store data attributes for later use (e.g., when submitting the form)
            btn.dataset.row = r;
            btn.dataset.col = c;
            btn.dataset.time = time;
            btn.dataset.machine = `Machine ${c + 1}`; 
            
            td.appendChild(btn);
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    });

    // Event listener for clicking slots
    table.addEventListener('click', (e) => {
        const btn = e.target.closest('.slot');
        if (!btn || btn.classList.contains('broken')) return;
        
        if (btn.classList.contains('free')) {
            btn.className = 'slot mine';
        } else if (btn.classList.contains('mine') || btn.classList.contains('booked')) {
            btn.className = 'slot free';
        }
    });
}

// Initialize both tables
buildGrid('washing-grid');
buildGrid('dryer-grid');

function handleSignOut() {
    
}