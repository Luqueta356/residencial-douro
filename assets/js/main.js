(() => {
  const WHATSAPP = '5519991380411';

  // Ícones
  if (window.lucide) lucide.createIcons();

  // Ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // Header ao rolar + botão topo
  const header = document.querySelector('.header');
  const toTop = document.querySelector('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const toggleMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Link ativo no menu
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

  // Reveal ao rolar (com leve atraso em cascata)
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      e.target.style.transitionDelay = Math.min(siblings.indexOf(e.target), 8) * 60 + 'ms';
      e.target.classList.add('is-visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Contadores animados
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, dur = 1600, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  // Carrosséis
  if (window.Swiper) {
    new Swiper('.hero-swiper', {
      loop: true, speed: 1000, effect: 'fade', fadeEffect: { crossFade: true },
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    });
    new Swiper('.gallery-swiper', {
      loop: true, centeredSlides: true, slidesPerView: 'auto', spaceBetween: 24, speed: 700,
      grabCursor: true,
      autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '.gallery-swiper .swiper-button-prev', nextEl: '.gallery-swiper .swiper-button-next' },
      pagination: { el: '.gallery-swiper .swiper-pagination', clickable: true },
    });
  }

  // Player do vídeo
  const player = document.getElementById('player');
  const video = document.getElementById('douroVideo');
  const playBtn = document.getElementById('playBtn');
  const startVideo = () => { video.controls = true; video.muted = false; video.play().catch(() => { video.muted = true; video.play(); }); };
  playBtn.addEventListener('click', (e) => { e.stopPropagation(); startVideo(); });
  player.addEventListener('click', () => { if (video.paused && !video.controls) startVideo(); });
  video.addEventListener('play', () => player.classList.add('is-playing'));
  video.addEventListener('pause', () => { if (!video.seeking) player.classList.remove('is-playing'); });
  video.addEventListener('ended', () => { player.classList.remove('is-playing'); video.controls = false; video.currentTime = 0; });
  // Pausa ao sair da tela
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !video.paused) video.pause(); }, { threshold: 0.2 }).observe(video);

  // Abas das plantas
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.plan');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
    panels.forEach(p => {
      const on = p.dataset.panel === tab.dataset.tab;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
  }));

  // "Tenho interesse nesta planta" pré-seleciona o formulário
  const interest = document.getElementById('f-int');
  document.querySelectorAll('[data-interest]').forEach(btn => btn.addEventListener('click', () => {
    interest.value = btn.dataset.interest;
  }));

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); };
  document.addEventListener('click', (e) => {
    const holder = e.target.closest('[data-lightbox], .plan__img, .implant__img, .location__aerial');
    if (holder) {
      const img = holder.matches('img') ? holder : holder.querySelector('img');
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    }
  });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); toggleMenu(false); } });

  // Tooltip do WhatsApp aparece sozinho uma vez
  const tip = document.querySelector('.wa-float__tip');
  setTimeout(() => { tip.classList.add('is-show'); setTimeout(() => tip.classList.remove('is-show'), 4500); }, 3500);

  // Máscara de telefone
  const tel = document.getElementById('f-tel');
  tel.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      : d.length > 2 ? d.replace(/(\d{2})(\d{0,5})/, '($1) $2')
      : d;
  });

  // Formulário -> WhatsApp da MultiDomus
  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    let ok = true;
    [f.nome, f.telefone].forEach(i => {
      const bad = i.name === 'telefone' ? i.value.replace(/\D/g, '').length < 10 : !i.value.trim();
      i.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    const consent = form.querySelector('.consent input');
    if (!ok || !consent.checked) {
      msg.textContent = !ok ? 'Preencha nome e WhatsApp válidos.' : 'Marque a autorização de contato.';
      msg.classList.add('is-error');
      return;
    }
    msg.classList.remove('is-error');
    const text = [
      'Olá! Tenho interesse no *Residencial Douro*.',
      `*Nome:* ${f.nome.value.trim()}`,
      `*WhatsApp:* ${f.telefone.value}`,
      f.email.value.trim() && `*E-mail:* ${f.email.value.trim()}`,
      `*Interesse:* ${f.interesse.value}`,
      f.mensagem.value.trim() && `*Mensagem:* ${f.mensagem.value.trim()}`,
    ].filter(Boolean).join('\n');
    // Meta Pixel: evento Lead no envio do formulário
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: 'Residencial Douro - Formulario', content_category: 'Imovel MCMV Campinas' });
    }
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    msg.textContent = 'Abrindo o WhatsApp… Obrigado! Em breve um especialista falará com você.';
    form.reset();
  });
})();
