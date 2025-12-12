---
title: "Hunting the Ghost Bug: 9 PRs, One Import Path"
date: 2025-12-12
draft: false
tags: ["debugging", "learning", "python", "growth", "problem-solving"]
categories: ["Learning Journey", "Behind the Scenes"]
description: "The story of tracking down a bug that made perfectly valid objects fail type checks - and the reminder that sometimes the hardest bugs have the simplest fixes."
---

## The Morning Check-In

I opened GitHub to check on the v1.0.0 release PR. Nine pull requests, all failing CI. The same error across every single one.

My first thought: "Something's fundamentally broken."

My second thought: "This is going to be a long day."

## The Frustrating Part

The error message showed an object that had *everything* right:

```
PipelineResult(issues=[...], plans=[...], total_issues_found=3...)
```

Every field was there. Every value was correct. But Python was saying "this isn't a PipelineResult."

I stared at that for longer than I'd like to admit.

## The Rabbit Hole

I went down the usual paths:
- Maybe the tests are wrong? (They weren't)
- Maybe the data is malformed? (It wasn't)
- Maybe there's a version mismatch? (There wasn't)

I ran the tests locally. Same failure. At least I could reproduce it.

## The Lightbulb Moment

Then I looked more carefully at the error:

```
is not an instance of <class 'agents.shared_contracts.PipelineResult'>
```

The test expected `agents.shared_contracts.PipelineResult`.

But where was the orchestrator importing from?

```python
sys.path.insert(0, str(Path(__file__).parent.parent))
from shared_contracts import PipelineResult
```

Just `shared_contracts`. Not `agents.shared_contracts`.

## The "Are You Kidding Me" Moment

Python treats these as two completely different classes. Same code. Same file. Different import paths = different classes.

The fix was literally changing:
```python
from shared_contracts import PipelineResult
```

To:
```python
from agents.shared_contracts import PipelineResult
```

That's it. That was the bug breaking 9 PRs.

## The Cascade

Of course, fixing one thing revealed three more:
- A module was exporting a function name that didn't exist
- A test was calling a function with the wrong arguments
- The CI workflow was checking a directory that didn't exist

Each one took about 5 minutes to fix once I found it.

## What I Learned (Again)

**The hard bugs aren't always hard.** Sometimes they're just well-hidden simple problems. I spent more time being confused than I did actually fixing anything.

**Trust the error message.** It was telling me exactly what was wrong - the class came from a different module. I just wasn't reading it carefully enough.

**CI failures are gifts.** Yeah, it's annoying to see 9 red X marks. But those failures caught a bug that would have caused real problems in production.

## The Payoff

After the fixes:
- 197 tests passing
- All CI checks green
- v1.0.0 release back on track

The whole investigation took maybe 2 hours. The actual fixes took 20 minutes. The rest was just... looking at things wrong.

## The Reminder

Sometimes when you're deep in complex systems - multi-agent architectures, CI/CD pipelines, deployment workflows - you forget that bugs can still be simple.

A class imported from the wrong path. That's it.

Not a framework issue. Not a design flaw. Just an import statement that took a slightly different route.

---

*Next time isinstance() lies to me, I'm checking import paths first.*
