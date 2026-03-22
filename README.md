# Claude 101

An interactive learning website that explains how Claude Code works — from AI's first-person perspective.

一个交互式学习网站：以 AI 的第一人称视角，理解 Claude Code 的工作原理。

## Chapters

| # | Topic | Description |
|---|-------|-------------|
| 01 | Prompt | Your first instruction |
| 02 | Context | What can you see? |
| 03 | Tools | You now have hands and feet |
| 04 | Agentic Loop | Think, act, observe, repeat |
| 05 | MCP | Connecting to the outside world |
| 06 | RAG & Memory | Bridging the gap of forgetting |
| 07 | Hooks | Automated triggers |
| 08 | Skills | Reusable superpowers |
| 09 | Plugins | Package your superpowers |
| 10 | Agents & Subagents | The art of cloning |
| 11 | Permissions & Safety | The boundaries of trust |
| 12 | Configuration | Customize your Claude Code |

## Tech Stack

- **Framework**: [Astro](https://astro.build/) (Island Architecture)
- **Interactive Components**: [React](https://react.dev/) (`client:only="react"`)
- **Content**: MDX
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 + CSS Variables
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)
- **Language**: TypeScript (strict)
- **i18n**: ZH / EN toggle (React Context + localStorage)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── i18n/                    # i18n context & language toggle
├── engine/                  # Scene engine (navigation, transitions)
├── components/
│   ├── scene/               # Scene framework (Narration, ChatBubble, DeepDive...)
│   └── interactive/         # Interactive components per chapter
│       ├── ch01/
│       ├── ch02/
│       └── ...
├── chapters/                # Chapter scene definitions (ch01–ch12)
├── config/                  # Chapter metadata
├── layouts/                 # Astro layouts
├── pages/
│   ├── index.astro          # Home page
│   └── chapters/*.mdx       # Chapter pages
└── styles/                  # Global CSS + scene styles
```

## Design Inspirations

- Visual & interaction: [The Evolution of Trust](https://ncase.me/trust/) by Nicky Case
- Content reference: [Learn ShareAI](https://learn.shareai.run/en/), [Claude Code Docs](https://code.claude.com/docs/en/overview)

## License

MIT
