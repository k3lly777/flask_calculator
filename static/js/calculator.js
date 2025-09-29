document.addEventListener('DOMContentLoaded', function () {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.calc-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');

      if (val === 'C') {
        display.value = '';
        return;
      }

      if (val === '=') {
        submitExpression(display.value);
        return;
      }

      if (val === '%') {
        display.value += '*0.01';
        return;
      }

      display.value += val;
    });
  });

  document.addEventListener('keydown', (e) => {
    if (/^[0-9+\\-*/().]$/.test(e.key)) {
      display.value += e.key;
    } else if (e.key === 'Enter') {
      submitExpression(display.value);
    } else if (e.key === 'Backspace') {
      display.value = display.value.slice(0, -1);
    } else if (e.key.toLowerCase() === 'c') {
      display.value = '';
    }
  });
});

function submitExpression(expr) {
  fetch('/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression: expr })
  })
    .then(async res => {
      const data = await res.json();
      if (res.ok && data.success) {
        document.getElementById('display').value = data.result;
        renderHistory(data.history);
      } else {
        alert(data.error || 'Invalid expression');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Server error');
    });
}

function renderHistory(history) {
  const el = document.getElementById('history');
  el.innerHTML = history.map(h => `<div class="d-flex justify-content-between"><span>${escapeHtml(h.expr)}</span><strong>${escapeHtml(h.result)}</strong></div>`).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>\"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#039;' })[m]; });
}
