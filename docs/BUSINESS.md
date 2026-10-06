# Business Documentation & Product Strategy (BUSINESS.md)

---

## 1. Product Positioning & One-Line Pitch

> **"A private digital business card that lives only on your phone."**

Parichay is positioned at the intersection of **luxury design craft** and **sovereign digital privacy**. Unlike legacy digital card platforms that harvest contact graphs, sell subscription analytics, and force recipients to open tracking URLs over the web, Parichay encodes your identity directly into standard offline vCard 3.0 optical codes, lock-screen wallpapers, and wallet passes.

---

## 2. Target Personas & Use Cases

### Persona A: The Privacy-Conscious Executive / Lawyer (Global)
- **Profile**: Managing partners, attorneys, cybersecurity consultants, medical doctors.
- **Pain Point**: Cannot ethically or legally use SaaS card platforms that route client contacts through third-party telemetry clouds or track who scanned their card.
- **Why Parichay**: Verifiable zero-network promise; works without corporate IT compliance approvals.

### Persona B: The Independent Freelancer & Creative (India & Global)
- **Profile**: UI/UX designers, photographers, creative directors, architects.
- **Pain Point**: Generic card apps look like tacky marketing flyers with intrusive badges and ads.
- **Why Parichay**: 17 editorial style presets, 45+ self-hosted typography families, seamless Devanagari script support, and lock-screen wallpaper integration.

### Persona C: The Conference Attendee & Event Goer
- **Profile**: Tech conference attendees, trade expo exhibitors, founders.
- **Pain Point**: Convention centers and basements have terrible mobile reception; URL-based QR cards fail to load when cell towers are congested.
- **Why Parichay**: Scans 100% offline in airplanes, subways, and crowded expo halls directly into iOS Contacts or Google Contacts.

### Persona D: Small Business Owner & Artisan (India)
- **Profile**: Boutique owners, cafe founders, consultants across Mumbai, Bengaluru, Delhi, and tier-2 cities.
- **Pain Point**: Expensive recurring subscriptions in USD ($10–$20/mo) for simple QR sharing.
- **Why Parichay**: Free, open-source, local-first, zero recurring fees.

---

## 3. Competitor Comparison Matrix

| Competitor | Core Mechanism | Business Model | Privacy / Network Model | Pricing | Major Drawback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Parichay** *(This App)* | **Direct vCard 3.0 in QR matrix** + On-Device Pass | **Open Source / Local Craft** | **100% Offline / Zero Network** | **Free / One-time Tip** | Static QR: changes require reprinting |
| **Blinq** | Redirect URL to hosted web profile *(Source: blinq.me)* | Freemium SaaS + Enterprise | Cloud-hosted; logs scans, IPs, and user locations | $3.99 - $5.99/user/mo *(estimated)* | Fails completely without internet |
| **HiHello** | Redirect URL to hosted contact page *(Source: hihello.me)* | Subscription SaaS | Cloud-hosted; CRM contact capture and analytics | $6.00 - $8.00/mo *(estimated)* | Requires recipient to open web browser |
| **Popl** | NFC chip + Redirect URL *(Source: popl.co)* | Hardware sales + SaaS | Cloud database; lead generation and tracking | $7.99/mo + hardware fees | Invasive lead capture modals |
| **Linq** | NFC hardware + Hosted profile *(Source: buy.linqapp.com)* | Hardware + SaaS | Centralized cloud infrastructure | $5.00/mo + hardware | Requires account creation to manage |

*(Note: Competitor pricing and feature descriptions reflect public marketing pages as of late 2024 / 2025 and may fluctuate; all cloud services require an active internet connection to deliver contact information).*

---

## 4. Privacy-Compatible Monetization Models

Parichay will **never** sell user contact data, show advertisement banners, or charge recurring fees to unlock basic contact sharing:

1. **Voluntary Support / Tip Jar**:
   - In-app "Support the Craftsman" tip button via GitHub Sponsors, Buy Me a Coffee, or App Store In-App Purchases ($2, $5, $10 one-time).
2. **Paid Studio Expansion Packs (Optional One-Time)**:
   - Optional one-time unlock ($2.99) for specialized luxury physical print templates (e.g. foil-stamped vectors, specialized vector exports).
3. **White-Label Organizational Licences**:
   - Bespoke on-premise compilation for law firms or enterprises needing custom corporate branding without cloud dependencies.

---

## 5. Go-To-Market & Distribution Strategy

1. **Developer & Designer Communities**:
   - Launch on Product Hunt, Hacker News (Show HN), Reddit (`r/privacy`, `r/selfhosted`, `r/webdev`).
   - Open source showcase emphasizing the architectural audit and zero-network security policy.
2. **App Store Optimization (ASO)**:
   - Primary Keywords: *Offline Business Card, Private vCard QR, Contact Card Wallpaper, Google Wallet Business Card, No Server Digital Card*.
3. **Physical-to-Digital Word of Mouth**:
   - The best distribution is the product itself: when a user presents a stunning lock-screen wallpaper QR at an event and the recipient scans it instantly without internet, the recipient asks: *"What app is that?"*

---

## 6. Privacy-Preserving Success Metrics

Because Parichay has zero analytics or telemetry, success is measured strictly via external, aggregate signals:
- **App Store & Google Play Console**: Installs, active devices, and star ratings (aggregated by Google/Apple).
- **GitHub Metrics**: Stars, forks, issues, and discussions.
- **Direct Qualitative Feedback**: Voluntary emails and user messages.

---

## 7. Risks & Mitigations

| Risk | Mitigation Strategy |
| :--- | :--- |
| **Static QR Immutability** | Clear in-app warnings when card edits alter the matrix fingerprint; encourage saving lock-screen wallpapers which are updated in 1 tap. |
| **Google Wallet Photo Pass Availability** | Dedicated in-app guide detailing the "Add to Wallet &rarr; Photo" pathway with clear platform instructions. |
| **iOS Direct Wallpaper Restrictions** | iOS restricts programmatic wallpaper setting; provide high-res gallery export with step-by-step guidance for iOS 16+ Wallpaper Pairs. |
| **Platform Store Policy Compliance** | Complete transparency: 100% "Data Not Collected" answers in App Store Privacy Nutrition labels and Google Play Data Safety forms. |

---

## 8. Product Roadmap

- **Now (v1.0 - v1.0.1)**:
  - 100% offline vCard 3.0 engine, 17 presets, 45+ fonts, Android/iOS Capacitor builds, lock screen wallpaper, Google Wallet photo pass, and complete docs.
- **Next (v1.1)**:
  - Apple Watch / Wear OS companion tile for displaying the QR directly on wristwear.
  - NFC card writing (`NDEF` vCard payload) for physical blank NFC tags.
- **Later (v2.0)**:
  - Bluetooth Low Energy (BLE) peer-to-peer card beaming between nearby devices without QR camera pointing.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
