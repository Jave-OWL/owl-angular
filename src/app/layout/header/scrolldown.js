let lastScrollY = window.scrollY;
const header = document.querySelector('header'); // Cambia el selector si tu header es diferente

window.addEventListener('scroll', () => {
	if (!header) return;
	if (window.scrollY > lastScrollY && window.scrollY > 50) {
		// Scrollea hacia abajo
		header.classList.add('header-small');
	} else {
		// Scrollea hacia arriba
		header.classList.remove('header-small');
	}
	lastScrollY = window.scrollY;
});
