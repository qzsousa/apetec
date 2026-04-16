/* ================================================================
   APETEC – script.js
   Menu responsivo, carrossel, depoimentos, formulários, blog modal
   ================================================================ */

/* ── Utilitário: DOM pronto ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════════
     MENU HAMBURGUER
     ════════════════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });

    /* Fechar ao clicar em link */
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  /* ════════════════════════════════════════════════════
     CARROSSEL HERO (index.html)
     ════════════════════════════════════════════════════ */
  const carouselSlides = document.querySelector('.carousel-slides');
  const dots           = document.querySelectorAll('.carousel-dot');
  const prevBtn        = document.querySelector('.carousel-btn.prev');
  const nextBtn        = document.querySelector('.carousel-btn.next');

  if (carouselSlides) {
    let current   = 0;
    const total   = document.querySelectorAll('.slide').length;
    let autoTimer = null;

    function goTo(index) {
      current = (index + total) % total;
      carouselSlides.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      autoTimer = setInterval(next, 4500);
    }

    function stopAuto() {
      clearInterval(autoTimer);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    /* Touch/swipe */
    let touchStartX = 0;
    carouselSlides.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carouselSlides.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        diff > 0 ? next() : prev();
        startAuto();
      }
    });

    goTo(0);
    startAuto();
  }

  /* ════════════════════════════════════════════════════
     CARROSSEL DEPOIMENTOS
     ════════════════════════════════════════════════════ */
  const testTrack = document.querySelector('.testimonials-track');
  const testDots  = document.querySelectorAll('.test-dot');

  if (testTrack) {
    let tCurrent = 0;
    const tTotal = testDots.length;

    function goToTest(i) {
      tCurrent = (i + tTotal) % tTotal;
      testTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
      testDots.forEach((d, idx) => d.classList.toggle('active', idx === tCurrent));
    }

    testDots.forEach((dot, i) => dot.addEventListener('click', () => goToTest(i)));

    goToTest(0);
    setInterval(() => goToTest(tCurrent + 1), 5000);
  }

  /* ════════════════════════════════════════════════════
     MODAIS DO BLOG
     ════════════════════════════════════════════════════ */
  document.querySelectorAll('[data-blog-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.blogOpen;
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.blog-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.blog-modal-backdrop').classList.remove('visible');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.blog-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) {
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  });

  /* ════════════════════════════════════════════════════
     FORMULÁRIO DE CONTATO
     ════════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        nome:     document.getElementById('cNome')?.value,
        email:    document.getElementById('cEmail')?.value,
        assunto:  document.getElementById('cAssunto')?.value,
        mensagem: document.getElementById('cMensagem')?.value,
      };

      console.log('[APETEC] Formulário enviado:', data);

      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('visible');
        contactForm.reset();
        setTimeout(() => success.classList.remove('visible'), 5000);
      }
    });
  }

  /* ════════════════════════════════════════════════════
     NEWSLETTER
     ════════════════════════════════════════════════════ */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input?.value.trim()) {
        console.log('[APETEC] Newsletter:', input.value);
        alert('✅ Inscrição realizada!\n\nVocê receberá as novidades da APETEC no e-mail: ' + input.value);
        input.value = '';
      } else {
        alert('Por favor, informe um e-mail válido.');
      }
    });
  });

  /* ════════════════════════════════════════════════════
     LINK ATIVO NO MENU
     ════════════════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ════════════════════════════════════════════════════
     ANIMAÇÃO SCROLL (Intersection Observer)
     ════════════════════════════════════════════════════ */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .stat-card, .item-card, .blog-card, .value-card, .team-card, .service-card').forEach(el => {
    if (!el.classList.contains('fade-in')) {
      observer.observe(el);
    }
  });

  /* ESC fecha modais */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.blog-modal-backdrop.visible').forEach(m => {
        m.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }
  });

});