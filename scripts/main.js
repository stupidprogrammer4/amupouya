const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeControls() {
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  themeButton.setAttribute('aria-pressed', String(light));
  themeColor.setAttribute('content', light ? '#f6f4fb' : '#101018');
}

themeButton.hidden = false;
updateThemeControls();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('pouya-theme', root.dataset.theme); } catch (_) {}
  updateThemeControls();
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
root.classList.add('js');
menuButton.hidden = false;

function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let feedbackTimeout;
if (window.isSecureContext && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    clearTimeout(feedbackTimeout);
    try {
      await navigator.clipboard.writeText('ilovelinux764@gmail.com');
      copyStatus.textContent = 'Email copied.';
    } catch (_) {
      copyStatus.textContent = 'Select the email address below to copy it.';
    }
    feedbackTimeout = setTimeout(() => { copyStatus.textContent = ''; }, 5000);
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
