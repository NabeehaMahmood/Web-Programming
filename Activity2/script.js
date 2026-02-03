// Button inside a div inside another div
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('myButton');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const inner = btn.parentElement; // the inner div
    // Toggle a simple visual change and button text
    if (inner.style.background === 'lightgreen') {
      inner.style.background = '#f9f9f9';
      btn.textContent = 'Click me';
    } else {
      inner.style.background = 'lightgreen';
      btn.textContent = 'Clicked!';
    }
  });
});
