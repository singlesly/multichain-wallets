document.addEventListener('DOMContentLoaded', () => {
  const head = document.querySelector('head');
  head.innerHTML += [
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/Base64/1.1.0/base64.min.js" integrity="sha512-gysqkfMGKYvQSEPi68aIzL4ffmrQ0I6azOoPJ+ocle8k1bblsHJh7QVVoy4HHQG2iPzvFmRbs81d8kkVSyCkjA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
  ].join('');
});

window.addEventListener('load', () => {
  authContainer().append(MetamaskAuth());
});

function MetamaskAuth() {
  const btn = document.createElement('button');
  btn.classList.add('btn');
  const span = document.createElement('span');
  span.innerText = 'Connect';
  btn.appendChild(span);

  const AUTH_MESSAGE = 'Authentication';

  const provider = window.ethereum;

  btn.addEventListener('click', async () => {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const signature = await provider.request({
      method: 'personal_sign',
      params: [AUTH_MESSAGE, account],
    });

    const { token } = await fetch('/api/auth/web3', {
      method: 'POST',
      body: JSON.stringify({
        signature,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
    authContainer().append(TokenCopyToClipboard(token));
  });

  return btn;
}

function TokenCopyToClipboard(token) {
  const exists = document.querySelector('#token-copy-to-clipboard');
  if (exists) {
    exists.remove();
  }
  const btn = document.createElement('button');
  btn.id = 'token-copy-to-clipboard';
  btn.classList.add('btn');
  btn.style.marginLeft = '10px';
  btn.onclick = async () => {
    await navigator.clipboard.writeText(token);
    btn.innerText = 'copied...';
    setTimeout(() => {
      btn.innerText = 'Copy Token';
    }, 1000);
  };
  const span = document.createElement('span');
  span.innerText = 'Copy Token';
  btn.append(span);

  return btn;
}

const authContainer = () => {
  const el = document.querySelector('.auth-wrapper');
  return el;
};
