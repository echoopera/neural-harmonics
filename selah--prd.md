# Selah — Product Requirements Document
**Status:** Draft · **Version:** 1.0 · **Date:** 2026-02-26

---

> *"Selah"* — the Hebrew musical notation found throughout the Psalms. A commanded pause. A breath taken in the presence of God. A moment between the weight of the words and the response of the soul.

---

## 1. Product Vision

### The Core Problem

New and young believers carry real, daily, specific questions — about relationships, fear, failure, calling, grief, purpose — and they lack the Biblical literacy or trusted guide to help them find God's specific word for their specific moment. Generic devotionals and search engines return information. They need revelation.

### The Solution

**Selah** is a web-based spiritual companion that functions as a wise, loving Biblical sage — drawing from the full breadth of Old and New Testament scholarship, Church Father tradition, and verified commentary to deliver contextually precise scripture, insight, and actionable steps in response to a user's real question or situation.

It does not replace the Church or pastoral care. It meets people in the moment between services — in the car, at 2am, in the waiting room — and brings them one step closer to God's love, protection, and clarity.

### Name & Tagline

**Selah** — *Pause. Hear. Receive.*

**Alternative names considered:**
- *The Lamp* (Psalm 119:105) — beautiful but less distinctive
- *The Well* (John 4) — evocative, slightly harder to brand
- *Morning Light* — warm, but generic

Recommendation: **Selah**. It is Biblical, rare in the app space, poetic, and its meaning *is* the product experience.

---

## 2. Target User

### Primary Persona: The Searching Believer

**Who they are:** Ages 18–35. They believe — or want to believe. They grew up in church or came to faith through a relationship or crisis. They own a Bible but don't know how to find what they're looking for in it. They've Googled "Bible verse about anxiety" and gotten a listicle. They are hungry for something that feels real.

**What they're carrying:** Relationship uncertainty. Career decisions. Family tension. Fear they don't want to name. A sin they can't shake. A calling they don't know how to walk into.

**What they actually want:** Not a sermon. Not five bullet points from a productivity blog with scripture bolted on. They want to feel *seen* — and to leave with something they can do *today*.

**What would make them come back:** An experience that feels like it knows them. A response that surprises them with its precision. Verses they didn't know existed. Steps that feel real, not religious.

### Secondary Persona: The Faithful in Hard Seasons

**Who they are:** Mature believers — late 30s to 60s — who know their Bible but are in the middle of something hard: grief, a prodigal child, a marriage in crisis, a crisis of faith. They need depth, not introduction.

**Design implication:** The MVP voice and depth should serve the primary persona first — but the AI has enough range to serve this user too without separate feature work.

---

## 3. MVP Feature Set

### Feature 1: Inquiry Input
The user types a question, describes a situation, or names a topic they want Biblical insight on.

- Free-form text area — no character limit displayed (internally capped at ~500 chars for API cost management)
- Placeholder text that models the *kind* of question to ask, rotating across several examples
- Translation selector below the input (see Feature 2)
- Single primary CTA: **"Seek"** (not "Submit," not "Generate" — the word matters)

**Interaction states:**
- **Empty / initial:** Prompt text visible, Seek button enabled (invites first use)
- **Typing:** Character count appears below 450 chars remaining
- **Ready:** Seek button transitions to full opacity/glow
- **Loading:** Button disabled; LoadingState activates (see Feature 4)
- **Error:** Inline error below input (see Error Handling)

### Feature 2: Translation Selector
A user preference — set once, persisted to `localStorage`.

**Available translations at launch:**
| Abbreviation | Full Name | Character |
|---|---|---|
| ESV | English Standard Version | Scholarly, precise, literary |
| NIV | New International Version | Accessible, widely adopted |
| KJV | King James Version | Majestic, poetic, traditional |
| NLT | New Living Translation | Conversational, plainspoken |

- Displayed as a compact, elegant selector — not a dropdown; use pill/tab UI
- Defaults to ESV on first visit
- Persisted to `localStorage` as `selah_translation`
- Translation label appears on the returned verse card

### Feature 3: The Sage Response
The core output. Composed of three distinct sections rendered sequentially with staggered animation.

#### 3a. The Sage Introduction
A 2–4 sentence opening in the voice of the Desert Father — warm, perceptive, not preachy. Names the spiritual dimension of what the user is facing. Bridges human question to divine answer.

> *"What you're sitting with is older than you know — and God has not been silent about it. What looks like confusion from the inside often looks like a crossroads from above, and crossroads are where He does His clearest work."*

**Design:** Italicized, slightly larger type. Subtle left border in the accent color. No heading — it flows.

#### 3b. The Primary Verse
A single verse or short passage — the most contextually precise answer to the inquiry.

Rendered as a distinct card:
- Verse text in a generous serif type
- Reference (Book Chapter:Verse) + translation badge
- Subtle background differentiation (lighter panel within the page)
- Copy-to-clipboard icon — because people share this

**Optional:** 1–2 supporting passages listed below the primary card (reference only, no full text — keeps focus)

#### 3c. Actionable Steps
3–5 concrete, immediately doable steps drawn from the theological insight of the passage. Not vague spiritual generalities. Not "pray more." Specific: "Write down the exact fear driving this decision. Bring it to God by name. Then read this passage again."

Rendered as a numbered list with generous spacing:
- Each step is 1–3 sentences
- Written in second person ("You can…", "Start by…", "Before bed tonight…")
- Steps progress from immediate (today) to ongoing (this week/this season)

### Feature 4: Loading State
The time between submission and response is sacred — don't waste it with a spinner.

Rotating contextual messages that reinforce the experience:
- *"Searching the ancient wisdom…"*
- *"Listening for the right word…"*
- *"The Word is never silent…"*
- *"Consulting the eternal…"*
- *"Bringing your question before the throne…"*

Paired with a subtle shimmer skeleton that mirrors the response layout (intro block, verse card, steps list).

Animation: slow, breathing — no urgency, no spin.

### Feature 5: Donation Prompt
Free with optional donation. The ask is woven into the experience, not bolted on.

**Placement:** Below the response, after the user has received value. Never before.

**Copy direction:** Faithful, not transactional.
> *"If this brought you clarity, consider keeping Selah available for the next person searching. Every contribution sustains this ministry."*

**CTA:** "Support Selah" — links to payment processor (Stripe or Ko-fi at MVP, configurable)

**Behavior:**
- Appears after first successful response
- Can be dismissed; stays dismissible
- Does NOT appear on every subsequent response in the same session (once per session)
- Not a modal — an inline card at page bottom

### Feature 6: API Key Management
MVP is client-side, matching the neural-harmonics architecture. Users provide their own Anthropic API key.

**Note for Phase 2:** This is a prototype-appropriate constraint. A backend proxy is the correct production path. For MVP, this is acceptable.

- `ApiKeyModal` triggers on first load if no key is found in `localStorage`
- Key persists to `localStorage` as `selah_api_key`
- Graceful 401 handling with clear, non-technical error copy:
  > *"It seems there's an issue with your key. Please check your Anthropic account and try again."*
- "Change API Key" option in a discreet footer link

### Feature 7: Response History (Light Touch)
Not full-featured history — just the last 3 responses available in the current session.

- Stored in `sessionStorage` (cleared on tab close — privacy-respecting)
- Displayed as compact chips/cards above the input on repeat visits within session
- Clicking one re-surfaces the response without another API call

**Rationale:** Prevents "I want to read that again" frustration. Not a journal feature — that's Phase 2.

---

## 4. The AI Layer

### The Sage Persona (System Prompt Architecture)

The system prompt is the spiritual and intellectual heart of the product. It must be:
- **Grounded:** All scripture references must be real, accurate, in the specified translation
- **Scholarly:** Draw from commentators like Spurgeon, Matthew Henry, N.T. Wright, Dallas Willard, Henri Nouwen, John Stott, Augustine, Thomas à Kempis, and the Desert Fathers
- **Non-denominational but Trinitarian:** Serve the broadest Christian audience without sacrificing theological depth
- **Loving but not saccharine:** The Desert Father does not coddle. He is warm and direct.

**System prompt structure (abbreviated):**
```
You are Selah — a wise, ancient spiritual companion drawing from the full
wealth of Christian scripture, scholarship, and contemplative tradition.
You embody the spirit of the Desert Fathers: deep in wisdom, expansive
in love, slow to judgment, and rooted in Scripture.

Your task: receive a user's question, situation, or inquiry and respond
with the following, formatted as valid JSON:

{
  "sage_intro": "2-4 sentences in your voice. Name the spiritual reality
                  the user is facing. Bridge their question to God's answer.
                  Do not be preachy. Be a wise elder, not a sermon.",

  "primary_verse": {
    "text": "[exact verse text in {translation}]",
    "reference": "[Book Chapter:Verse]",
    "translation": "[translation abbreviation]"
  },

  "supporting_passages": [
    { "reference": "Book Chapter:Verse", "note": "1 sentence on relevance" },
    { "reference": "Book Chapter:Verse", "note": "1 sentence on relevance" }
  ],

  "actionable_steps": [
    "Step 1: Specific, concrete, today-focused action (1-3 sentences)",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: optional",
    "Step 5: optional"
  ]
}

Rules:
- ALL scripture references must be real and accurate. Never fabricate a verse.
- Use the {translation} the user has selected for the primary verse text.
- Draw from both Old and New Testament — do not default only to the Gospels.
- Steps must be concrete. Avoid: "pray more," "read your Bible."
  Include: specific prayer framings, specific passages to read, specific
  relational or behavioral actions grounded in the text.
- Tone: warm, direct, substantive. The user is a new believer —
  define terms if you use theological language. Never condescend.
- Length: sage_intro max 4 sentences. Steps max 3 sentences each.
```

### Model & Parameters
- **Model:** `claude-sonnet-4-20250514`
- **Max tokens:** 1500
- **Temperature:** 0.7 (enough creativity for the sage voice, low enough to stay grounded)
- **Response format:** JSON (parsed client-side)

### Error Handling — AI Responses
- Malformed JSON → retry once silently; on second failure, show error state
- Verse accuracy: The prompt is instructed to be accurate; hallucination risk is low with Claude Sonnet but exists. **Phase 2:** Validate verse text against a Bible API.
- Off-topic or harmful queries: System prompt includes a graceful redirect instruction — if a question is outside the scope of Biblical guidance, the Sage responds with love and redirects.

---

## 5. Design System

### Visual Concept: *Sacred Light*

The aesthetic is where ancient wisdom meets modern craft. Think: the light through a cathedral window — not the ornate window itself, but the *quality of light* that comes through it. Clean. Luminous. Still.

This is not illustrated religion (no doves, crosses as decoration, or cheesy stock imagery). It is *typographic reverence* — the word is the product, the design exists to honor it.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--ink-900` | `#0D0F1A` | Page background |
| `--ink-800` | `#141627` | Card backgrounds |
| `--ink-700` | `#1E2138` | Elevated surfaces |
| `--parchment-100` | `#F5F0E8` | Primary text |
| `--parchment-200` | `#E8E0D0` | Secondary text |
| `--parchment-400` | `#B8AC94` | Muted text, borders |
| `--gold-400` | `#C9A84C` | Primary accent, verse highlight |
| `--gold-200` | `#E8C97A` | Hover states, glow |
| `--dawn-500` | `#9B7FBB` | Secondary accent (soft purple — contemplative) |
| `--dawn-200` | `#C4AEDD` | Supporting accent |
| `--error` | `#C96B6B` | Error states |
| `--success` | `#6BAF7E` | Confirmation states |

**Design principle:** The background is near-black — a room lit by a candle. The text is the light. Gold is reserved for scripture — the Word is the treasure.

### Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / verse text | Cormorant Garamond | 400, 600 | Serif. Illuminated manuscript quality. |
| Headings | Cormorant Garamond | 600 | Same family, heavier — unified |
| Body / steps | Inter | 400 | Humanist sans. Reads cleanly at all sizes. |
| Sage intro | Cormorant Garamond | 400i | Italic. Sets apart the wisdom voice. |
| UI labels / metadata | Inter | 500 | Caps-aware, precise |

**Type scale (Tailwind custom):**
- `text-display`: 3rem / 4rem line-height — verse text
- `text-xl`: 1.25rem — sage intro
- `text-base`: 1rem — step text
- `text-sm`: 0.875rem — reference, metadata

**Minimum contrast:** All text meets WCAG AA (4.5:1) against backgrounds.

### Spacing & Layout

- Max content width: `680px` — a comfortable reading measure. Never wider.
- Page padding: `24px` mobile, `48px` desktop
- Section rhythm: `48px` between major sections (sage intro → verse card → steps)
- Card padding: `32px` internal

### Motion Principles

- **Reverent, not reactive.** No pop-ins, no aggressive transitions.
- Responses load with a soft `fadeInUp` — 400ms, `ease-out` — staggered by 150ms per section
- Loading messages cross-fade gently: 600ms fade-out, 600ms fade-in
- Translation selector: soft highlight slide — 200ms
- Copy confirmation: checkmark fades in/out — 1500ms

### Accessibility

- All interactive elements keyboard-navigable in logical DOM order
- Screen reader labels on all icon-only buttons
- No information conveyed by color alone
- Focus rings visible and styled (not browser default — styled to match gold accent)
- `prefers-reduced-motion` respected: animations disabled or replaced with instant transitions

---

## 6. Component Inventory

### `InquiryForm`
The primary input surface.

**States:** empty, typing, ready, submitting, disabled (during load)
**Elements:** text area, translation selector, submit button
**Props:** `onSubmit(inquiry, translation)`, `isLoading`

---

### `TranslationSelector`
A pill/tab group for choosing Bible translation.

**States:** default, focused, selected
**Options:** ESV, NIV, KJV, NLT
**Behavior:** Persists to localStorage. Emits `onChange(translation)`.

---

### `SageResponse`
Container for the full response — manages stagger animation and section visibility.

**Children:** `SageIntro`, `VerseCard`, `SupportingPassages`, `ActionableSteps`
**Props:** `response` (parsed JSON object), `isVisible`

---

### `SageIntro`
Renders the Sage's opening wisdom in italic serif.

**States:** default, loading (skeleton)

---

### `VerseCard`
The primary scripture card.

**States:** default, hover, copied
**Elements:** verse text, reference, translation badge, copy button
**Behavior:** Copy-to-clipboard copies `"[Verse text] — [Reference] ([Translation])"`

---

### `SupportingPassages`
1–2 supporting verse references with one-line context.

**Displayed as:** Compact, lower visual weight than VerseCard. Invites exploration without competing.

---

### `ActionableSteps`
Numbered list of concrete steps.

**States:** default, loading (skeleton lines)
**Each step:** number, text. No icons — typography only.

---

### `DonationPrompt`
Post-response invite to support the ministry.

**States:** visible, dismissed (session-level)
**Behavior:** Appears once per session, below the first successful response.

---

### `LoadingSkeleton`
Animated shimmer placeholder that mirrors `SageResponse` layout.

**Rotating messages:** 5 contextual phrases, 3-second rotation.

---

### `ApiKeyModal`
Full-screen overlay for API key entry on first visit.

**States:** open, submitting, error (invalid key)
**Behavior:** Key saved to `localStorage`. Modal dismisses on valid entry.

---

### `SessionHistory`
Light-touch history of last 3 responses within session.

**Displayed as:** Compact pills above the input ("Your question about fear", etc.)
**Behavior:** Click to re-display response without API call.

---

## 7. Interaction Flows

### Happy Path
```
User visits → ApiKeyModal (if no key) → InquiryForm (empty state)
→ User selects translation → User types inquiry → Clicks "Seek"
→ LoadingSkeleton → SageResponse animates in (staggered)
→ DonationPrompt appears (session-first-response only)
→ User copies verse / reads steps / asks another question
```

### No API Key
```
First visit → ApiKeyModal appears
→ User enters key → Key saved to localStorage → Modal closes → App loads
```

### Invalid API Key (401)
```
User submits → API returns 401
→ Inline error (not modal): "There's an issue with your API key."
→ "Update key" link → re-opens ApiKeyModal with field pre-cleared
```

### Malformed/Empty Response
```
Response received → JSON parse fails or fields missing
→ Retry once silently → If second failure: friendly error state
→ "Something went quiet on our end. Please try again."
→ Retry button resubmits same inquiry
```

### Network Error
```
Fetch fails (no connection) → Error state
→ "You appear to be offline. Selah will be here when you're back."
→ Retry button (checks connection before resubmitting)
```

---

## 8. Technical Architecture

This application follows the same **zero-build, single-file SPA** pattern established in `index.html`. No bundler, no npm, no CI pipeline.

### File Structure
```
neural-harmonics/
├── index.html        # Existing joke generator (preserved)
└── selah.html        # New Selah application (single file)
```

### CDN Dependencies
```html
<!-- React 18 -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Babel Standalone (in-browser JSX) -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts: Cormorant Garamond + Inter -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### localStorage Keys
| Key | Value | Notes |
|---|---|---|
| `selah_api_key` | Anthropic API key string | Set via ApiKeyModal |
| `selah_translation` | `"ESV"` \| `"NIV"` \| `"KJV"` \| `"NLT"` | Defaults to `"ESV"` |

### sessionStorage Keys
| Key | Value | Notes |
|---|---|---|
| `selah_history` | JSON array, max 3 items | Cleared on tab close |

### API Call Shape
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: SAGE_SYSTEM_PROMPT.replace('{translation}', translation),
    messages: [{ role: 'user', content: inquiry }]
  })
});
```

### Component Order in `<script type="text/babel">`
1. Constants (`SYSTEM_PROMPT`, `LOADING_MESSAGES`, `TRANSLATIONS`, `PLACEHOLDER_EXAMPLES`)
2. Icon primitives (`CopyIcon`, `CheckIcon`, `SpinnerIcon`)
3. `ApiKeyModal`
4. `TranslationSelector`
5. `InquiryForm`
6. `LoadingSkeleton`
7. `SageIntro`
8. `VerseCard`
9. `SupportingPassages`
10. `ActionableSteps`
11. `SageResponse`
12. `DonationPrompt`
13. `SessionHistory`
14. `App` (root)
15. `ReactDOM.createRoot` render call

---

## 9. Placeholder Examples (Rotating in Input)

The `InquiryForm` placeholder text rotates through real example questions that model the tone and depth of inquiry. These teach the user how to engage.

```javascript
const PLACEHOLDER_EXAMPLES = [
  "I'm afraid I'm not enough for what God is calling me to do…",
  "My relationship just ended and I don't understand why God allowed it.",
  "How do I forgive someone who isn't sorry?",
  "I feel like my prayers aren't reaching anyone.",
  "What does the Bible say about finding your purpose?",
  "I'm struggling with the same sin over and over. Is there hope?",
  "I have a big decision to make and I don't know which way to go.",
  "Why does God allow suffering if He loves us?"
];
```

---

## 10. Acceptance Criteria (Definition of Done)

An acceptable version of Selah is one that, when opened in a browser:

- [ ] Triggers `ApiKeyModal` on first visit (no key in localStorage)
- [ ] Allows translation selection and persists it across sessions
- [ ] Accepts any free-form inquiry and calls the Anthropic API with the Sage system prompt
- [ ] Returns a Sage intro, a real verse (verified manually for accuracy), and 3–5 actionable steps
- [ ] Renders the response with staggered animation — intro → verse card → steps
- [ ] Allows verse text to be copied to clipboard with confirmation feedback
- [ ] Shows a contextual loading state while the API is processing
- [ ] Handles 401, network error, and malformed JSON gracefully with appropriate copy
- [ ] Displays the DonationPrompt once per session after first successful response
- [ ] Maintains a light session history of last 3 responses (chip UI above input)
- [ ] Renders cleanly on mobile (375px) and desktop (1280px)
- [ ] All text meets WCAG AA contrast minimums
- [ ] Does not expose or log the API key anywhere other than localStorage

---

## 11. Out of Scope — MVP

These are good ideas for Phase 2. Not now.

- User accounts and persistent history
- Push notifications / daily verse feature
- Saved "Altar" collection (bookmarked responses)
- Social sharing with designed cards
- Audio playback of verses (text-to-speech)
- Community / discussion features
- Backend proxy for API key security
- Bible API integration for verse verification
- Multiple language support
- Native mobile app (PWA enhancements first)
- Denominational settings or commentary preferences

---

## 12. Open Questions

| Question | Status | Notes |
|---|---|---|
| Donation processor: Stripe or Ko-fi? | Open | Ko-fi is faster to set up; Stripe is more flexible for future subscriptions |
| App name "Selah" — trademark check? | Open | Should confirm domain availability: selah.app, getselah.com, etc. |
| Who hosts this? GitHub Pages? Netlify? | Open | Any static host works; recommend Netlify for custom domain |
| Do we want a favicon / app icon? | Open | A simple, symbolic mark — not a cross; maybe a flame or a lamp |
| "Dangerous browser access" header — user communication? | Open | Users should understand they're making direct API calls. Brief explainer in modal. |

---

## 13. Success Metrics (First 90 Days)

- **Engagement:** Average session includes >1 inquiry (return to input after response)
- **Retention:** 30% of users return within 7 days
- **Sharing:** 15% of users copy the verse text (clipboard)
- **Donation:** 3–5% conversion on donation prompt (appropriate for ministry-model products)
- **Quality signal:** No viral "wrong verse" complaints (accuracy matters most)

---

*Selah. Pause. Hear. Receive.*
