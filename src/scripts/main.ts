const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn') as HTMLButtonElement;
const navLinks = document.getElementById('navLinks');
const hamburgerIcon = document.getElementById('hamburgerIcon');

function closeMenu() {
  navLinks?.classList.remove('active');
  hamburgerIcon?.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
}

if (mobileMenuBtn && navLinks && hamburgerIcon) {
  mobileMenuBtn.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    if (isActive) {
      hamburgerIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
      hamburgerIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
  });

  navLinks.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      closeMenu();
    }
  });
}

const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
if (contactForm) {
  const submitBtn = contactForm.querySelector('.contact-submit') as HTMLButtonElement;
  const btnText = contactForm.querySelector('.btn-text');
  const btnLoading = contactForm.querySelector('.btn-loading');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const formErrorText = document.getElementById('formErrorText');

  let widgetId: string | null = null;
  let widgetReady = false;
  let verified = false;
  let loading = false;
  let pendingSubmit = false;
  let retryCount = 0;
  let currentToken = '';
  let rendered = false;

  function showError(msg: string) {
    if (formErrorText) formErrorText.textContent = msg;
    if (formError) formError.hidden = false;
    if (formSuccess) formSuccess.hidden = true;
  }

  function showSuccess() {
    if (formSuccess) formSuccess.hidden = false;
    if (formError) formError.hidden = true;
  }

  function updateButton() {
    submitBtn.disabled = loading || !verified;
    if (btnText) btnText.hidden = loading;
    if (btnLoading) btnLoading.hidden = !loading;
  }

  function onVerifySuccess(token: string) {
    verified = true;
    retryCount = 0;
    currentToken = token;
    updateButton();
    if (pendingSubmit) {
      pendingSubmit = false;
      submitForm();
    }
  }

  function onVerifyExpired() {
    verified = false;
    currentToken = '';
    updateButton();
    resetWidget();
  }

  function onVerifyError(errorCode: string) {
    verified = false;
    currentToken = '';
    updateButton();
    if (retryCount < 3) {
      retryCount += 1;
      window.setTimeout(() => resetWidget(), 800 * retryCount);
    } else {
      showError('We couldn\u2019t verify you\u2019re not a bot. Please refresh the page and try again.');
    }
  }

  function onVerifyTimeout() {
    verified = false;
    currentToken = '';
    updateButton();
    resetWidget();
  }

  function resetWidget() {
    verified = false;
    currentToken = '';
    if (widgetId !== null && widgetReady) {
      (window as any).turnstile.reset(widgetId);
    }
  }

  function renderWidget() {
    const host = document.getElementById('turnstile-widget') as HTMLElement | null;
    if (!host) return;

    const siteKey = host.getAttribute("data-sitekey") || '';
    if (!siteKey) {
      showError('Verification is not configured. Please contact support.');
      return;
    }

    widgetId = (window as any).turnstile.render(host, {
      sitekey: siteKey,
      size: 'normal',
      appearance: 'interaction-only',
      retry: 'never',
      'refresh-expired': 'auto',
      callback: onVerifySuccess,
      'error-callback': onVerifyError,
      'expired-callback': onVerifyExpired,
      'timeout-callback': onVerifyTimeout,
    });
  }

  function initTurnstile() {
    if (widgetReady || !(window as any).turnstile) return;
    widgetReady = true;
    setupFormInteractionListeners();
  }

  function setupFormInteractionListeners() {
    const formElements = contactForm.querySelectorAll('input, textarea');
    const onInteraction = () => {
      if (rendered) return;
      rendered = true;
      renderWidget();
      formElements.forEach(el => {
        el.removeEventListener('focus', onInteraction);
        el.removeEventListener('input', onInteraction);
      });
    };
    formElements.forEach(el => {
      el.addEventListener('focus', onInteraction);
      el.addEventListener('input', onInteraction);
    });
  }

  const turnstileScript = document.querySelector('script[src*="turnstile"]');
  turnstileScript?.addEventListener('load', initTurnstile);
  const pollTimer = window.setInterval(initTurnstile, 200);
  window.setTimeout(() => {
    if (!widgetReady) {
      window.clearInterval(pollTimer);
      showError('Could not load verification. Please refresh the page.');
    }
  }, 15000);

  async function submitForm() {
    loading = true;
    updateButton();
    if (formError) formError.hidden = true;
    if (formSuccess) formSuccess.hidden = true;

    const data = {
      name: (contactForm.querySelector('#contact-name') as HTMLInputElement).value.trim(),
      email: (contactForm.querySelector('#contact-email') as HTMLInputElement).value.trim(),
      subject: (contactForm.querySelector('#contact-subject') as HTMLInputElement).value.trim(),
      message: (contactForm.querySelector('#contact-message') as HTMLTextAreaElement).value.trim(),
      turnstileToken: currentToken,
    };

    if (!data.name || !data.email || !data.subject || !data.message || !data.turnstileToken) {
      loading = false;
      updateButton();
      showError('Please fill in all fields and wait for verification to complete.');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        contactForm.reset();
        showSuccess();
        resetWidget();
      } else {
        showError(result.error || 'Something went wrong. Please try again.');
        resetWidget();
      }
    } catch {
      showError('Network error. Please check your connection and try again.');
      resetWidget();
    } finally {
      loading = false;
      updateButton();
    }
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loading) return;
    if (!verified) {
      pendingSubmit = true;
      if (formError) formError.hidden = true;
      if (!rendered) {
        rendered = true;
        renderWidget();
      } else {
        resetWidget();
      }
      return;
    }
    submitForm();
  });
}
