// prototype-sidecar.js

// Feature #1 : Add Selawik font

const installSelawikFont = function () {

    const head = document.head;

    const preload100 = document.createElement('link');
    preload100.rel = 'preload';
    preload100.href = 'https://static.verivox.de/assets/fonts/de/selawik-100.woff';
    preload100.as = 'font';
    preload100.crossOrigin = 'anonymous';
    head.appendChild(preload100);

    const preload400 = document.createElement('link');
    preload400.rel = 'preload';
    preload400.href = 'https://static.verivox.de/assets/fonts/de/selawik-400.woff';
    preload400.as = 'font';
    preload400.crossOrigin = 'anonymous';
    head.appendChild(preload400);

    const preload700 = document.createElement('link');
    preload700.rel = 'preload';
    preload700.href = 'https://static.verivox.de/assets/fonts/de/selawik-700.woff';
    preload700.as = 'font';
    preload700.crossOrigin = 'anonymous';
    head.appendChild(preload700);

    const styleWithFontFace = document.createElement('style');
    styleWithFontFace.textContent = `
    @font-face{font-family:Selawik;src:url(https://static.verivox.de/assets/fonts/de/selawik-400.woff) format("woff"),url(https://static.verivox.de/assets/fonts/de/selawik-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:optional}
    @font-face{font-family:Selawik;src:url(https://static.verivox.de/assets/fonts/de/selawik-100.woff) format("woff"),url(https://static.verivox.de/assets/fonts/de/selawik-100.woff2) format("woff2");font-weight:100;font-style:normal;font-display:optional}
    @font-face{font-family:Selawik;src:url(https://static.verivox.de/assets/fonts/de/selawik-700.woff) format("woff"),url(https://static.verivox.de/assets/fonts/de/selawik-700.woff2) format("woff2");font-weight:700;font-style:normal;font-display:optional}
    `
    head.appendChild(styleWithFontFace);
}
installSelawikFont();





// Feature #2 : Protection Layer

const addProtectionLayer = function () {
    // hint: to generate new hash run
    // node -e "console.log(require('crypto').createHash('sha256').update('my_new_code_word').digest('hex'))"
    const EXPECTED_HASH = '51e9317ae92cde2546955a65876f6a5630464a2f69763e5b1d580a166977ffc1';

    const overlayHTML = `
  <div id="pw-overlay" style="position:fixed;z-index:99999;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.98);">
    <form id="pw-form" style="background:#fff;padding:2rem 2.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.1);display:flex;flex-direction:column;gap:1rem;min-width:260px;">
      <label for="pw-input" style="font-size:1.1rem;">Willkommen beim User-Test!<br/><br/>Code-Wort:</label>
      <input id="pw-input" type="password" autocomplete="off" style="padding:0.5rem;font-size:1rem;border:1px solid #ccc;border-radius:4px;" autofocus>
      <button type="submit" style="padding:0.5rem;font-size:1rem;border-radius:4px;background:#ff5600;color:#fff;border:none;cursor:pointer;">Bestätigen</button>
      <div id="pw-error" style="color:#c00;font-size:0.95rem;display:none;">Falsches Code-Wort</div>
    </form>
  </div>
`;

    // Add overlay to the page
    document.body.insertAdjacentHTML('afterbegin', overlayHTML);
    document.body.style.overflow = 'hidden';

    // Add event listener for form submission
    document.getElementById('pw-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const pw = document.getElementById('pw-input').value;

        async function sha256(str) {
            const buf = await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(str)
            );
            return [...new Uint8Array(buf)]
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        async function isCodeWordCorrect(input) {
            return (await sha256(input)) === EXPECTED_HASH;
        }

        if (await isCodeWordCorrect(pw)) {
            document.getElementById('pw-overlay').style.display = 'none';
            document.body.style.overflow = '';
        } else {
            document.getElementById('pw-error').style.display = 'block';
            document.getElementById('pw-input').value = '';
            document.getElementById('pw-input').focus();
        }
    });
}
addProtectionLayer();
