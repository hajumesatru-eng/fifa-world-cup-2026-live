import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// Home page - Group Stage Schedule
app.get('/', (c) => {
  return c.html(homePage())
})

// Live Streaming page
app.get('/live', (c) => {
  return c.html(livePage())
})

// Groups page
app.get('/groups', (c) => {
  return c.html(groupsPage())
})

function homePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FIFA World Cup 2026™ - Official Schedule</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :root {
      --fifa-blue: #003087;
      --fifa-gold: #C8A028;
      --fifa-red: #D4002D;
    }

    * { box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a1a;
      color: #fff;
      overflow-x: hidden;
    }

    .bebas { font-family: 'Bebas Neue', cursive; }

    /* Animated background */
    .hero-bg {
      background: linear-gradient(135deg, #001a4d 0%, #003087 40%, #1a0030 100%);
      position: relative;
      overflow: hidden;
    }

    .hero-bg::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at center, rgba(200,160,40,0.15) 0%, transparent 60%);
      animation: pulse 6s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 1; }
    }

    /* Stadium particles */
    .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(200,160,40,0.6);
      border-radius: 50%;
      animation: float linear infinite;
    }

    @keyframes float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
    }

    /* Navigation */
    nav {
      background: rgba(0, 10, 40, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(200,160,40,0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-logo {
      background: linear-gradient(135deg, #C8A028, #FFD700, #C8A028);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-link {
      color: rgba(255,255,255,0.8);
      transition: all 0.3s;
      position: relative;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .nav-link:hover, .nav-link.active {
      color: #FFD700;
      background: rgba(200,160,40,0.1);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 2px;
      background: #FFD700;
      border-radius: 2px;
    }

    /* Trophy banner */
    .trophy-badge {
      background: linear-gradient(135deg, #C8A028, #FFD700);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Countdown */
    .countdown-box {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,160,40,0.3);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px 24px;
      text-align: center;
      min-width: 90px;
      transition: all 0.3s;
    }

    .countdown-box:hover {
      border-color: #C8A028;
      background: rgba(200,160,40,0.1);
      transform: translateY(-2px);
    }

    .countdown-number {
      font-family: 'Bebas Neue', cursive;
      font-size: 3rem;
      line-height: 1;
      background: linear-gradient(180deg, #FFD700, #C8A028);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Schedule tabs */
    .tab-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      color: rgba(255,255,255,0.6);
      background: transparent;
      white-space: nowrap;
    }

    .tab-btn:hover {
      border-color: rgba(200,160,40,0.5);
      color: rgba(255,255,255,0.9);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #C8A028, #FFD700);
      color: #000;
      border-color: transparent;
    }

    /* Match card */
    .match-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 18px 20px;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .match-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #C8A028, transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .match-card:hover {
      background: rgba(200,160,40,0.08);
      border-color: rgba(200,160,40,0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }

    .match-card:hover::before { opacity: 1; }

    .match-card.live {
      border-color: rgba(212,0,45,0.5);
      background: rgba(212,0,45,0.08);
      animation: livePulse 2s ease-in-out infinite;
    }

    @keyframes livePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,0,45,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(212,0,45,0); }
    }

    .live-badge {
      background: #D4002D;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      animation: blinkBadge 1.5s ease-in-out infinite;
    }

    @keyframes blinkBadge {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Flag emoji display */
    .flag-emoji {
      font-size: 2rem;
      line-height: 1;
    }

    /* Group badge */
    .group-badge {
      background: linear-gradient(135deg, #003087, #0052cc);
      border: 1px solid rgba(200,160,40,0.3);
      border-radius: 8px;
      padding: 2px 10px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Section header */
    .section-header {
      background: rgba(0,48,135,0.3);
      border: 1px solid rgba(200,160,40,0.2);
      border-radius: 12px;
      padding: 12px 20px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-date {
      font-family: 'Bebas Neue', cursive;
      font-size: 1.4rem;
      color: #FFD700;
    }

    /* Group cards */
    .group-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
    }

    .group-card:hover {
      border-color: rgba(200,160,40,0.3);
      transform: translateY(-3px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }

    .group-header {
      background: linear-gradient(135deg, #003087, #001a4d);
      padding: 16px 20px;
      border-bottom: 1px solid rgba(200,160,40,0.2);
    }

    .team-row {
      padding: 10px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      transition: background 0.2s;
    }

    .team-row:last-child { border-bottom: none; }
    .team-row:hover { background: rgba(255,255,255,0.03); }

    /* Stats pills */
    .stat-pill {
      background: rgba(255,255,255,0.05);
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Host cities */
    .city-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      transition: all 0.3s;
    }

    .city-card:hover {
      border-color: rgba(200,160,40,0.3);
      background: rgba(200,160,40,0.05);
      transform: translateY(-2px);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(200,160,40,0.4); border-radius: 3px; }

    /* Tab content */
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Scroll tabs */
    .tabs-scroll {
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs-scroll::-webkit-scrollbar { display: none; }

    /* Live badge pulse */
    @keyframes liveRing {
      0% { box-shadow: 0 0 0 0 rgba(212,0,45,0.7); }
      70% { box-shadow: 0 0 0 10px rgba(212,0,45,0); }
      100% { box-shadow: 0 0 0 0 rgba(212,0,45,0); }
    }

    .live-indicator {
      width: 10px;
      height: 10px;
      background: #D4002D;
      border-radius: 50%;
      animation: liveRing 1.5s infinite;
      display: inline-block;
    }

    /* Footer */
    footer {
      background: rgba(0,5,20,0.9);
      border-top: 1px solid rgba(200,160,40,0.2);
    }
  </style>
</head>
<body>

<!-- NAVIGATION -->
<nav>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <i class="fas fa-futbol text-black text-lg"></i>
        </div>
        <div>
          <div class="nav-logo font-black text-lg leading-none bebas tracking-wider">FIFA WORLD CUP</div>
          <div class="text-yellow-400 text-xs font-bold tracking-widest">2026™ USA · CANADA · MEXICO</div>
        </div>
      </div>
      
      <div class="hidden md:flex items-center gap-2">
        <a href="/" class="nav-link active text-sm font-semibold"><i class="fas fa-home mr-1"></i>Home</a>
        <a href="/groups" class="nav-link text-sm font-semibold"><i class="fas fa-layer-group mr-1"></i>Groups</a>
        <a href="/live" class="nav-link text-sm font-semibold">
          <span class="live-indicator mr-2"></span>Live Stream
        </a>
      </div>

      <div class="flex items-center gap-3">
        <a href="/live" class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2">
          <span class="live-indicator" style="width:8px;height:8px;"></span>
          WATCH LIVE
        </a>
        <button class="md:hidden text-white" id="mobileMenuBtn">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div class="md:hidden hidden pb-3" id="mobileMenu">
      <div class="flex flex-col gap-1">
        <a href="/" class="nav-link text-sm font-semibold"><i class="fas fa-home mr-2"></i>Home</a>
        <a href="/groups" class="nav-link text-sm font-semibold"><i class="fas fa-layer-group mr-2"></i>Groups</a>
        <a href="/live" class="nav-link text-sm font-semibold"><i class="fas fa-play-circle mr-2"></i>Live Stream</a>
      </div>
    </div>
  </div>
</nav>

<!-- HERO SECTION -->
<section class="hero-bg relative py-16 md:py-24">
  <!-- Particles -->
  <div id="particles" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
    <div class="text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-yellow-400 uppercase tracking-widest">
        <i class="fas fa-star text-yellow-400"></i>
        Official FIFA World Cup 2026™ Fan Hub
        <i class="fas fa-star text-yellow-400"></i>
      </div>
      
      <!-- Title -->
      <h1 class="bebas text-6xl md:text-9xl font-black leading-none mb-2">
        <span class="text-white">FIFA</span><br/>
        <span class="trophy-badge">WORLD CUP</span>
      </h1>
      <div class="bebas text-4xl md:text-6xl text-white tracking-widest mb-6">2026™</div>
      
      <p class="text-gray-300 text-lg md:text-xl mb-4 max-w-2xl mx-auto">
        The biggest World Cup in history. 48 teams. 104 matches. 3 host countries.
      </p>
      <p class="text-yellow-400 font-bold text-sm mb-10 tracking-widest uppercase">
        🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico &nbsp;|&nbsp; June 11 – July 19, 2026
      </p>
      
      <!-- Countdown -->
      <div class="flex flex-wrap justify-center gap-4 mb-10">
        <div class="countdown-box">
          <div class="countdown-number" id="days">00</div>
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Days</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number" id="hours">00</div>
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Hours</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number" id="minutes">00</div>
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Mins</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number" id="seconds">00</div>
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Secs</div>
        </div>
      </div>
      
      <!-- Stats row -->
      <div class="flex flex-wrap justify-center gap-6 text-sm">
        <div class="flex items-center gap-2 text-gray-300">
          <div class="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
            <i class="fas fa-flag text-yellow-400 text-xs"></i>
          </div>
          <span><strong class="text-white">48</strong> Teams</span>
        </div>
        <div class="flex items-center gap-2 text-gray-300">
          <div class="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
            <i class="fas fa-futbol text-yellow-400 text-xs"></i>
          </div>
          <span><strong class="text-white">104</strong> Matches</span>
        </div>
        <div class="flex items-center gap-2 text-gray-300">
          <div class="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
            <i class="fas fa-map-marker-alt text-yellow-400 text-xs"></i>
          </div>
          <span><strong class="text-white">16</strong> Venues</span>
        </div>
        <div class="flex items-center gap-2 text-gray-300">
          <div class="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
            <i class="fas fa-layer-group text-yellow-400 text-xs"></i>
          </div>
          <span><strong class="text-white">12</strong> Groups</span>
        </div>
        <div class="flex items-center gap-2 text-gray-300">
          <div class="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center">
            <i class="fas fa-calendar text-yellow-400 text-xs"></i>
          </div>
          <span><strong class="text-white">39</strong> Days</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- MAIN CONTENT -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">

  <!-- SCHEDULE SECTION -->
  <section id="schedule" class="mb-16">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-1 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
      <div>
        <h2 class="bebas text-3xl md:text-4xl text-white tracking-wide">GROUP STAGE SCHEDULE</h2>
        <p class="text-gray-400 text-sm">June 11 – 27, 2026 · All times in UTC</p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="tabs-scroll flex gap-2 mb-6 pb-2">
      <button class="tab-btn active" onclick="showTab('all', this)">All Matches</button>
      <button class="tab-btn" onclick="showTab('A', this)">Group A</button>
      <button class="tab-btn" onclick="showTab('B', this)">Group B</button>
      <button class="tab-btn" onclick="showTab('C', this)">Group C</button>
      <button class="tab-btn" onclick="showTab('D', this)">Group D</button>
      <button class="tab-btn" onclick="showTab('E', this)">Group E</button>
      <button class="tab-btn" onclick="showTab('F', this)">Group F</button>
      <button class="tab-btn" onclick="showTab('G', this)">Group G</button>
      <button class="tab-btn" onclick="showTab('H', this)">Group H</button>
      <button class="tab-btn" onclick="showTab('I', this)">Group I</button>
      <button class="tab-btn" onclick="showTab('J', this)">Group J</button>
      <button class="tab-btn" onclick="showTab('K', this)">Group K</button>
      <button class="tab-btn" onclick="showTab('L', this)">Group L</button>
    </div>

    <!-- Schedule Matches -->
    <div id="schedule-container">
      ${generateScheduleHTML()}
    </div>
  </section>

  <!-- HOST CITIES -->
  <section class="mb-16">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-1 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
      <div>
        <h2 class="bebas text-3xl md:text-4xl text-white tracking-wide">HOST CITIES & VENUES</h2>
        <p class="text-gray-400 text-sm">16 World-Class Stadiums Across 3 Countries</p>
      </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      ${generateCitiesHTML()}
    </div>
  </section>

</main>

<!-- CTA LIVE STREAMING -->
<section class="py-16 relative overflow-hidden" style="background: linear-gradient(135deg, #1a0000, #4d0010, #1a0000);">
  <div class="absolute inset-0" style="background: radial-gradient(ellipse at center, rgba(212,0,45,0.2) 0%, transparent 70%);"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <div class="mb-4">
      <span class="live-indicator" style="width:14px;height:14px;margin-right:8px;vertical-align:middle;"></span>
      <span class="text-red-400 font-bold text-sm uppercase tracking-widest">Live Streaming Available</span>
    </div>
    <h2 class="bebas text-5xl md:text-7xl text-white mb-4">WATCH EVERY MATCH LIVE</h2>
    <p class="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
      Stream all 104 FIFA World Cup 2026 matches in HD quality. Never miss a goal, save, or legendary moment from the biggest football tournament on Earth.
    </p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/live" class="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 flex items-center gap-3">
        <i class="fas fa-play-circle"></i>
        Watch Live Now
      </a>
      <a href="/groups" class="border border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center gap-3">
        <i class="fas fa-layer-group"></i>
        View Groups
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="py-10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <i class="fas fa-futbol text-black text-lg"></i>
          </div>
          <div>
            <div class="nav-logo font-black text-base bebas tracking-wider">FIFA WORLD CUP 2026™</div>
          </div>
        </div>
        <p class="text-gray-500 text-sm">The biggest sporting event in history. 48 teams, 3 host nations, 1 champion.</p>
      </div>
      <div>
        <h4 class="text-yellow-400 font-bold text-sm mb-3 uppercase tracking-widest">Quick Links</h4>
        <div class="flex flex-col gap-2">
          <a href="/" class="text-gray-400 hover:text-white text-sm transition-colors"><i class="fas fa-chevron-right text-xs mr-2 text-yellow-600"></i>Schedule</a>
          <a href="/groups" class="text-gray-400 hover:text-white text-sm transition-colors"><i class="fas fa-chevron-right text-xs mr-2 text-yellow-600"></i>Groups & Teams</a>
          <a href="/live" class="text-gray-400 hover:text-white text-sm transition-colors"><i class="fas fa-chevron-right text-xs mr-2 text-yellow-600"></i>Live Streaming</a>
        </div>
      </div>
      <div>
        <h4 class="text-yellow-400 font-bold text-sm mb-3 uppercase tracking-widest">Tournament Dates</h4>
        <div class="text-gray-400 text-sm space-y-1">
          <div><i class="fas fa-circle text-xs text-blue-400 mr-2"></i>Group Stage: Jun 11 – 27</div>
          <div><i class="fas fa-circle text-xs text-purple-400 mr-2"></i>Round of 32: Jun 28 – Jul 3</div>
          <div><i class="fas fa-circle text-xs text-green-400 mr-2"></i>Round of 16: Jul 4 – 7</div>
          <div><i class="fas fa-circle text-xs text-yellow-400 mr-2"></i>QF: Jul 9–12 | SF: Jul 14–15</div>
          <div><i class="fas fa-trophy text-xs text-yellow-400 mr-2"></i>Final: July 19, 2026</div>
        </div>
      </div>
    </div>
    <div class="border-t border-white/5 pt-6 text-center text-gray-600 text-xs">
      <p>© 2026 FIFA World Cup Fan Hub. Not officially affiliated with FIFA. For entertainment purposes.</p>
    </div>
  </div>
</footer>

<script>
  // Mobile menu toggle
  document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  });

  // Countdown timer
  function updateCountdown() {
    const target = new Date('2026-06-11T19:00:00Z');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Generate particles
  function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.opacity = Math.random() * 0.6;
      container.appendChild(p);
    }
  }
  createParticles();

  // Tab switching
  function showTab(group, btn) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter matches
    const allDays = document.querySelectorAll('.match-day-section');
    if (group === 'all') {
      allDays.forEach(d => d.style.display = '');
      document.querySelectorAll('.match-card').forEach(c => c.style.display = '');
    } else {
      allDays.forEach(day => {
        const cards = day.querySelectorAll('.match-card');
        let visible = 0;
        cards.forEach(card => {
          if (card.dataset.group === group) {
            card.style.display = '';
            visible++;
          } else {
            card.style.display = 'none';
          }
        });
        day.style.display = visible === 0 ? 'none' : '';
      });
    }
  }
</script>

</body>
</html>`
}

function generateScheduleHTML(): string {
  const schedule = getGroupStageMatches()
  let html = ''

  schedule.forEach(day => {
    html += `<div class="match-day-section mb-8">`
    html += `<div class="section-header">
      <i class="fas fa-calendar-day text-yellow-400"></i>
      <span class="section-date">${day.date}</span>
      <span class="text-gray-400 text-sm">${day.matches.length} match${day.matches.length > 1 ? 'es' : ''}</span>
    </div>`
    html += `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">`
    
    day.matches.forEach(m => {
      const isLive = m.isLive || false
      html += `<div class="match-card${isLive ? ' live' : ''}" data-group="${m.group}">
        <div class="flex items-center justify-between mb-3">
          <span class="group-badge">Group ${m.group}</span>
          <div class="flex items-center gap-2">
            ${isLive ? '<span class="live-badge">● Live</span>' : `<span class="text-gray-400 text-xs font-mono">${m.time} UTC</span>`}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-center gap-1 flex-1">
            <span class="flag-emoji">${m.flag1}</span>
            <span class="text-white font-bold text-sm text-center leading-tight">${m.team1}</span>
          </div>
          <div class="flex flex-col items-center px-4">
            <div class="text-yellow-400 font-black text-xl bebas">VS</div>
            ${isLive ? '<div class="text-2xl font-black text-white bebas">' + (m.score || '0 - 0') + '</div>' : ''}
          </div>
          <div class="flex flex-col items-center gap-1 flex-1">
            <span class="flag-emoji">${m.flag2}</span>
            <span class="text-white font-bold text-sm text-center leading-tight">${m.team2}</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
          <i class="fas fa-map-marker-alt text-yellow-700"></i>
          <span>${m.venue}</span>
        </div>
      </div>`
    })
    
    html += '</div></div>'
  })

  return html
}

function generateCitiesHTML(): string {
  const cities = [
    { name: 'New York/NJ', country: '🇺🇸', flag: '🏟️', matches: 8 },
    { name: 'Los Angeles', country: '🇺🇸', flag: '🏟️', matches: 8 },
    { name: 'Dallas', country: '🇺🇸', flag: '🏟️', matches: 7 },
    { name: 'San Francisco', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Seattle', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Miami', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Atlanta', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Houston', country: '🇺🇸', flag: '🏟️', matches: 7 },
    { name: 'Kansas City', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Philadelphia', country: '🇺🇸', flag: '🏟️', matches: 6 },
    { name: 'Boston', country: '🇺🇸', flag: '🏟️', matches: 7 },
    { name: 'Toronto', country: '🇨🇦', flag: '🏟️', matches: 6 },
    { name: 'Vancouver', country: '🇨🇦', flag: '🏟️', matches: 5 },
    { name: 'Mexico City', country: '🇲🇽', flag: '🏟️', matches: 5 },
    { name: 'Guadalajara', country: '🇲🇽', flag: '🏟️', matches: 5 },
    { name: 'Monterrey', country: '🇲🇽', flag: '🏟️', matches: 5 },
  ]

  return cities.map(c => `
    <div class="city-card">
      <div class="text-3xl mb-2">${c.country}</div>
      <div class="text-white font-bold text-sm">${c.name}</div>
      <div class="text-gray-500 text-xs mt-1">${c.matches} matches</div>
    </div>
  `).join('')
}

interface Match {
  team1: string;
  team2: string;
  flag1: string;
  flag2: string;
  time: string;
  group: string;
  venue: string;
  isLive?: boolean;
  score?: string;
}

interface DaySchedule {
  date: string;
  matches: Match[];
}

function getGroupStageMatches(): DaySchedule[] {
  return [
    {
      date: "Thursday, June 11, 2026",
      matches: [
        { team1: "Mexico", team2: "South Africa", flag1: "🇲🇽", flag2: "🇿🇦", time: "19:00", group: "A", venue: "Mexico City Stadium", isLive: true, score: "0 - 0" },
      ]
    },
    {
      date: "Friday, June 12, 2026",
      matches: [
        { team1: "Korea Republic", team2: "Czechia", flag1: "🇰🇷", flag2: "🇨🇿", time: "02:00", group: "A", venue: "Guadalajara Stadium" },
        { team1: "Canada", team2: "Bosnia & Herzegovina", flag1: "🇨🇦", flag2: "🇧🇦", time: "19:00", group: "B", venue: "Toronto Stadium" },
      ]
    },
    {
      date: "Saturday, June 13, 2026",
      matches: [
        { team1: "USA", team2: "Paraguay", flag1: "🇺🇸", flag2: "🇵🇾", time: "01:00", group: "D", venue: "Los Angeles Stadium" },
        { team1: "Qatar", team2: "Switzerland", flag1: "🇶🇦", flag2: "🇨🇭", time: "19:00", group: "B", venue: "San Francisco Bay Area Stadium" },
        { team1: "Brazil", team2: "Morocco", flag1: "🇧🇷", flag2: "🇲🇦", time: "22:00", group: "C", venue: "New York/New Jersey Stadium" },
      ]
    },
    {
      date: "Sunday, June 14, 2026",
      matches: [
        { team1: "Haiti", team2: "Scotland", flag1: "🇭🇹", flag2: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", time: "01:00", group: "C", venue: "Boston Stadium" },
        { team1: "Australia", team2: "Türkiye", flag1: "🇦🇺", flag2: "🇹🇷", time: "04:00", group: "D", venue: "BC Place Vancouver" },
        { team1: "Germany", team2: "Curaçao", flag1: "🇩🇪", flag2: "🇨🇼", time: "17:00", group: "E", venue: "Houston Stadium" },
        { team1: "Netherlands", team2: "Japan", flag1: "🇳🇱", flag2: "🇯🇵", time: "20:00", group: "F", venue: "Dallas Stadium" },
        { team1: "Côte d'Ivoire", team2: "Ecuador", flag1: "🇨🇮", flag2: "🇪🇨", time: "23:00", group: "E", venue: "Philadelphia Stadium" },
      ]
    },
    {
      date: "Monday, June 15, 2026",
      matches: [
        { team1: "Sweden", team2: "Tunisia", flag1: "🇸🇪", flag2: "🇹🇳", time: "02:00", group: "F", venue: "Monterrey Stadium" },
        { team1: "Spain", team2: "Cabo Verde", flag1: "🇪🇸", flag2: "🇨🇻", time: "16:00", group: "H", venue: "Atlanta Stadium" },
        { team1: "Belgium", team2: "Egypt", flag1: "🇧🇪", flag2: "🇪🇬", time: "19:00", group: "G", venue: "Seattle Stadium" },
        { team1: "Saudi Arabia", team2: "Uruguay", flag1: "🇸🇦", flag2: "🇺🇾", time: "22:00", group: "H", venue: "Miami Stadium" },
      ]
    },
    {
      date: "Tuesday, June 16, 2026",
      matches: [
        { team1: "IR Iran", team2: "New Zealand", flag1: "🇮🇷", flag2: "🇳🇿", time: "01:00", group: "G", venue: "Los Angeles Stadium" },
        { team1: "France", team2: "Senegal", flag1: "🇫🇷", flag2: "🇸🇳", time: "19:00", group: "I", venue: "New York/New Jersey Stadium" },
        { team1: "Iraq", team2: "Norway", flag1: "🇮🇶", flag2: "🇳🇴", time: "22:00", group: "I", venue: "Boston Stadium" },
      ]
    },
    {
      date: "Wednesday, June 17, 2026",
      matches: [
        { team1: "Argentina", team2: "Algeria", flag1: "🇦🇷", flag2: "🇩🇿", time: "01:00", group: "J", venue: "Kansas City Stadium" },
        { team1: "Austria", team2: "Jordan", flag1: "🇦🇹", flag2: "🇯🇴", time: "04:00", group: "J", venue: "San Francisco Bay Area Stadium" },
        { team1: "Portugal", team2: "Congo DR", flag1: "🇵🇹", flag2: "🇨🇩", time: "17:00", group: "K", venue: "Houston Stadium" },
        { team1: "England", team2: "Croatia", flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag2: "🇭🇷", time: "20:00", group: "L", venue: "Dallas Stadium" },
        { team1: "Ghana", team2: "Panama", flag1: "🇬🇭", flag2: "🇵🇦", time: "23:00", group: "L", venue: "Toronto Stadium" },
      ]
    },
    {
      date: "Thursday, June 18, 2026",
      matches: [
        { team1: "Uzbekistan", team2: "Colombia", flag1: "🇺🇿", flag2: "🇨🇴", time: "02:00", group: "K", venue: "Mexico City Stadium" },
        { team1: "Czechia", team2: "South Africa", flag1: "🇨🇿", flag2: "🇿🇦", time: "16:00", group: "A", venue: "Atlanta Stadium" },
        { team1: "Switzerland", team2: "Bosnia & Herzegovina", flag1: "🇨🇭", flag2: "🇧🇦", time: "19:00", group: "B", venue: "Los Angeles Stadium" },
        { team1: "Canada", team2: "Qatar", flag1: "🇨🇦", flag2: "🇶🇦", time: "22:00", group: "B", venue: "BC Place Vancouver" },
      ]
    },
    {
      date: "Friday, June 19, 2026",
      matches: [
        { team1: "Mexico", team2: "Korea Republic", flag1: "🇲🇽", flag2: "🇰🇷", time: "01:00", group: "A", venue: "Guadalajara Stadium" },
        { team1: "USA", team2: "Australia", flag1: "🇺🇸", flag2: "🇦🇺", time: "19:00", group: "D", venue: "Seattle Stadium" },
        { team1: "Scotland", team2: "Morocco", flag1: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", flag2: "🇲🇦", time: "22:00", group: "C", venue: "Boston Stadium" },
      ]
    },
    {
      date: "Saturday, June 20, 2026",
      matches: [
        { team1: "Brazil", team2: "Haiti", flag1: "🇧🇷", flag2: "🇭🇹", time: "00:30", group: "C", venue: "Philadelphia Stadium" },
        { team1: "Türkiye", team2: "Paraguay", flag1: "🇹🇷", flag2: "🇵🇾", time: "03:00", group: "D", venue: "San Francisco Bay Area Stadium" },
        { team1: "Netherlands", team2: "Sweden", flag1: "🇳🇱", flag2: "🇸🇪", time: "17:00", group: "F", venue: "Houston Stadium" },
        { team1: "Germany", team2: "Côte d'Ivoire", flag1: "🇩🇪", flag2: "🇨🇮", time: "20:00", group: "E", venue: "Toronto Stadium" },
      ]
    },
    {
      date: "Sunday, June 21, 2026",
      matches: [
        { team1: "Ecuador", team2: "Curaçao", flag1: "🇪🇨", flag2: "🇨🇼", time: "00:00", group: "E", venue: "Kansas City Stadium" },
        { team1: "Tunisia", team2: "Japan", flag1: "🇹🇳", flag2: "🇯🇵", time: "04:00", group: "F", venue: "Monterrey Stadium" },
        { team1: "Spain", team2: "Saudi Arabia", flag1: "🇪🇸", flag2: "🇸🇦", time: "16:00", group: "H", venue: "Atlanta Stadium" },
        { team1: "Belgium", team2: "IR Iran", flag1: "🇧🇪", flag2: "🇮🇷", time: "19:00", group: "G", venue: "Los Angeles Stadium" },
        { team1: "Uruguay", team2: "Cabo Verde", flag1: "🇺🇾", flag2: "🇨🇻", time: "22:00", group: "H", venue: "Miami Stadium" },
      ]
    },
    {
      date: "Monday, June 22, 2026",
      matches: [
        { team1: "New Zealand", team2: "Egypt", flag1: "🇳🇿", flag2: "🇪🇬", time: "01:00", group: "G", venue: "BC Place Vancouver" },
        { team1: "Argentina", team2: "Austria", flag1: "🇦🇷", flag2: "🇦🇹", time: "17:00", group: "J", venue: "Dallas Stadium" },
        { team1: "France", team2: "Iraq", flag1: "🇫🇷", flag2: "🇮🇶", time: "21:00", group: "I", venue: "Philadelphia Stadium" },
      ]
    },
    {
      date: "Tuesday, June 23, 2026",
      matches: [
        { team1: "Norway", team2: "Senegal", flag1: "🇳🇴", flag2: "🇸🇳", time: "00:00", group: "I", venue: "New York/New Jersey Stadium" },
        { team1: "Jordan", team2: "Algeria", flag1: "🇯🇴", flag2: "🇩🇿", time: "03:00", group: "J", venue: "San Francisco Bay Area Stadium" },
        { team1: "Portugal", team2: "Uzbekistan", flag1: "🇵🇹", flag2: "🇺🇿", time: "17:00", group: "K", venue: "Houston Stadium" },
        { team1: "England", team2: "Ghana", flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag2: "🇬🇭", time: "20:00", group: "L", venue: "Boston Stadium" },
        { team1: "Panama", team2: "Croatia", flag1: "🇵🇦", flag2: "🇭🇷", time: "23:00", group: "L", venue: "Toronto Stadium" },
      ]
    },
    {
      date: "Wednesday, June 24, 2026",
      matches: [
        { team1: "Colombia", team2: "Congo DR", flag1: "🇨🇴", flag2: "🇨🇩", time: "02:00", group: "K", venue: "Guadalajara Stadium" },
        { team1: "Switzerland", team2: "Canada", flag1: "🇨🇭", flag2: "🇨🇦", time: "19:00", group: "B", venue: "BC Place Vancouver" },
        { team1: "Bosnia & Herzegovina", team2: "Qatar", flag1: "🇧🇦", flag2: "🇶🇦", time: "19:00", group: "B", venue: "Seattle Stadium" },
        { team1: "Scotland", team2: "Brazil", flag1: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", flag2: "🇧🇷", time: "22:00", group: "C", venue: "Miami Stadium" },
        { team1: "Morocco", team2: "Haiti", flag1: "🇲🇦", flag2: "🇭🇹", time: "22:00", group: "C", venue: "Atlanta Stadium" },
      ]
    },
    {
      date: "Thursday, June 25, 2026",
      matches: [
        { team1: "Czechia", team2: "Mexico", flag1: "🇨🇿", flag2: "🇲🇽", time: "01:00", group: "A", venue: "Mexico City Stadium" },
        { team1: "South Africa", team2: "Korea Republic", flag1: "🇿🇦", flag2: "🇰🇷", time: "01:00", group: "A", venue: "Monterrey Stadium" },
        { team1: "Curaçao", team2: "Côte d'Ivoire", flag1: "🇨🇼", flag2: "🇨🇮", time: "20:00", group: "E", venue: "Philadelphia Stadium" },
        { team1: "Ecuador", team2: "Germany", flag1: "🇪🇨", flag2: "🇩🇪", time: "20:00", group: "E", venue: "New York/New Jersey Stadium" },
        { team1: "Japan", team2: "Sweden", flag1: "🇯🇵", flag2: "🇸🇪", time: "23:00", group: "F", venue: "Dallas Stadium" },
        { team1: "Tunisia", team2: "Netherlands", flag1: "🇹🇳", flag2: "🇳🇱", time: "23:00", group: "F", venue: "Kansas City Stadium" },
      ]
    },
    {
      date: "Friday, June 26, 2026",
      matches: [
        { team1: "Türkiye", team2: "USA", flag1: "🇹🇷", flag2: "🇺🇸", time: "02:00", group: "D", venue: "Los Angeles Stadium" },
        { team1: "Paraguay", team2: "Australia", flag1: "🇵🇾", flag2: "🇦🇺", time: "02:00", group: "D", venue: "San Francisco Bay Area Stadium" },
        { team1: "Norway", team2: "France", flag1: "🇳🇴", flag2: "🇫🇷", time: "19:00", group: "I", venue: "Boston Stadium" },
        { team1: "Senegal", team2: "Iraq", flag1: "🇸🇳", flag2: "🇮🇶", time: "19:00", group: "I", venue: "Toronto Stadium" },
      ]
    },
    {
      date: "Saturday, June 27, 2026",
      matches: [
        { team1: "Cabo Verde", team2: "Saudi Arabia", flag1: "🇨🇻", flag2: "🇸🇦", time: "00:00", group: "H", venue: "Houston Stadium" },
        { team1: "Uruguay", team2: "Spain", flag1: "🇺🇾", flag2: "🇪🇸", time: "00:00", group: "H", venue: "Guadalajara Stadium" },
        { team1: "Egypt", team2: "IR Iran", flag1: "🇪🇬", flag2: "🇮🇷", time: "03:00", group: "G", venue: "Seattle Stadium" },
        { team1: "New Zealand", team2: "Belgium", flag1: "🇳🇿", flag2: "🇧🇪", time: "03:00", group: "G", venue: "BC Place Vancouver" },
        { team1: "Panama", team2: "England", flag1: "🇵🇦", flag2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", time: "21:00", group: "L", venue: "New York/New Jersey Stadium" },
        { team1: "Croatia", team2: "Ghana", flag1: "🇭🇷", flag2: "🇬🇭", time: "21:00", group: "L", venue: "Philadelphia Stadium" },
        { team1: "Colombia", team2: "Portugal", flag1: "🇨🇴", flag2: "🇵🇹", time: "23:30", group: "K", venue: "Miami Stadium" },
        { team1: "Congo DR", team2: "Uzbekistan", flag1: "🇨🇩", flag2: "🇺🇿", time: "23:30", group: "K", venue: "Atlanta Stadium" },
      ]
    },
    {
      date: "Sunday, June 28, 2026",
      matches: [
        { team1: "Algeria", team2: "Austria", flag1: "🇩🇿", flag2: "🇦🇹", time: "02:00", group: "J", venue: "Kansas City Stadium" },
        { team1: "Jordan", team2: "Argentina", flag1: "🇯🇴", flag2: "🇦🇷", time: "02:00", group: "J", venue: "Dallas Stadium" },
      ]
    }
  ]
}

function livePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Stream - FIFA World Cup 2026™</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; background: #050510; color: #fff; }
    .bebas { font-family: 'Bebas Neue', cursive; }

    nav { background: rgba(0,10,40,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(200,160,40,0.3); position: sticky; top: 0; z-index: 1000; }
    .nav-logo { background: linear-gradient(135deg, #C8A028, #FFD700, #C8A028); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-link { color: rgba(255,255,255,0.8); transition: all 0.3s; padding: 8px 16px; border-radius: 8px; }
    .nav-link:hover, .nav-link.active { color: #FFD700; background: rgba(200,160,40,0.1); }

    /* Video player */
    .video-container {
      background: #000;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      border: 2px solid rgba(200,160,40,0.3);
      box-shadow: 0 0 60px rgba(200,160,40,0.1);
    }

    .video-player {
      width: 100%;
      aspect-ratio: 16/9;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    /* Animated stadium background for player */
    .stadium-bg {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 50% 60%, rgba(0,80,0,0.3) 0%, transparent 60%),
        linear-gradient(180deg, #001a00 0%, #003300 50%, #001a00 100%);
    }

    .field-lines {
      position: absolute;
      inset: 0;
      opacity: 0.15;
      background-image: 
        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
        radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.2) 31%, rgba(255,255,255,0.2) 33%, transparent 34%);
      background-size: 60px 40px, 60px 40px, 400px 300px;
    }

    .play-overlay {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .play-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C8A028, #FFD700);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 0 30px rgba(200,160,40,0.5);
    }

    .play-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 50px rgba(200,160,40,0.8);
    }

    @keyframes liveRing {
      0% { box-shadow: 0 0 0 0 rgba(212,0,45,0.7); }
      70% { box-shadow: 0 0 0 15px rgba(212,0,45,0); }
      100% { box-shadow: 0 0 0 0 rgba(212,0,45,0); }
    }

    .live-indicator {
      width: 12px;
      height: 12px;
      background: #D4002D;
      border-radius: 50%;
      animation: liveRing 1.5s infinite;
      display: inline-block;
    }

    .stream-badge {
      background: rgba(212,0,45,0.15);
      border: 1px solid rgba(212,0,45,0.4);
      border-radius: 20px;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    /* Match info bar */
    .match-info-bar {
      background: rgba(0,20,60,0.8);
      border-top: 1px solid rgba(200,160,40,0.2);
      padding: 16px 24px;
    }

    /* Channel cards */
    .channel-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 20px;
      transition: all 0.3s;
      cursor: pointer;
      text-align: center;
    }

    .channel-card:hover, .channel-card.active {
      border-color: rgba(200,160,40,0.4);
      background: rgba(200,160,40,0.06);
      transform: translateY(-2px);
    }

    /* Live match list */
    .live-match-item {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 16px;
      transition: all 0.3s;
      cursor: pointer;
    }

    .live-match-item:hover {
      border-color: rgba(200,160,40,0.3);
      background: rgba(200,160,40,0.06);
    }

    .live-match-item.now-playing {
      border-color: rgba(212,0,45,0.4);
      background: rgba(212,0,45,0.08);
    }

    .score-display {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 1px solid rgba(200,160,40,0.3);
      border-radius: 10px;
      padding: 8px 20px;
      font-family: 'Bebas Neue', cursive;
      font-size: 1.8rem;
      color: #FFD700;
      min-width: 80px;
      text-align: center;
    }

    /* Stats bar */
    .stat-bar-bg {
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      height: 6px;
      overflow: hidden;
    }

    .stat-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #C8A028, #FFD700);
      border-radius: 4px;
      transition: width 1s ease;
    }

    /* Ticker */
    .ticker {
      background: rgba(212,0,45,0.9);
      overflow: hidden;
      white-space: nowrap;
      padding: 8px 0;
    }

    .ticker-inner {
      display: inline-block;
      animation: ticker 30s linear infinite;
    }

    @keyframes ticker {
      0% { transform: translateX(100vw); }
      100% { transform: translateX(-100%); }
    }

    /* Platform cards */
    .platform-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
      text-decoration: none;
      display: block;
    }

    .platform-card:hover {
      border-color: rgba(200,160,40,0.3);
      transform: translateY(-3px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(200,160,40,0.4); border-radius: 3px; }
  </style>
</head>
<body>

<!-- NAVIGATION -->
<nav>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <i class="fas fa-futbol text-black text-lg"></i>
        </div>
        <div>
          <div class="nav-logo font-black text-lg leading-none bebas tracking-wider">FIFA WORLD CUP</div>
          <div class="text-yellow-400 text-xs font-bold tracking-widest">2026™ USA · CANADA · MEXICO</div>
        </div>
      </div>
      <div class="hidden md:flex items-center gap-2">
        <a href="/" class="nav-link text-sm font-semibold"><i class="fas fa-home mr-1"></i>Home</a>
        <a href="/groups" class="nav-link text-sm font-semibold"><i class="fas fa-layer-group mr-1"></i>Groups</a>
        <a href="/live" class="nav-link active text-sm font-semibold">
          <span class="live-indicator" style="width:8px;height:8px;margin-right:6px;"></span>Live Stream
        </a>
      </div>
      <a href="/" class="border border-yellow-500/30 hover:border-yellow-400 text-yellow-400 text-xs font-bold px-4 py-2 rounded-full transition-all">
        <i class="fas fa-calendar mr-1"></i>Schedule
      </a>
    </div>
  </div>
</nav>

<!-- NEWS TICKER -->
<div class="ticker">
  <span class="ticker-inner text-white font-bold text-sm">
    ⚽ LIVE: Mexico vs South Africa - Group A - 1st Half &nbsp;|&nbsp; 🏆 FIFA World Cup 2026™ is LIVE! &nbsp;|&nbsp; ⚽ Opening ceremony was spectacular! &nbsp;|&nbsp; 📺 Watch all 104 matches in HD &nbsp;|&nbsp; 🌍 48 nations competing for glory &nbsp;|&nbsp; ⚽ Group Stage: June 11–27, 2026 &nbsp;|&nbsp; 🏆 Final at MetLife Stadium, New Jersey - July 19 &nbsp;|&nbsp;
    ⚽ LIVE: Mexico vs South Africa - Group A - 1st Half &nbsp;|&nbsp; 🏆 FIFA World Cup 2026™ is LIVE! &nbsp;|&nbsp;
  </span>
</div>

<!-- MAIN PLAYER AREA -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
  <div class="grid lg:grid-cols-3 gap-6">
    
    <!-- Left: Main Player -->
    <div class="lg:col-span-2">
      <!-- Live badge -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="stream-badge">
            <span class="live-indicator"></span>
            <span class="text-red-400 uppercase tracking-widest text-xs">Live Now</span>
          </div>
          <span class="text-gray-400 text-sm" id="live-time">Loading time...</span>
        </div>
        <div class="flex items-center gap-2 text-gray-400 text-sm">
          <i class="fas fa-users text-yellow-400"></i>
          <span id="viewers">847,293</span> viewers
        </div>
      </div>

      <!-- Video Player -->
      <div class="video-container mb-4">
        <div class="video-player" id="player">
          <div class="stadium-bg"></div>
          <div class="field-lines"></div>
          <div class="play-overlay" id="playOverlay">
            <div class="text-center mb-4">
              <div class="bebas text-3xl text-white mb-1">MEXICO VS SOUTH AFRICA</div>
              <div class="text-yellow-400 text-sm font-bold uppercase tracking-widest">Group A · Live Now</div>
            </div>
            <div class="flex items-center gap-6 mb-6">
              <div class="text-center">
                <div class="text-4xl mb-2">🇲🇽</div>
                <div class="text-white font-bold text-sm">Mexico</div>
              </div>
              <div class="score-display">0 - 0</div>
              <div class="text-center">
                <div class="text-4xl mb-2">🇿🇦</div>
                <div class="text-white font-bold text-sm">South Africa</div>
              </div>
            </div>
            <div class="bebas text-6xl text-yellow-400 mb-2" id="matchClock">27'</div>
            <button class="play-btn" onclick="startStream()">
              <i class="fas fa-play text-black text-2xl ml-1"></i>
            </button>
            <div class="text-gray-400 text-sm">Click to Watch Live</div>
          </div>
          
          <!-- Stream active view (hidden by default) -->
          <div class="hidden absolute inset-0 flex flex-col items-center justify-center" id="streamActive" style="background: linear-gradient(180deg, rgba(0,20,0,0.95), rgba(0,40,0,0.95));">
            <div class="text-center">
              <div class="text-6xl mb-4">🇲🇽 ⚽ 🇿🇦</div>
              <div class="bebas text-4xl text-white mb-2">MEXICO VS SOUTH AFRICA</div>
              <div class="flex items-center gap-4 justify-center mb-4">
                <div class="score-display text-3xl">0 - 0</div>
              </div>
              <div class="bebas text-yellow-400 text-5xl mb-2" id="streamClock">27'</div>
              <div class="stream-badge inline-flex">
                <span class="live-indicator"></span>
                <span class="text-red-400 text-xs uppercase tracking-widest">Live Streaming</span>
              </div>
              <div class="mt-6 text-gray-400 text-sm max-w-sm">
                <p>🎥 HD Stream Active</p>
                <p class="mt-1 text-xs text-gray-500">Note: This is a demo player. Real streams available on Fox Sports, Telemundo, and CBC.</p>
              </div>
              <button onclick="stopStream()" class="mt-4 bg-red-900/50 hover:bg-red-800/50 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-lg transition-all">
                <i class="fas fa-stop mr-1"></i> Stop Stream
              </button>
            </div>
          </div>
        </div>

        <!-- Match info bar -->
        <div class="match-info-bar">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="text-3xl">🇲🇽</span>
                <span class="text-white font-bold">Mexico</span>
              </div>
              <div class="score-display">0 - 0</div>
              <div class="flex items-center gap-2">
                <span class="text-white font-bold">South Africa</span>
                <span class="text-3xl">🇿🇦</span>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span><i class="fas fa-clock mr-1 text-yellow-400"></i>27th min</span>
              <span><i class="fas fa-map-marker-alt mr-1 text-yellow-400"></i>Mexico City Stadium</span>
              <span class="bg-blue-900/50 text-blue-300 border border-blue-700/30 px-2 py-1 rounded text-xs font-bold">Group A</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Match Stats -->
      <div class="bg-white/4 border border-white/8 rounded-2xl p-6 mb-6" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
        <h3 class="text-white font-bold mb-5 flex items-center gap-2">
          <i class="fas fa-chart-bar text-yellow-400"></i>
          Live Match Statistics
        </h3>
        <div class="space-y-4" id="stats">
          ${generateMatchStats()}
        </div>
      </div>

      <!-- Broadcasting Partners -->
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
        <h3 class="text-white font-bold mb-4 flex items-center gap-2">
          <i class="fas fa-satellite-dish text-yellow-400"></i>
          Watch On These Official Platforms
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          ${generatePlatformsHTML()}
        </div>
      </div>
    </div>

    <!-- Right: Sidebar -->
    <div class="space-y-5">
      <!-- Now Playing -->
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(200,160,40,0.3); border-radius: 16px; padding: 20px;">
        <h3 class="text-yellow-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <span class="live-indicator" style="width:8px;height:8px;"></span>
          Now Live
        </h3>
        <div class="live-match-item now-playing mb-3">
          <div class="flex items-center justify-between mb-2">
            <span style="background: rgba(212,0,45,0.2); border: 1px solid rgba(212,0,45,0.4); border-radius: 20px; padding: 2px 10px; font-size: 0.65rem; font-weight: 700; color: #F87171; text-transform: uppercase; letter-spacing: 1px;">● LIVE</span>
            <span class="text-yellow-500 text-xs font-mono">27'</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>🇲🇽</span>
              <span class="text-white text-sm font-semibold">Mexico</span>
            </div>
            <div class="score-display" style="font-size:1.2rem;padding:4px 12px;">0 - 0</div>
            <div class="flex items-center gap-2">
              <span class="text-white text-sm font-semibold">South Africa</span>
              <span>🇿🇦</span>
            </div>
          </div>
          <div class="mt-2 text-gray-500 text-xs flex items-center gap-1">
            <i class="fas fa-map-marker-alt text-yellow-700"></i>
            Mexico City Stadium
          </div>
        </div>
      </div>

      <!-- Upcoming Matches -->
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px;">
        <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <i class="fas fa-clock text-yellow-400"></i>
          Upcoming Matches
        </h3>
        <div class="space-y-3">
          ${generateUpcomingMatchesHTML()}
        </div>
      </div>

      <!-- Schedule Quick View -->
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px;">
        <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <i class="fas fa-calendar text-yellow-400"></i>
          Today's Schedule
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center justify-between py-2 border-b border-white/5">
            <div class="flex items-center gap-2">
              <span class="text-red-400 text-xs font-bold">● LIVE</span>
              <span class="text-white font-semibold">MEX vs RSA</span>
            </div>
            <span class="text-gray-400">19:00</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-white/5">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">⏰</span>
              <span class="text-gray-300">KOR vs CZE</span>
            </div>
            <span class="text-gray-400">02:00</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">⏰</span>
              <span class="text-gray-300">CAN vs BIH</span>
            </div>
            <span class="text-gray-400">19:00</span>
          </div>
        </div>
        <a href="/" class="mt-4 w-full block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
          View Full Schedule <i class="fas fa-arrow-right ml-1"></i>
        </a>
      </div>

      <!-- Quality selector -->
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px;">
        <h3 class="text-white font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <i class="fas fa-tv text-yellow-400"></i>
          Stream Quality
        </h3>
        <div class="grid grid-cols-3 gap-2">
          <button class="quality-btn py-2 rounded-lg text-xs font-bold border transition-all" style="border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);" onclick="setQuality(this, '480p')">480p</button>
          <button class="quality-btn py-2 rounded-lg text-xs font-bold border transition-all" style="border-color: rgba(200,160,40,0.5); color: #FFD700; background: rgba(200,160,40,0.1);" onclick="setQuality(this, '720p')">720p HD</button>
          <button class="quality-btn py-2 rounded-lg text-xs font-bold border transition-all" style="border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);" onclick="setQuality(this, '1080p')">1080p</button>
        </div>
        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <i class="fas fa-wifi text-green-400"></i>
          <span>Connection: <span class="text-green-400 font-bold">Excellent</span></span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<footer style="background: rgba(0,5,20,0.9); border-top: 1px solid rgba(200,160,40,0.2); padding: 32px 0; margin-top: 40px;">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600 text-xs">
    <p class="mb-2">© 2026 FIFA World Cup Fan Hub. Not officially affiliated with FIFA.</p>
    <p>For real official streams, visit <a href="https://www.fifa.com" class="text-yellow-600 hover:text-yellow-400" target="_blank">FIFA.com</a>, FOX Sports, Telemundo, CBC Sports, or your local broadcaster.</p>
  </div>
</footer>

<script>
  // Live clock
  function updateClock() {
    const el = document.getElementById('live-time');
    if (el) el.textContent = new Date().toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Match clock simulation
  let matchMin = 27;
  function updateMatchClock() {
    matchMin++;
    if (matchMin > 90) matchMin = 90;
    const el1 = document.getElementById('matchClock');
    const el2 = document.getElementById('streamClock');
    if (el1) el1.textContent = matchMin + "'";
    if (el2) el2.textContent = matchMin + "'";
  }
  setInterval(updateMatchClock, 60000);

  // Fake viewer count fluctuation
  function updateViewers() {
    const base = 847293;
    const variation = Math.floor(Math.random() * 5000 - 2500);
    const el = document.getElementById('viewers');
    if (el) el.textContent = (base + variation).toLocaleString();
  }
  setInterval(updateViewers, 3000);

  // Stream controls
  function startStream() {
    document.getElementById('playOverlay').classList.add('hidden');
    document.getElementById('streamActive').classList.remove('hidden');
  }

  function stopStream() {
    document.getElementById('streamActive').classList.add('hidden');
    document.getElementById('playOverlay').classList.remove('hidden');
  }

  // Quality buttons
  function setQuality(btn, quality) {
    document.querySelectorAll('.quality-btn').forEach(b => {
      b.style.borderColor = 'rgba(255,255,255,0.1)';
      b.style.color = 'rgba(255,255,255,0.5)';
      b.style.background = 'transparent';
    });
    btn.style.borderColor = 'rgba(200,160,40,0.5)';
    btn.style.color = '#FFD700';
    btn.style.background = 'rgba(200,160,40,0.1)';
  }
</script>
</body>
</html>`
}

function generateMatchStats(): string {
  const stats = [
    { label: "Possession", home: 58, away: 42, homeVal: "58%", awayVal: "42%" },
    { label: "Shots on Target", home: 3, away: 1, homeVal: "3", awayVal: "1" },
    { label: "Total Shots", home: 7, away: 4, homeVal: "7", awayVal: "4" },
    { label: "Corners", home: 4, away: 2, homeVal: "4", awayVal: "2" },
    { label: "Fouls", home: 5, away: 8, homeVal: "5", awayVal: "8" },
    { label: "Pass Accuracy", home: 87, away: 79, homeVal: "87%", awayVal: "79%" },
  ]

  return stats.map(s => `
    <div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-white font-semibold">${s.homeVal}</span>
        <span class="text-gray-400 text-xs">${s.label}</span>
        <span class="text-white font-semibold">${s.awayVal}</span>
      </div>
      <div class="flex gap-1 items-center">
        <div class="stat-bar-bg flex-1" style="transform: scaleX(-1);">
          <div class="stat-bar-fill" style="width: ${s.home}%;"></div>
        </div>
        <div class="stat-bar-bg flex-1">
          <div class="stat-bar-fill" style="width: ${s.away}%; background: linear-gradient(90deg, #1e40af, #3b82f6);"></div>
        </div>
      </div>
    </div>
  `).join('')
}

function generatePlatformsHTML(): string {
  const platforms = [
    { name: "FOX Sports", icon: "🦊", region: "USA", color: "#003087", desc: "English broadcast" },
    { name: "Telemundo", icon: "📺", region: "USA", color: "#e8001c", desc: "Spanish broadcast" },
    { name: "CBC Sports", icon: "🍁", region: "Canada", color: "#cc0000", desc: "English/French" },
    { name: "TV Azteca", icon: "🦅", region: "Mexico", color: "#005bbb", desc: "Spanish" },
    { name: "BBC Sport", icon: "🎙️", region: "UK", color: "#bb1919", desc: "English" },
    { name: "FIFA+", icon: "⚽", region: "Global", color: "#003087", desc: "Free streaming" },
  ]

  return platforms.map(p => `
    <div class="platform-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(200,160,40,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
      <div style="font-size: 2rem; margin-bottom: 8px;">${p.icon}</div>
      <div style="color: white; font-weight: 700; font-size: 0.8rem; margin-bottom: 2px;">${p.name}</div>
      <div style="color: #9ca3af; font-size: 0.7rem;">${p.region}</div>
      <div style="color: #6b7280; font-size: 0.65rem; margin-top: 2px;">${p.desc}</div>
    </div>
  `).join('')
}

function generateUpcomingMatchesHTML(): string {
  const upcoming = [
    { team1: "🇰🇷 Korea", team2: "Czechia 🇨🇿", time: "02:00", group: "A", date: "Jun 12" },
    { team1: "🇨🇦 Canada", team2: "Bosnia 🇧🇦", time: "19:00", group: "B", date: "Jun 12" },
    { team1: "🇺🇸 USA", team2: "Paraguay 🇵🇾", time: "01:00", group: "D", date: "Jun 13" },
    { team1: "🇧🇷 Brazil", team2: "Morocco 🇲🇦", time: "22:00", group: "C", date: "Jun 13" },
    { team1: "🇩🇪 Germany", team2: "Curaçao 🇨🇼", time: "17:00", group: "E", date: "Jun 14" },
  ]

  return upcoming.map(m => `
    <div class="live-match-item" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; cursor: pointer;" onmouseover="this.style.borderColor='rgba(200,160,40,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
      <div class="flex items-center justify-between">
        <div>
          <div style="color: white; font-size: 0.8rem; font-weight: 600;">${m.team1} <span style="color: #6b7280;">vs</span> ${m.team2}</div>
          <div style="color: #9ca3af; font-size: 0.7rem; margin-top: 2px;">${m.date} · ${m.time} UTC</div>
        </div>
        <span style="background: rgba(0,48,135,0.4); border: 1px solid rgba(200,160,40,0.2); border-radius: 6px; padding: 2px 8px; font-size: 0.65rem; font-weight: 700; color: #FCD34D;">Grp ${m.group}</span>
      </div>
    </div>
  `).join('')
}

function groupsPage(): string {
  const groups = [
    { id: "A", teams: ["🇲🇽 Mexico", "🇿🇦 South Africa", "🇰🇷 Korea Republic", "🇨🇿 Czechia"] },
    { id: "B", teams: ["🇨🇦 Canada", "🇧🇦 Bosnia & Herzegovina", "🇶🇦 Qatar", "🇨🇭 Switzerland"] },
    { id: "C", teams: ["🇧🇷 Brazil", "🇲🇦 Morocco", "🇭🇹 Haiti", "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland"] },
    { id: "D", teams: ["🇺🇸 USA", "🇵🇾 Paraguay", "🇦🇺 Australia", "🇹🇷 Türkiye"] },
    { id: "E", teams: ["🇩🇪 Germany", "🇨🇼 Curaçao", "🇨🇮 Côte d'Ivoire", "🇪🇨 Ecuador"] },
    { id: "F", teams: ["🇳🇱 Netherlands", "🇯🇵 Japan", "🇸🇪 Sweden", "🇹🇳 Tunisia"] },
    { id: "G", teams: ["🇧🇪 Belgium", "🇪🇬 Egypt", "🇮🇷 IR Iran", "🇳🇿 New Zealand"] },
    { id: "H", teams: ["🇪🇸 Spain", "🇨🇻 Cabo Verde", "🇸🇦 Saudi Arabia", "🇺🇾 Uruguay"] },
    { id: "I", teams: ["🇫🇷 France", "🇸🇳 Senegal", "🇮🇶 Iraq", "🇳🇴 Norway"] },
    { id: "J", teams: ["🇦🇷 Argentina", "🇩🇿 Algeria", "🇦🇹 Austria", "🇯🇴 Jordan"] },
    { id: "K", teams: ["🇵🇹 Portugal", "🇨🇩 Congo DR", "🇺🇿 Uzbekistan", "🇨🇴 Colombia"] },
    { id: "L", teams: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", "🇭🇷 Croatia", "🇬🇭 Ghana", "🇵🇦 Panama"] },
  ]

  const groupsHTML = groups.map(g => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(200,160,40,0.3)';this.style.transform='translateY(-3px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform=''">
      <div style="background: linear-gradient(135deg, #003087, #001a4d); padding: 14px 20px; border-bottom: 1px solid rgba(200,160,40,0.2);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-family: 'Bebas Neue', cursive; font-size: 2rem; background: linear-gradient(135deg, #C8A028, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">GROUP ${g.id}</div>
        </div>
      </div>
      <table style="width: 100%; font-size: 0.8rem;">
        <thead>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <th style="text-align: left; padding: 8px 20px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.05em;">Team</th>
            <th style="text-align: center; padding: 8px 8px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">P</th>
            <th style="text-align: center; padding: 8px 8px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">W</th>
            <th style="text-align: center; padding: 8px 8px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">D</th>
            <th style="text-align: center; padding: 8px 8px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">L</th>
            <th style="text-align: center; padding: 8px 8px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">GD</th>
            <th style="text-align: center; padding: 8px 20px; color: #9ca3af; font-weight: 600; text-transform: uppercase; font-size: 0.65rem;">Pts</th>
          </tr>
        </thead>
        <tbody>
          ${g.teams.map((t, i) => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 10px 20px; display: flex; align-items: center; gap: 8px;">
                <span style="color: #6b7280; font-size: 0.7rem; font-weight: 700; min-width: 14px;">${i+1}</span>
                <span style="color: white; font-weight: 600;">${t}</span>
              </td>
              <td style="text-align: center; padding: 10px 8px; color: #9ca3af;">0</td>
              <td style="text-align: center; padding: 10px 8px; color: #9ca3af;">0</td>
              <td style="text-align: center; padding: 10px 8px; color: #9ca3af;">0</td>
              <td style="text-align: center; padding: 10px 8px; color: #9ca3af;">0</td>
              <td style="text-align: center; padding: 10px 8px; color: #9ca3af;">0</td>
              <td style="text-align: center; padding: 10px 20px; color: #FFD700; font-weight: 700;">0</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Groups - FIFA World Cup 2026™</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; background: #050510; color: #fff; }
    .bebas { font-family: 'Bebas Neue', cursive; }
    nav { background: rgba(0,10,40,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(200,160,40,0.3); position: sticky; top: 0; z-index: 1000; }
    .nav-logo { background: linear-gradient(135deg, #C8A028, #FFD700, #C8A028); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-link { color: rgba(255,255,255,0.8); transition: all 0.3s; padding: 8px 16px; border-radius: 8px; }
    .nav-link:hover, .nav-link.active { color: #FFD700; background: rgba(200,160,40,0.1); }
    .live-indicator { width: 8px; height: 8px; background: #D4002D; border-radius: 50%; display: inline-block; animation: liveRing 1.5s infinite; }
    @keyframes liveRing { 0% { box-shadow: 0 0 0 0 rgba(212,0,45,0.7); } 70% { box-shadow: 0 0 0 8px rgba(212,0,45,0); } 100% { box-shadow: 0 0 0 0 rgba(212,0,45,0); } }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); } ::-webkit-scrollbar-thumb { background: rgba(200,160,40,0.4); border-radius: 3px; }
  </style>
</head>
<body>
<nav>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"><i class="fas fa-futbol text-black text-lg"></i></div>
        <div>
          <div class="nav-logo font-black text-lg leading-none bebas tracking-wider">FIFA WORLD CUP</div>
          <div class="text-yellow-400 text-xs font-bold tracking-widest">2026™ USA · CANADA · MEXICO</div>
        </div>
      </div>
      <div class="hidden md:flex items-center gap-2">
        <a href="/" class="nav-link text-sm font-semibold"><i class="fas fa-home mr-1"></i>Home</a>
        <a href="/groups" class="nav-link active text-sm font-semibold"><i class="fas fa-layer-group mr-1"></i>Groups</a>
        <a href="/live" class="nav-link text-sm font-semibold"><span class="live-indicator mr-1"></span>Live Stream</a>
      </div>
      <a href="/live" class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2">
        <span class="live-indicator"></span>WATCH LIVE
      </a>
    </div>
  </div>
</nav>

<div style="background: linear-gradient(135deg, #001a4d 0%, #003087 50%, #1a0030 100%); padding: 60px 16px; text-align: center;">
  <div class="inline-flex items-center gap-2 mb-4" style="background: rgba(200,160,40,0.1); border: 1px solid rgba(200,160,40,0.3); border-radius: 20px; padding: 6px 16px; font-size: 0.75rem; font-weight: 700; color: #FFD700; text-transform: uppercase; letter-spacing: 0.1em;">
    <i class="fas fa-layer-group"></i> 12 Groups · 48 Teams
  </div>
  <h1 class="bebas" style="font-size: 4rem; color: white; margin-bottom: 8px;">GROUP STAGE</h1>
  <p style="color: #9ca3af; font-size: 1rem;">FIFA World Cup 2026™ · Phase One · June 11–27</p>
  <p style="color: #6b7280; font-size: 0.875rem; margin-top: 8px;">Top 2 teams from each group + 8 best 3rd-place teams advance to Round of 32</p>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
  <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
    ${groupsHTML}
  </div>
</div>

<footer style="background: rgba(0,5,20,0.9); border-top: 1px solid rgba(200,160,40,0.2); padding: 32px 0; margin-top: 20px;">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-600 text-xs">
    <p>© 2026 FIFA World Cup Fan Hub. Not officially affiliated with FIFA.</p>
  </div>
</footer>
</body>
</html>`
}

export default app
