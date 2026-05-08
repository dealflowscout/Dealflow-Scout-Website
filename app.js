const CALENDLY = 'https://calendly.com/d/ct7j-wbh-rrn/dealflow-scout-by-ssanz-demo-call?month=2026-05';

// ─── Email capture forms (hero + CTA) ───
document.querySelectorAll('.hero-form, .cta-form').forEach(function(form) {
  var emailInput = form.querySelector('input[type="email"]');
  var demoLink = form.querySelector('a[href*="calendly"]');
  if (!demoLink || !emailInput) return;

  demoLink.addEventListener('click', function(e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var source = form.closest('section') && form.closest('section').className || 'Website';

    if (email) {
      fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'demo', email: email, source: source }),
      }).catch(function() {});
    }

    window.open(CALENDLY, '_blank');
  });
});

// ─── For-founders submission form ───
var founderForm = document.getElementById('founderForm');
if (founderForm) {
  var submitBtn = founderForm.querySelector('.form-submit');
  var successMsg = document.getElementById('founderSuccess');

  founderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var company = founderForm.querySelector('[name="company"]').value.trim();
    var website = founderForm.querySelector('[name="website"]').value.trim();
    var description = founderForm.querySelector('[name="description"]').value.trim();
    var stage = founderForm.querySelector('[name="stage"]').value;
    var sector = founderForm.querySelector('[name="sector"]').value;
    var email = founderForm.querySelector('[name="email"]').value.trim();

    if (!company || !email) {
      founderForm.querySelector('[name="company"]').focus();
      return;
    }

    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

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
          if (successMsg) successMsg.style.display = 'block';
        } else {
          submitBtn.textContent = 'Try again';
          submitBtn.disabled = false;
        }
      })
      .catch(function() {
        submitBtn.textContent = 'Try again';
        submitBtn.disabled = false;
      });
  });
}
