(function () {
  'use strict';

  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  var mobileMenuPanel = document.getElementById('mobile-menu-panel');
  var mobileMenuClose = document.getElementById('mobile-menu-close');
  var backToTop = document.getElementById('back-to-top');

  // Defensive mobile menu handlers
  function openMobileMenu() {
    if (!mobileMenu) mobileMenu = document.querySelector('#mobile-menu');
    if (!mobileMenu) return;
    try { mobileMenu.classList.remove('hidden'); } catch (e) {}
    try { mobileMenu.style.display = 'block'; } catch (e) {}
    requestAnimationFrame(function () {
      if (mobileMenuBackdrop) {
        try { mobileMenuBackdrop.classList.remove('opacity-0'); mobileMenuBackdrop.classList.add('opacity-100'); } catch (e) {}
        try { mobileMenuBackdrop.style.opacity = '1'; } catch (e) {}
      }
      if (mobileMenuPanel) {
        try { mobileMenuPanel.classList.remove('-translate-x-full'); mobileMenuPanel.classList.add('translate-x-0'); } catch (e) {}
        try { mobileMenuPanel.style.transform = 'translateX(0)'; } catch (e) {}
      }
    });
    try { menuToggle && menuToggle.setAttribute('aria-expanded', 'true'); menuToggle && menuToggle.setAttribute('aria-label', 'ปิดเมนู'); } catch (e) {}
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
  }

  function closeMobileMenu() {
    if (!mobileMenu) mobileMenu = document.querySelector('#mobile-menu');
    if (!mobileMenu) return;
    if (mobileMenuBackdrop) {
      try { mobileMenuBackdrop.classList.remove('opacity-100'); mobileMenuBackdrop.classList.add('opacity-0'); } catch (e) {}
      try { mobileMenuBackdrop.style.opacity = '0'; } catch (e) {}
    }
    if (mobileMenuPanel) {
      try { mobileMenuPanel.classList.remove('translate-x-0'); mobileMenuPanel.classList.add('-translate-x-full'); } catch (e) {}
      try { mobileMenuPanel.style.transform = 'translateX(-100%)'; } catch (e) {}
    }
    try { menuToggle && menuToggle.setAttribute('aria-expanded', 'false'); menuToggle && menuToggle.setAttribute('aria-label', 'เปิดเมนู'); } catch (e) {}
    try { document.body.style.overflow = ''; } catch (e) {}
    setTimeout(function () {
      try { mobileMenu.classList.add('hidden'); } catch (e) {}
      try { mobileMenu.style.display = 'none'; } catch (e) {}
    }, 300);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var isOpen = false;
      try { isOpen = menuToggle.getAttribute('aria-expanded') === 'true'; } catch (e) {}
      try { isOpen = mobileMenu && !mobileMenu.classList.contains('hidden'); } catch (e) {}
      if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', function (ev) { ev.stopPropagation(); closeMobileMenu(); });
  }

  // Click outside to close when open
  document.addEventListener('click', function (e) {
    try {
      var open = mobileMenu && !mobileMenu.classList.contains('hidden');
      if (!open) return;
      if (mobileMenuPanel && typeof e.target.closest === 'function' && e.target.closest('#mobile-menu-panel a:not([href="#"])')) {
        closeMobileMenu();
        return;
      }
      if (menuToggle && (menuToggle.contains(e.target) || (mobileMenuPanel && mobileMenuPanel.contains(e.target)))) return;
      closeMobileMenu();
    } catch (err) {}
  });

  // Close on Escape
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobileMenu(); });

  // Contact submenu toggle (inside panel)
  (function () {
    var contactToggle = document.getElementById('mobile-contact-toggle');
    var contactSubmenu = document.getElementById('mobile-contact-submenu');
    var contactArrow = document.getElementById('mobile-contact-arrow');
    if (contactToggle && contactSubmenu && contactArrow) {
      contactToggle.addEventListener('click', function () {
        var isHidden = contactSubmenu.classList.contains('hidden');
        if (isHidden) {
          contactSubmenu.classList.remove('hidden');
          contactArrow.classList.add('rotate-180');
        } else {
          contactSubmenu.classList.add('hidden');
          contactArrow.classList.remove('rotate-180');
        }
      });
    }
  })();

  // Services submenu toggle (inside panel)
  (function () {
    var servicesToggle = document.getElementById('mobile-services-toggle');
    var servicesSubmenu = document.getElementById('mobile-services-submenu');
    var servicesArrow = document.getElementById('mobile-services-arrow');
    if (servicesToggle && servicesSubmenu && servicesArrow) {
      servicesToggle.addEventListener('click', function () {
        var hidden = servicesSubmenu.classList.contains('hidden');
        if (hidden) {
          servicesSubmenu.classList.remove('hidden');
          servicesArrow.classList.add('rotate-180');
        } else {
          servicesSubmenu.classList.add('hidden');
          servicesArrow.classList.remove('rotate-180');
        }
      });
    }
  })();

  // Smooth scroll for procurement links (#procurement)
  (function () {
    var procLinks = document.querySelectorAll('a[href*="#procurement"]');
    var procTarget = document.getElementById('procurement');
    if (!procTarget || procLinks.length === 0) return;
    procLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var header = document.querySelector('header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetY = procTarget.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        try { link.style.transition = 'transform 150ms ease'; link.style.transform = 'translateY(2px) scale(0.99)'; } catch (err) {}
        setTimeout(function () { try { link.style.transform = ''; } catch (err) {} }, 200);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        try { history.replaceState && history.replaceState(null, '', '#procurement'); } catch (err) {}
      });
    });
  })();

  // Loading animation for Contact buttons
  (function () {
    var contactIds = ['contact-nav', 'contact-hero'];
    contactIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function (e) {
        // prevent immediate navigation so user sees the animation
        e.preventDefault();
        try {
          // don't double-trigger
          if (el.getAttribute('data-loading') === '1') return;
          el.setAttribute('data-loading', '1');
          el.setAttribute('aria-busy', 'true');
          // show centered overlay spinner
          if (!document.getElementById('global-loading-overlay')) {
            var overlay = document.createElement('div');
            overlay.id = 'global-loading-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(0,0,0,0.35)';
            overlay.style.zIndex = '9999';
            // spinner container
            var box = document.createElement('div');
            box.style.padding = '12px';
            box.style.borderRadius = '8px';
            box.style.background = 'rgba(0,0,0,0.45)';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.justifyContent = 'center';
            // spinner svg (circular ring) — rotate dur set to 1s
            box.innerHTML = '<svg width="64" height="64" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" stroke="#ffffff" stroke-width="4" stroke-opacity="0.18" fill="none"></circle><circle cx="25" cy="25" r="20" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-dasharray="90 150" fill="none"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>';
            overlay.appendChild(box);
            document.body.appendChild(overlay);
          }
          // small press effect on the clicked element
          try { el.style.transition = 'transform 140ms ease'; el.style.transform = 'translateY(2px) scale(0.99)'; } catch (err) {}
          setTimeout(function () { try { el.style.transform = ''; } catch (err) {} }, 220);
          // navigate after short delay so animation is visible
          var href = el.getAttribute('href');
          setTimeout(function () {
            window.location.href = href || 'contact.html';
          }, 1000);
        } catch (err) {}
      });
    });
  })();

  // Back to top: show/hide and scroll
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
      }
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Smooth scroll for CTA button to #quick-links (accounts for sticky header)
  (function () {
    var ctaQuicklinks = document.getElementById('cta-quicklinks');
    if (!ctaQuicklinks) return;
    ctaQuicklinks.addEventListener('click', function (e) {
      var target = document.getElementById('quick-links');
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('header');
      var headerHeight = header ? header.offsetHeight : 0;
      var targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      // small pressed effect
      ctaQuicklinks.style.transition = 'transform 150ms ease';
      ctaQuicklinks.style.transform = 'translateY(2px) scale(0.99)';
      setTimeout(function () { ctaQuicklinks.style.transform = ''; }, 200);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  })();

  // Smooth scroll for "ข่าวประชาสัมพันธ์" links (#news)
  (function () {
    var newsLinks = document.querySelectorAll('a[href*="#news"]');
    var target = document.getElementById('news');
    if (!target || newsLinks.length === 0) return;
    newsLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (!document.getElementById('news')) return;
        e.preventDefault();
        var header = document.querySelector('header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        link.style.transition = 'transform 150ms ease';
        link.style.transform = 'translateY(2px) scale(0.99)';
        setTimeout(function () { link.style.transform = ''; }, 200);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        try { history.replaceState && history.replaceState(null, '', '#news'); } catch (err) {}
      });
    });
  })();

  // Smooth scroll + press animation for gallery links and gallery CTA
  (function () {
    var galleryLinks = document.querySelectorAll('a[href*="#gallery"]');
    var galleryTarget = document.getElementById('gallery');
    var galleryBtn = document.getElementById('gallery-all');
    if (!galleryTarget || (galleryLinks.length === 0 && !galleryBtn)) return;

    function doGalleryScroll(trigger) {
      var header = document.querySelector('header');
      var headerHeight = header ? header.offsetHeight : 0;
      var targetY = galleryTarget.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      if (trigger) {
        try { trigger.style.transition = 'transform 160ms ease'; trigger.style.transform = 'translateY(2px) scale(0.99)'; } catch (e) {}
        setTimeout(function () { try { trigger.style.transform = ''; } catch (e) {} }, 220);
      }
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      try { history.replaceState && history.replaceState(null, '', '#gallery'); } catch (err) {}
    }

    galleryLinks.forEach(function (lnk) {
      lnk.addEventListener('click', function (e) {
        e.preventDefault();
        doGalleryScroll(lnk);
      });
    });

    if (galleryBtn) {
      galleryBtn.addEventListener('click', function (e) {
        e.preventDefault();
        doGalleryScroll(galleryBtn);
      });
    }
  })();

  // Desktop dropdown keep-open handler (mouseenter/mouseleave with small debounce)
  (function () {
    try {
      var groups = document.querySelectorAll('.group');
      if (!groups || groups.length === 0) return;
      groups.forEach(function (g) {
        var submenu = g.querySelector('div.absolute');
        var btn = g.querySelector('button, a');
        if (!submenu || !btn) return;
        var hideTimer = null;
        function show() {
          clearTimeout(hideTimer);
          try { submenu.classList.remove('opacity-0', 'pointer-events-none'); } catch (e) {}
          try { submenu.classList.add('opacity-100', 'pointer-events-auto'); } catch (e) {}
          try { btn.setAttribute && btn.setAttribute('aria-expanded', 'true'); } catch (e) {}
        }
        function hide() {
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function () {
            try { submenu.classList.remove('opacity-100', 'pointer-events-auto'); } catch (e) {}
            try { submenu.classList.add('opacity-0', 'pointer-events-none'); } catch (e) {}
            try { btn.setAttribute && btn.setAttribute('aria-expanded', 'false'); } catch (e) {}
          }, 150);
        }
        g.addEventListener('mouseenter', function () { if (window.innerWidth >= 768) show(); });
        g.addEventListener('mouseleave', function () { if (window.innerWidth >= 768) hide(); });
        // Prevent accidental hide when hovering submenu itself
        submenu.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
        submenu.addEventListener('mouseleave', function () { if (window.innerWidth >= 768) hide(); });
        // Allow keyboard escape to close
        submenu.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
      });
    } catch (err) {}
  })();

})();
