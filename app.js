// ─── Demo Modal ───
var modal = document.getElementById('demoModal');
var modalForm = document.getElementById('demoModalForm');
var modalSuccess = document.getElementById('demoModalSuccess');
var modalSubmit = document.getElementById('demoModalSubmit');

function openDemoModal(prefillEmail) {
  if (!modal) return;
  if (prefillEmail && modalForm) {
    var emailField = modalForm.querySelector('[name="email"]');
    if (emailField) emailField.value = prefillEmail;
  }
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (modal) {
  // Open on all Book a demo / CTA triggers
  document.querySelectorAll('.js-open-demo').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openDemoModal();
    });
  });

  // Hero/CTA email forms — pre-fill email in modal
  document.querySelectorAll('.hero-form, .cta-form').forEach(function(form) {
    var emailInput = form.querySelector('input[type="email"]');
    var trigger = form.querySelector('.js-open-demo');
    if (!trigger || !emailInput) return;
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openDemoModal(emailInput.value.trim());
    });
  });

  // Close via × button
  var closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeDemoModal);

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeDemoModal();
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDemoModal();
  });
}

// ─── Demo Modal Form Submit ───
if (modalForm) {
  modalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = modalForm.querySelector('[name="name"]').value.trim();
    var email = modalForm.querySelector('[name="email"]').value.trim();
    var firm = modalForm.querySelector('[name="firm"]').value.trim();
    var message = modalForm.querySelector('[name="message"]').value.trim();

    if (!name || !email) {
      modalForm.querySelector('[name="' + (!name ? 'name' : 'email') + '"]').focus();
      return;
    }

    modalSubmit.textContent = 'Sending…';
    modalSubmit.disabled = true;

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'demo', name: name, email: email, firm: firm, message: message }),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          modalForm.style.display = 'none';
          if (modalSuccess) modalSuccess.style.display = 'block';
        } else {
          modalSubmit.textContent = 'Try again';
          modalSubmit.disabled = false;
        }
      })
      .catch(function() {
        modalSubmit.textContent = 'Try again';
        modalSubmit.disabled = false;
      });
  });
}

// ─── For-founders Submission Form ───
var founderForm = document.getElementById('founderForm');
if (founderForm) {
  var founderSubmitBtn = founderForm.querySelector('.form-submit');
  var founderSuccess = document.getElementById('founderSuccess');

  founderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var company = founderForm.querySelector('[name="company"]').value.trim();
    var website = founderForm.querySelector('[name="website"]').value.trim();
    var description = founderForm.querySelector('[name="description"]').value.trim();
    var stage = founderForm.querySelector('[name="stage"]').value;
    var sector = founderForm.querySelector('[name="sector"]').value;
    var email = founderForm.querySelector('[name="email"]').value.trim();

    if (!company || !email) {
      founderForm.querySelector('[name="' + (!company ? 'company' : 'email') + '"]').focus();
      return;
    }

    founderSubmitBtn.textContent = 'Submitting…';
    founderSubmitBtn.disabled = true;

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'founder',
        company: company,
        website: website,
        description: description,
        stage: stage,
        sector: sector,
        email: email,
      }),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          founderForm.style.display = 'none';
          if (founderSuccess) founderSuccess.style.display = 'block';
        } else {
          founderSubmitBtn.textContent = 'Try again';
          founderSubmitBtn.disabled = false;
        }
      })
      .catch(function() {
        founderSubmitBtn.textContent = 'Try again';
        founderSubmitBtn.disabled = false;
      });
  });
}
