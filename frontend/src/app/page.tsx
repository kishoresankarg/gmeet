'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    const plxHero = document.getElementById('plxHero');
    const ctaGhost = document.getElementById('ctaGhost');

    const parallaxSections = [
      { el: document.getElementById('plxFeat'), speed: 0.12 },
      { el: document.getElementById('plxHow'), speed: 0.10 },
      { el: document.getElementById('plxPrev'), speed: 0.08 },
      { el: document.getElementById('plxPlat'), speed: 0.10 },
    ];

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    function updateParallax() {
      const sy = window.scrollY;

      if (plxHero) {
        plxHero.style.transform = `translateY(${sy * 0.35}px)`;
      }

      parallaxSections.forEach(({ el, speed }) => {
        if (!el) return;
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2);
        el.style.transform = `translateY(${offset * speed * -1}px)`;
      });

      const ctaSection = document.getElementById('download');
      if (ctaSection && ctaGhost) {
        const ctaRect = ctaSection.getBoundingClientRect();
        const ctaOffset = (ctaRect.top + ctaRect.height / 2 - window.innerHeight / 2);
        ctaGhost.style.transform = `translate(-50%, calc(-50% + ${ctaOffset * 0.08}px))`;
      }

      ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('up');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#080808] text-white overflow-hidden">
      <section className="hero" id="home">
        <div className="parallax-layer" data-speed="0.25" id="plxHero">
          <div className="plx-grid"></div>
          <div className="plx-glow"></div>
          <div className="plx-orb1"></div>
          <div className="plx-orb2"></div>
        </div>

        <div className="hero-ticker">
          <div className="ticker-inner">
            <span className="ticker-item"><span>✦</span> AI Summarization</span>
            <span className="ticker-item"><span>✦</span> Action Item Extraction</span>
            <span className="ticker-item"><span>✦</span> Key Point Detection</span>
            <span className="ticker-item"><span>✦</span> Fast Analysis</span>
            <span className="ticker-item"><span>✦</span> Gemini Pro Model</span>
            <span className="ticker-item"><span>✦</span> No Wasted Hours</span>
            <span className="ticker-item"><span>✦</span> 99% Accuracy</span>
            <span className="ticker-item"><span>✦</span> AI Summarization</span>
            <span className="ticker-item"><span>✦</span> Action Item Extraction</span>
            <span className="ticker-item"><span>✦</span> Key Point Detection</span>
            <span className="ticker-item"><span>✦</span> Fast Analysis</span>
            <span className="ticker-item"><span>✦</span> Gemini Pro Model</span>
            <span className="ticker-item"><span>✦</span> No Wasted Hours</span>
            <span className="ticker-item"><span>✦</span> 99% Accuracy</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="eyebrow-pulse"></div>
            <span className="eyebrow-text">Faster AI analysis with Gemini Pro v1.5</span>
          </div>

          <h1 className="hero-headline">
            <span className="line1">MEETINGS</span>
            <span className="line2">INTO<span className="hero-badge">ACTION</span></span>
            <span className="line3">INSTANTLY.</span>
          </h1>

          <p className="hero-sub">
            MeetPulse extracts key points, summaries, and action items from your meeting notes in seconds. Stop wasting hours.
          </p>

          <div className="hero-actions">
            <Link href="/generator" className="btn-main">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
              Start Generating
            </Link>
            <Link href="#features" className="btn-ghost">Learn More →</Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-n">&lt;2<span>s</span></div>
            <div className="stat-l">Processing Time</div>
          </div>
          <div className="stat">
            <div className="stat-n">99<span>%</span></div>
            <div className="stat-l">Accuracy Rate</div>
          </div>
          <div className="stat">
            <div className="stat-n">85<span>%</span></div>
            <div className="stat-l">Time Saved</div>
          </div>
          <div className="stat">
            <div className="stat-n">0<span>×</span></div>
            <div className="stat-l">Data Sold</div>
          </div>
        </div>
      </section>

      <section className="section-wrap dark" id="features">
        <div className="plx-section-bg" data-speed="0.12" id="plxFeat">
          <div className="bg-word">FEAT</div>
        </div>

        <div className="section-eyebrow reveal">✦ What It Does</div>
        <h2 className="section-h reveal d1">BUILT FOR<br /><span className="ghost">SPEED</span></h2>

        <div className="feat-grid">
          <div className="feat-card reveal">
            <div className="feat-glow"></div>
            <span className="feat-num">01</span>
            <div className="feat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="feat-title">AI Summarization</div>
            <p className="feat-desc">Get concise, accurate summaries of your long meetings in seconds using state-of-the-art AI.</p>
            <div className="feat-line"></div>
          </div>

          <div className="feat-card reveal d1">
            <div className="feat-glow"></div>
            <span className="feat-num">02</span>
            <div className="feat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="feat-title">Action Items</div>
            <p className="feat-desc">Never miss a task again. Our AI automatically identifies and lists clear action items and owners.</p>
            <div className="feat-line"></div>
          </div>

          <div className="feat-card reveal d2">
            <div className="feat-glow"></div>
            <span className="feat-num">03</span>
            <div className="feat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="feat-title">Key Points</div>
            <p className="feat-desc">Find the most important highlights and decisions without reading the entire raw transcript.</p>
            <div className="feat-line"></div>
          </div>
        </div>
      </section>

      <section className="section-wrap red" id="how">
        <div className="plx-section-bg" data-speed="0.1" id="plxHow">
          <div className="bg-word">HOW</div>
        </div>

        <div className="section-eyebrow reveal">✦ Process</div>
        <h2 className="section-h reveal d1">HOW IT<br /><span className="ghost">WORKS</span></h2>

        <div className="steps-wrap">
          <div className="steps-connector"></div>
          <div className="step-card reveal">
            <div className="step-dot"></div>
            <div className="step-n">01</div>
            <div className="step-title">Paste Notes</div>
            <p className="step-desc">Bring your raw transcripts or meeting notes. Paste them into MeetPulse.</p>
          </div>
          <div className="step-card reveal d1">
            <div className="step-dot"></div>
            <div className="step-n">02</div>
            <div className="step-title">Select Tone</div>
            <p className="step-desc">Pick options if you need a specific summarization style or action items extraction focus.</p>
          </div>
          <div className="step-card reveal d2">
            <div className="step-dot"></div>
            <div className="step-n">03</div>
            <div className="step-title">Generate</div>
            <p className="step-desc">Watch our engine generate the organized points instantly. Copy or download them directly.</p>
          </div>
          <div className="step-card reveal d3">
            <div className="step-dot"></div>
            <div className="step-n">04</div>
            <div className="step-title">Done.</div>
            <p className="step-desc">Your results are ready. Share with the team and get things done faster.</p>
          </div>
        </div>
      </section>

      <section className="section-wrap mid" id="preview">
        <div className="plx-section-bg" data-speed="0.08" id="plxPrev">
          <div className="bg-word">APP</div>
        </div>

        <div className="section-eyebrow reveal">✦ App Preview</div>
        <h2 className="section-h reveal d1">CLEAN.<br /><span className="ghost">FAST.</span></h2>

        <div className="preview-layout">
          <div className="app-window reveal">
            <div className="win-bar">
              <div className="wd r"></div>
              <div className="wd y"></div>
              <div className="wd g"></div>
              <span className="win-bar-title">MEETPULSE — GENERATOR</span>
            </div>
            <div className="win-body">
              <div className="win-app-name">PULSE</div>
              <div className="win-label">Meeting Transcript</div>
              <div className="win-field" style={{ height: '70px', alignItems: 'flex-start', paddingTop: '8px' }}>
                <span className="win-field-text" style={{ whiteSpace: 'normal', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4' }}>
                  &quot;Alright team, let&apos;s discuss Q3 targets. We need to deploy the new UI by Friday. Sarah will handle the frontend, John will do...&quot;
                </span>
              </div>
              <div className="win-prow">
                <span className="win-pro-label">Processing with Gemini Pro 1.5</span>
                <span className="win-pct">89%</span>
              </div>
              <div className="win-bar-bg">
                <div className="win-bar-fill"></div>
              </div>
              <div className="win-btns">
                <div className="win-btn"><span className="win-btn-t">Analyzing...</span></div>
                <div className="win-btn" style={{ flex: 0.38, background: 'rgba(0,0,0,0.28)' }}>
                  <span className="win-btn-t" style={{ color: 'rgba(255,255,255,0.45)' }}>Cancel</span>
                </div>
              </div>
            </div>
          </div>

          <div className="preview-feats reveal d2">
            <div className="p-feat">
              <div className="p-feat-num">01</div>
              <div>
                <div className="p-feat-title">Lightning Inference</div>
                <p className="p-feat-desc">Enjoy incredibly fast summary generation with the state-of-the-art Gemini Pro 1.5 model.</p>
              </div>
            </div>
            <div className="p-feat">
              <div className="p-feat-num">02</div>
              <div>
                <div className="p-feat-title">Smart Extraction</div>
                <p className="p-feat-desc">Automatically identify who is doing what, turning messy transcripts into clear, actionable bullet points.</p>
              </div>
            </div>
            <div className="p-feat">
              <div className="p-feat-num">03</div>
              <div>
                <div className="p-feat-title">Copy & Paste Ready</div>
                <p className="p-feat-desc">Formats are perfect for pasting into Slack, Discord, or any email client completely seamlessly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap darkest cta-section" id="download">
        <div className="cta-ghost" id="ctaGhost">GO</div>
        <div className="cta-inner">
          <div className="cta-tag reveal">✦ Free Access</div>
          <h2 className="cta-h reveal d1">START<br /><span className="stroke">NOW.</span></h2>
          <p className="cta-sub reveal d2">Ready to make your meetings productive? Join thousands saving time.</p>
          <div className="cta-btns reveal d3">
            <Link href="/generator" className="dl-btn primary">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
              USE GENERATOR
            </Link>
            <Link href="#features" className="dl-btn secondary">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
