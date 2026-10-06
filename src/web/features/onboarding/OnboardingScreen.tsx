import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { Button } from '@/web/components/ui/Button';
import { Field } from '@/web/components/ui/Field';
import { Avatar } from '@/web/components/ui/Avatar';
import { BRAND } from '@/shared/brand';
import { normalizePhone, normalizeWebsite, normalizeEmail } from '@/shared/normalizers';
import { processPhotoFile } from '@/web/lib/photo';
import { NativeNotifications } from '@/native/notifications';
import { ArrowRight, ShieldCheck, Camera, Check, Sparkles } from 'lucide-react';
import type { Card } from '@/shared/card';

export const OnboardingScreen: React.FC = () => {
  const { saveCard, savePhoto } = useCard();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [photoDataUrl, setLocalPhoto] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Handle Photo Picker
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const processed = await processPhotoFile(file);
      setLocalPhoto(processed.full512);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, photo: err.message || 'Could not process photo' }));
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleFinish = async () => {
    if (!firstName.trim()) {
      setErrors({ firstName: 'First name is required' });
      setStep(2);
      return;
    }

    const normPhone = phone ? normalizePhone(phone) : null;
    const normEmail = email ? normalizeEmail(email) : null;
    const normWeb = website ? normalizeWebsite(website) : null;

    const newCard: Card = {
      id: crypto.randomUUID(),
      schemaVersion: 1,
      firstName: firstName.trim(),
      lastName: lastName.trim() || null,
      jobTitle: jobTitle.trim() || null,
      company: company.trim() || null,
      phone: normPhone,
      email: normEmail,
      website: normWeb,
      location: null,
      linkedin: null,
      instagram: null,
      xHandle: null,
      whatsapp: null,
      photoPresent: !!photoDataUrl,
      qrInclude: {
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
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qrFingerprint: '',
    };

    if (photoDataUrl) {
      await savePhoto(photoDataUrl);
    }
    await saveCard(newCard);
    NativeNotifications.sendCardReadyNotification(firstName.trim()).catch(() => {});
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[90dvh] flex flex-col justify-between px-5 py-6">
      {/* Step 1: Welcome & Brand Promise */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-28 h-28 rounded-[32px] p-2.5 liquid-glass shadow-2xl relative">
            <img src="/logo.svg" alt="Parichay Logo" className="w-full h-full object-contain rounded-2xl" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              {BRAND.displayName}
            </span>
            <h1 className="text-3xl font-bold font-serif text-[var(--color-text-primary)] tracking-tight">
              One card. One scan.<br />Nothing leaves your phone.
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mx-auto leading-relaxed pt-2">
              A private digital business card. Generate compact offline vCard QR codes that any camera can scan without an app or server.
            </p>
          </div>

          <div className="p-5 rounded-3xl liquid-glass-card w-full text-left space-y-3">
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-primary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-status-success)] shrink-0" />
              <span>100% Offline &middot; Zero servers or analytics</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
              <span>Wallet cards, wallpapers &amp; custom QR styles</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-primary)]">
              <Check className="w-4 h-4 text-[var(--color-status-success)] shrink-0" />
              <span>Works directly with stock iPhone and Android cameras</span>
            </div>
          </div>

          <Button fullWidth size="lg" onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
            Create My Card
          </Button>
        </div>
      )}

      {/* Step 2, 3, 4: Guided Wizard */}
      {step > 1 && (
        <div className="flex-1 flex flex-col justify-between space-y-6 animate-in slide-in-from-right-4 duration-200">
          <div>
            {/* Progress Cue */}
            <div className="w-full flex items-center justify-between text-2xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
              <span>Step {step - 1} of 3</span>
              <span>
                {step === 2 && 'Identity'}
                {step === 3 && 'Contact'}
                {step === 4 && 'Photo'}
              </span>
            </div>
            <div className="w-full h-1 bg-[var(--color-bg-surface-sunken)] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>

            {/* Live Mini Preview Bar */}
            <div className="p-3 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-hairline)] flex items-center gap-3 mb-6 shadow-2xs">
              <Avatar src={photoDataUrl} name={`${firstName} ${lastName}`} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold font-serif text-[var(--color-text-primary)] truncate">
                  {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Your Name'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {[jobTitle, company].filter(Boolean).join(' · ') || 'Title · Company'}
                </p>
              </div>
            </div>

            {/* Step 2: Identity */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
                  What is your name and title?
                </h2>
                <Field
                  label="First Name *"
                  placeholder="e.g. Aditi"
                  value={firstName}
                  error={errors.firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                  }}
                  autoFocus
                />
                <Field
                  label="Last Name"
                  placeholder="e.g. Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Field
                  label="Job Title"
                  placeholder="e.g. Product Architect"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <Field
                  label="Company or Studio"
                  placeholder="e.g. Studio Parichay"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
                  How can people reach you?
                </h2>
                <Field
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  type="tel"
                  value={phone}
                  hint="Normalized to international E.164"
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                />
                <Field
                  label="Email Address"
                  placeholder="aditi@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                  label="Website"
                  placeholder="https://example.com"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            )}

            {/* Step 4: Photo */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-serif text-[var(--color-text-primary)]">
                    Add a profile photo
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Photos are processed in-memory and EXIF data is stripped. The photo is never encoded in the QR.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] text-center space-y-3">
                  <Avatar src={photoDataUrl} name={`${firstName} ${lastName}`} size="xl" />

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-hairline)] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-sunken)] transition-colors">
                    <Camera className="w-4 h-4 text-[var(--color-accent)]" />
                    <span>{photoDataUrl ? 'Change Photo' : 'Select Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                      disabled={isProcessingPhoto}
                    />
                  </label>

                  {photoDataUrl && (
                    <button
                      type="button"
                      onClick={() => setLocalPhoto(null)}
                      className="text-xs text-[var(--color-status-error)] hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}

                  {errors.photo && <p className="text-xs text-[var(--color-status-error)]">{errors.photo}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 pt-4">
            <Button variant="ghost" size="md" onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}>
              Back
            </Button>

            {step < 4 ? (
              <Button
                fullWidth
                size="md"
                onClick={() => {
                  if (step === 2 && !firstName.trim()) {
                    setErrors({ firstName: 'First name is required' });
                    return;
                  }
                  setStep((s) => ((s + 1) as any));
                }}
              >
                Continue
              </Button>
            ) : (
              <Button fullWidth size="md" variant="primary" onClick={handleFinish}>
                Done &amp; View QR
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
