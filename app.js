/* ============================================================
   GrowthPilot AI — Core Application Logic
   ============================================================ */

/* ── Canvas roundRect polyfill (for older browsers) ─────── */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = Array.isArray(radii) ? radii[0] : (radii || 0);
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
  };
}

/* ── 1. BUSINESS DATA ─────────────────────────────────────── */
const BUSINESSES = [
  { id: 'grocery',     name: 'Grocery Store',     icon: '🛒' },
  { id: 'restaurant',  name: 'Restaurant',         icon: '🍽️' },
  { id: 'clothing',    name: 'Clothing Store',     icon: '👗' },
  { id: 'pharmacy',    name: 'Pharmacy',           icon: '💊' },
  { id: 'bakery',      name: 'Bakery',             icon: '🥐' },
  { id: 'salon',       name: 'Salon',              icon: '💇' },
  { id: 'electronics', name: 'Electronics Store',  icon: '📱' },
  { id: 'other',       name: 'Other',              icon: '🏪' },
];

const MARKETING_IDEAS = {
  grocery: [
    { icon: '📱', name: 'WhatsApp Daily Deals', channel: 'social',  type: 'social',  desc: 'Share daily fresh arrivals and discount combos on WhatsApp groups. Build a local customer broadcast list.', impact: '+18% repeat visits' },
    { icon: '🏷️', name: 'Weekend Bundle Offers', channel: 'in-store', type: 'instore', desc: 'Create family bundle packs (e.g. "Family Basket ₹499") every Saturday to drive weekend traffic.', impact: '+22% weekend sales' },
    { icon: '🎯', name: 'Loyalty Punch Card',    channel: 'loyalty',  type: 'loyalty', desc: 'Every 10th purchase gets a free item. Simple physical card boosts retention significantly.', impact: '+30% retention' },
    { icon: '📧', name: 'Monthly Newsletter',    channel: 'email',    type: 'email',   desc: 'Send monthly offers and new stock updates via SMS or email to registered customers.', impact: '+12% conversions' },
  ],
  restaurant: [
    { icon: '📸', name: 'Instagram Food Reels',  channel: 'social',  type: 'social',  desc: 'Post short 15-sec reels of popular dishes being prepared. Tag local food bloggers for reach.', impact: '+35% new customers' },
    { icon: '⭐', name: 'Google Reviews Push',   channel: 'in-store', type: 'instore', desc: 'Place QR codes on tables linking to Google reviews. Offer a free dessert for 5-star reviews.', impact: '+40% online visibility' },
    { icon: '🎁', name: 'Weekday Happy Hour',     channel: 'ads',      type: 'ads',     desc: 'Offer 20% off on Tues-Wed to fill slow days. Advertise via Facebook local ads with ₹200/day budget.', impact: '+28% weekday covers' },
    { icon: '💌', name: 'Birthday Club',          channel: 'email',    type: 'email',   desc: 'Collect customer birthdays and send a free meal coupon. Creates strong emotional loyalty.', impact: '+15% loyalty' },
  ],
  clothing: [
    { icon: '👗', name: 'Try-On Hauls on Reels', channel: 'social',  type: 'social',  desc: 'Film stylish try-on videos of new arrivals. Instagram & YouTube Shorts drive massive fashion traffic.', impact: '+40% awareness' },
    { icon: '🤝', name: 'Local Influencer Collab', channel: 'social', type: 'social',  desc: 'Partner with micro-influencers (5K–50K followers) in your city for authentic outfit showcases.', impact: '+25% new buyers' },
    { icon: '🏷️', name: 'End-of-Season Sale',     channel: 'ads',    type: 'ads',     desc: 'Run targeted Facebook/Instagram ads for seasonal clearance sales with countdown timers.', impact: '+50% clearance speed' },
    { icon: '💌', name: 'VIP Early Access Drops',  channel: 'email',  type: 'email',   desc: 'Email top customers 24h early access to new collections. Creates exclusivity and urgency.', impact: '+20% VIP revenue' },
  ],
  pharmacy: [
    { icon: '❤️', name: 'Health Tips WhatsApp',   channel: 'social',  type: 'social',  desc: 'Share daily health tips and medicine reminders on WhatsApp. Build trust as a health authority.', impact: '+20% customer trust' },
    { icon: '💊', name: 'Medicine Reminder Cards', channel: 'in-store', type: 'instore', desc: 'Offer free personalized medicine schedules printed for elderly customers. Builds deep loyalty.', impact: '+35% elderly retention' },
    { icon: '📋', name: 'Doctor Tie-Up Program',   channel: 'loyalty',  type: 'loyalty', desc: 'Partner with nearby clinics so doctors recommend your pharmacy. Share referral commissions.', impact: '+45% prescription sales' },
    { icon: '🎯', name: 'Seasonal Health Kits',    channel: 'ads',      type: 'ads',     desc: 'Create monsoon/winter health kits and promote via Google Ads targeting local area searches.', impact: '+30% kit sales' },
  ],
  bakery: [
    { icon: '🎂', name: 'Custom Cake Orders',      channel: 'social',  type: 'social',  desc: 'Showcase custom cake designs on Instagram. Accept orders via DM for birthdays and events.', impact: '+60% event orders' },
    { icon: '📱', name: 'Morning Bread Alerts',    channel: 'social',  type: 'social',  desc: 'Post a story every morning of fresh-baked items with availability. Creates FOMO and urgency.', impact: '+25% morning sales' },
    { icon: '🤝', name: 'Corporate Tiffin Deals',  channel: 'email',   type: 'email',   desc: 'Target nearby offices with bulk order deals for meetings, events, and daily tiffin services.', impact: '+40% B2B revenue' },
    { icon: '🏷️', name: 'Loyalty Stamp Card',      channel: 'loyalty', type: 'loyalty', desc: 'Buy 9 pastries, get the 10th free. Simple and effective for daily repeat customers.', impact: '+28% frequency' },
  ],
  salon: [
    { icon: '✨', name: 'Before/After Transformations', channel: 'social', type: 'social', desc: 'Post before/after photos (with permission) on Instagram. Hair transformations go viral locally.', impact: '+45% bookings' },
    { icon: '📅', name: 'Online Appointment Booking',   channel: 'ads',    type: 'ads',   desc: 'Set up free Google Business booking and run ads for "salon near me". Capture high-intent searches.', impact: '+30% new clients' },
    { icon: '🎁', name: 'Refer a Friend Offer',         channel: 'loyalty', type: 'loyalty', desc: 'Give ₹100 off to both referrer and new client. Word-of-mouth grows your client base fast.', impact: '+35% referrals' },
    { icon: '💌', name: 'Seasonal Service Packages',    channel: 'email',   type: 'email',   desc: 'Email festive packages (Diwali glow, summer care) to existing clients with early-bird pricing.', impact: '+22% upsells' },
  ],
  electronics: [
    { icon: '📺', name: 'YouTube Unboxing Videos',   channel: 'social',  type: 'social',  desc: 'Create unboxing and comparison videos. Electronics content gets high search traffic on YouTube.', impact: '+50% organic reach' },
    { icon: '🔧', name: 'Free Demo Days',             channel: 'instore', type: 'instore', desc: 'Host in-store demo days for new products (smart TVs, laptops). Drives footfall and impulse buys.', impact: '+40% in-store sales' },
    { icon: '🎯', name: 'EMI Offer Campaigns',        channel: 'ads',     type: 'ads',     desc: 'Run targeted ads highlighting 0% EMI options. Reduces price barrier for high-ticket items.', impact: '+35% big-ticket sales' },
    { icon: '⭐', name: 'Service After Sale Program',  channel: 'loyalty', type: 'loyalty', desc: 'Offer free 1-year support and check-ups. Builds premium reputation and repeat purchase trust.', impact: '+25% loyalty' },
  ],
  other: [
    { icon: '📱', name: 'Social Media Presence',    channel: 'social',  type: 'social',  desc: 'Post consistently on Instagram and Facebook showcasing your products/services and happy customers.', impact: '+30% awareness' },
    { icon: '⭐', name: 'Google My Business',        channel: 'ads',     type: 'ads',     desc: 'Claim and optimize your free Google Business listing. Appear in "near me" local searches.', impact: '+40% local discovery' },
    { icon: '🎁', name: 'Referral Rewards',          channel: 'loyalty', type: 'loyalty', desc: 'Give discounts or gifts to customers who refer new clients. Word-of-mouth is your best channel.', impact: '+25% new customers' },
    { icon: '💌', name: 'WhatsApp / SMS Campaigns',  channel: 'email',   type: 'email',   desc: 'Build a customer contact list and send regular updates, offers, and new arrivals via WhatsApp.', impact: '+20% retention' },
  ],
};

const WEEKLY_PLAN_TEMPLATE = [
  { day: 'Monday',    focus: '📊 Analytics & Planning', tasks: [
    'Review last week\'s sales figures and top-performing products',
    'Check inventory levels and flag items below reorder point',
    'Set this week\'s revenue target and write it visibly',
    'Schedule 3 social media posts for the week',
  ]},
  { day: 'Tuesday',   focus: '📣 Marketing & Outreach', tasks: [
    'Post a promotional offer on social media',
    'Follow up with 5 regular customers via WhatsApp',
    'Update Google My Business hours and photos',
    'Create one promotional graphic for upcoming offer',
  ]},
  { day: 'Wednesday', focus: '📦 Inventory & Operations', tasks: [
    'Place restock orders for slow-running items',
    'Reorganize store layout to highlight best-sellers',
    'Review supplier invoices and confirm delivery dates',
    'Train staff on upselling techniques for top products',
  ]},
  { day: 'Thursday',  focus: '💡 Customer Engagement', tasks: [
    'Respond to all customer reviews (Google, social)',
    'Launch today\'s special deal or flash discount',
    'Collect customer feedback from 3 in-store visitors',
    'Send WhatsApp broadcast with Thursday special',
  ]},
  { day: 'Friday',    focus: '🚀 Revenue Push', tasks: [
    'Activate weekend promotions and bundle offers',
    'Brief staff on weekend targets and upsell priorities',
    'Post "Weekend Special" across all social channels',
    'Review accounts receivable and collect pending dues',
  ]},
  { day: 'Saturday',  focus: '🛍️ Peak Day Operations', tasks: [
    'Ensure shelves/stock is fully replenished for weekend rush',
    'Monitor peak hours and manage queue/service speed',
    'Offer loyalty stamp or reward to repeat customers',
    'Upsell add-ons or complementary products actively',
  ]},
  { day: 'Sunday',    focus: '🔁 Review & Reset', tasks: [
    'Tally total weekly sales vs target — celebrate wins!',
    'Document what worked and what didn\'t this week',
    'Prep next week\'s marketing content ideas',
    'Rest and recharge — your energy fuels your business 💪',
  ]},
];

const MONTHLY_PLAN_TEMPLATE = [
  { week: 1, title: '🔍 Audit & Foundation Week', tasks: 'Complete full inventory audit · Fix pricing on slow sellers · Set monthly revenue goal · Optimize store/service flow · Build customer contact database' },
  { week: 2, title: '📣 Marketing Launch Week',   tasks: 'Launch main promotional campaign · Activate social media consistently · Reach out to 20 potential customers · Collect and respond to reviews · Publish 3 pieces of content' },
  { week: 3, title: '📈 Growth & Optimization Week', tasks: 'Analyze mid-month sales data · Double down on what\'s working · Introduce a new product or service · Run a referral drive · Engage top 10 loyal customers with a thank-you offer' },
  { week: 4, title: '🏁 Close & Plan Week',      tasks: 'Final revenue push — all promotions active · Count total monthly sales vs goal · Pay suppliers and restock for next month · Document lessons learned · Plan next month\'s strategy' },
];

/* ── 2. STATE ─────────────────────────────────────────────── */
let state = {
  selectedBiz: null,
  formData: {},
  scenarioActive: 'realistic',
};

/* ── 3. PAGE NAVIGATION ───────────────────────────────────── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.remove('fade-out');
    p.style.display = 'none';
  });
  const target = document.getElementById(pageId);
  target.style.display = 'flex';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
    });
  });
}

/* ── 4. PARTICLE BACKGROUND ──────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      a: Math.random(),
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${p.a * 0.7})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 5. STEP 1: BUILD BUSINESS GRID ─────────────────────── */
function buildBizGrid() {
  const grid = document.getElementById('biz-grid');
  grid.innerHTML = BUSINESSES.map(b => `
    <div class="biz-card" data-id="${b.id}">
      <span class="biz-icon">${b.icon}</span>
      <div class="biz-name">${b.name}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.biz-card').forEach(card => {
    card.addEventListener('click', () => {
      const biz = BUSINESSES.find(b => b.id === card.dataset.id);
      selectBusiness(biz);
    });
  });
}

function selectBusiness(biz) {
  state.selectedBiz = biz;

  // Update form page
  document.getElementById('form-biz-badge').innerHTML = `${biz.icon} ${biz.name}`;
  document.getElementById('form-biz-name').textContent = biz.name;

  // Transition
  const landing = document.getElementById('page-landing');
  landing.classList.add('fade-out');
  setTimeout(() => showPage('page-form'), 300);
}

/* ── 6. STEP 2: FORM LOGIC ───────────────────────────────── */

/* Live margin calculator */
function updateMarginDisplay() {
  const sales    = parseFloat(document.getElementById('monthly-sales').value)    || 0;
  const expenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
  const profit   = sales - expenses;
  const margin   = sales > 0 ? ((profit / sales) * 100).toFixed(1) : '0.0';
  const breakEven = expenses;

  const profitEl = document.getElementById('live-profit');
  const marginEl = document.getElementById('live-margin');

  profitEl.textContent = `₹${Math.abs(profit).toLocaleString('en-IN')}${profit < 0 ? ' (loss)' : ''}`;
  profitEl.style.color = profit >= 0 ? '#10b981' : '#ef4444';
  marginEl.textContent = `${margin}%`;
  marginEl.style.color = profit >= 0 ? '#06b6d4' : '#ef4444';
  document.getElementById('live-breakeven').textContent = `₹${breakEven.toLocaleString('en-IN')}`;

  updateProgress();
}

/* Form progress bar */
function updateProgress() {
  const fields = ['monthly-sales', 'monthly-expenses', 'num-products', 'stock-value'];
  let filled = fields.filter(f => document.getElementById(f).value.trim() !== '').length;
  const bestTags = getBestTags().length;
  const slowTags = getSlowTags().length;
  if (bestTags > 0) filled++;
  if (slowTags > 0) filled++;
  const total = fields.length + 2;
  const pct = Math.round((filled / total) * 100);
  document.getElementById('form-progress').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
}

/* ── Tag Inputs ── */
let bestTags = [];
let slowTags = [];

function getBestTags() { return bestTags; }
function getSlowTags() { return slowTags; }

function initTagInput(wrapId, inputId, tagsArr, maxTags = 5) {
  const wrap  = document.getElementById(wrapId);
  const input = document.getElementById(inputId);

  function renderTags() {
    wrap.querySelectorAll('.tag').forEach(t => t.remove());
    tagsArr.forEach((tag, i) => {
      const t = document.createElement('div');
      t.className = 'tag';
      t.innerHTML = `${tag} <span class="rm-tag" data-i="${i}">×</span>`;
      wrap.insertBefore(t, input);
    });
    wrap.querySelectorAll('.rm-tag').forEach(btn => {
      btn.addEventListener('click', (e) => {
        tagsArr.splice(parseInt(btn.dataset.i), 1);
        renderTags();
        updateProgress();
      });
    });
  }

  function addTag(val) {
    val = val.trim().replace(/,$/, '');
    if (val && !tagsArr.includes(val) && tagsArr.length < maxTags) {
      tagsArr.push(val);
      renderTags();
      updateProgress();
    }
    input.value = '';
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value);
    }
    if (e.key === 'Backspace' && input.value === '' && tagsArr.length > 0) {
      tagsArr.pop();
      renderTags();
      updateProgress();
    }
  });
  input.addEventListener('blur', () => { if (input.value) addTag(input.value); });
  wrap.addEventListener('click', () => input.focus());
}

/* ── 7. LOADING ANIMATION ────────────────────────────────── */
const LOADING_STEPS = [
  'Calculating profit margins…',
  'Analyzing inventory trends…',
  'Generating marketing strategies…',
  'Building sales forecast models…',
  'Creating your growth roadmap…',
  'Finalizing insights…',
];

function showLoading() {
  const overlay = document.getElementById('loading-overlay');
  const stepEl  = document.getElementById('loading-step');
  overlay.classList.add('active');
  let i = 0;
  const interval = setInterval(() => {
    stepEl.textContent = LOADING_STEPS[i % LOADING_STEPS.length];
    i++;
  }, 500);
  return () => {
    clearInterval(interval);
    overlay.classList.remove('active');
  };
}

/* ── 8. FORM SUBMISSION & ANALYSIS ──────────────────────── */
document.getElementById('data-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const sales    = parseFloat(document.getElementById('monthly-sales').value)    || 0;
  const expenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
  if (!sales && !expenses) { alert('Please enter at least your monthly sales and expenses.'); return; }

  state.formData = {
    sales,
    expenses,
    numProducts: parseInt(document.getElementById('num-products').value)  || 20,
    stockValue:  parseFloat(document.getElementById('stock-value').value) || 0,
    bestSellers: [...bestTags],
    slowSellers: [...slowTags],
  };

  const hideLoading = showLoading();
  await new Promise(r => setTimeout(r, 3200));
  hideLoading();
  buildDashboard();
  showPage('page-dashboard');
  window.scrollTo(0, 0);
});

/* ── 9. ANALYSIS ENGINE ─────────────────────────────────── */
function analyzeData(data) {
  const { sales, expenses } = data;
  const profit = sales - expenses;
  const margin = sales > 0 ? (profit / sales) * 100 : 0;

  // Health score calculation
  let score = 50;
  if (margin > 30) score += 20;
  else if (margin > 15) score += 10;
  else if (margin < 0) score -= 20;
  if (sales > 100000) score += 10;
  if (sales > 500000) score += 5;
  if (data.bestSellers.length > 0) score += 8;
  if (data.slowSellers.length === 0) score += 7;
  else score -= data.slowSellers.length * 2;
  score = Math.max(10, Math.min(97, score));

  const growthRate = margin > 20 ? 0.08 : margin > 10 ? 0.05 : margin > 0 ? 0.03 : 0.01;

  return { profit, margin, score, growthRate };
}

function generateForecast(baseSales, growthRate, scenario) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const multipliers = {
    realistic:    [1, 1 + growthRate, 1 + growthRate * 2, 1 + growthRate * 3, 1 + growthRate * 3.5, 1 + growthRate * 4],
    optimistic:   [1.05, 1.12, 1.20, 1.28, 1.35, 1.45],
    conservative: [0.95, 0.97, 1.00, 1.03, 1.06, 1.09],
  };
  return months.map((m, i) => ({
    month: m,
    value: Math.round(baseSales * multipliers[scenario][i]),
  }));
}

/* ── 10. DASHBOARD BUILD ─────────────────────────────────── */
function buildDashboard() {
  const biz  = state.selectedBiz;
  const data = state.formData;
  const { profit, margin, score, growthRate } = analyzeData(data);

  // Header badge
  document.getElementById('dash-biz-badge').innerHTML = `${biz.icon} ${biz.name}`;
  document.getElementById('dash-subtitle').textContent =
    `Analysis based on ₹${data.sales.toLocaleString('en-IN')} monthly revenue · Generated ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`;

  // Metrics Row
  buildMetrics(data, profit, margin);

  // Gauge
  drawGauge(score);
  buildHealthDetails(margin, score, data);

  // Bar Chart
  drawBarChart(data.sales, data.expenses, profit);

  // Restock
  buildRestockList(data);

  // Marketing
  buildMarketing(biz.id);

  // Forecast
  buildForecast(data.sales, growthRate);

  // Growth Plans
  buildWeeklyPlan(biz.id);
  buildMonthlyPlan();

  // Events
  initDashboardEvents(data.sales, growthRate);
}

/* Metrics */
function buildMetrics(data, profit, margin) {
  const row = document.getElementById('metrics-row');
  const isProfit = profit >= 0;
  row.innerHTML = `
    <div class="metric-card purple">
      <div class="metric-icon">💰</div>
      <div class="metric-val">₹${(data.sales/1000).toFixed(0)}K</div>
      <div class="metric-lbl">Monthly Revenue</div>
      <div class="metric-change up">↑ Current Month</div>
    </div>
    <div class="metric-card ${isProfit ? 'green' : 'red'}">
      <div class="metric-icon">${isProfit ? '📈' : '📉'}</div>
      <div class="metric-val" style="color:${isProfit ? 'var(--green)' : 'var(--red)'}">₹${Math.abs(profit/1000).toFixed(1)}K</div>
      <div class="metric-lbl">Net ${isProfit ? 'Profit' : 'Loss'}</div>
      <div class="metric-change ${isProfit ? 'up' : 'down'}">${isProfit ? '✅ Profitable' : '⚠️ Review Expenses'}</div>
    </div>
    <div class="metric-card cyan">
      <div class="metric-icon">📊</div>
      <div class="metric-val" style="color:var(--cyan)">${margin.toFixed(1)}%</div>
      <div class="metric-lbl">Profit Margin</div>
      <div class="metric-change ${margin > 15 ? 'up' : 'down'}">${margin > 20 ? '🏆 Excellent' : margin > 10 ? '👍 Good' : margin > 0 ? '⚡ Needs Work' : '🚨 Loss-Making'}</div>
    </div>
    <div class="metric-card purple">
      <div class="metric-icon">📦</div>
      <div class="metric-val">${data.numProducts}</div>
      <div class="metric-lbl">Products in Stock</div>
      <div class="metric-change up">₹${(data.stockValue/1000).toFixed(0)}K inventory value</div>
    </div>
  `;
}

/* Gauge Chart */
function drawGauge(score) {
  const canvas = document.getElementById('gauge-canvas');
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 65;

  ctx.clearRect(0, 0, 160, 160);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.25 + Math.PI, false);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Color
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const startAngle = Math.PI * 0.75;
  const endAngle   = startAngle + (score / 100) * (Math.PI * 1.5);

  // Glow
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Animate score number
  let current = 0;
  const target = score;
  const scoreEl = document.getElementById('gauge-score');
  scoreEl.style.color = color;
  const interval = setInterval(() => {
    current = Math.min(current + 2, target);
    scoreEl.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 20);
}

/* Health Details */
function buildHealthDetails(margin, score, data) {
  const el = document.getElementById('health-details');
  const items = [
    { label: 'Profit Margin',    val: `${margin.toFixed(1)}%`,  color: margin > 15 ? '#10b981' : margin > 0 ? '#f59e0b' : '#ef4444' },
    { label: 'Revenue Level',    val: data.sales > 200000 ? 'Strong' : data.sales > 50000 ? 'Moderate' : 'Low', color: data.sales > 200000 ? '#10b981' : data.sales > 50000 ? '#f59e0b' : '#ef4444' },
    { label: 'Product Variety',  val: data.numProducts > 30 ? 'Good' : data.numProducts > 10 ? 'Moderate' : 'Slim', color: data.numProducts > 30 ? '#10b981' : '#f59e0b' },
    { label: 'Best Sellers',     val: data.bestSellers.length > 0 ? `${data.bestSellers.length} identified` : 'Not set', color: data.bestSellers.length > 0 ? '#06b6d4' : '#8b99c0' },
    { label: 'Slow Movers',      val: data.slowSellers.length > 0 ? `${data.slowSellers.length} flagged` : 'None', color: data.slowSellers.length === 0 ? '#10b981' : '#f59e0b' },
    { label: 'Overall Status',   val: score >= 70 ? '🏆 Thriving' : score >= 50 ? '⚡ Growing' : '🔧 Needs Focus', color: score >= 70 ? '#10b981' : score >= 50 ? '#06b6d4' : '#ef4444' },
  ];
  el.innerHTML = items.map(item => `
    <div class="health-item">
      <div class="health-dot" style="background:${item.color}"></div>
      <div class="health-item-text">${item.label}</div>
      <div class="health-item-val" style="color:${item.color}">${item.val}</div>
    </div>
  `).join('');
}

/* Bar Chart */
function drawBarChart(sales, expenses, profit) {
  const canvas = document.getElementById('bar-chart');
  canvas.width  = canvas.offsetWidth || 400;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');

  const data   = [sales, expenses, Math.max(0, profit)];
  const colors = ['#7c3aed', '#ef4444', '#10b981'];
  const labels = ['Revenue', 'Expenses', 'Profit'];
  const max    = Math.max(...data) * 1.2 || 1;
  const barW   = 60;
  const gap    = (canvas.width - data.length * barW) / (data.length + 1);
  const chartH = 170;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 10 + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px Inter';
    ctx.fillText(`₹${((max - (max / 4) * i) / 1000).toFixed(0)}K`, 4, y + 4);
  }

  data.forEach((val, i) => {
    const x = gap + i * (barW + gap);
    const h = (val / max) * chartH;
    const y = 10 + chartH - h;

    // Shadow
    ctx.shadowBlur = 20;
    ctx.shadowColor = colors[i];

    // Gradient fill
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, colors[i] + '44');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, h, [6, 6, 0, 0]);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Labels
    ctx.fillStyle = '#f0f4ff';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`₹${(val / 1000).toFixed(0)}K`, x + barW / 2, y - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter';
    ctx.fillText(labels[i], x + barW / 2, 200);
  });
  ctx.textAlign = 'left';
}

/* Restock List */
function buildRestockList(data) {
  const list = document.getElementById('restock-list');
  const biz  = state.selectedBiz;
  const items = [];

  // Add slow sellers as urgent restock candidates (liquidate)
  data.slowSellers.slice(0, 2).forEach(p => {
    items.push({ icon: '⚠️', name: p, note: 'Slow-mover — discount 20% or bundle to clear stock', badge: 'urgent', badgeClass: 'badge-urgent' });
  });

  // Add best sellers as normal restock
  data.bestSellers.slice(0, 3).forEach(p => {
    items.push({ icon: '⭐', name: p, note: 'High demand — reorder within 7 days to avoid stockouts', badge: 'restock', badgeClass: 'badge-normal' });
  });

  // Business-specific suggestions
  const suggestions = {
    grocery:     [{ icon: '🥛', name: 'Dairy & Perishables', note: 'Top-selling category — maintain 3-day buffer stock', badge: 'normal', badgeClass: 'badge-normal' }],
    restaurant:  [{ icon: '🧂', name: 'Core Ingredients',    note: 'Ensure 1-week supply of key menu ingredients',        badge: 'normal', badgeClass: 'badge-normal' }],
    clothing:    [{ icon: '👕', name: 'Popular Sizes (M, L)', note: 'Most common sizes run out fastest — buffer stock',    badge: 'normal', badgeClass: 'badge-normal' }],
    pharmacy:    [{ icon: '💊', name: 'OTC Medicines',        note: 'Paracetamol, antacids, vitamins — always in demand',  badge: 'normal', badgeClass: 'badge-normal' }],
    bakery:      [{ icon: '🌾', name: 'Flour & Sugar',        note: 'Core ingredients — keep 2-week buffer in stock',      badge: 'normal', badgeClass: 'badge-normal' }],
    salon:       [{ icon: '💇', name: 'Shampoo & Treatments', note: 'High-use retail products — reorder when 30% left',   badge: 'normal', badgeClass: 'badge-normal' }],
    electronics: [{ icon: '🔋', name: 'Accessories & Cables', note: 'High-margin add-ons — always keep 50+ units',        badge: 'normal', badgeClass: 'badge-normal' }],
    other:       [{ icon: '📦', name: 'Top Category Items',   note: 'Analyze sales data weekly to spot demand shifts',    badge: 'low',    badgeClass: 'badge-low'    }],
  };

  const bizSuggestion = suggestions[biz.id] || suggestions.other;
  items.push(...bizSuggestion);

  // Seasonal suggestion
  items.push({ icon: '🗓️', name: 'Seasonal / Festive Stock', note: 'Plan ahead for upcoming festivals — order 3 weeks early', badge: 'low', badgeClass: 'badge-low' });

  list.innerHTML = items.slice(0, 6).map(item => `
    <div class="restock-item">
      <div class="restock-emoji">${item.icon}</div>
      <div class="restock-info">
        <div class="restock-name">${item.name}</div>
        <div class="restock-note">${item.note}</div>
      </div>
      <div class="restock-badge ${item.badgeClass}">${item.badge}</div>
    </div>
  `).join('');
}

/* Marketing Ideas */
function buildMarketing(bizId) {
  const grid  = document.getElementById('marketing-grid');
  const ideas = MARKETING_IDEAS[bizId] || MARKETING_IDEAS.other;
  grid.innerHTML = ideas.map(m => `
    <div class="mkt-card ${m.type}">
      <div class="mkt-header">
        <div class="mkt-icon">${m.icon}</div>
        <div class="mkt-name">${m.name}</div>
        <div class="mkt-channel">${m.channel}</div>
      </div>
      <div class="mkt-desc">${m.desc}</div>
      <div class="mkt-impact">📈 Estimated: ${m.impact}</div>
    </div>
  `).join('');
}

/* Forecast Chart */
function drawForecastChart(data, scenario) {
  const canvas = document.getElementById('forecast-chart');
  canvas.width  = canvas.offsetWidth || 800;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');

  const vals   = data.map(d => d.value);
  const months = data.map(d => d.month);
  const max    = Math.max(...vals) * 1.2;
  const min    = Math.min(...vals) * 0.85;
  const range  = max - min;
  const W = canvas.width, H = 180;
  const padL = 60, padR = 20, padT = 20;

  const colors = { realistic: '#7c3aed', optimistic: '#10b981', conservative: '#f59e0b' };
  const color  = colors[scenario];

  ctx.clearRect(0, 0, W, canvas.height);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (H / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    const v = max - (range / 4) * i;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`₹${(v / 1000).toFixed(0)}K`, padL - 4, y + 4);
  }

  const xStep = (W - padL - padR) / (vals.length - 1);
  const pts = vals.map((v, i) => ({
    x: padL + i * xStep,
    y: padT + H - ((v - min) / range) * H,
  }));

  // Fill gradient
  const grad = ctx.createLinearGradient(0, padT, 0, padT + H);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '08');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, padT + H);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, padT + H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.shadowBlur = 14;
  ctx.shadowColor = color;
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Points
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`₹${(vals[i] / 1000).toFixed(0)}K`, p.x, p.y - 12);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter';
    ctx.fillText(months[i], p.x, padT + H + 16);
  });
  ctx.textAlign = 'left';
}

function buildForecast(sales, growthRate) {
  state.forecastData = {
    realistic:    generateForecast(sales, growthRate, 'realistic'),
    optimistic:   generateForecast(sales, growthRate, 'optimistic'),
    conservative: generateForecast(sales, growthRate, 'conservative'),
  };
  state.growthRate = growthRate;
  drawCurrentForecast();
}

function drawCurrentForecast() {
  const scenario = state.scenarioActive;
  const data = state.forecastData[scenario];
  drawForecastChart(data, scenario);

  const last  = data[data.length - 1].value;
  const first = data[0].value;
  const growth = (((last - first) / first) * 100).toFixed(1);
  const annual  = data.reduce((s, d) => s + d.value, 0);

  document.getElementById('forecast-stats').innerHTML = `
    <div class="margin-stat" style="text-align:left">
      <div class="val" style="color:var(--purple-light);font-size:1.3rem">₹${(last/1000).toFixed(0)}K</div>
      <div class="lbl">Month 6 Projection</div>
    </div>
    <div class="margin-stat" style="text-align:left">
      <div class="val" style="color:var(--cyan);font-size:1.3rem">+${growth}%</div>
      <div class="lbl">6-Month Growth</div>
    </div>
    <div class="margin-stat" style="text-align:left">
      <div class="val" style="color:var(--green);font-size:1.3rem">₹${(annual/100000).toFixed(1)}L</div>
      <div class="lbl">6-Month Total Revenue</div>
    </div>
  `;
}

/* Weekly Plan */
function buildWeeklyPlan(bizId) {
  const wrap = document.getElementById('weekly-plan');
  const saved = JSON.parse(localStorage.getItem(`gp_tasks_${bizId}`) || '{}');

  wrap.innerHTML = WEEKLY_PLAN_TEMPLATE.map((d, di) => `
    <div class="plan-day" id="day-${di}">
      <div class="plan-day-header" data-day="${di}">
        <div class="plan-day-label">${d.day}</div>
        <div class="plan-day-tag">${d.focus}</div>
        <div class="plan-day-chevron">▼</div>
      </div>
      <div class="plan-day-tasks">
        ${d.tasks.map((task, ti) => {
          const key   = `${di}-${ti}`;
          const done  = saved[key] || false;
          return `
            <div class="plan-task ${done ? 'done' : ''}" data-key="${key}" data-day="${di}" data-task="${ti}">
              <div class="plan-checkbox"></div>
              <div class="plan-task-text">${task}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  // Accordion toggles
  wrap.querySelectorAll('.plan-day-header').forEach(h => {
    h.addEventListener('click', () => {
      const day = document.getElementById(`day-${h.dataset.day}`);
      day.classList.toggle('open');
    });
  });
  // Open Monday by default
  document.getElementById('day-0')?.classList.add('open');

  // Task checkboxes
  wrap.querySelectorAll('.plan-task').forEach(task => {
    task.addEventListener('click', () => {
      task.classList.toggle('done');
      const key = task.dataset.key;
      const saved = JSON.parse(localStorage.getItem(`gp_tasks_${bizId}`) || '{}');
      saved[key] = task.classList.contains('done');
      localStorage.setItem(`gp_tasks_${bizId}`, JSON.stringify(saved));
    });
  });
}

/* Monthly Plan */
function buildMonthlyPlan() {
  const el = document.getElementById('monthly-plan');
  const totalTasks = MONTHLY_PLAN_TEMPLATE.reduce((s, w) => s + w.tasks.split('·').length, 0);
  el.innerHTML = MONTHLY_PLAN_TEMPLATE.map((w, i) => `
    <div class="month-week">
      <div class="week-number">W${w.week}</div>
      <div class="week-content">
        <div class="week-title">${w.title}</div>
        <div class="week-tasks">${w.tasks.split('·').map(t => `• ${t.trim()}`).join('<br>')}</div>
      </div>
    </div>
  `).join('') + `
    <div class="month-progress">
      <div class="month-progress-title">📊 Monthly Progress Tracker</div>
      <div class="mp-bar-wrap"><div class="mp-bar" id="month-progress-bar" style="width:0%"></div></div>
      <div class="mp-label">0 of 4 weeks complete — click on weekly tasks to track your progress</div>
    </div>
  `;
  setTimeout(() => {
    const bar = document.getElementById('month-progress-bar');
    if (bar) bar.style.width = '0%';
  }, 100);
}

/* ── 11. DASHBOARD EVENT HANDLERS ───────────────────────── */
function initDashboardEvents(sales, growthRate) {
  // Scenario tabs
  document.getElementById('scenario-tabs').querySelectorAll('.scenario-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.scenarioActive = btn.dataset.scenario;
      drawCurrentForecast();
    });
  });

  // Plan tabs
  document.getElementById('tab-weekly').addEventListener('click', () => {
    document.getElementById('tab-weekly').classList.add('active');
    document.getElementById('tab-monthly').classList.remove('active');
    document.getElementById('weekly-wrap').classList.add('active');
    document.getElementById('monthly-plan').classList.remove('active');
    document.getElementById('monthly-plan').style.display = 'none';
    document.getElementById('weekly-wrap').style.display = 'block';
  });
  document.getElementById('tab-monthly').addEventListener('click', () => {
    document.getElementById('tab-monthly').classList.add('active');
    document.getElementById('tab-weekly').classList.remove('active');
    document.getElementById('monthly-plan').style.display = 'flex';
    document.getElementById('weekly-wrap').style.display = 'none';
  });

  // Restart
  document.getElementById('restart-btn').addEventListener('click', () => {
    bestTags = [];
    slowTags = [];
    state.selectedBiz = null;
    state.formData = {};
    document.getElementById('data-form').reset();
    document.getElementById('live-profit').textContent = '₹0';
    document.getElementById('live-margin').textContent = '0%';
    document.getElementById('live-breakeven').textContent = '₹0';
    document.getElementById('form-progress').style.width = '0%';
    document.getElementById('progress-pct').textContent = '0%';
    showPage('page-landing');
    window.scrollTo(0, 0);
  });

  // Download Report
  document.getElementById('download-btn').addEventListener('click', () => downloadReport());

  // Resize charts on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const { profit, margin, score, growthRate: gr } = analyzeData(state.formData);
      drawBarChart(state.formData.sales, state.formData.expenses, profit);
      drawCurrentForecast();
    }, 200);
  });
}

/* ── 12. DOWNLOAD REPORT ────────────────────────────────── */
function downloadReport() {
  const biz  = state.selectedBiz;
  const data = state.formData;
  const { profit, margin, score } = analyzeData(data);
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const report = `
=====================================
  GROWTHPILOT AI — BUSINESS REPORT
  ${biz.icon} ${biz.name}
  Generated: ${date}
=====================================

FINANCIAL SUMMARY
─────────────────
Monthly Revenue : ₹${data.sales.toLocaleString('en-IN')}
Monthly Expenses: ₹${data.expenses.toLocaleString('en-IN')}
Net Profit      : ₹${profit.toLocaleString('en-IN')} ${profit < 0 ? '(LOSS)' : ''}
Profit Margin   : ${margin.toFixed(1)}%
Break-even Point: ₹${data.expenses.toLocaleString('en-IN')}

BUSINESS HEALTH SCORE: ${score}/100
${score >= 70 ? '🏆 THRIVING' : score >= 50 ? '⚡ GROWING' : '🔧 NEEDS FOCUS'}

PRODUCTS
─────────
Best-Selling: ${data.bestSellers.length > 0 ? data.bestSellers.join(', ') : 'Not specified'}
Slow-Selling: ${data.slowSellers.length > 0 ? data.slowSellers.join(', ') : 'None'}
Total Products in Stock: ${data.numProducts}
Total Inventory Value  : ₹${data.stockValue.toLocaleString('en-IN')}

MARKETING RECOMMENDATIONS
──────────────────────────
${(MARKETING_IDEAS[biz.id] || MARKETING_IDEAS.other).map((m, i) => `${i + 1}. ${m.name} (${m.channel})\n   ${m.desc}\n   Expected Impact: ${m.impact}`).join('\n\n')}

WEEKLY ACTION PLAN (Top Priorities)
──────────────────────────────────
${WEEKLY_PLAN_TEMPLATE.map(d => `${d.day} — ${d.focus}\n${d.tasks.map(t => `  • ${t}`).join('\n')}`).join('\n\n')}

MONTHLY GROWTH ROADMAP
─────────────────────
${MONTHLY_PLAN_TEMPLATE.map(w => `Week ${w.week}: ${w.title}\n${w.tasks.split('·').map(t => `  • ${t.trim()}`).join('\n')}`).join('\n\n')}

=====================================
  Powered by GrowthPilot AI
  Helping small businesses grow 🚀
=====================================
  `.trim();

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `GrowthPilot_Report_${biz.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── 13. FORM LISTENERS ─────────────────────────────────── */
function initFormListeners() {
  ['monthly-sales', 'monthly-expenses'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateMarginDisplay);
  });
  ['num-products', 'stock-value'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateProgress);
  });

  initTagInput('best-tags-wrap', 'best-input', bestTags, 5);
  initTagInput('slow-tags-wrap', 'slow-input', slowTags, 5);

  document.getElementById('back-to-landing').addEventListener('click', () => {
    showPage('page-landing');
  });
}

/* ── 14. INIT ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  buildBizGrid();
  initFormListeners();

  // Ensure weekly plan is shown by default on dashboard
  const weeklyWrap = document.getElementById('weekly-wrap');
  const monthlyPlan = document.getElementById('monthly-plan');
  if (weeklyWrap)  weeklyWrap.style.display  = 'block';
  if (monthlyPlan) monthlyPlan.style.display  = 'none';
});

