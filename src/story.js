import { animate, stagger } from 'animejs';

const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const stage = $('#stage');
if (stage) {
  const av = $('#av'), cap = $('#cap'), who = $('#who'), say = $('#say');
  const titles = ['Chapter 1: Boot up', 'Chapter 2: Meet the stakeholders', 'Chapter 3: Ship it', 'Chapter 4: Eureka'];
  const lefts = ['12%', '6%', '8%', '40%'];
  let token = 0, cur = 0, anims = [];
  const A = (t, p) => { const a = animate(t, p); anims.push(a); return a; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const type = (el, text, ms = 24) => {
    const o = { n: 0 };
    return A(o, { n: text.length, duration: text.length * ms, ease: 'linear', onUpdate: () => (el.textContent = text.slice(0, Math.round(o.n))) });
  };
  const talk = async (L, name, text) => {
    who.textContent = name; say.textContent = ''; cap.classList.add('on');
    $$('.sh').forEach((s) => s.classList.toggle('talk', s.dataset.n === name));
    await L(type(say, text, 20)); await L(sleep(1000));
  };
  const walk = () => ['.leg.l', '.leg.r', '.arm.l', '.arm.r'].map((s, k) =>
    A('#av ' + s, { rotate: k % 3 ? [20, -20] : [-20, 20], duration: 380, alternate: true, loop: true, ease: 'inOutSine' }));
  const burst = async (L) => {
    const box = $('#conf'), cols = ['#e9d8a6', '#ee9b00', '#94d2bd', '#bb3e03', '#0a9396'];
    for (let i = 0; i < 70; i++) { const d = document.createElement('i'); d.style.background = cols[i % 5]; box.append(d); }
    await L(A('#conf i', { x: () => (Math.random() - 0.5) * 900, y: () => -(60 + Math.random() * 220), rotate: () => Math.random() * 720, opacity: [0, 1], duration: 700, ease: 'outQuad' }));
    A('#conf i', { y: '+=420', opacity: 0, duration: 1500, ease: 'inQuad', delay: stagger(8) });
  };

  const cmds = [
    ['python pretrain_dino3d.py --bf16', '✓ 3D DINOv2 pretraining on the H100 cluster'],
    ['python finetune.py --params 303M', '✓ 303M-parameter model fine-tuned'],
    ['python quantize_nnunet.py', '✓ nnU-Net: 97% Dice, lower edge latency'],
    ['docker compose up -d rag-api agents', '✓ FastAPI, LangGraph agents and Qdrant are up'],
  ];
  const chapters = [
    async (L) => {
      await talk(L, 'Narrator', 'Monday, 9:12. An Ubuntu laptop, a GPU cluster and a big idea.');
      A('#av .arm', { rotate: [-6, 6], duration: 180, alternate: true, loop: true, delay: stagger(90) });
      for (const [c, out] of cmds) {
        const row = document.createElement('div'); $('#term').append(row);
        await L(type(row, 'abhi@cdac:~$ ' + c, 22)); await L(sleep(250));
        const ok = document.createElement('div'); ok.className = 'ok'; ok.textContent = out; $('#term').append(ok);
        await L(sleep(450));
      }
    },
    async (L) => {
      const w = walk();
      await L(A('#av', { left: ['6%', '30%'], duration: 3200, ease: 'inOutSine' }));
      w.forEach((a) => a.revert());
      for (const [n, t] of [
        ['CEO', 'We need AI that reads scans and explains them. Can you do it?'],
        ['Abhijith', 'Yes. A BLIP-2 Q-Former pipeline links text and images: 88% clinical domain accuracy.'],
        ['Hospital lead', 'How do we stop it making things up?'],
        ['Abhijith', 'RAG with guardrails and grounding, so every answer cites its source.'],
        ['CEO', 'Ship it.'],
      ]) await talk(L, n, t);
    },
    async (L) => {
      await talk(L, 'Narrator', 'Friday, 6 PM. Merge to main.');
      await L(type($('#push'), '$ git push origin main', 40));
      const steps = $$('.step');
      for (let i = 0; i < steps.length; i++) {
        steps[i].classList.add('run');
        await L(A('#bar', { width: `${(i + 1) * 20}%`, duration: 700, ease: 'inOutQuad' }));
        steps[i].classList.replace('run', 'done');
      }
      A('#live', { opacity: [0, 1], scale: [0.6, 1], duration: 700, ease: 'outElastic(1,.6)' });
      A('#av .arm.r', { rotate: [0, -150], duration: 600, ease: 'outBack' });
      await L(sleep(2000));
    },
    async (L) => {
      await talk(L, 'Narrator', 'Launch day. The users arrive.');
      A('#eur', { opacity: [0, 1], scale: [0.5, 1], duration: 800, ease: 'outBack' });
      A('#av .arm.l', { rotate: [0, 150], duration: 500, ease: 'outBack' });
      A('#av .arm.r', { rotate: [0, -150], duration: 500, ease: 'outBack' });
      A('#av', { y: [0, -30], duration: 380, alternate: true, loop: 5, ease: 'outQuad' });
      A('#chart path', { strokeDashoffset: [1, 0], duration: 2600, ease: 'inOutQuad' });
      burst(L);
      await L(A('#fans span', { opacity: [0, 1], y: [16, 0], delay: stagger(500), duration: 600 }));
      await L(sleep(1800));
    },
  ];

  async function play(i) {
    const my = ++token; cur = i;
    anims.forEach((a) => a.revert()); anims = [];
    stage.dataset.s = i; $('#chap').textContent = titles[i];
    $$('.dot').forEach((d, k) => d.classList.toggle('on', k === i));
    $$('.scene').forEach((s, k) => s.classList.toggle('on', k === i));
    ['#start', '#end'].forEach((s) => $(s).classList.remove('on'));
    cap.classList.remove('on'); say.textContent = '';
    $$('.sh').forEach((s) => s.classList.remove('talk'));
    $('#term').innerHTML = ''; $('#push').textContent = ''; $('#bar').style.width = '0';
    $('#live').style.opacity = 0; $('#eur').style.opacity = 0; $('#conf').innerHTML = '';
    $$('.step').forEach((s) => (s.className = 'step'));
    $$('#fans span').forEach((s) => (s.style.opacity = 0));
    $('#chart path').style.strokeDashoffset = 1;
    av.style.left = lefts[i];
    const L = async (p) => { await p; if (my !== token) throw 'stop'; };
    try {
      await chapters[i](L);
      if (i < 3) { await L(sleep(900)); play(i + 1); } else $('#end').classList.add('on');
    } catch (e) { if (e !== 'stop') throw e; }
  }
  const finish = () => { token++; anims.forEach((a) => a.pause()); $('#end').classList.add('on'); };
  $('#play').onclick = () => play(0);
  $('#replay').onclick = () => play(0);
  $('#skip').onclick = () => (cur < 3 && $('#start').classList.contains('on') === false && stage.dataset.s !== '-1' ? play(cur + 1) : finish());
  $$('.dot').forEach((d, k) => (d.onclick = () => play(k)));
  addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' && stage.dataset.s !== '-1') $('#skip').click(); });
}
