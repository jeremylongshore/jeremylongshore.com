---
title: "Starting a New Build: Local-First AI Resume Parsing"
date: 2025-12-11
author: "Jeremy Longshore"
tags: ["learning", "rust", "wasm", "planning", "new-project"]
description: "I'm starting a new project to build a browser-based resume parser. This post documents why I'm building it and the planning process before writing code."
---

## Why This Project

I was looking at recruitment tooling costs and noticed something: per-document parsing fees. $0.05-$0.20 every time a PDF gets converted to structured data.

That felt solvable. Browsers have gotten powerful. WebGPU exists. Quantized LLMs fit in cache. Why ship data to servers for basic extraction?

I don't know if this will work yet. That's what I'm building to find out.

## What I Did This Week

No code yet. I spent the week on architecture planning:

**Documents created:**
- MVP PRD (scope, requirements, success criteria)
- 6 Architecture Decision Records
- 89-task implementation plan

**Key decisions made:**
- Leptos (Rust) for UI instead of React
- transformers.js with Phi-3-mini for inference
- WebGPU with WASM fallback
- IndexedDB with AES-256-GCM encryption

Each decision has tradeoffs I documented. Some will turn out wrong. That's fine - the point is to have a starting position to iterate from.

## What I Don't Know Yet

A lot:

- Will Phi-3-mini accuracy be good enough? (Target: 90%)
- What's the actual parse latency? (Target: <5s WebGPU, <30s WASM)
- How bad is the 1.5GB initial download UX?
- Will Leptos + Chrome extension architecture work smoothly?

These are hypotheses, not facts. The build will test them.

## The Plan

8 weeks, 89 tasks:

1. **Week 1:** Extension scaffold, Leptos popup
2. **Week 2:** PDF extraction with pdf.js
3. **Weeks 3-4:** LLM inference integration
4. **Week 5:** HITL correction UI
5. **Week 6:** Encrypted storage
6. **Week 7:** Polish and performance
7. **Week 8:** Chrome Web Store submission

Will I hit this timeline? Probably not exactly. But having a plan gives me something concrete to work against.

## Why Document Before Building

I used to jump straight into code. It felt productive but led to meandering projects.

Writing ADRs forces clarity:
- What problem am I solving?
- What are the options?
- Why this choice over alternatives?
- What could go wrong?

The documents aren't bureaucracy. They're thinking tools.

## Following Along

The repo is public. I'll be documenting what works and what doesn't as I go.

This is day one. The interesting part starts when plans meet reality.

---

*Building and learning at Intent Solutions. jeremy@intentsolutions.io*
