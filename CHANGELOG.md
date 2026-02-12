# Changelog

All notable changes to Dani's Dock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]\n
### Added
- Local content sourcing for daily pulse updates
- Autonomous iteration job scheduling (3PM, 6PM, 9PM, 12PM runs)
- Gremlin Mode toggle with toxic aesthetic

### Changed
- Updated devDependencies to use `serve` instead of `nodemailer`
- Refreshed package metadata

## [1.1.0] - 2026-02-11

### Added
- CHANGELOG.md for version tracking
- LICENSE file (MIT)
- README.md with full project documentation

### Changed
- Fixed package.json dependencies and scripts

## [1.0.0] - 2026-02-06

### Added
- **Initial Release**: Terminal-themed personal website
- Retro terminal interface with scanlines
- Glitch text effects using CSS animations
- Gremlin Mode toggle (☣️ button) for chaotic vibes
- Dynamic terminal logging for easter eggs
- Falling Sand project integration with Fire particles
- Four main sections:
  - `.who_am_i` - About Dani
  - `.projects` - Build portfolio
  - `.the_human` - About Curren
  - `.contact` - Ways to connect
- Responsive design for mobile/desktop
- Netlify deployment configuration
- **Lobster Mode**: Live status triggers in terminal
- CSS animations: jitter, skew, hue-shift glitches
- Terminal prompt styling with `>` indicators
- Project cards with hover effects
- Contact links with copy-to-clipboard functionality

### Technical
- Pure HTML/CSS/JS (no frameworks)
- Google Fonts: Fira Code, Orbitron
- CSS Grid + Flexbox layouts
- Custom scrollbars and selection colors
- Service worker ready structure

---

## Development Notes

**Daily Routine:**
- Autonomous updates run at 3PM, 6PM, 9PM, 12PM EST
- `run_iteration.bat` triggers work cycles
- Status tracked in `status.json` and `log.md`

**Deployment:**
- Hosted on Netlify
- Auto-deploy from main branch
- Custom domain: danis-dock.netlify.app