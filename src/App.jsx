import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Heart, MapPin, Menu, Music2, Pause, Play, X } from 'lucide-react';
import { WEDDING_CONFIG as config } from './config/wedding';

const pad = (value) => String(value).padStart(2, '0');

function Opening({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const open = () => { setOpening(true); window.setTimeout(onOpen, 1150); };
  return <div className={`opening ${opening ? 'opening--away' : ''}`} aria-hidden={opening}>
    <div className="opening__grain" />
    <div className="opening__leaf opening__leaf--left" />
    <div className="opening__leaf opening__leaf--right" />
    <div className="opening__content">
      <p className="eyebrow">The wedding of</p>
      <div className="opening__monogram">F <span>&</span> A</div>
      <p className="opening__names">Faisad <i>&</i> Afshan</p>
      <p className="opening__blessing">With love, prayers & blessings</p>
      <button className="seal-button" onClick={open} disabled={opening}>
        <span className="seal-button__ring" /> <span>Open invitation</span> <ArrowDown size={15} strokeWidth={1.3} />
      </button>
      <p className="opening__hint">Tap to enter</p>
    </div>
  </div>;
}

function Navigation({ onNavigate }) {
  const [menu, setMenu] = useState(false);
  const links = [['story', 'Our story'], ['events', 'Celebrations'], ['venue', 'Venues'], ['rsvp', 'RSVP']];
  return <>
    <button className="nav-toggle" aria-label="Open navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={19} /> : <Menu size={19} />}<span>Menu</span></button>
    <nav className={`floating-nav ${menu ? 'floating-nav--open' : ''}`} aria-label="Main navigation">
      <span className="floating-nav__mark">F <i>&</i> A</span>
      {links.map(([id, label]) => <button key={id} onClick={() => { onNavigate(id); setMenu(false); }}>{label}</button>)}
    </nav>
  </>;
}

function Countdown() {
  const getTime = () => Math.max(0, new Date(config.countdownDate).getTime() - Date.now());
  const [time, setTime] = useState(getTime);
  useEffect(() => { const timer = window.setInterval(() => setTime(getTime()), 1000); return () => window.clearInterval(timer); }, []);
  const values = useMemo(() => {
    const seconds = Math.floor(time / 1000);
    return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  }, [time]);
  return <section className="countdown-section section-band" aria-label="Countdown">
    <div className="section-intro centered" data-reveal="up"><h2>Counting the moments</h2><p>Until we say <em>Qabool Hai</em></p></div>
    {time === 0 ? <p className="arrived">Alhamdulillah, the day has arrived.</p> : <div className="countdown-grid">{values.map((value, index) => <div className="countdown-unit" key={index}><strong>{pad(value)}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div>}
    <p className="countdown-target" data-reveal="fade"><CalendarDays size={14} /> {config.couple.date} <span>at 12:15 PM</span></p>
  </section>;
}

function SaveTheDate() {
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const startX = useRef(null);
  const reveal = () => { setRevealed(true); setProgress(100); };
  const dragStart = (event) => { startX.current = event.clientX ?? event.touches?.[0]?.clientX; };
  const dragMove = (event) => { if (startX.current === null) return; const current = event.clientX ?? event.touches?.[0]?.clientX; setProgress(Math.min(100, Math.max(0, Math.abs(current - startX.current) / 1.65))); };
  const dragEnd = () => { if (progress > 44) reveal(); startX.current = null; };
  return <section className="save-date section-band" id="date">
    <div className="save-date__copy" data-reveal="up"><p className="eyebrow">A note for your calendar</p><h2>Save<br /><i>the date</i></h2><p>A beautiful day awaits us, and we would be honoured to have you with us as we begin this journey together.</p></div>
    <div className="date-reveal" data-reveal="scale" onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd} onTouchStart={dragStart} onTouchMove={dragMove} onTouchEnd={dragEnd}>
            <div className="date-reveal__paper"><span className="date-reveal__top">In sha Allah</span><h3>Mahfil-e-Nikah</h3><strong className="date-reveal__date">31 October 2026 <span>•</span> 12:15 PM</strong><div className="date-reveal__rule" /><p className="date-reveal__hijri">19 Jumada Al-Awwal 1448</p></div>
      <button className={`date-reveal__veil ${revealed ? 'date-reveal__veil--gone' : ''}`} onClick={reveal} aria-label="Reveal the wedding date" style={{ transform: `translateX(-${progress}%)` }}><span>Slide to reveal</span><ArrowUpRight size={17} /></button>
    </div>
  </section>;
}

function EventChapter({ event, featured }) {
  return <article className={`event-chapter ${featured ? 'event-chapter--featured' : ''}`}>
    <div className="event-chapter__number">{event.number}</div><div className="event-chapter__body"><p className="eyebrow">Chapter {event.number}</p><h3>{event.title}</h3><div className="event-chapter__meta"><span><CalendarDays size={15} />{event.date}</span><span><Clock3 size={15} />{event.time}</span></div><p className="event-chapter__place">{event.place}</p>{event.address && <p className="event-chapter__address">{event.address}</p>}{event.hijriDate && <p className="hijri">{event.hijriDate}</p>}{event.locations && <div className="event-locations">{event.locations.map((location) => <span key={location}>{location}</span>)}</div>}</div>
  </article>;
}

function Venue({ event }) {
  const canOpen = Boolean(event.mapsUrl);
  return <div className="venue-item"><div className="venue-item__icon"><MapPin size={18} /></div><div><p className="eyebrow">{event.title}</p><h3>{event.place}</h3><p>{event.address || event.place}</p></div>{canOpen ? <a className="text-link" href={event.mapsUrl} target="_blank" rel="noreferrer">View on Maps <ArrowUpRight size={15} /></a> : <span className="venue-pending">Map link to be added</span>}</div>;
}

function RSVP() {
  const [status, setStatus] = useState('');
  const go = () => {
    const message = encodeURIComponent("Assalamu Alaikum, I would like to RSVP: Yes, I'll be there for the wedding of Faisad & Afshan.");
    if (config.whatsappNumber) window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    else setStatus('Your WhatsApp RSVP link will appear here once the number is configured.');
  };
  return <section className="rsvp section-band" id="rsvp"><div className="rsvp__ornament" data-reveal="scale">F <span>&</span> A</div><div className="section-intro centered" data-reveal="up"><h2>Your presence<br /><i>is our blessing</i></h2><p>Your presence, prayers and blessings would mean the world to us as we begin this beautiful journey together.</p></div><div className="rsvp__actions" data-reveal="up"><button className="button button--dark" onClick={go}>Yes, I'll be there <Check size={16} /></button><button className="button button--light" onClick={() => setStatus('We will miss you and keep you in our prayers.')}>Sorry, I can't make it <X size={16} /></button></div>{status && <p className="rsvp__status" role="status">{status}</p>}<p className="rsvp__note">Dua is the best present.</p></section>;
}

function MusicControl() {
  const [playing, setPlaying] = useState(false); const audio = useRef(null);
  useEffect(() => {
    if (!config.musicUrl) return undefined;
    const player = new Audio(config.musicUrl);
    player.loop = true;
    audio.current = player;
    player.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return () => { player.pause(); audio.current = null; };
  }, []);
  const toggle = () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  return <button className="music-control" onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'} title={config.musicUrl ? undefined : 'Add a music URL in src/config/wedding.js'}>{playing ? <Pause size={15} /> : <Music2 size={15} />}<span>{playing ? 'Music on' : 'Music off'}</span></button>;
}

function useScrollReveal(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const items = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [enabled]);
}

export function App() {
  const [opened, setOpened] = useState(() => sessionStorage.getItem('invitation-opened') === 'true');
  const open = () => { sessionStorage.setItem('invitation-opened', 'true'); setOpened(true); };
  const navigate = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  useScrollReveal(opened);
  return <>{!opened && <Opening onOpen={open} />}<div className={`site ${!opened ? 'site--locked' : ''}`}>
    <Navigation onNavigate={navigate} /><MusicControl />
    <main>
      <section className="hero" id="home"><div className="hero__wash" /><div className="hero__content" data-reveal="hero"><p className="eyebrow">In sha Allah <span className="line" /></p><p className="hero__kicker">The blessed Nikah of</p><h1>Faisad <i>&</i><br />Afshan</h1><p className="hero__date">31 October 2026</p></div><button className="scroll-cue" data-reveal="fade" onClick={() => navigate('story')}><span className="scroll-cue__message">Two hearts. Two families. One beautiful beginning.</span><span>Scroll to discover our story</span><ArrowDown size={15} /></button></section>
      <section className="story section-band" id="story"><div className="story__seal" data-reveal="scale">F <span>&</span> A</div><div className="section-intro" data-reveal="up"><h2>A beautiful<br /><i>beginning</i></h2><p>In the name of Allah, we begin a beautiful new chapter and joyfully invite you to be a part of our wedding celebrations.</p></div><div className="couple-columns" data-reveal="up"><div className="couple-columns__person couple-columns__person--groom"><p className="eyebrow">The groom</p><h3>{config.couple.groom}</h3><p>Son of<br /><strong>{config.parents.groom}</strong></p></div><div className="couple-columns__ampersand" aria-hidden="true">&amp;</div><div className="couple-columns__person couple-columns__person--bride"><p className="eyebrow">The bride</p><h3>{config.couple.bride}</h3><p>Daughter of<br /><strong>{config.parents.bride}</strong></p></div></div></section>
      <SaveTheDate />
      <section className="events section-band" id="events"><div className="section-intro" data-reveal="up"><p className="eyebrow">Three chapters, one beginning</p><h2>Our wedding<br /><i>celebrations</i></h2></div><div className="timeline" data-reveal="up"><EventChapter event={config.events.mehndiHaldi} /><EventChapter event={config.events.nikah} featured /><EventChapter event={config.events.walima} /></div></section>
      <Countdown />
      <section className="venues section-band" id="venue"><div className="section-intro" data-reveal="up"><h2>Gather with<br /><i>us</i></h2><p>We cannot wait to welcome you to these two special celebrations.</p></div><div className="venue-list" data-reveal="up"><Venue event={config.events.nikah} /><Venue event={config.events.walima} /></div></section>
      <section className="families section-band"><div className="section-intro centered" data-reveal="up"><p className="eyebrow">Two homes, one prayer</p><h2>With the blessings<br /><i>of our families</i></h2></div><div className="family-grid" data-reveal="scale"><div><p className="eyebrow">Groom's family</p><h3>{config.parents.groom}</h3></div><Heart size={18} strokeWidth={1.2} /><div><p className="eyebrow">Bride's family</p><h3>{config.parents.bride}</h3></div></div></section>
      <RSVP />
      <footer className="footer" data-reveal="up"><p className="eyebrow">With love, prayers & gratitude</p><div className="footer__names">Faisad <i>&</i> Afshan</div><p>{config.couple.date}</p><p className="footer__blessing">May this beginning be filled with love, barakah and beautiful memories.</p><div className="footer__mark">F <span>&</span> A</div></footer>
    </main>
  </div></>;
}