# Deepak Khanal — Portfolio

Animated, fully responsive personal portfolio. Live: https://www.deepak-khanal.com.np

## Features
- Responsive layout for phone, tablet and desktop (mobile menu, touch-friendly, safe-area aware)
- Animated hero (canvas sky, typing effect) that pauses when off-screen
- Custom cursor on desktop mouse devices only (native cursor kept on touch)
- Filterable skills, project detail modals (Esc to close, keyboard accessible)
- **Visitor counter** in the navbar (counts once per browser)
- Working contact form (Web3Forms, falls back to your mail app)
- Respects `prefers-reduced-motion`; works with JavaScript disabled

## Structure
```
index.html   markup
style.css    styles
script.js    behaviour + CONFIG block at the top
```

## Setup
1. **Contact form:** get a free access key at https://web3forms.com and set `CONFIG.web3formsKey` in `script.js`.
2. **Visitor counter:** uses the free Abacus API (`CONFIG.counter`). Change `ns` to your own unique name. If the service is unreachable the counter hides itself.
3. Replace the project "GitHub" links with the real repository URLs.
4. Deploy on Vercel / any static host. No build step.
