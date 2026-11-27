/*
 * neis-byte.js — 세특 글의 나이스(NEIS) 바이트를 세는 계산기
 * ------------------------------------------------------------------
 * 세는 방법 (UTF-8 바이트 길이를 기준으로 합니다)
 *   - 영문·숫자·공백·기본 기호(아스키 문자) : 1바이트
 *   - 한글·한자 등 대부분의 글자            : 3바이트
 *   - 줄바꿈(엔터)                          : 계산기마다 1 또는 2로 달라서 선택하게 했습니다
 *     (기본값 2. 최종 기준은 나이스 입력 화면입니다.)
 *
 * 왜 따로 계산기가 필요한가?
 *   AI는 글을 '토큰' 단위로 처리해서 바이트를 정확히 세지 못합니다.
 *   그래서 바이트는 여기서 재고, AI에게는 "몇 바이트 줄여 줘"처럼 숫자로 시킵니다.
 *
 * 입력한 글은 이 브라우저 안에서만 계산하고 어디로도 보내지 않습니다.
 */
(function () {
  'use strict';

  /* ── 계산 함수 (화면과 상관없이 쓸 수 있는 부분) ─────────── */

  // 글자 하나(코드 포인트)의 바이트 수
  function charBytes(cp, nlBytes) {
    if (cp === 0x0A) return nlBytes;   // 줄바꿈
    if (cp <= 0x7F) return 1;          // 아스키: 영문·숫자·공백·기본 기호
    if (cp <= 0x7FF) return 2;         // 일부 기호(예: ·)는 UTF-8에서 2바이트
    if (cp <= 0xFFFF) return 3;        // 한글·한자 등
    return 4;                          // 이모지 등 (세특에는 쓰지 않음)
  }

  // 전체 바이트와, 한도를 넘기 시작하는 위치(문자열 인덱스)를 함께 계산합니다.
  function measure(text, nlBytes, limit) {
    const t = String(text).replace(/\r\n?/g, '\n');  // 윈도우 줄바꿈(\r\n)은 1개로
    let bytes = 0;
    let cutIndex = t.length;
    let i = 0;
    for (const ch of t) {              // for...of는 한 글자씩(서로게이트 쌍 포함) 돕니다
      const b = charBytes(ch.codePointAt(0), nlBytes);
      if (bytes + b > limit && cutIndex === t.length) cutIndex = i;
      bytes += b;
      i += ch.length;
    }
    return { text: t, bytes, cutIndex };
  }

  // 테스트·재사용을 위해 내보냅니다 (예: 콘솔에서 NeisByte.measure('가a\n', 2, 1500))
  window.NeisByte = { measure, charBytes };

  /* ── 화면 연결 (tools/neis-byte.html 안에서만 동작) ──────── */

  const $ = id => document.getElementById(id);
  const textEl = $('text');
  if (!textEl) return;                 // 계산기 화면이 아니면 여기서 끝
  const limitEl = $('limit');
  const nlEl = $('nl');
  const fmt = n => n.toLocaleString('ko-KR');

  function escapeHTML(s) {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  function update() {
    const limit = Math.max(0, parseInt(limitEl.value, 10) || 0);
    const nlBytes = parseInt(nlEl.value, 10);
    const { text, bytes, cutIndex } = measure(textEl.value, nlBytes, limit);
    const diff = limit - bytes;

    $('bytes').textContent = fmt(bytes);
    $('chars').textContent = fmt(Array.from(text).length);
    $('charsNoSpace').textContent = fmt(Array.from(text.replace(/\s/g, '')).length);

    // 남은 바이트 / 초과 바이트
    const status = $('status');
    status.classList.toggle('over', !!text && diff < 0);
    status.textContent = !text ? '글을 붙여 넣으세요'
      : diff >= 0 ? `${fmt(diff)}바이트 남음`
      : `${fmt(-diff)}바이트 초과`;

    // 한도를 넘는 부분 미리 보기 (나이스에서 잘릴 수 있는 부분)
    const overflow = $('overflow');
    overflow.hidden = !(text && diff < 0);
    if (!overflow.hidden) {
      $('overflowText').innerHTML = escapeHTML(text.slice(0, cutIndex)) + '<mark>' + escapeHTML(text.slice(cutIndex)) + '</mark>';
    }

    // AI에게 보낼 문장
    $('askText').textContent = !text ? ''
      : diff < 0
        ? `이 세특은 나이스 기준으로 지금 ${fmt(bytes)}바이트야. ${fmt(limit)}바이트 이내가 되도록 ${fmt(-diff)}바이트 이상 줄여 줘. 학생이 한 활동과 핵심 역량 표현은 남기고, 꾸밈말부터 줄여 줘.`
        : `이 세특은 지금 ${fmt(bytes)}바이트야. 학생이 실제로 한 활동 중 빠진 것이 있으면 ${fmt(diff)}바이트 안에서 보태 줘. 없는 활동은 지어내지 마.`;
  }

  // 복사 버튼
  $('copyAsk').addEventListener('click', e => {
    const t = $('askText').textContent;
    if (!t) return;
    navigator.clipboard.writeText(t).then(() => {
      e.target.textContent = '복사됨';
      setTimeout(() => { e.target.textContent = '복사'; }, 1500);
    });
  });

  [textEl, limitEl, nlEl].forEach(el => el.addEventListener('input', update));
  update();
})();
