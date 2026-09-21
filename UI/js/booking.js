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