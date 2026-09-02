> **Superseded.** This describes the earlier grayscale build. The page now follows Apex Driver Brand System v3 (see README.md); where this file disagrees with the brand system, the brand system wins.

# Apex Driver — Voice Guide

Derived from the copy in the design handoff, which already holds a consistent
voice. This guide names what that copy is doing so it can be extended to
surfaces that don't exist yet (checkout, confirmation emails, errors) without
drifting.

---

## We are

**Understated.** The car is the loudest thing in the room. The writing isn't.
A Huracán does not need an adjective in front of it.

**Concrete.** Specific nouns, real numbers, named places. "Frederick, Maryland,"
"V10 · 630HP," "30 MIN." Never a claim that can't be pointed at.

**Assured.** State the fact once and move on. No reassuring the reader twice, no
hedging, no working to convince. Confidence reads as brevity here.

**Plain-spoken.** Say it the way you'd say it to someone standing next to the
car. No luxury-brand poetry, no motorsport jargon, no words nobody uses out loud.

---

## Voice chart

| Trait | Do | Don't |
|---|---|---|
| Understated | "A Huracán." | "An absolutely breathtaking Lamborghini Huracán." |
| Concrete | "We meet at a set point in Frederick, Maryland." | "We'll meet at a convenient location." |
| Assured | "Every drive is covered." | "We're proud to say every drive should be fully covered." |
| Plain-spoken | "Pilot drives, with a professional alongside." | "Elevate your journey with our expert-guided pilot program." |

---

## The three rules that matter most

### 1. "You" is the buyer. "They" is the driver.

This site sells to someone buying a gift for someone else. The existing copy
holds that line exactly, and it's the easiest thing to break.

- ✅ "Give them the wheel."
- ✅ "The recipient books by phone or email using the code on their voucher."
- ✅ "No fine print for the gift buyer to explain."
- ❌ "Get behind the wheel of a Huracán." — now you're selling to the driver
- ❌ "Your unforgettable drive starts here." — same mistake

Once the recipient is the one reading (voucher card, redemption page,
confirmation email), "you" flips to them. Know which surface you're writing.

### 2. Subtraction is the proof.

This brand builds trust by naming what's absent: "no track fees," "no fine
print," "no waitlist." It works because each one is a real friction a
competitor imposes.

Earn every negation. Don't invent one for rhythm.

### 3. Fragment, then expand.

The signature rhythm is a short fragment followed by a parallel clause pair:

> A Huracán. A lead car ahead, a chase car behind.

> Real roads, a set date, and a straightforward booking process.

Use it deliberately, not in every paragraph. Two fragments in a row is a tic.

---

## We sound like

- "A Huracán. A lead car ahead, a chase car behind."
- "Every voucher includes a professional alongside, on local roads, no track fees."
- "They pick the date. We handle the rest."
- "Thirty minutes on roads worth driving."
- "The code on the card is all they need."
- "No fine print for the gift buyer to explain."

## We don't sound like

- "Unleash the beast!" — hype, exclamation point
- "The ultimate adrenaline-fueled bucket-list experience" — four banned words in one line
- "Our team is passionate about delivering unforgettable memories" — about us, not them
- "Elevate your gifting journey" — jargon, means nothing
- "Book now and feel the thrill of raw Italian horsepower coursing through you"

**Banned vocabulary:** unforgettable, adrenaline, thrill/thrilling, dream,
bucket list, once-in-a-lifetime, elevate, unleash, curated, bespoke, luxury,
exclusive, VIP, pulse-pounding, heart-racing, journey (as metaphor), experience
(as a verb).

**Banned punctuation:** exclamation points. Anywhere. There is not a surface on
this site that needs one.

---

## CTAs

The design sets the form: uppercase, Space Grotesk 700, letterspaced. The copy
rules:

- **Verb + object. Four words maximum.** "GIVE THE DRIVE." "BOOK A VOUCHER."
- **Use giving verbs on the marketing page**, buying verbs only inside checkout.
  The whole page is framed as a gift; "ADD TO CART" belongs after the decision,
  not during it.
- **Never first-person.** Not "Get my voucher," not "Start my booking."
- **Never generic.** Not "Submit," "Learn more," "Click here," "Get started."
- **Never hype.** Not "Start your engines," not "Let's go!"
- **Say what happens next** when the action is non-obvious. A tier card's
  "GIVE THIS DRIVE →" tells you the card itself is the button.

| Context | Good | Bad |
|---|---|---|
| Hero | GIVE THE DRIVE | START YOUR ENGINES |
| Tier card | GIVE THIS DRIVE → | LEARN MORE |
| Closing CTA | BOOK A VOUCHER | GET STARTED TODAY |
| Checkout | PAY $795 | COMPLETE MY JOURNEY |
| Redemption | SCHEDULE THE DRIVE | SUBMIT |

---

## Errors

**A palette constraint drives this.** The design is deliberately grayscale —
there is no red in the token set. Error states cannot lean on color to carry
urgency, so the words have to do it, and the UI needs a non-color signal
(a dashed-to-solid border change, an inline mark). Flag this to design rather
than introducing a red that breaks the system.

Rules:

- **Name what happened, then what to do.** Two clauses, one line.
- **Never apologize twice.** Once, briefly, or not at all.
- **Never blame the reader.** "That card was declined," not "You entered an
  invalid card."
- **Never say "Oops," "Uh oh," or "Something went wrong."** Say what went wrong.
- **Name the actual field.** Generic form errors are the fastest way to sound
  like every other checkout.

| Situation | Write | Not |
|---|---|---|
| Card declined | "That card was declined. Try another, or call (000) 000-0000." | "Oops! Payment failed." |
| Missing email | "We need an email to send the voucher." | "This field is required." |
| Bad voucher code | "That code doesn't match a voucher. Check the card and try again." | "Invalid input." |
| Date unavailable | "That date is taken. The next open one is March 4." | "Error: unavailable." |
| Server failure | "We couldn't process that. Nothing was charged — try again in a minute." | "Something went wrong!" |

The money line matters: if a payment fails, say explicitly that nothing was
charged. That is the buyer's actual fear.

---

## Empty states

Empty is not broken, and it's not an occasion for a joke. State the condition,
give one next action. No mascots, no "Nothing to see here."

| Situation | Write |
|---|---|
| No bookings yet | "No drives scheduled yet. Book one with the code on your voucher." |
| Fleet filtered to nothing | "No cars match that filter. The fleet is two Huracáns today — more soon." |
| No voucher history | "No vouchers yet." |
| Search returns nothing | "Nothing matched. Try a shorter search." |

Where the design already has an honest empty state — "EXPANDING SOON" next to a
two-car fleet — keep that register. It admits the size of the operation without
apologizing for it. That's the voice working.

---

## Tone shifts by context

| Context | Shift | Example |
|---|---|---|
| Homepage | Baseline — assured, spare | "Give them the wheel." |
| Checkout | Flatter, more literal. No poetry near money. | "You're buying one Driver II voucher. $795." |
| Confirmation | Warmer by one degree, still spare | "The voucher is on its way. They can book whenever they're ready." |
| Support / problem | Direct, no defensiveness | "That didn't go through. Here's what to do." |
| Safety / waiver | Most formal. Precision over style. | "A licensed driver must be present for the full session." |
| Instagram | Shortest register. Often just the car. | "Huracán 01. Back roads. Saturday." |

Safety copy is the one place to let the voice go quiet and just be accurate.
Nobody wants brand personality in a liability waiver.

---

## Applied: homepage copy

The handoff copy already sits in this voice. Below, each section shows the
generic version this brand would drift toward, and the version that holds.

### Hero

> **Generic:** "Experience the Drive of a Lifetime — Give the gift of an
> unforgettable supercar adventure they'll never forget."

> **Apex Driver:** **GIVE THEM THE WHEEL.**
> A Huracán. A lead car ahead, a chase car behind. They choose: drive it, or
> ride along while a pro does.

Ships as-is. The headline is three words and does the whole job: names the gift,
names the recipient, and puts the wheel — not the car — at the center.

### How it works

Copy unchanged, order changed. The steps were numbered 01–04 but ran out of
sequence: "REDEEM WHEN READY" sat at 04, describing the booking that happens
before anyone meets in Frederick. Numbering promises chronology, so it has to
deliver it.

Now: **01** redeem → **02** meet → **03** choose pilot or copilot → **04** drive.

Two things improved at once. The numbers are true, and the section ends on the
drive instead of on booking admin — the route diagram's arrowhead now lands on
the most exciting step rather than the most procedural one. Step 03 still does
the heavy lifting, defining Pilot and Copilot without a glossary.

One optional addition, for buyers who don't know what they're committing the
recipient to:

> **Section intro:** "Four steps, start to finish. Nothing for the recipient to
> figure out."

### Fleet

Ships as-is. "EXPANDING SOON" beside two cars is the most on-voice line on the
page — honest about scale, not apologetic.

If a third car lands, resist "Our Growing Collection." It stays "THE FLEET."

### Pricing

> **Generic:** "Choose the perfect package for your budget and unlock an
> experience they'll treasure forever."

> **Apex Driver:** **PICK A TIER**
> Every voucher includes a professional alongside, on local roads, no track fees.

Ships as-is. Suggested addition under the grid, because the ghost card currently
explains itself only through "ASK FOR DETAILS":

> "Driver X is for anything that doesn't fit a tier — a longer route, a wedding,
> a shoot. Tell us what you have in mind."

### Why gift this

Ships as-is. All three headlines are two or three words; all three bodies land
on a subtraction. That's the pattern working.

The 12-month window is tempting as a fourth column here — it's a genuine
subtraction and the buyer's real worry. It stays out. The section is specified
as a 3-column grid, and a fourth point costs a design change to save a fact that
already has a home in the FAQ.

### FAQ

One change shipped. FAQ 01 asks how the recipient redeems the voucher and didn't
say how long they have, which is the buyer's next question:

> "They receive a card, physical or digital, with a QR code. They call or email
> to schedule their drive. **Vouchers are good for 12 months.**"

Duration rather than a printed date, because the FAQ is written before anyone
buys and doesn't know the purchase date.

### Contact / closing CTA

> **Generic:** "Ready to Make Memories? Get Started Today!"

> **Apex Driver:** **READY TO GIVE THE DRIVE?**
> BOOK A VOUCHER

Ships as-is.

### Copy for the surfaces that don't exist yet

**Voucher card (recipient-facing — "you" flips here):**

> "This is good for one Driver II drive — 45 minutes in a Huracán near
> Frederick, Maryland. Call or email with the code below. Good through
> March 14, 2027."

**Purchase confirmation:**

> "The voucher is on its way to your inbox. They have until March 14, 2027 to
> book — no need to pick a date now."

**On stating the 12-month window.** Vouchers are good for 12 months from
purchase. Which form to use depends on whether the surface knows the purchase
date:

- **It knows the date → print the date.** "Good through March 14, 2027." A
  printed date is concrete; a duration makes the reader do arithmetic. Voucher
  cards, confirmation emails, and account pages all know the date.
- **It doesn't know the date → say "12 months."** Marketing pages, FAQ, and
  pricing copy are written before anyone buys. "Vouchers are good for 12 months"
  is the right form there.

Never write "expires." Write "good through." Same fact, and it doesn't open the
gift on a deadline.

**Booking confirmed:**

> "You're set for Saturday, March 14 at 9:00 AM. We'll meet you at the point in
> Frederick — details are in your email."

---

## Voice test

Before anything ships, four questions:

1. Would a competitor write this exact sentence? If yes, rewrite it.
2. Is there an adjective doing work a noun should do?
3. Am I writing to the buyer or the driver — and is that the right one for this
   surface?
4. Could I say this out loud, standing next to the car, without wincing?
