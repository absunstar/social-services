const articleMenu = document.querySelector('.articleMenu .nav-link');
articleMenu.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.toggle('show');

  document.querySelectorAll('.show').forEach((el) => {
    if (el !== e.currentTarget.parentElement) {
      el.classList.remove('show');
    }
  });
});

const dropdowns = document.querySelector('.megaMenu .nav-link');

dropdowns.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.toggle('show');
  document.querySelectorAll('.show').forEach((el) => {
    if (el !== e.currentTarget.parentElement) {
      el.classList.remove('show');
    }
  });
});

const profileMenu = document.querySelector('.profileContainer .dropdown-item');

profileMenu.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.toggle('show');
  document.querySelectorAll('.show').forEach((el) => {
    if (el !== e.currentTarget.parentElement) {
      el.classList.remove('show');
    }
  });
});

const langMenu = document.querySelector('.langMenu .nav-link');

langMenu.addEventListener('click', (e) => {
  e.currentTarget.parentElement.classList.toggle('show');
  document.querySelectorAll('.show').forEach((el) => {
    if (el !== e.currentTarget.parentElement) {
      el.classList.remove('show');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-link') && !e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.show').forEach((el) => {
      el.classList.remove('show');
    });
  }
});
