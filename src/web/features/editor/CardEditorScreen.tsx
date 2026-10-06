import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { Button } from '@/web/components/ui/Button';
import { Field } from '@/web/components/ui/Field';
import { Avatar } from '@/web/components/ui/Avatar';
import { useToast } from '@/web/components/ui/Toast';
import {
  normalizePhone,
  normalizeWebsite,
  normalizeEmail,
  normalizeLinkedIn,
  normalizeInstagram,
  normalizeXHandle,
  normalizeWhatsApp,
} from '@/shared/normalizers';
import { buildCompactVCard, getQRPayloadMetrics } from '@/shared/vcard';
import { processPhotoFile } from '@/web/lib/photo';
import { storage } from '@/web/lib/storage';
import {
  ArrowLeft,
  Camera,
  Check,
  AlertCircle,
  QrCode,
  User,
  Phone,
  Share2,
} from 'lucide-react';
import type { Card } from '@/shared/card';

export const CardEditorScreen: React.FC = () => {
  const { card, photoDataUrl, saveCard, savePhoto } = useCard();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form Fields State
  const [firstName, setFirstName] = useState(card?.firstName || '');
  const [lastName, setLastName] = useState(card?.lastName || '');
  const [jobTitle, setJobTitle] = useState(card?.jobTitle || '');
  const [company, setCompany] = useState(card?.company || '');
  const [phone, setPhone] = useState(card?.phone || '');
  const [email, setEmail] = useState(card?.email || '');
  const [website, setWebsite] = useState(card?.website || '');
  const [location, setLocation] = useState(card?.location || '');
  const [linkedin, setLinkedin] = useState(card?.linkedin || '');
  const [instagram, setInstagram] = useState(card?.instagram || '');
  const [xHandle, setXHandle] = useState(card?.xHandle || '');
  const [whatsapp, setWhatsapp] = useState(card?.whatsapp || '');
  const [localPhoto, setLocalPhoto] = useState<string | null>(photoDataUrl);

  // Per-field QR Toggles
  const [qrInclude, setQrInclude] = useState(
    card?.qrInclude || {
      name: true,
      jobTitle: true,
      company: true,
      phone: true,
      email: true,
      website: true,
      location: false,
      linkedin: false,
      instagram: false,
      xHandle: false,
      whatsapp: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasDraftNotice, setHasDraftNotice] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState<Partial<Card> | null>(null);

  // Check for saved draft on mount
  useEffect(() => {
    storage.getDraftCard().then((draft) => {
      if (draft && draft.firstName && draft.firstName !== card?.firstName) {
        setDraftToRestore(draft);
        setHasDraftNotice(true);
      }
    });
  }, [card]);

  // Draft autosave debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      storage.saveDraftCard({
        firstName,
        lastName,
        jobTitle,
        company,
        phone,
        email,
        website,
        location,
        linkedin,
        instagram,
        xHandle,
        whatsapp,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [firstName, lastName, jobTitle, company, phone, email, website, location, linkedin, instagram, xHandle, whatsapp]);

  const restoreDraft = () => {
    if (!draftToRestore) return;
    if (draftToRestore.firstName) setFirstName(draftToRestore.firstName);
    if (draftToRestore.lastName) setLastName(draftToRestore.lastName || '');
    if (draftToRestore.jobTitle) setJobTitle(draftToRestore.jobTitle || '');
    if (draftToRestore.company) setCompany(draftToRestore.company || '');
    if (draftToRestore.phone) setPhone(draftToRestore.phone || '');
    if (draftToRestore.email) setEmail(draftToRestore.email || '');
    if (draftToRestore.website) setWebsite(draftToRestore.website || '');
    if (draftToRestore.location) setLocation(draftToRestore.location || '');
    if (draftToRestore.linkedin) setLinkedin(draftToRestore.linkedin || '');
    if (draftToRestore.instagram) setInstagram(draftToRestore.instagram || '');
    if (draftToRestore.xHandle) setXHandle(draftToRestore.xHandle || '');
    if (draftToRestore.whatsapp) setWhatsapp(draftToRestore.whatsapp || '');
    setHasDraftNotice(false);
    toast('Draft restored', 'info');
  };

  const dismissDraft = () => {
    setHasDraftNotice(false);
    storage.saveDraftCard(null);
  };

  // Construct hypothetical Card object for live metrics
  const previewCard: Card = useMemo(() => {
    return {
      id: card?.id || 'temp-id',
      schemaVersion: 1,
      firstName: firstName || 'Name',
      lastName: lastName || null,
      jobTitle: jobTitle || null,
      company: company || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      location: location || null,
      linkedin: linkedin || null,
      instagram: instagram || null,
      xHandle: xHandle || null,
      whatsapp: whatsapp || null,
      photoPresent: !!localPhoto,
      qrInclude,
      createdAt: card?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qrFingerprint: '',
    };
  }, [card, firstName, lastName, jobTitle, company, phone, email, website, location, linkedin, instagram, xHandle, whatsapp, localPhoto, qrInclude]);

  const qrPayload = useMemo(() => buildCompactVCard(previewCard), [previewCard]);
  const metrics = useMemo(() => getQRPayloadMetrics(qrPayload), [qrPayload]);

  const handleToggleQR = (field: keyof typeof qrInclude) => {
    setQrInclude((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await processPhotoFile(file);
      setLocalPhoto(processed.full512);
    } catch (err: any) {
      toast(err.message || 'Photo upload failed', 'warning');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      setErrors({ firstName: 'First name is required' });
      toast('First name is required', 'warning');
      return;
    }

    if (metrics.isExceeded) {
      toast('QR payload exceeds 700 bytes limit. Please disable some QR fields.', 'warning');
      return;
    }

    const normPhone = phone ? normalizePhone(phone) : null;
    const normEmail = email ? normalizeEmail(email) : null;
    const normWeb = website ? normalizeWebsite(website) : null;
    const normLinkedin = linkedin ? normalizeLinkedIn(linkedin) : null;
    const normInsta = instagram ? normalizeInstagram(instagram) : null;
    const normX = xHandle ? normalizeXHandle(xHandle) : null;
    const normWa = whatsapp ? normalizeWhatsApp(whatsapp) : null;

    const updatedCard: Card = {
      id: card?.id || crypto.randomUUID(),
      schemaVersion: 1,
      firstName: firstName.trim(),
      lastName: lastName.trim() || null,
      jobTitle: jobTitle.trim() || null,
      company: company.trim() || null,
      phone: normPhone,
      email: normEmail,
      website: normWeb,
      location: location.trim() || null,
      linkedin: normLinkedin,
      instagram: normInsta,
      xHandle: normX,
      whatsapp: normWa,
      photoPresent: !!localPhoto,
      qrInclude,
      createdAt: card?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qrFingerprint: card?.qrFingerprint || '',
    };

    if (localPhoto !== photoDataUrl) {
      await savePhoto(localPhoto);
    }
    await saveCard(updatedCard);
    toast('Card saved', 'success');
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] liquid-glass px-3 py-1.5 rounded-xl active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <h1 className="text-base font-bold font-serif text-[var(--color-text-primary)]">
          Edit Business Card
        </h1>
        <button
          onClick={handleSave}
          className="text-xs font-bold text-[var(--color-accent)] liquid-glass px-3.5 py-1.5 rounded-xl active:scale-95 shadow-xs"
        >
          Save
        </button>
      </div>

      {/* Live Interactive ID Card Preview (Figma/Dribbble Signature Pattern) */}
      <div className="p-4 rounded-3xl liquid-glass-card flex items-center gap-3.5 shadow-md border border-white/60 dark:border-white/15">
        <Avatar src={localPhoto} name={`${firstName} ${lastName}`} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold tracking-widest text-[var(--color-accent)] uppercase">
              Live Preview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-base font-bold font-serif text-[var(--color-text-primary)] truncate">
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Your Name'}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] truncate">
            {[jobTitle, company].filter(Boolean).join(' · ') || 'Job Title · Company'}
          </p>
        </div>
      </div>

      {/* Draft Restore Banner */}
      {hasDraftNotice && (
        <div className="p-3.5 rounded-2xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <span className="text-[var(--color-text-primary)]">Unsaved draft found.</span>
          <div className="flex items-center gap-2">
            <button onClick={restoreDraft} className="font-bold text-[var(--color-accent)] underline">
              Restore
            </button>
            <button onClick={dismissDraft} className="text-[var(--color-text-tertiary)]">
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Live QR Size Meter */}
      <div className="p-4 rounded-3xl liquid-glass-card space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              QR Density Meter
            </span>
          </div>
          <div className="flex items-center gap-2 text-2xs font-mono">
            <span
              className={`font-bold ${
                metrics.status === 'green'
                  ? 'text-[var(--color-status-success)]'
                  : metrics.status === 'amber'
                  ? 'text-[var(--color-status-warning)]'
                  : 'text-[var(--color-status-error)]'
              }`}
            >
              {metrics.bytes} / 700 bytes
            </span>
            <span className="text-[var(--color-text-tertiary)]">· v{metrics.version}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              metrics.status === 'green'
                ? 'bg-[var(--color-status-success)]'
                : metrics.status === 'amber'
                ? 'bg-[var(--color-status-warning)]'
                : 'bg-[var(--color-status-error)]'
            }`}
            style={{ width: `${Math.min((metrics.bytes / 700) * 100, 100)}%` }}
          />
        </div>

        <p className="text-2xs text-[var(--color-text-tertiary)] leading-tight">
          {metrics.status === 'green' && 'Optimal size. Lightning fast scans in all light conditions.'}
          {metrics.status === 'amber' && 'Moderate density. Scans well on modern phone cameras.'}
          {metrics.status === 'red' && 'Dense matrix. Consider disabling non-essential fields from the QR.'}
        </p>
      </div>

      {/* Section 1: Profile Photo */}
      <section className="p-5 rounded-3xl liquid-glass-card space-y-4 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Profile Photo
        </h2>
        <div className="flex items-center gap-4">
          <Avatar src={localPhoto} name={`${firstName} ${lastName}`} size="lg" />
          <div className="space-y-1.5 flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass-button text-xs font-semibold text-[var(--color-text-primary)]">
              <Camera className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>{localPhoto ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </label>
            {localPhoto && (
              <div>
                <button
                  type="button"
                  onClick={() => setLocalPhoto(null)}
                  className="text-xs text-[var(--color-status-error)] hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            <p className="text-2xs text-[var(--color-text-tertiary)]">
              Centre-cropped square, EXIF stripped. Never placed into QR.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Identity & QR Toggles */}
      <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--color-accent)]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Identity
          </h2>
        </div>

        <Field
          label="First Name *"
          value={firstName}
          error={errors.firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
          }}
        />

        <Field label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <div className="space-y-1">
          <Field
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => handleToggleQR('jobTitle')}
                className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                  qrInclude.jobTitle
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-tertiary)]'
                }`}
              >
                {qrInclude.jobTitle ? 'In QR' : 'Omit from QR'}
              </button>
            }
          />
        </div>

        <Field
          label="Company or Studio"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('company')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.company
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.company ? 'In QR' : 'Omit from QR'}
            </button>
          }
        />
      </section>

      {/* Section 3: Contact */}
      <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[var(--color-accent)]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Contact
          </h2>
        </div>

        <Field
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('phone')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.phone
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.phone ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('email')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.email
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.email ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="Website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('website')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.website
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.website ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="Location"
          placeholder="e.g. Mumbai, India"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('location')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.location
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.location ? 'In QR' : 'Omit'}
            </button>
          }
        />
      </section>

      {/* Section 4: Social Links */}
      <section className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[var(--color-accent)]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Social Profiles
          </h2>
        </div>

        <Field
          label="LinkedIn"
          placeholder="username or URL"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('linkedin')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.linkedin
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.linkedin ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="Instagram Handle"
          placeholder="username"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('instagram')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.instagram
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.instagram ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="X (Twitter) Handle"
          placeholder="username"
          value={xHandle}
          onChange={(e) => setXHandle(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('xHandle')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.xHandle
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.xHandle ? 'In QR' : 'Omit'}
            </button>
          }
        />

        <Field
          label="WhatsApp"
          placeholder="phone number or wa.me"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => handleToggleQR('whatsapp')}
              className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                qrInclude.whatsapp
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {qrInclude.whatsapp ? 'In QR' : 'Omit'}
            </button>
          }
        />
      </section>

      {/* Floating Save Dock (Figma/iOS 27 Dock Pattern) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto liquid-glass-dock rounded-[28px] p-2.5 safe-bottom shadow-2xl">
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="md" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button fullWidth variant="primary" size="md" onClick={handleSave} icon={<Check className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
