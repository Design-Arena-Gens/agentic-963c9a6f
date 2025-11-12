"use client";

import { useMemo, useState } from 'react';

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'pinterest', label: 'Pinterest' }
] as const;

const tones = [
  { value: 'opulent', label: 'Opulent' },
  { value: 'adventurous', label: 'Adventurous' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'minimal', label: 'Minimal' }
] as const;

const lengths = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' }
] as const;

export default function Page() {
  const [destination, setDestination] = useState('Amalfi Coast, Italy');
  const [platform, setPlatform] = useState<(typeof platforms)[number]['value']>('instagram');
  const [tone, setTone] = useState<(typeof tones)[number]['value']>('opulent');
  const [audience, setAudience] = useState('Modern luxury travelers');
  const [brand, setBrand] = useState('LuxeVoyage');
  const [length, setLength] = useState<(typeof lengths)[number]['value']>('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [callToAction, setCallToAction] = useState('Tap to save and start planning');
  const [offers, setOffers] = useState('Complimentary breakfast & late checkout');
  const [season, setSeason] = useState('May?September');
  const [hotelName, setHotelName] = useState('Belmond Hotel Caruso');
  const [experiences, setExperiences] = useState('Infinity pool at golden hour, lemon grove cocktails, private boat to Capri');
  const [variants, setVariants] = useState(3);
  const [seed, setSeed] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ caption: string; hashtags?: string; full: string }>>([]);

  const canSubmit = useMemo(() => destination.trim().length > 2 && variants >= 1, [destination, variants]);

  async function generate() {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          platform,
          tone,
          audience,
          brand,
          callToAction,
          offers,
          season,
          hotelName,
          experiences,
          includeHashtags,
          includeEmojis,
          length,
          variants,
          seed: seed === '' ? undefined : Number(seed)
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to generate');
      setResults(data.result);
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function downloadAll() {
    const csv = ['Variant,Caption,Hashtags,Full'].concat(
      results.map((r, idx) => `${idx + 1},"${r.caption.replaceAll('"', '""')}","${(r.hashtags||'').replaceAll('"','""')}","${r.full.replaceAll('"','""')}"`)
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luxury-content.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="grid" style={{marginTop: 24}}>
      <section className="card grid cols-2">
        <div className="grid" style={{gap: 12}}>
          <div>
            <label>Destination or Itinerary</label>
            <input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="e.g., Santorini, Greece" />
          </div>
          <div className="grid cols-3">
            <div>
              <label>Platform</label>
              <select value={platform} onChange={e=>setPlatform(e.target.value as any)}>
                {platforms.map(p=> <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label>Tone</label>
              <select value={tone} onChange={e=>setTone(e.target.value as any)}>
                {tones.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label>Length</label>
              <select value={length} onChange={e=>setLength(e.target.value as any)}>
                {lengths.map(l=> <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid cols-3">
            <div>
              <label>Audience</label>
              <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g., Couples, Families" />
            </div>
            <div>
              <label>Brand/Handle</label>
              <input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="e.g., @YourBrand" />
            </div>
            <div>
              <label>Variants</label>
              <input type="number" min={1} max={8} value={variants} onChange={e=>setVariants(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid cols-3">
            <div>
              <label>Season/Dates</label>
              <input value={season} onChange={e=>setSeason(e.target.value)} placeholder="e.g., April?October" />
            </div>
            <div>
              <label>Hotel/Ship/Resort</label>
              <input value={hotelName} onChange={e=>setHotelName(e.target.value)} placeholder="e.g., Amanzoe" />
            </div>
            <div>
              <label>Seed (optional)</label>
              <input type="number" value={seed} onChange={e=>setSeed(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Random seed" />
            </div>
          </div>
          <div>
            <label>Experiences/Details</label>
            <textarea value={experiences} onChange={e=>setExperiences(e.target.value)} placeholder="Signature moments, dining, excursions" />
          </div>
          <div className="grid cols-3">
            <div>
              <label>Call to Action</label>
              <input value={callToAction} onChange={e=>setCallToAction(e.target.value)} placeholder="e.g., Message us to plan" />
            </div>
            <div>
              <label>Offers (optional)</label>
              <input value={offers} onChange={e=>setOffers(e.target.value)} placeholder="e.g., VIP perks" />
            </div>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <label style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="checkbox" checked={includeHashtags} onChange={e=>setIncludeHashtags(e.target.checked)} /> Hashtags
              </label>
              <label style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="checkbox" checked={includeEmojis} onChange={e=>setIncludeEmojis(e.target.checked)} /> Emojis
              </label>
            </div>
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <button className="primary" onClick={generate} disabled={!canSubmit || loading}>{loading ? 'Generating?' : 'Generate'}</button>
            {results.length > 0 && (
              <>
                <button onClick={()=>copyText(results.map(r=>r.full).join('\n\n---\n\n'))}>Copy All</button>
                <button className="ghost" onClick={downloadAll}>Download CSV</button>
              </>
            )}
          </div>
          {error && <div className="badge" style={{background:'#fee', color:'#900'}}>{error}</div>}
        </div>
        <div className="grid" style={{gap:12}}>
          <div className="card">
            <div className="badge">Preview</div>
            <p style={{opacity:0.8, marginTop:8}}>High-end, platform-tuned captions with optional emojis and tailored hashtags.</p>
            <hr />
            <ul style={{margin:0, paddingLeft:18, opacity:0.85}}>
              <li>Platform-aware length & style</li>
              <li>Luxury-focused tone presets</li>
              <li>Destination-smart hashtags</li>
              <li>Seeded variations for consistency</li>
            </ul>
          </div>
          <div className="card">
            <div className="badge">Tips</div>
            <p style={{opacity:0.85}}>Adjust tone and length for each platform. Use seed to recreate variants. Keep 1?2 hashtags for X.</p>
          </div>
        </div>
      </section>

      {results.length > 0 && (
        <section className="grid cols-2">
          {results.map((r, idx) => (
            <article key={idx} className="card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div className="badge">Variant {idx + 1}</div>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={()=>copyText(r.caption)}>Copy Caption</button>
                  <button onClick={()=>copyText(r.full)} className="primary">Copy Full</button>
                </div>
              </div>
              <hr />
              <div className="caption">{r.caption}</div>
              {r.hashtags && <div className="caption" style={{opacity:0.9, marginTop:12}}>{r.hashtags}</div>}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
