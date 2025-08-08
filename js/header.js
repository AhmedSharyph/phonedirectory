// header.js
document.addEventListener('DOMContentLoaded', () => {
  const headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm" role="navigation" aria-label="Main navigation">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">Shaviyani Health Directory</a>
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
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      // Disable link to prevent click
      link.removeAttribute('href');
      link.classList.add('disabled');
      link.style.pointerEvents = 'none';
      link.style.cursor = 'default';
      link.style.opacity = '0.65';
    }
  });
});
``