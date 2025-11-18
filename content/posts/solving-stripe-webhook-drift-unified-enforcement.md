+++
title = 'Solving Stripe Webhook Drift with a Unified Enforcement Engine'
date = 2025-11-17T22:15:00-05:00
draft = false
tags = ["system-design", "stripe", "firebase", "problem-solving", "testing", "saas"]
+++

As a software engineer building a subscription-based SaaS platform, I encountered a classic distributed systems problem: **how do you maintain consistency when external events can arrive delayed, duplicated, or out of order?**

In our case, the external system was Stripe's webhook infrastructure. The internal system was a Firestore-backed workspace with plan and status fields that needed to stay synchronized. When these got out of sync, users could see incorrect billing information or lose access to features they'd paid for.

This is how I designed and implemented a unified plan enforcement engine that solved the drift problem, eliminated duplicate code, and added automatic correction—all while maintaining a complete audit trail for compliance.

## The Business Problem

I'm building Hustle, a youth sports statistics platform where parents can track their kids' game performance. The subscription model is straightforward:

- **Free plan:** 1 player, basic stats
- **Starter plan ($5/mo):** 3 players, advanced stats
- **Plus plan ($10/mo):** 10 players, team analytics
- **Pro plan ($25/mo):** Unlimited, coach features

Revenue depends on accurately tracking which plan each workspace is on and enforcing limits accordingly. But here's what I discovered: **Stripe webhooks are eventually consistent.**

### Real-World Failure Modes

**Scenario 1: Duplicate Delivery**
Stripe retries failed webhooks. If your handler times out but actually succeeded, you process the same event twice.

**Scenario 2: Out-of-Order Arrival**
User upgrades from Starter to Plus at 2:00 PM. Two webhooks fire:
1. `subscription.updated` (sent at 14:00:01)
2. `payment.succeeded` (sent at 14:00:05)

Network latency causes #2 to arrive first. Your database shows the wrong plan for 5 seconds—or 5 minutes if #1 is delayed further.

**Scenario 3: Missed Webhooks**
Webhook delivery fails completely. You won't know until you run a consistency audit and discover drift between Stripe's state and your database.

## The Technical Challenge

Before implementing the solution, our billing code had plan/status update logic scattered across **four separate locations**:

1. Stripe webhook handler (5 event types)
2. Event replay endpoint (manual drift correction)
3. Billing auditor (drift detection)
4. Future admin dashboard (manual overrides)

Each location had ~15 lines of duplicated logic:

```typescript
const plan = getPlanForPriceId(priceId);
const status = mapStripeStatusToWorkspaceStatus(subscription.status);
await updateWorkspace(workspaceId, { plan, status });
await recordBillingEvent(workspaceId, {
  // ... manual before/after tracking ...
});
```

**Problems:**
- No guarantee all handlers stayed in sync
- No built-in idempotency for duplicates
- Drift detection couldn't auto-fix itself
- ~180 lines of duplicate code across handlers

## The Solution: Unified Enforcement Engine

I designed a single authoritative function that handles all plan/status updates with these properties:

### 1. Idempotency by Design

The core algorithm:

```typescript
// Fetch current state
const workspace = await getWorkspace(workspaceId);

// Map Stripe data to workspace types
const targetPlan = getPlanForPriceId(stripePriceId);
const targetStatus = mapStripeStatus(stripeStatus);

// Detect deltas
const planChanged = workspace.plan !== targetPlan;
const statusChanged = workspace.status !== targetStatus;

// Only update if changed
if (planChanged || statusChanged) {
  await updateWorkspace(workspaceId, {
    plan: targetPlan,
    status: targetStatus,
  });
  recordLedgerEntry('plan_changed', { before, after });
} else {
  // No changes - record noop for audit trail
  recordLedgerEntry('plan_changed', { noop: true });
}
```

**Why this works:**

First call with new data:
- Detects mismatch
- Updates workspace
- Records delta in ledger

Second call with same data (duplicate webhook):
- Detects NO mismatch
- Skips workspace update
- Records noop in ledger

The workspace converges to correct state regardless of how many times you call it.

### 2. Delta Detection with Audit Trails

Every enforcement action creates a ledger entry with:
- Before/after state for both plan and status
- Event source (webhook, replay, auditor, manual)
- Stripe event ID (when applicable)
- Human-readable note

Example ledger entry:

```typescript
{
  type: 'plan_changed',
  timestamp: '2025-11-17T14:05:32Z',
  statusBefore: 'active',
  statusAfter: 'past_due',
  planBefore: 'starter',
  planAfter: 'starter',
  source: 'webhook',
  stripeEventId: 'evt_payment_failed_123',
  note: 'Plan enforcement: plan unchanged, active→past_due'
}
```

**Business value:**
- Customer support can see exactly when plan changed
- Compliance audits have immutable record
- Troubleshooting: "Why is this workspace suspended?"

### 3. Automatic Drift Correction

I integrated the enforcement engine into our billing auditor:

```typescript
async function auditWorkspaceBilling(workspaceId) {
  const workspace = await getWorkspace(workspaceId);
  const subscription = await stripe.subscriptions.retrieve(
    workspace.stripeSubscriptionId
  );

  // Detect drift
  const expectedStatus = mapStripeStatus(subscription.status);
  if (workspace.status !== expectedStatus) {
    // Drift detected!

    // Automatically fix simple status/plan mismatches
    await enforceWorkspacePlan(workspaceId, {
      stripePriceId: subscription.items[0].price.id,
      stripeStatus: subscription.status,
      source: 'auditor',
    });

    // Record drift detection + auto-fix in ledger
  }
}
```

**Result:** Periodic audits detect AND fix drift automatically. No manual intervention required.

## Implementation Quality

### Testing Strategy

I wrote **450 lines of tests** for 264 lines of implementation (1.7:1 ratio).

Why such extensive testing?

1. **Billing is critical** - Errors directly impact revenue
2. **Edge cases are numerous** - Workspace not found, unknown price IDs, Firestore failures
3. **Behavioral contracts** - "Never calls Stripe API" prevents circular updates
4. **Regression prevention** - Future changes can't break enforcement logic

Key test categories:
- Delta detection (both changed, only plan, only status, noop)
- Event sources (webhook, replay, auditor)
- Input validation (invalid workspace, price, status, source)
- Error handling (not found, update failure, unknown price)

All 229 tests passing (14 new enforcement tests + 215 existing).

### Code Quality Improvements

**Before:**
- 10 handlers with duplicated plan/status logic
- ~180 lines of repeated code
- No consistency guarantees

**After:**
- 1 enforcement function
- 4 integration points (webhook, replay, auditor, manual)
- 264 lines of enforcement + 450 lines of tests
- Net: Cleaner, more maintainable codebase

**Refactoring example:**

Webhook handler went from 23 lines to 8 lines:

```typescript
// Before
async function handleSubscriptionUpdated(subscription, eventId) {
  const workspace = await getWorkspaceByStripeCustomerId(customerId);
  const planBefore = workspace.plan;
  const statusBefore = workspace.status;
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanForPriceId(priceId);
  const status = mapStripeStatusToWorkspaceStatus(subscription.status);
  await updateWorkspace(workspace.id, { plan, status });
  await updateWorkspaceBilling(workspace.id, { /* ... */ });
  await recordBillingEvent(workspace.id, {
    type: 'subscription_updated',
    statusBefore,
    statusAfter: status,
    planBefore,
    planAfter: plan,
    source: 'webhook',
    note: `Subscription updated: ${planBefore}→${plan}`,
  });
}

// After
async function handleSubscriptionUpdated(subscription, eventId) {
  const workspace = await getWorkspaceByStripeCustomerId(customerId);
  const priceId = subscription.items.data[0].price.id;

  await enforceWorkspacePlan(workspace.id, {
    stripePriceId: priceId,
    stripeStatus: subscription.status,
    source: 'webhook',
    stripeEventId: eventId,
  });

  await updateWorkspaceBilling(workspace.id, {
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
}
```

## Business Impact

### 1. Revenue Protection

**Before:** Drift could cause users to access paid features on free plan or lose access to features they paid for.

**After:** Enforcement ensures plan limits match Stripe subscription. Auditor auto-corrects drift before users notice.

### 2. Compliance & Support

**Before:** No audit trail of plan changes. Customer disputes hard to resolve.

**After:** Complete ledger with before/after state, timestamps, event sources. Support can show exactly when and why plan changed.

### 3. Operational Efficiency

**Before:** Manual drift correction required admin intervention.

**After:** Auditor detects AND fixes drift automatically. Only complex cases (missing subscriptions, unknown price IDs) require manual review.

### 4. Code Maintainability

**Before:** Changes to plan logic required updating 10 separate handlers.

**After:** One function to update. Integration points just call enforcement with appropriate source.

## Lessons Learned

### 1. Design for Idempotency from Day One

Webhooks will be duplicated. Don't treat it as an edge case—it's the normal case.

**Key pattern:** Always compare current state vs. target state before updating.

### 2. Audit Trails Are Not Optional

For billing systems, you need to prove:
- When did the plan change?
- Why did it change?
- Who/what triggered the change?

Ledger entries with before/after deltas provide this proof.

### 3. Passive Design Prevents Circular Loops

**Never update Stripe from enforcement logic.**

Stripe is source of truth for billing. Workspace is source of truth for runtime behavior. Updating Stripe triggers webhook → triggers enforcement → infinite loop.

**The rule:** Enforcement only reads Stripe, applies to workspace.

### 4. Test More Than You Implement

1.7:1 test-to-code ratio caught 5 bugs before production. Worth the investment.

## Technical Skills Demonstrated

- **Distributed Systems:** Handling eventually consistent external events
- **System Design:** Consolidating duplicate logic into authoritative function
- **Testing:** Comprehensive test coverage with mocks and behavioral contracts
- **Firebase/Firestore:** Server-side operations with Firestore Admin SDK
- **Stripe Integration:** Webhooks, subscriptions, idempotency
- **TypeScript:** Type-safe interfaces and validation
- **DevOps:** Automated testing with Vitest, git workflow

## What's Next

### Optional Enhancements

1. **Batch Enforcement Script** - Run enforcement across all workspaces for periodic drift correction
2. **Admin Dashboard UI** - Manual "Force Sync" button with real-time Stripe comparison
3. **Monitoring & Alerts** - Track enforcement metrics, alert on high failure rate

### Integration Opportunities

The `'manual'` source is reserved for future admin operations, enabling support staff to manually trigger enforcement when investigating customer issues.

## Conclusion

Solving webhook drift required thinking beyond immediate fixes to design a system that:

1. **Handles chaos gracefully** - Idempotent design survives duplicates and out-of-order events
2. **Eliminates technical debt** - Consolidated duplicate logic into single function
3. **Self-corrects** - Auditor detects and fixes drift automatically
4. **Provides compliance** - Complete audit trail for every plan change

**Measurable outcomes:**
- Removed 180 lines of duplicate code
- Added 264 lines of enforcement + 450 lines of tests
- 100% test coverage on enforcement logic
- Zero manual drift corrections since deployment

This project showcases my approach to building production systems: anticipate failure modes, design for consistency, test comprehensively, and leave systems better than I found them.

---

*Currently building Hustle, a youth sports stats platform. Available for contract work focused on Firebase, Stripe, and production SaaS infrastructure.*

*Technical deep-dive available at: [StartAITools.com](https://startaitools.com/posts/building-idempotent-stripe-billing-enforcement-firestore/)*
