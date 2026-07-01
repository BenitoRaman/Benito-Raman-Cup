// Benito Raman Cup — basis interacties

// Jaartal in footer
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Mobiel menu
var toggle = document.getElementById('navToggle');
var links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });
}

// Reveal-on-scroll
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (el) {
  io.observe(el);
});

// U8 / U9 toggle
document.querySelectorAll('.toggle-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var target = btn.getAttribute('data-target');
    document.querySelectorAll('.toggle-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.compare-panel').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = document.getElementById(target);
    if (panel) panel.classList.add('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function (q) {
  q.addEventListener('click', function () {
    var item = q.closest('.faq-item');
    var answer = item.querySelector('.faq-a');
    var isOpen = item.classList.contains('open');
    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Formulieren -> Web3Forms (AJAX)
document.querySelectorAll('form[data-web3form]').forEach(function (form) {
  var feedback = form.querySelector('.form-feedback');
  var submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var key = form.querySelector('input[name="access_key"]');
    if (!key || key.value.indexOf('VERVANG') !== -1 || key.value.trim() === '') {
      showFeedback(feedback, 'err', 'Het formulier is nog niet gekoppeld. Voeg de Web3Forms access key toe om verzendingen te ontvangen.');
      return;
    }
    var data = new FormData(form);
    var original = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Versturen…'; }
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          form.reset();
          showFeedback(feedback, 'ok', 'Bedankt! Je aanvraag is verstuurd. Het bestuur bekijkt ze en neemt contact met je op.');
        } else {
          showFeedback(feedback, 'err', 'Er ging iets mis bij het versturen. Probeer later opnieuw of mail ons rechtstreeks.');
        }
      })
      .catch(function () {
        showFeedback(feedback, 'err', 'Er ging iets mis bij het versturen. Probeer later opnieuw of mail ons rechtstreeks.');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
      });
  });
});

function showFeedback(el, type, msg) {
  if (!el) return;
  el.className = 'form-feedback ' + type;
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
