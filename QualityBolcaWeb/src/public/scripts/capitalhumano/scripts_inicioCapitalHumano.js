
  // ── Fecha en banner ────────────────────────────────────────
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const now    = new Date();
  document.getElementById('bannerDate').textContent =
    `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;

  // ── Sidebar toggle ─────────────────────────────────────────
  const sidebar     = document.getElementById('sidebar');
  const mainWrapper = document.getElementById('mainWrapper');
  const overlay     = document.getElementById('overlay');
  let   sidebarOpen = true;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    if (window.innerWidth <= 768) {
      // mobile: slide in/out over content
      sidebar.classList.toggle('open', sidebarOpen);
      overlay.classList.toggle('active', sidebarOpen);
    } else {
      // desktop: collapse sidebar, expand content
      sidebar.classList.toggle('collapsed', !sidebarOpen);
      mainWrapper.classList.toggle('expanded', !sidebarOpen);
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  // ── Navigation ─────────────────────────────────────────────
  function navigate(pageId, navItem) {
    // hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');

    // update nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navItem) navItem.classList.add('active');

    // update breadcrumb
    const label = navItem ? navItem.dataset.label : document.querySelector('.nav-item.active')?.dataset.label;
    if (label) document.getElementById('breadcrumbCurrent').textContent = label;

    // close sidebar on mobile
    if (window.innerWidth <= 768) closeSidebar();
  }
