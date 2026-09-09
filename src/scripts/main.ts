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