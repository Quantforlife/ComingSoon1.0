# Architecture
- src/config/vyron.js: all event content, media paths, links, content status. Edit only this for content.
- src/main.js: teaser controller, Three.js obsidian monolith, one GSAP timeline (KF keyframes) driving object + camera via targets S smoothed into P, text choreography, cursor.
- src/styles/global.css: tokens, layout, responsive, reduced motion.
- Assets: public/assets/video/vyron-teaser.mp4, vyron-teaser-poster.webp, public/assets/images/dempo-logo.png
- Run: npm install && npm run dev. Build: npm run build.
## Known gaps
Not yet split into per-feature modules; no browser screenshot QA run; quality modes are automatic pixel-ratio adaptation only.
