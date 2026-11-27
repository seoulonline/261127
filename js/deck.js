/*
 * deck.js — data/slides.js의 내용을 슬라이드로 그리고, 넘기기·메모·인쇄를 처리합니다.
 * ------------------------------------------------------------------
 * 조작 키
 *   → / Space / PageDown : 다음      ← / PageUp : 이전
 *   Home / End           : 처음 / 끝
 *   N                    : 발표자 메모 보이기/숨기기
 *   F                    : 전체 화면
 *   P                    : 인쇄(→ 'PDF로 저장'을 고르면 슬라이드 PDF가 됨)
 * 주소 끝에 #5 처럼 쓰면 5번째 장부터 열립니다.
 */
(function () {
  'use strict';

  const SLIDES = window.SLIDES || [];
  const PROMPTS = window.PROMPTS || {};
  const stage = document.getElementById('stage');
  const notesEl = document.getElementById('notes');
  let current = 0;

  /* ── 글자 처리 도우미 ─────────────────────────────── */

  // HTML 특수문자를 안전한 글자로 바꿉니다 (내용이 태그로 해석되지 않게).
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  // **굵게** 표시만 <strong>으로 바꿉니다.
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  // 목록 한 줄씩 <li>로 만듭니다.
  function lis(arr) {
    return (arr || []).map(x => `<li>${fmt(x)}</li>`).join('');
  }

  /* ── 슬라이드 종류별 그리기 ───────────────────────── */

  const render = {
    title: s => `
      <h1>${fmt(s.title)}</h1>
      <div class="subtitle">${fmt(s.subtitle)}</div>
      <div class="meta">${(s.meta || []).map(fmt).join('<br>')}</div>`,

    timeline: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <div class="tl">${(s.items || []).map(i => `
        <div class="time">${fmt(i.time)}</div>
        <div><div class="label">${fmt(i.label)}</div><div class="desc">${fmt(i.desc)}</div></div>`).join('')}
      </div>`,

    stats: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <div class="stats">${(s.items || []).map(i => `
        <div><div class="num">${fmt(i.num)}</div><div class="lab">${fmt(i.label)}</div></div>`).join('')}
      </div>
      ${s.note ? `<div class="note">${fmt(s.note)}</div>` : ''}`,

    bullets: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <ul class="bul">${lis(s.bullets)}</ul>
      ${s.aside ? `<div class="aside">${fmt(s.aside)}</div>` : ''}`,

    steps: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <ol class="steps">${lis(s.steps)}</ol>
      ${s.aside ? `<div class="aside">${fmt(s.aside)}</div>` : ''}`,

    twocol: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <div class="two">
        <div><h2>${fmt(s.left.h)}</h2><ul>${lis(s.left.items)}</ul></div>
        <div><h2>${fmt(s.right.h)}</h2><ul>${lis(s.right.items)}</ul></div>
      </div>
      ${s.foot ? `<div class="foot">${fmt(s.foot)}</div>` : ''}`,

    table: s => `
      <div class="kicker">${fmt(s.kicker)}</div>
      <h1>${fmt(s.title)}</h1>
      <table class="tbl">
        <thead><tr>${(s.head || []).map(h => `<th>${fmt(h)}</th>`).join('')}</tr></thead>
        <tbody>${(s.rows || []).map(r => `<tr>${r.map(c => `<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      ${s.foot ? `<div class="foot">${fmt(s.foot)}</div>` : ''}`,

    // 실습 장: 왼쪽에 프롬프트(복사 버튼), 오른쪽에 확인 포인트
    prompt: s => {
      const boxes = (s.prompts || []).map(id => {
        const p = PROMPTS[id];
        if (!p) return `<div class="pbox">프롬프트 id "${esc(id)}"를 data/prompts.js에서 찾을 수 없습니다.</div>`;
        return `
          <div class="pbox">
            <div class="phead"><span>${esc(p.title)}</span>
              <button class="copy-btn" data-copy="${esc(id)}">복사</button></div>
            <div class="ptext">${esc(p.text)}</div>
          </div>`;
      }).join('');
      return `
        <div class="kicker">${fmt(s.kicker)}</div>
        <h1>${fmt(s.title)}</h1>
        <div class="pgrid">
          <div class="plist">
            ${s.files && s.files.length ? `<div class="files">자료 · ${s.files.map(esc).join(' / ')}</div>` : ''}
            ${boxes}
          </div>
          <div class="side">
            <h3>확인 포인트</h3><ul>${lis(s.checks)}</ul>
            ${s.swap ? `<div class="swap">${fmt(s.swap)}</div>` : ''}
          </div>
        </div>`;
    }
  };

  /* ── 전체 슬라이드 만들기 ─────────────────────────── */

  SLIDES.forEach((s, i) => {
    const el = document.createElement('section');
    el.className = `slide t-${s.type}`;
    const draw = render[s.type];
    el.innerHTML = (draw ? draw(s) : `<h1>알 수 없는 type: ${esc(s.type)}</h1>`) +
      `<div class="pageno">${i + 1} / ${SLIDES.length}</div>`;
    stage.appendChild(el);
  });
  const slideEls = Array.from(stage.querySelectorAll('.slide'));

  /* ── 화면 크기에 맞게 확대·축소 ───────────────────── */

  function fit() {
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    slideEls.forEach(el => { el.style.transform = `scale(${scale})`; });
  }

  /* ── 특정 장 보여 주기 ────────────────────────────── */

  function show(n) {
    current = Math.max(0, Math.min(SLIDES.length - 1, n));
    slideEls.forEach((el, i) => el.classList.toggle('active', i === current));
    notesEl.textContent = SLIDES[current].notes || '(메모 없음)';
    history.replaceState(null, '', `#${current + 1}`);
  }

  /* ── 키보드·클릭 조작 ─────────────────────────────── */

  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') { e.preventDefault(); show(current + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); show(current - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(SLIDES.length - 1);
    else if (k === 'n' || k === 'N') notesEl.classList.toggle('show');
    else if (k === 'f' || k === 'F') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
    else if (k === 'p' || k === 'P') window.print();
  });

  // 복사 버튼: 프롬프트 원문을 클립보드에 넣습니다.
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const p = PROMPTS[btn.dataset.copy];
    if (!p) return;
    navigator.clipboard.writeText(p.text).then(() => {
      btn.textContent = '복사됨';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = '복사'; btn.classList.remove('done'); }, 1500);
    });
  });

  window.addEventListener('resize', fit);

  /* ── 시작 ─────────────────────────────────────────── */
  fit();
  const start = parseInt(location.hash.replace('#', ''), 10);
  show(Number.isFinite(start) ? start - 1 : 0);
})();
