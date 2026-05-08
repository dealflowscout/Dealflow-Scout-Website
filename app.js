// ─── Nav scroll shadow ───
(function() {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var onScroll = function() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Scroll reveal ───
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length || !window.IntersectionObserver) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  els.forEach(function(el) { io.observe(el); });
})();

// ─── Shared form submit (FormSubmit AJAX) ───
function submitForm(payload, onSuccess, onError) {
  fetch('https://formsubmit.co/ajax/dealflowscout@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success === 'true' || data.success === true) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch(function() { onError(); });
}

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
  document.querySelectorAll('.js-open-demo').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openDemoModal();
    });
  });

  document.querySelectorAll('.hero-form, .cta-form').forEach(function(form) {
    var emailInput = form.querySelector('input[type="email"]');
    var trigger = form.querySelector('.js-open-demo');
    if (!trigger || !emailInput) return;
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openDemoModal(emailInput.value.trim());
    });
  });

  var closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeDemoModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeDemoModal();
  });

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

    submitForm(
      {
        _subject: 'New Demo Request — ' + name,
        Name: name,
        Email: email,
        Firm: firm || '—',
        Message: message || '—',
      },
      function() {
        modalForm.style.display = 'none';
        if (modalSuccess) modalSuccess.style.display = 'block';
      },
      function() {
        modalSubmit.textContent = 'Try again';
        modalSubmit.disabled = false;
      }
    );
  });
}

// ─── Founder Submission Modal ───
var founderModal = document.getElementById('founderModal');
var founderModalForm = document.getElementById('founderModalForm');
var founderModalSuccess = document.getElementById('founderModalSuccess');
var founderModalSubmit = document.getElementById('founderModalSubmit');

function openFounderModal() {
  if (!founderModal) return;
  founderModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeFounderModal() {
  if (!founderModal) return;
  founderModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (founderModal) {
  document.querySelectorAll('.js-open-founder').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openFounderModal();
    });
  });

  var founderModalClose = document.getElementById('founderModalClose');
  if (founderModalClose) founderModalClose.addEventListener('click', closeFounderModal);

  founderModal.addEventListener('click', function(e) {
    if (e.target === founderModal) closeFounderModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeFounderModal();
  });
}

if (founderModalForm) {
  founderModalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var company = founderModalForm.querySelector('[name="company"]').value.trim();
    var website = founderModalForm.querySelector('[name="website"]').value.trim();
    var description = founderModalForm.querySelector('[name="description"]').value.trim();
    var stage = founderModalForm.querySelector('[name="stage"]').value;
    var sector = founderModalForm.querySelector('[name="sector"]').value;
    var email = founderModalForm.querySelector('[name="email"]').value.trim();

    if (!company || !email) {
      founderModalForm.querySelector('[name="' + (!company ? 'company' : 'email') + '"]').focus();
      return;
    }

    founderModalSubmit.textContent = 'Submitting…';
    founderModalSubmit.disabled = true;

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'founder', company: company, website: website, description: description, stage: stage, sector: sector, email: email }),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          founderModalForm.style.display = 'none';
          if (founderModalSuccess) founderModalSuccess.style.display = 'block';
        } else {
          founderModalSubmit.textContent = 'Try again';
          founderModalSubmit.disabled = false;
        }
      })
      .catch(function() {
        founderModalSubmit.textContent = 'Try again';
        founderModalSubmit.disabled = false;
      });
  });
}

// ─── For-founders Submission Form (bottom page form) ───
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

    if (founderSubmitBtn) {
      founderSubmitBtn.textContent = 'Submitting…';
      founderSubmitBtn.disabled = true;
    }

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
          if (founderSubmitBtn) { founderSubmitBtn.textContent = 'Try again'; founderSubmitBtn.disabled = false; }
        }
      })
      .catch(function() {
        if (founderSubmitBtn) { founderSubmitBtn.textContent = 'Try again'; founderSubmitBtn.disabled = false; }
      });
  });
}
