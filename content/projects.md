+++
title = 'Projects'
date = 2025-10-19T15:00:00-05:00
draft = false
+++

# What I'm Building

From concept to production, here's what keeps me up at night (in a good way).

---

## Perception
**Live at [perception-with-intent.web.app](https://perception-with-intent.web.app) | AI News Intelligence**

Stop manually checking 50 news sources. Perception monitors everything, filters what matters using 8 specialized Vertex AI agents, and delivers executive-level insights to your dashboard.

Multi-agent system orchestrated via Google's A2A Protocol on Vertex AI Agent Engine. Source-agnostic ingestion (RSS, APIs, custom connectors). Real-time Firebase dashboard with Gemini 2.0 Flash analysis.

**Stack:** Python 3.11, Firebase, Vertex AI Agent Engine, Gemini 2.0 Flash
**Features:** 8-agent orchestration, daily executive briefs, smart alerts, enterprise security
**Google Cloud:** Vertex AI, Cloud Run, Firebase Hosting, Firestore, Cloud Scheduler

---

## Claude Code Plugins
**Live at [claudecodeplugins.io](https://claudecodeplugins.io) | 253 Plugins**

The only Claude Code marketplace 100% compliant with Anthropic's 2025 Skills schema. 253 production-ready plugins including 185 Agent Skills with tool permissions, version tracking, and enhanced activation triggers.

First marketplace to implement the complete 2025 specification released by Anthropic. Includes MCP servers, slash commands, subagents, and the Skills Powerkit - the first Agent Skills meta-plugin.

**Stack:** Next.js 15, TypeScript, GitHub-based marketplace, Node.js MCP servers
**Features:** 253 plugins, 185 Agent Skills, tool permission system, activation guides
**Status:** v1.3.1 (November 2025), 221+ commits in 2025

---

## PipelinePilot
**Production | B2B Sales Automation Platform**

B2B sales automation orchestrating external data providers (Clay, Apollo, Clearbit, Crunchbase) through an AI-powered Reasoning Engine. Firebase Functions gateway routing to Vertex AI for intelligent API orchestration.

Serverless architecture with bring-your-own-keys (BYO) policy for cost control and compliance. Multi-cloud ready with Terraform templates for GCP, AWS, and Azure deployments.

**Stack:** Firebase Functions Gen2 (Node 20 ESM), Python ADK, Vertex AI Reasoning Engine
**Features:** 4 ADK-compliant agents, 6 connector tools, action counting, multi-tenant isolation
**Google Cloud:** Firebase Functions, Vertex AI, Firestore, Secret Manager

---

## HustleStats
**In Development | Youth Sports Analytics**

Youth soccer statistics tracking with three integrated systems: core Next.js app, Vertex AI multi-agent orchestration (A2A protocol), and NWSL video pipeline using Veo 3.0.

Currently in Phase 1 migration from PostgreSQL/NextAuth to Firebase Auth and Firestore. Step 1 complete with local Firebase wiring verified. Multi-agent system includes orchestrator plus 4 sub-agents for operations automation.

**Stack:** Next.js 15, React 19, TypeScript, Firebase Auth, Firestore (migrating from Prisma)
**Features:** Player profiles, game tracking, Vertex AI agents, NWSL video generation (CI-only)
**Google Cloud:** Firebase Hosting, Cloud Functions, Firestore, Vertex AI Agent Engine, Veo 3.0

---

## Start AI Tools
**Live at [startaitools.com](https://startaitools.com) | AI Implementation Hub**

AI tools directory, tutorials, and implementation guides. Built in under 24 hours. 65+ posts, 344 pages, technical deep-dives on actually deploying AI.

Not another AI hype blog - practical guides on what works, what doesn't, and how to ship fast.

**Stack:** Hugo, Archie theme, Netlify, Pagefind search
**Purpose:** Help others deploy AI solutions in days, not months

---

## DiagnosticPro
**95% Production Ready | AI Diagnostic Platform**

AI-powered equipment diagnostic platform. Upload a problem photo, get Vertex AI Gemini analysis for $4.99. Helps people avoid getting overcharged by repair shops.

API Gateway routes Stripe webhooks to private Cloud Run backend. Vertex AI analyzes images, generates PDF reports, delivers via email. Data infrastructure includes 266 BigQuery tables for diagnostic intelligence.

**Stack:** React, Express, Vertex AI Gemini, API Gateway, Cloud Run
**Features:** Image analysis, PDF generation, Stripe integration, email delivery
**Google Cloud:** API Gateway, Cloud Run, Firestore, Vertex AI, Firebase Storage, BigQuery
**Status:** Awaiting Firebase Storage bucket creation (5-minute console setup)

---

## Waygate MCP
**[GitHub](https://github.com/jeremylongshore/waygate-mcp) | Enterprise MCP Server**

Security-hardened Model Context Protocol server with Docker isolation. TaskWarrior integration, FastAPI backend, Nginx proxy. Enterprise-grade security without enterprise-grade complexity.

**Stack:** Python 3.12, FastAPI, Docker, Nginx, TaskWarrior
**Security:** Read-only filesystem, non-root user, dropped capabilities
**Status:** v2.1.0 stable

---

## Bob's Brain
**[GitHub](https://github.com/jeremylongshore/bobs-brain) | Sovereign AI Agent**

Personal AI agent that runs wherever you want. Swap LLM providers like batteries (Claude, Google, OpenRouter, Ollama). Learns from every interaction. Optional Slack integration.

Built on the principle that AI should serve you, not surveil you.

**Stack:** Python, Flask, SQLite/Postgres, Neo4j, Redis, Chroma
**Philosophy:** Your hardware, your rules, your data

---

## Private AI Deployments (Intent Solutions)
**intentsolutions.io/ai-models | Enterprise Private LLM Stacks**

Keep data on your cloud while offering ChatGPT-style experience to every teammate. Curated model stack includes Llama 3.1 70B (enterprise reasoning), Mistral 7B (fast interactions), and Qwen 2.5 14B (technical/multilingual).

Orchestration layer automatically routes calls based on task requirements. Maps workflows during onboarding for consistent performance. Combined with Hybrid AI Stack for 60-80% cost reduction via intelligent local/cloud routing.

**Stack:** Llama 3.1 70B, Mistral 7B, Qwen 2.5 14B, Docker, Ollama, n8n, Terraform
**Features:** Model orchestration, workflow mapping, local/cloud routing, AWS/GCP ready
**For:** Enterprises wanting private AI without cloud API bills

---

## N8N Workflow Automation
**Production Workflows | 10+ Active**

Enterprise automation without expensive platforms:
- **Daily Energizer** - Automated content from positive news sources
- **Lead Follow-up System** - B2B lead capture with AI scoring
- **Gmail Drive Organizer** - Attachment automation and organization
- **News Pipeline** - Daily news monitoring with AI analysis
- **AI Blog Journalist** - Automated blog content using Perplexity + Claude

**Stack:** N8N, Claude API, various integrations
**Impact:** Eliminating manual work, one workflow at a time

---

## Prompts Intent Solutions
**[Live Catalog](https://jeremylongshore.github.io/prompts-intent-solutions/) | 150+ Templates**

Battle-tested prompts for development, business ops, marketing, finance. 74 specialized Claude Code agents included.

Stop starting from scratch. Use what actually works.

**For:** Developers and business users who value their time

---

## This Site
**[jeremylongshore.com](https://jeremylongshore.com) | Personal Blog**

Personal blog running hugo-bearblog theme. Clean, minimal, fast. Auto-syncs select content from Start AI Tools daily.

**Stack:** Hugo, hugo-bearblog theme, Netlify, GitHub Actions
**Performance:** Built and deployed in minutes

---

## In Progress

**Local RAG Agent** — Retrieval-augmented generation that runs entirely local
**RSS Atoms** — Feed validation system (226+ feeds tested and curated)
**AI DevOps** — AI-powered DevOps workflows and automation

---

## Open Source Philosophy

Most projects are MIT licensed on [GitHub](https://github.com/jeremylongshore). Clone them, fork them, learn from them, build with them.

If it solved a real problem for me, maybe it'll help you too.

---

## Background

20+ years in restaurant operations (Bonefish Grill, Waffle House) → self-taught developer → AI automation specialist. Marine Corps Reservist, Citadel grad, now building systems that eliminate bullshit and save people money.

**Google Cloud Platform Expert:** Extensive experience with Vertex AI, BigQuery, Firestore, Cloud Functions, Cloud Storage, and GCP infrastructure. Built production systems processing millions of records on Google Cloud.

Based in Gulf Shores, Alabama. Available for consulting through [Intent Solutions](https://intentsolutions.io/).

**Contact:**
Email: jeremy@intentsolutions.io
Discord: asphaltcowboy
X: [@asphaltcowb0y](https://x.com/asphaltcowb0y)
GitHub: [@jeremylongshore](https://github.com/jeremylongshore)
LinkedIn: [jeremylongshore](https://linkedin.com/in/jeremylongshore)
