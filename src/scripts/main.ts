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

    function setLoading(loading: boolean) {
        submitBtn.disabled = loading;
        if (btnText) btnText.hidden = loading;
        if (btnLoading) btnLoading.hidden = !loading;
    }

    function showError(msg: string) {
        if (formErrorText) formErrorText.textContent = msg;
        if (formError) formError.hidden = false;
        if (formSuccess) formSuccess.hidden = true;
    }

    function showSuccess() {
        if (formSuccess) formSuccess.hidden = false;
        if (formError) formError.hidden = true;
    }

    (window as any).onTurnstileSuccess = () => {
        submitBtn.disabled = false;
    };

    (window as any).onTurnstileError = () => {
        submitBtn.disabled = true;
        showError('Verification failed. Please refresh the page and try again.');
    };

    (window as any).onTurnstileExpired = () => {
        submitBtn.disabled = true;
        showError('Verification expired. Please try submitting again.');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formError) formError.hidden = true;
        if (formSuccess) formSuccess.hidden = true;

        const turnstileResponse = contactForm.querySelector(
            '[name="cf-turnstile-response"]'
        ) as HTMLInputElement | null;

        if (!turnstileResponse || !turnstileResponse.value) {
            showError('Verification is required. Please wait for the check to complete.');
            setLoading(false);
            return;
        }

        const data = {
            name: (contactForm.querySelector('#contact-name') as HTMLInputElement).value.trim(),
            email: (contactForm.querySelector('#contact-email') as HTMLInputElement).value.trim(),
            subject: (contactForm.querySelector('#contact-subject') as HTMLInputElement).value.trim(),
            message: (contactForm.querySelector('#contact-message') as HTMLTextAreaElement).value.trim(),
            turnstileToken: turnstileResponse.value,
        };

        if (!data.name || !data.email || !data.subject || !data.message) {
            showError('Please fill in all fields.');
            setLoading(false);
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
            } else {
                showError(result.error || 'Something went wrong. Please try again.');
            }
        } catch {
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    });
}
