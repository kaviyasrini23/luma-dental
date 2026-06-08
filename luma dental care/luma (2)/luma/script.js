/* Luma Dental Clinic — script.js (Premium UI Enhancements) */
(function () {
  'use strict';

  /* ---- Navbar shadow on scroll ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---- Scroll reveal via IntersectionObserver ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = +el.dataset.count;
      const duration = 1600;
      const start    = performance.now();
      const step = (now) => {
        const p      = Math.min((now - start) / duration, 1);
        const eased  = 1 - Math.pow(1 - p, 3);
        const suffix = target >= 1000 ? '+' : '';
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  /* ---- WhatsApp float button toggle ---- */
  const waBtn   = document.getElementById('waBtn');
  const waPopup = document.getElementById('waPopup');
  const waClose = document.getElementById('waClose');

  if (waBtn && waPopup) {
    const iconOpen  = waBtn.querySelector('.wa-icon-open');
    const iconClose = waBtn.querySelector('.wa-icon-close');

    const openPopup = () => {
      waPopup.classList.add('open');
      if (iconOpen)  iconOpen.style.display  = 'none';
      if (iconClose) iconClose.style.display = '';
      waBtn.setAttribute('aria-expanded', 'true');
    };

    const closePopup = () => {
      waPopup.classList.remove('open');
      if (iconOpen)  iconOpen.style.display  = '';
      if (iconClose) iconClose.style.display = 'none';
      waBtn.setAttribute('aria-expanded', 'false');
    };

    waBtn.addEventListener('click', () => {
      waPopup.classList.contains('open') ? closePopup() : openPopup();
    });

    if (waClose) waClose.addEventListener('click', closePopup);

    const hasSeenPopup = sessionStorage.getItem('wa_popup_seen');
    if (!hasSeenPopup) {
      setTimeout(() => {
        openPopup();
        sessionStorage.setItem('wa_popup_seen', '1');
      }, 4000);
    }

    document.addEventListener('click', (e) => {
      if (!waBtn.contains(e.target) && !waPopup.contains(e.target)) {
        closePopup();
      }
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ======================================================
      Floating Live Reviews Widget (auto-rotating carousel)
  ====================================================== */
  const reviewsData = [
    { name: 'Arrhat', stars: 5, text: 'Dental scaling was painless and smooth. Doctor explained everything clearly.' },
    { name: 'Jayalakshmi', stars: 5, text: 'Fully satisfied with the service. Thanks to Luma Dental Care!' },
    { name: 'Karthikeyan', stars: 4.5, text: 'Procedure was well explained and comfortable throughout. Great care and attention.' },
    { name: 'Meera', stars: 5, text: 'Whitening results were amazing. Friendly staff and spotless clinic.' },
    { name: 'Rahul', stars: 5, text: 'Got emergency relief the same day. Exceptional support and follow-up.' }
  ];

  const reviewsTrack = document.getElementById('reviewsTrack');
  const viewAllBtn = document.getElementById('viewAllReviews');

  function starsHTML(n) {
    const full = Math.floor(n);
    const half = n - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      '<span class="review-stars" aria-hidden="true">' +
      '<i class="fa-solid fa-star"></i>'.repeat(full) +
      (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '') +
      '<i class="fa-regular fa-star"></i>'.repeat(empty) +
      '</span>'
    );
  }

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  if (reviewsTrack) {
    reviewsData.forEach(r => {
      const slide = document.createElement('div');
      slide.className = 'review-slide';
      slide.innerHTML = `
        <div class="review-avatar" aria-hidden="true">${initials(r.name)}</div>
        <div class="review-content">
          “${r.text}”
          <div class="review-meta">
            <strong>${r.name}</strong>
            ${starsHTML(r.stars)}
          </div>
        </div>
      `;
      reviewsTrack.appendChild(slide);
    });

    let current = 0;
    const slideCount = reviewsData.length;
    const viewport = document.querySelector('.reviews-viewport');

    const rotate = () => {
      if (!viewport) return;
      const slideHeight = viewport.clientHeight / 1;
      current = (current + 1) % slideCount;
      reviewsTrack.style.transform = `translateY(-${current * (slideHeight + 12)}px)`;
    };

    let revInterval = setInterval(rotate, 3500);

    const reviewsFloat = document.getElementById('reviewsFloat');
    if (reviewsFloat) {
      reviewsFloat.addEventListener('mouseenter', () => clearInterval(revInterval));
      reviewsFloat.addEventListener('mouseleave', () => {
        clearInterval(revInterval);
        revInterval = setInterval(rotate, 3500);
      });
    }
  }

  /* ---- CLOSE BUTTON ADDED (NEW) ---- */
  const closeReviewsBtn = document.getElementById('closeReviews');
  const reviewsWidget = document.getElementById('reviewsFloat');

  if (closeReviewsBtn && reviewsWidget) {
    closeReviewsBtn.addEventListener('click', () => {
      reviewsWidget.style.display = 'none';
    });
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      window.location.hash = '#contact';
    });
  }

  /* ---- Services Marquee Accessibility Tweaks ---- */
  const servicesTrack = document.getElementById('servicesTrack');
  const servicesMarquee = document.querySelector('.services-marquee');
  if (servicesTrack && servicesMarquee) {
    servicesMarquee.addEventListener('mouseenter', () => {
      servicesTrack.style.animationPlayState = 'paused';
    });
    servicesMarquee.addEventListener('mouseleave', () => {
      servicesTrack.style.animationPlayState = 'running';
    });
  }

  /* ---- Appointment Form + Premium Confirmation Modal ---- */
  const form = document.getElementById('apptForm');
  const msg  = document.getElementById('formMsg');
  const modalBackdrop = document.getElementById('confirmModal');
  const modalClose = document.getElementById('modalClose');
  const viewAppointmentBtn = document.getElementById('viewAppointmentBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');

  const mPatient = document.getElementById('mPatient');
  const mDate = document.getElementById('mDate');
  const mTime = document.getElementById('mTime');
  const mDoctor = document.getElementById('mDoctor');

  if (form) {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = form.querySelector('#date');
    if (dateInput) dateInput.setAttribute('min', today);
  }

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    // CSS fallback visibility handler
    modalBackdrop.style.display = 'flex'; 
    runConfetti();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    // Ensure the structure hides completely from screen overlays
    modalBackdrop.style.display = 'none'; 
    stopConfetti();
  }

  // Bind modern programmatic event configurations to the action buttons
  if (modalClose) modalClose.addEventListener('click', closeModal);
  
  if (viewAppointmentBtn) {
    viewAppointmentBtn.addEventListener('click', closeModal);
  }

  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (form && msg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
        msg.className = 'form-msg error';
        msg.textContent = 'Please fill in all required fields.';
        return;
      }

      // Populate centered modal text inputs dynamically before displaying
      const patientFirstName = data.name.split(' ')[0];
      const selectedDoctor = data.doctor || 'Any Available Doctor';

      if (mPatient) mPatient.textContent = data.name;
      if (mDate) mDate.textContent = data.date;
      if (mTime) mTime.textContent = data.time;
      if (mDoctor) mDoctor.textContent = selectedDoctor;

      // Centered descriptive success message matching modal details
      msg.className = 'form-msg success';
      msg.innerHTML = `
        <strong>Thank you, ${patientFirstName}!</strong> Your appointment is confirmed.<br>
        <strong>📅 Date:</strong> ${data.date} | <strong>⏰ Time:</strong> ${data.time}<br>
        <strong>👨‍⚕️ Doctor:</strong> ${selectedDoctor}
      `;

      openModal();
      form.reset();
    });
  }

  /* ---- CONFETTI SYSTEM ---- */
  let confettiTimer = null;
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let w = 0, h = 0;

  function resizeCanvas() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    w = parent.clientWidth;
    h = parent.clientHeight;
    canvas.width = w;
    canvas.height = h;
  }

  window.addEventListener('resize', resizeCanvas);

  function createParticles(count = 80) {
    particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: -10 - Math.random() * 40,
      r: 4 + Math.random() * 4,
      c: ['#2F80ED','#00B2D9','#8AB4F8','#25D366','#FFD166'][Math.floor(Math.random()*5)],
      vx: -1 + Math.random() * 2,
      vy: 2 + Math.random() * 2,
      a: 0.85
    }));
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.006;
    });
    particles = particles.filter(p => p.y < h + 10 && p.a > 0);
  }

  function animateConfetti() {
    drawParticles();
    if (particles.length === 0) return;
    confettiTimer = requestAnimationFrame(animateConfetti);
  }

  function runConfetti() {
    if (!canvas) return;
    resizeCanvas();
    createParticles(100);
    cancelAnimationFrame(confettiTimer);
    confettiTimer = requestAnimationFrame(animateConfetti);
  }

  function stopConfetti() {
    cancelAnimationFrame(confettiTimer);
    if (ctx) ctx.clearRect(0, 0, w, h);
    particles = [];
  }

})();