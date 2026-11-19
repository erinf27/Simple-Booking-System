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


//grids
function buildHeader(theadRowId, machines) {
  const tr = document.getElementById(theadRowId);
  tr.querySelectorAll('th:not(:first-child)').forEach(th => th.remove());

  machines.forEach(m => {
    const th = document.createElement('th');
    th.textContent = m.name.slice(-1);
    tr.appendChild(th);
  });
}

function buildGrid(tableId, timeslots, machines) {
  const table = document.querySelector(`#${tableId}`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  const topLeftTh = table.querySelector('thead th');
  if (topLeftTh) topLeftTh.classList.add('sticky-corner');

  timeslots.forEach((slot) => {
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.textContent = slot.label.substring(0,5);
    th.classList.add('sticky-time');
    tr.appendChild(th);

    machines.forEach((machine) => {
      const td = document.createElement('td');
      const btn = document.createElement('button');

      btn.className = 'slot free';
      
      // IDs for the database
      btn.dataset.timeslotId = slot.id;
      btn.dataset.machineId = machine.id;
      
      // Labels for the UI
      btn.dataset.timeLabel = slot.label;
      btn.dataset.machineName = machine.name.slice(-2);

      td.appendChild(btn);
      tr.appendChild(td);

      
    });

    tbody.appendChild(tr);
  });
}

function attachSlotHandler(tableId) {
  document.querySelector(`#${tableId}`).addEventListener('click', (e) => {
    const btn = e.target.closest('.slot');
    if (!btn) return;
    
    if (btn.classList.contains('broken') || btn.classList.contains('booked')) return;

    btn.className = btn.classList.contains('free') ? 'slot mine' : 'slot free';
  });
}


// --- Initialization ---
async function initGrids() {
  const [machinesRes, timeslotsRes] = await Promise.all([
    supabase.from('machines').select('id, name, type').order('name'), // Added 'type' here to filter
    supabase.from('time_slots').select('id, label').eq('active', true).order('display_order')
  ]);

  if (machinesRes.error || timeslotsRes.error) {
     console.error('Machines Error:', machinesRes.error?.message);
    console.error('Timeslots Error:', timeslotsRes.error?.message);
    return;
  }

  const allMachines = machinesRes.data;
  const timeslots = timeslotsRes.data;
// console.log("All machines from DB:", allMachines);

  const washers = allMachines.filter(m => m.type === 'Washer');
  const dryers = allMachines.filter(m => m.type === 'Dryer');
//  console.log("Washers found:", washers);
//   console.log("Dryers found:", dryers);
  // Build Washing Grid
  buildHeader('washing-head', washers);
  buildGrid('washing-grid', timeslots, washers);
  attachSlotHandler('washing-grid');

  // Build Dryer Grid
  buildHeader('dryer-head', dryers);
  buildGrid('dryer-grid', timeslots, dryers);
  attachSlotHandler('dryer-grid');
}

initGrids();


async function handleSignOut() 
{
    await logout();
    window.location.href = "login.html";
}