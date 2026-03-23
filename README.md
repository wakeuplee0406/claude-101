# Claude 101

> An interactive learning website that explains how Claude Code works — from AI's first-person perspective.

**[Live Demo](https://airingursb.github.io/claude-101/)**

## Chapters

### Fundamentals

| # | Topic | Description |
|---|-------|-------------|
| 01 | **Prompt** | Your first instruction |
| 02 | **Context** | What can you see? |

### Tools & Execution

| # | Topic | Description |
|---|-------|-------------|
| 03 | **Tools** | You now have hands and feet |
| 04 | **Agentic Loop** | Think, act, observe, repeat |
| 05 | **MCP** | Connecting to the outside world |

### Memory & Knowledge

| # | Topic | Description |
|---|-------|-------------|
| 06 | **Memory** | Persistent memory |
| 07 | **Codebase Intelligence** | Understanding & searching your codebase |

### Extensions

| # | Topic | Description |
|---|-------|-------------|
| 08 | **Hooks** | Automated triggers |
| 09 | **Skills** | Reusable superpowers |
| 10 | **Plugins** | Package your superpowers |

### Collaboration & Governance

| # | Topic | Description |
|---|-------|-------------|
| 11 | **Agents & Subagents** | The art of cloning |
| 12 | **Permissions & Safety** | The boundaries of trust |
| 13 | **Configuration** | Customize your Claude Code |

## Tech Stack

- **Framework**: [Astro](https://astro.build/) (Island Architecture)
- **Interactive Components**: [React](https://react.dev/) (`client:only="react"`)
- **Content**: MDX + custom Scene Engine
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 + CSS Variables (dark theme)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) + SVG animations
- **Language**: TypeScript (strict)
- **i18n**: Chinese / English toggle (React Context + localStorage)

## Getting Started

```bash
npm install
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Project Structure

```
src/
├── config/                  # Chapter metadata & categories
├── engine/                  # Scene engine (navigation, transitions, context)
├── i18n/                    # Language context & toggle
├── components/
│   ├── scene/               # Scene primitives (Narration, ChatBubble, DeepDive...)
│   └── interactive/         # Interactive components per chapter
│       ├── ch01/            #   MessageStructure
│       ├── ch02/            #   ContextLayers, CompactSimulator
│       ├── ch03/            #   ToolExplorer
│       ├── ch04/            #   AgenticLoop
│       ├── ch05/            #   MCPArchitecture
│       ├── ch06/            #   MemorySystem
│       ├── ch07/            #   CodeSearch
│       ├── ch08/            #   HookLifecycle
│       ├── ch09/            #   SkillBuilder, SkillLoader
│       ├── ch10/            #   PluginAnatomy
│       ├── ch11/            #   SubagentDispatch, SubagentIsolation
│       ├── ch12/            #   PermissionSimulator
│       └── ch13/            #   ConfigMap, ConfigBuilder
├── chapters/                # Chapter scene definitions (Ch01–Ch13)
├── layouts/                 # Astro layouts (base + chapter)
├── pages/
│   ├── index.astro          # Home page
│   └── chapters/*.mdx       # Chapter pages (article + scenes)
└── styles/
    ├── global.css           # Tailwind + theme variables
    └── scene.css            # Scene engine + component styles
```

## How It Works

Each chapter combines two layers:

1. **Article** (MDX) — scrollable long-form content explaining concepts
2. **Scenes** (React) — full-screen interactive experiences with click-to-advance navigation

The Scene Engine manages transitions, scroll locking, and progress tracking. Interactive components use `useSceneComplete()` to gate progression — you must interact with each demo before moving forward.

## References

- Visual & interaction design: [The Evolution of Trust](https://ncase.me/trust/) by Nicky Case
- Content: [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code), [Learn ShareAI](https://learn.shareai.run/en/)

## License

MIT
