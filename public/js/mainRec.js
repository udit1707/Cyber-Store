const backdrop = document.querySelector('.backdropR');
const sideDrawer = document.querySelector('.mobile-navR');
const menuToggle = document.querySelector('#side-menu-toggleR');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
