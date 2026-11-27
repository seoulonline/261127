/*
 * practice.js — data/practice.js의 카드를 실습 안내 페이지에 그립니다.
 * ------------------------------------------------------------------
 * - 같은 part끼리 한 구역(section)으로 묶고, 구역 안의 카드는 2열 격자로 놓습니다.
 * - 왼쪽 목차는 지금 보고 있는 구역을 검게 표시합니다.
 * - place: 'aside'인 카드(시작 전 안전 원칙)는 오른쪽 칸에 고정해 둡니다.
 * - 프롬프트마다 [복사] 버튼이 붙습니다.
 * - [세부과정] 버튼을 누르면 오른쪽에서 패널이 나와 senGPT 테스트 기록(data/process.js)을 보여 줍니다.
 * - 주소 끝에 ?instructor=1 이 있으면 강사용 정답(answer)도 보이고, 세부과정의 AI 답 화면도 펼쳐 둡니다.
 */
(function () {
  'use strict';

  const CARDS = window.PRACTICE || [];
  const PROMPTS = window.PROMPTS || {};
  const PROCESS = window.PROCESS || [];
  const isInstructor = new URLSearchParams(location.search).get('instructor') === '1';
  const root = document.getElementById('cards');
  const toc = document.getElementById('toc');
  const aside = document.getElementById('aside');

  // HTML 특수문자를 안전한 글자로 바꿉니다.
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // 프롬프트 상자 하나 (카드와 세부과정에서 함께 씁니다)
  function promptHTML(id) {
    const p = PROMPTS[id];
    if (!p) return `<div class="prompt">프롬프트 "${esc(id)}"를 찾을 수 없습니다.</div>`;
    return `
      <div class="prompt">
        <div class="prompt-head"><span>${esc(p.title)}</span>
          <button class="copy-btn" data-copy="${esc(id)}">복사</button></div>
        <pre>${esc(p.text)}</pre>
      </div>`;
  }

  // ── 실습 카드 ─────────────────────────────────────────────
  function cardHTML(c) {
    // download 값이 있으면 그 이름(한글)으로 저장됩니다. 배포용 빌드가 넣어 줍니다.
    const files = (c.files || []).map(f => {
      if (!f.href) return `<li>${esc(f.label)}</li>`;
      const dl = f.download ? ` download="${esc(f.download)}"` : '';
      return `<li><a href="${encodeURI(f.href)}"${dl}>${esc(f.label)}</a></li>`;
    }).join('');
    const prompts = (c.prompts || []).map(promptHTML).join('');
    const checks = (c.checks || []).map(x => `<li>${esc(x)}</li>`).join('');
    // process 값이 있고, 그 기록이 data/process.js에 있을 때만 [세부과정] 버튼을 붙입니다.
    const hasProcess = c.process && PROCESS.some(p => p.id === c.process);
    const procBtn = hasProcess
      ? `<button type="button" class="proc-btn" data-process-open="${esc(c.process)}" aria-controls="process">세부과정</button>`
      : '';

    return `
      <article class="card">
        <div class="card-head"><h3>${esc(c.title)}</h3>${procBtn}</div>
        <p class="goal">${esc(c.goal)}</p>
        ${files ? `<div class="block"><h4>자료</h4><ul class="files">${files}</ul></div>` : ''}
        ${prompts ? `<div class="block"><h4>프롬프트</h4>${prompts}</div>` : ''}
        ${checks ? `<div class="block"><h4>확인 포인트</h4><ul class="checks">${checks}</ul></div>` : ''}
        ${c.swap ? `<p class="swap">${esc(c.swap)}</p>` : ''}
        ${isInstructor && c.answer ? `<div class="answer"><h4>강사용 정답</h4><p>${esc(c.answer)}</p></div>` : ''}
      </article>`;
  }

  // 오른쪽 칸에 둘 카드와 가운데에 둘 카드를 나눕니다.
  const asideCards = CARDS.filter(c => c.place === 'aside');
  const mainCards = CARDS.filter(c => c.place !== 'aside');
  aside.innerHTML = asideCards.map(cardHTML).join('');

  // part 이름 순서를 지키면서 카드를 묶습니다.
  const groups = [];
  mainCards.forEach(card => {
    let g = groups.find(x => x.part === card.part);
    if (!g) { g = { part: card.part, cards: [] }; groups.push(g); }
    g.cards.push(card);
  });

  // 구역과 목차를 그립니다.
  groups.forEach((g, i) => {
    const id = `part-${i + 1}`;
    toc.insertAdjacentHTML('beforeend', `<a href="#${id}" data-target="${id}">${esc(g.part)}</a>`);
    root.insertAdjacentHTML('beforeend', `
      <section class="part" id="${id}">
        <h2>${esc(g.part)}</h2>
        <div class="cards">${g.cards.map(cardHTML).join('')}</div>
      </section>`);
  });

  if (isInstructor) document.body.classList.add('instructor');

  // 지금 화면에 보이는 구역을 목차에서 검게 표시합니다.
  const links = Array.from(toc.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.dataset.target === en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.part').forEach(sec => io.observe(sec));
  }

  // ── [세부과정] 오른쪽 패널 ─────────────────────────────────
  const drawer = document.getElementById('process');
  const body = document.getElementById('process-body');
  const ptoc = document.getElementById('process-toc');
  const backdrop = document.querySelector('.process-backdrop');
  const expandBtn = document.querySelector('.process-expand');
  let lastFocus = null;

  // 단계 하나: 설명 → (프롬프트) → (붙여 넣은 자료) → (화면 캡처) → (알아 둘 점)
  function stepHTML(s) {
    const shot = s.img ? `
      <figure class="shot">
        <a href="${encodeURI(s.img)}" target="_blank" rel="noopener"><img src="${encodeURI(s.img)}" alt="${esc(s.alt)}"${s.w ? ` width="${s.w}" height="${s.h}"` : ''} loading="lazy"></a>
        <figcaption>누르면 새 탭에서 크게 볼 수 있습니다.</figcaption>
      </figure>` : '';
    const inner = `
      <p>${esc(s.text)}</p>
      ${s.prompt ? promptHTML(s.prompt) : ''}
      ${s.paste ? `<p class="paste">＋ ${esc(s.paste)}</p>` : ''}
      ${shot}
      ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}`;
    // AI 답이 담긴 단계는 접어 둡니다(실습 전에 답을 먼저 보지 않도록).
    if (s.spoiler) {
      return `<li class="step"><details class="spoiler"${isInstructor ? ' open' : ''}>
        <summary>AI 답 보기 <span>— 직접 해 본 뒤 열어 보세요</span></summary>${inner}</details></li>`;
    }
    return `<li class="step">${inner}</li>`;
  }

  if (drawer && body) {
    body.innerHTML = PROCESS.map(p => `
      <section class="proc" id="proc-${esc(p.id)}">
        <h3>${esc(p.title)}</h3>
        <p class="proc-meta">모델: ${esc(p.model)}</p>
        <p class="proc-intro">${esc(p.intro)}</p>
        <ol class="steps">${(p.steps || []).map(stepHTML).join('')}</ol>
      </section>`).join('');
    ptoc.innerHTML = PROCESS.map(p =>
      `<button type="button" data-goto="${esc(p.id)}">${esc(p.title.replace(/^\d+\.\s*/, ''))}</button>`).join('');
  }

  function openProcess(id) {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    document.body.classList.add('process-open');
    document.querySelectorAll('[data-process-open]').forEach(b => b.setAttribute('aria-expanded', 'true'));
    const target = id && document.getElementById('proc-' + id);
    // 패널이 다 나온 뒤에 해당 부분으로 스크롤합니다.
    requestAnimationFrame(() => {
      body.scrollTop = target ? target.offsetTop - body.offsetTop : 0;
      drawer.querySelector('.process-close').focus({ preventScroll: true });
    });
  }

  function closeProcess() {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('process-open');
    document.querySelectorAll('[data-process-open]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // 주소가 #process 또는 #process-t2 처럼 끝나면 열린 채로 시작합니다(슬라이드에서 바로 연결할 때).
  const m = location.hash.match(/^#process(?:-(.+))?$/);
  if (m) openProcess(m[1]);

  // ── 클릭 한곳에서 처리: 복사 / 세부과정 열기·닫기 / 패널 안 이동 / 모두 펼치기 ──
  document.addEventListener('click', e => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const p = PROMPTS[copy.dataset.copy];
      if (!p) return;
      navigator.clipboard.writeText(p.text).then(() => {
        copy.textContent = '복사됨';
        copy.classList.add('done');
        setTimeout(() => { copy.textContent = '복사'; copy.classList.remove('done'); }, 1500);
      });
      return;
    }
    const opener = e.target.closest('[data-process-open]');
    if (opener) { openProcess(opener.dataset.processOpen); return; }
    if (e.target.closest('[data-process-close]')) { closeProcess(); return; }
    const go = e.target.closest('[data-goto]');
    if (go) {
      const t = document.getElementById('proc-' + go.dataset.goto);
      if (t) body.scrollTo({ top: t.offsetTop - body.offsetTop, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('.process-expand')) {
      const all = Array.from(body.querySelectorAll('details.spoiler'));
      const openAll = all.some(d => !d.open);
      all.forEach(d => { d.open = openAll; });
      expandBtn.textContent = openAll ? 'AI 답 모두 접기' : 'AI 답 모두 펼치기';
    }
  });

  // Esc로 닫고, 패널이 열려 있는 동안 Tab 이동은 패널 안에서만 돕니다.
  document.addEventListener('keydown', e => {
    if (!drawer || !drawer.classList.contains('open')) return;
    if (e.key === 'Escape') { closeProcess(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(drawer.querySelectorAll('a[href], button, summary, [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
