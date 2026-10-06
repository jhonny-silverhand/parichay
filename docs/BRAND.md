# Brand & Identity Architecture (BRAND.md)

## 1. Naming Process & Evaluation

We evaluated 17 candidate names against six core criteria:
1. **Length**: ≤ 10 characters for display versatility and icon legibility.
2. **Pronunciation**: Natural, unambiguous phonetics for English, Hindi, and Marathi speakers.
3. **Semantic Fit**: Evoking introduction, greeting, presence, or exchange rather than cold tech ("QR", "Card", "Scan").
4. **Cultural Resonance**: Dignified, warm, and memorable across multilingual demographics.
5. **Distinctiveness**: No confusion with dominant enterprise tech or popular social networks.
6. **Icon Potential**: Distinctive letterforms for monogram crafting.

### Full Candidate Pool
| # | Name | Origin / Language | Meaning / Association | Score (1-10) | Notes |
|---|------|-------------------|-----------------------|--------------|-------|
| 1 | **Parichay** | Sanskrit / Hindi / Marathi | Introduction, identity, acquaintance | **9.8** | Perfect cultural fit; warm, phonetically clean, dignified |
| 2 | **Sparsh** | Sanskrit / Hindi / Marathi | Touch, tactile contact | 8.8 | Strong, slightly clinical in some contexts |
| 3 | **Milap** | Hindi / Urdu / Marathi | Meeting, union, harmony | 8.2 | Friendly, occasionally confused with matchmaking |
| 4 | **Pehchan** | Hindi / Urdu / Marathi | Identity, recognition | 8.4 | Strong identity meaning, slightly heavy phonetics |
| 5 | **Sanga** | Sanskrit / Pali | Fellowship, association | 7.6 | Short, slightly ambiguous |
| 6 | **Kith** | Old English | Acquaintance, familiar friends | 8.6 | Distinctive, but less resonant for Indian language speakers |
| 7 | **Folio** | Latin / English | Portable case of documents | 7.0 | Overused in design portfolios |
| 8 | **Vouch** | English | Confirm, stand for | 7.2 | Overly legalistic |
| 9 | **Dastak** | Hindi / Urdu / Marathi | Knock on the door, presence | 8.0 | Poetic, but implies knocking rather than introducing |
| 10 | **Paas** | Hindi / Marathi | Near, close | 7.4 | Clashes with ticket "pass" |
| 11 | **Roster** | English | Register of names | 6.5 | Cold, administrative |
| 12 | **Anukram** | Sanskrit / Hindi | Sequence, order | 6.8 | Overly mathematical |
| 13 | **Haathil** | Hindi / Gujarati | Within reach | 7.5 | Rare usage |
| 14 | **Bhent** | Hindi / Marathi | Meeting, greeting, offering | 8.1 | Warm, but regional nuances vary |
| 15 | **Sanvaad** | Sanskrit / Hindi / Marathi | Dialogue, conversation | 7.9 | Good, but more aligned with chat |
| 16 | **Aavahan** | Sanskrit / Hindi | Invitation, call | 7.2 | High register |
| 17 | **Namaskar** | Sanskrit / Hindi / Marathi | Traditional respectful greeting | 8.0 | Very long (8 chars), formal |

### Shortlist Comparison
1. **Parichay**: The exact cultural term used across India when asking "May I introduce myself?" (*Mera parichay* / *Maza parichay*). In English, it reads easily as *Puh-ree-chuy*.
2. **Sparsh**: Evokes the physical touch of exchanging a business card or tapping a phone.
3. **Kith**: Ultra-compact 4-letter English word for personal networks, but lacks multilingual warmth.

### Chosen Name: Parichay (परिचय)
- **Display Name**: `Parichay` (8 characters — fits cleanly below app launcher icons on iOS and Android).
- **Package / Repo Slug**: `parichay`
- **Capacitor App ID**: `com.example.parichay` (Reverse-domain placeholder; must be configured with personal domain prior to store distribution).
- **Android Package**: `com.example.parichay`
- **iOS Bundle ID**: `com.example.parichay`
- **URL-safe Slug**: `parichay`

### Trademark & Conflict Verification Caveat
A best-effort conflict check was performed via search for existing prominent mobile business card applications in the App Store and Google Play. While "Parichay" is an established cultural word, no dominant global mobile digital business card currently holds an exclusive worldwide trademark on the bare software mark. **Caveat**: As an autonomous AI system, formal legal trademark clearances and regional trademark registry searches cannot be certified. Product owners must conduct a formal trademark search in their target jurisdictions before commercial publication.

---

## 2. Brand Positioning & Voice Guide

### Core Promise
> **"One card. One scan. Nothing leaves your phone."**

### One-Sentence Description
A private digital business card that lives only on your phone, sharing contacts via pure offline vCard QR codes with zero servers, tracking, or cloud backup.

### Brand Voice Principles
- **Confident & Calm**: We don't scream for attention. We deliver an essential physical interaction translated faithfully to pixels.
- **Concise & Direct**: Explain what happens in plain words. Never hide technical truths behind marketing fluff.
- **Human & Respectful**: Respect the user's attention, device resources, battery, and personal data.
- **Banned Words**: *revolutionary, next-generation, seamless, empowering, cutting-edge, world-class, unlock, disrupt, magical, AI-driven*.

---

## 3. Brand Identity & Visual Assets

### The Motif: The Card Hand-off
The identity is anchored in the geometric dialogue between two phones or two hands meeting at a 45-degree angle — represented by the interlocking letterforms of the 'P' monogram and a subtle scan aperture.

- **Monogram**: An architectural capital 'P' with an offset inner loop that hints at a camera viewfinder or QR finder pattern.
- **Wordmark**: Custom-tracked serif type paired with clean humanist proportions.
- **Color Palette**:
  - Deep Obsidian (`#111317`): Editorial authority and deep contrast.
  - Soft Linen (`#F7F5F0`): Warm paper-like ground that prevents screen glare.
  - Terracotta Accent (`#B85226`): A single, warm, disciplined accent inspired by Indian clay and terracotta tiles.
  - Secondary Slate (`#4A505C`): Quiet metadata and structural dividers.
