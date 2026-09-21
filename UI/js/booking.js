const modal = document.getElementById('popupDate');
const openBtn = document.getElementById('dateBtn');
const closeBtn = document.getElementById('closeBtn');

// Open the pop-up
openBtn.addEventListener('click', () => {
  modal.showModal(); 
});

// Close the pop-up
closeBtn.addEventListener('click', () => {
  modal.close();
});


const today = new Date().toISOString().split('T')[0];
document.getElementById('bookDate').value = today;



const times = ['6:30', '7:30', '8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'];
const machines = 7;

const tbody = document.querySelector('#grid tbody');

times.forEach((time, r) => {
    const tr = document.createElement('tr');
    
    const th = document.createElement('th');
    th.textContent = time;
    tr.appendChild(th);
    
    for (let c = 0; c < machines; c++) {
        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.className = 'slot free';
        btn.dataset.row = r;
        btn.dataset.col = c;
        td.appendChild(btn);
        tr.appendChild(td);
    }
    
    tbody.appendChild(tr);
});

// Click demo
document.querySelector('#grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.slot');
    if (!btn || btn.classList.contains('broken')) return;
    
    if (btn.classList.contains('free')) {
        btn.className = 'slot mine';
    } else if (btn.classList.contains('mine') || btn.classList.contains('booked')) {
        btn.className = 'slot free';
    }
});