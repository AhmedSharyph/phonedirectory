// header.js
document.addEventListener('DOMContentLoaded', () => {
  const headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm" role="navigation" aria-label="Main navigation">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="https://ahmedsharyph.github.io/shaviyanihealthdirectory/images/logo.png" alt="Logo" width="30" height="30" class="me-2" />
          Shaviyani Health Directory
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Directory</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="add-contact.html">Add Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Try to insert inside #headerContainer if it exists, else prepend to body
  const container = document.getElementById('headerContainer');
  if (container) {
    container.innerHTML = headerHTML;
  } else {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerHTML;
    document.body.prepend(tempDiv.firstElementChild);
  }

  // Highlight active tab and disable its link
  const currentPage = location.pathname.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active', 'disabled');
      link.removeAttribute('href');
      link.setAttribute('aria-current', 'page');
      link.style.pointerEvents = 'none';
      link.style.cursor = 'default';
      link.style.opacity = '0.65';
    }
  });
});




