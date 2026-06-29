const assets = {
  hero: "assets/hero-metal-yard.png",
  facility: "assets/facility-overview.png",
  copper: "assets/material-copper.png",
  aluminum: "assets/material-aluminum.png",
  electronics: "assets/electronics-recycling.png"
};

const services = [
  {
    slug: "scrap-metal-purchasing",
    title: "Scrap Metal Purchasing",
    summary: "Transparent buying for non-ferrous and ferrous metals with fast payment and calibrated weighing.",
    image: assets.copper,
    bullets: ["Walk-in and scheduled pickups", "Grade sorting and pricing support", "Commercial volume programs"]
  },
  {
    slug: "industrial-recycling",
    title: "Industrial Recycling",
    summary: "Recurring recovery programs for production scrap, obsolete inventory, and plant maintenance streams.",
    image: assets.facility,
    bullets: ["On-site assessment", "Material flow reporting", "Dedicated account management"]
  },
  {
    slug: "factory-cleanouts",
    title: "Factory Cleanouts",
    summary: "Organized removal of machinery, racking, cables, metals, and surplus assets from active or closed facilities.",
    image: assets.hero,
    bullets: ["Shift-sensitive scheduling", "Segregated recovery", "Documentation packages"]
  },
  {
    slug: "demolition-dismantling",
    title: "Demolition & Dismantling",
    summary: "Safe dismantling support for equipment, steel structures, production lines, and utility systems.",
    image: assets.facility,
    bullets: ["Site method statements", "Torching and rigging coordination", "Scrap rebate management"]
  },
  {
    slug: "container-logistics-services",
    title: "Container & Logistics Services",
    summary: "Roll-off bins, cages, pallets, and transport planning for clean material separation at source.",
    image: assets.aluminum,
    bullets: ["Container placement", "Pickup scheduling", "Export-ready packing"]
  },
  {
    slug: "international-metal-trading",
    title: "International Metal Trading",
    summary: "Export channels for inspected, packed, and documented metal commodities.",
    image: assets.electronics,
    bullets: ["Quality control", "Container loading", "Documentation and customs coordination"]
  }
];

const materials = [
  { slug: "copper", title: "Copper", image: assets.copper, forms: ["Bare bright wire", "Bus bars", "Copper pipe", "Armored cable"], process: "Sorted by purity, stripped when practical, weighed, documented, and prepared for smelting or export." },
  { slug: "aluminum", title: "Aluminum", image: assets.aluminum, forms: ["Profiles", "Sheets", "Cast aluminum", "Wheels"], process: "Separated by alloy family, checked for attachments, compacted, and routed to domestic or export buyers." },
  { slug: "brass", title: "Brass", image: assets.copper, forms: ["Valves", "Fittings", "Turnings", "Radiators"], process: "Inspected for mixed metals, cleaned where needed, then consolidated into recoverable brass grades." },
  { slug: "stainless-steel", title: "Stainless Steel", image: assets.facility, forms: ["304", "316", "Sheet", "Tanks"], process: "Identified by grade, separated from carbon steel, and processed for mills and alloy refiners." },
  { slug: "nickel-alloys", title: "Nickel Alloys", image: assets.aluminum, forms: ["Inconel", "Monel", "Hastelloy", "High-temp alloys"], process: "Verified with analytical tools and managed as high-value specialty material." },
  { slug: "lead", title: "Lead", image: assets.facility, forms: ["Sheets", "Weights", "Cable lead", "Industrial scrap"], process: "Handled with strict containment, documentation, and approved downstream recovery partners." },
  { slug: "iron-steel", title: "Iron & Steel", image: assets.hero, forms: ["Structural steel", "Machinery", "Plate", "Turnings"], process: "Cut, sheared, sorted, and loaded for steel mills and export streams." },
  { slug: "cables-motors", title: "Cables & Motors", image: assets.copper, forms: ["Insulated cable", "Electric motors", "Transformers", "Harnesses"], process: "Recovered through grading, dismantling, and separation of copper, steel, and insulation fractions." },
  { slug: "electronic-waste", title: "Electronic Waste", image: assets.electronics, forms: ["Boards", "Servers", "Power supplies", "Telecom equipment"], process: "Asset streams are sorted, depolluted, and sent to compliant downstream processors." }
];

const industries = ["Manufacturing", "Electronics", "Construction", "Telecommunications", "Automotive", "Defense & Aerospace"];

const news = [
  ["Copper market updates", "How volatility in copper demand affects scrap planning and contract timing."],
  ["Recycling tips", "Practical steps for cleaner scrap segregation and higher recovery value."],
  ["Sustainability news", "Why industrial recycling is becoming a measurable ESG contributor."],
  ["Industry developments", "Export quality expectations and documentation trends for metal commodities."]
];

function cardGrid(items, type) {
  return `<div class="grid three">${items.map(item => `
    <article class="card ${type}-card">
      <img class="card-image" src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.summary || item.process}</p>
      <a class="arrow-link" href="#${type === "service" ? "services" : "materials"}/${item.slug}">View details</a>
    </article>
  `).join("")}</div>`;
}

function pricesPreview() {
  return `
    <section class="band">
      <div class="section">
        <div class="section-head">
          <div><span class="eyebrow">Market pricing</span><h2>Metal prices API</h2></div>
        <p>Track indicative market values for common recyclable metals. Prices are cached locally and refreshed about every 8 hours.</p>
        </div>
        <div class="price-ticker" data-price-preview>
          <article class="price-card skeleton"><span>Loading</span><strong>Metal prices</strong><small>Checking API</small></article>
        </div>
        <div class="button-row"><a class="btn primary" href="#prices">View Price Board</a><a class="btn secondary" href="#contact">Request Fixed Quote</a></div>
      </div>
    </section>`;
}

function renderHome() {
  return `
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">Industrial metal recovery</span>
        <h1>Leaders in Metal Recycling Since 1983</h1>
        <p>IR Metals helps factories, contractors, telecom operators, and exporters recover more value from scrap through accurate grading, modern logistics, and compliant recycling.</p>
        <div class="actions">
          <a class="btn primary" href="#contact">Request a Quote</a>
          <a class="btn secondary" href="#materials">Sell Scrap</a>
          <a class="btn ghost" href="#contact">Contact Us</a>
        </div>
        <div class="hero-strip">
          <div class="hero-stat"><strong>43+</strong><span>Years in business</span></div>
          <div class="hero-stat"><strong>75k</strong><span>Tons processed annually</span></div>
          <div class="hero-stat"><strong>12</strong><span>Industries served</span></div>
          <div class="hero-stat"><strong>18</strong><span>Countries exported to</span></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div><span class="eyebrow">Services</span><h2>From shop-floor bins to export loads</h2></div>
        <p>Programs are built around the material stream, site constraints, safety needs, and market destination.</p>
      </div>
      ${cardGrid(services.slice(0, 5), "service")}
    </section>
    ${pricesPreview()}
    <section class="band">
      <div class="section split">
        <div class="copy">
          <span class="eyebrow">Materials we buy</span>
          <h2>Non-ferrous, ferrous, cables, motors, and electronic scrap</h2>
          <p>Each load is graded, weighed, and documented clearly so suppliers can understand the value of their material and improve separation at source.</p>
          <ul class="pill-list">${materials.slice(0, 9).map(m => `<li>${m.title}</li>`).join("")}</ul>
        </div>
        <img src="${assets.copper}" alt="Sorted copper and mixed recyclable metal">
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div><span class="eyebrow">Why choose us</span><h2>Reliable, precise, compliant</h2></div>
      </div>
      <div class="grid four">
        ${["Fast payments", "Accurate weighing", "Environmental compliance", "Modern equipment"].map((item, index) => `
          <article class="card ${index === 1 ? "dark" : ""}">
            <h3>${item}</h3>
            <p>${["Clear settlement workflows and responsive commercial support.", "Calibrated scales, organized receiving lanes, and transparent paperwork.", "Documented procedures for safe handling and approved downstream partners.", "Processing equipment, containers, and sorting tools matched to industrial volumes."][index]}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="band">
      <div class="section">
        <div class="section-head">
          <div><span class="eyebrow">Customers</span><h2>Built for industrial suppliers</h2></div>
        </div>
        <div class="grid three">${industries.slice(0, 6).map(i => `<article class="card"><h3>${i}</h3><p>Dedicated recycling streams for ${i.toLowerCase()} operations, maintenance teams, and project managers.</p></article>`).join("")}</div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><span class="eyebrow">Latest news</span><h2>Market and recycling insights</h2></div><a class="arrow-link" href="#news">All articles</a></div>
      <div class="grid four">${news.map((n, i) => `<article class="card article"><time>2026-0${i + 2}-15</time><h3>${n[0]}</h3><p>${n[1]}</p></article>`).join("")}</div>
    </section>
  `;
}

function pageHero(title, text) {
  return `<section class="page-hero"><div class="page"><span class="eyebrow">IR Metals</span><h1>${title}</h1><p>${text}</p></div></section>`;
}

function renderAbout() {
  return `${pageHero("About Us", "A family-grown recycling company focused on safety, reliability, and long-term supplier relationships.")}
    <section class="page split">
      <div>
        <span class="eyebrow">Company history</span>
        <h2>Four decades of industrial recycling</h2>
        <div class="timeline">
          <div class="timeline-item"><strong>1983</strong><p>IR Metals begins as a local buyer serving workshops and small factories.</p></div>
          <div class="timeline-item"><strong>1998</strong><p>Container services and commercial collection routes expand across industrial zones.</p></div>
          <div class="timeline-item"><strong>2012</strong><p>Export and trading capabilities are added for prepared non-ferrous grades.</p></div>
          <div class="timeline-item"><strong>Today</strong><p>The company supports complex cleanouts, recurring recycling programs, and international shipments.</p></div>
        </div>
      </div>
      <img src="${assets.facility}" alt="IR Metals facility overview">
    </section>
    <section class="band"><div class="section grid three">
      <article class="card"><h3>Management team</h3><p>Experienced operations, logistics, commercial, and compliance leaders coordinate each program from quote to settlement.</p></article>
      <article class="card"><h3>Mission & values</h3><p>Recover maximum value from materials while keeping suppliers informed, safe, and compliant.</p></article>
      <article class="card"><h3>Safety commitment</h3><p>Site procedures, risk reviews, equipment checks, and contractor coordination are part of every serious project.</p></article>
    </div></section>`;
}

function renderServices(slug) {
  if (slug) return renderDetail("Services", services, slug, "Service program", item => item.bullets);
  return `${pageHero("Services", "Industrial recycling programs for purchasing, cleanouts, dismantling, logistics, and international trading.")}
    <section class="page">${cardGrid(services, "service")}</section>`;
}

function renderMaterials(slug) {
  if (slug) return renderDetail("Materials", materials, slug, "Accepted forms", item => item.forms, true);
  return `${pageHero("Materials We Recycle", "Copper, aluminum, brass, stainless steel, alloys, lead, iron, cables, motors, and electronic waste.")}
    <section class="page">${cardGrid(materials, "material")}</section>`;
}

function renderDetail(group, list, slug, listTitle, listFactory, materialMode = false) {
  const item = list.find(entry => entry.slug === slug) || list[0];
  const base = group.toLowerCase();
  return `${pageHero(item.title, materialMode ? item.process : item.summary)}
    <section class="page detail-layout">
      <nav class="side-nav" aria-label="${group} navigation">
        ${list.map(entry => `<a class="${entry.slug === item.slug ? "active" : ""}" href="#${base}/${entry.slug}">${entry.title}</a>`).join("")}
      </nav>
      <article>
        <img class="detail-media" src="${item.image}" alt="${item.title}">
        <span class="eyebrow">${listTitle}</span>
        <h2>${item.title}</h2>
        <p>${materialMode ? item.process : item.summary}</p>
        <ul class="check-list">${listFactory(item).map(v => `<li>${v}</li>`).join("")}</ul>
        ${materialMode ? `<h3>Recycling process</h3><p>${item.process}</p>` : `<h3>How it works</h3><p>IR Metals assesses the stream, recommends containers or handling methods, schedules removal, grades the material, and provides settlement documentation.</p>`}
        <div class="button-row"><a class="btn primary" href="#contact">Request a Quote</a><a class="btn secondary" href="#contact">Schedule Pickup</a></div>
      </article>
    </section>`;
}

function renderIndustries() {
  return `${pageHero("Industries", "Recycling services for production sites, infrastructure projects, telecom networks, construction crews, and technical industries.")}
    <section class="page grid three">${industries.map(i => `<article class="card"><h3>${i}</h3><p>Custom sorting, pickup, reporting, and recovery flows for ${i.toLowerCase()} material streams.</p></article>`).join("")}</section>`;
}

function renderSustainability() {
  return `${pageHero("Sustainability", "Metal recycling reduces landfill pressure, preserves mined resources, and supports measurable ESG performance.")}
    <section class="page">
      <div class="kpi-grid">
        <div class="kpi"><strong>52k</strong><span>Estimated CO2 tons avoided</span></div>
        <div class="kpi"><strong>96%</strong><span>Recovered material utilization</span></div>
        <div class="kpi"><strong>100%</strong><span>Documented downstream partners</span></div>
        <div class="kpi"><strong>24/7</strong><span>Environmental controls mindset</span></div>
      </div>
      <div class="grid three" style="margin-top:24px">
        <article class="card"><h3>Environmental impact</h3><p>Cleaner separation and high recovery rates help suppliers reduce waste and improve resource efficiency.</p></article>
        <article class="card"><h3>Compliance & permits</h3><p>Material handling, storage, transport, and downstream processing are managed with documented compliance expectations.</p></article>
        <article class="card"><h3>ESG initiatives</h3><p>Supplier reports can support sustainability tracking, internal dashboards, and customer disclosures.</p></article>
      </div>
    </section>`;
}

function renderCertifications() {
  return `${pageHero("Certifications", "Documentation, permits, memberships, and quality standards that support responsible recycling.")}
    <section class="page grid four">
      ${["ISO certificates", "Government permits", "Industry memberships", "Quality standards"].map((title, i) => `<article class="card"><h3>${title}</h3><p>${["ISO-aligned management systems for quality, environment, and operational consistency.", "Permits and local approvals maintained for compliant material handling.", "Participation in recycling and metal trade networks.", "Load inspection, grade control, traceability, and supplier documentation."][i]}</p></article>`).join("")}
    </section>`;
}

function renderNews() {
  return `${pageHero("News & Insights", "Market updates, recycling tips, sustainability notes, and industrial scrap developments.")}
    <section class="page grid four">${news.concat(news).map((n, i) => `<article class="card article"><time>2026-${String((i % 6) + 1).padStart(2, "0")}-15</time><h3>${n[0]}</h3><p>${n[1]}</p><a class="arrow-link" href="#news">Read article</a></article>`).join("")}</section>`;
}

function renderPrices() {
  return `${pageHero("Metals Price Board", "Indicative market prices for recyclable metals, ready to connect to a live metals pricing API.")}
    <section class="page">
      <div class="section-head">
        <div><span class="eyebrow">API powered</span><h2>Current reference prices</h2></div>
        <p>These are market references, not final scrap settlement prices. Prices are cached for 8 hours to stay under roughly 100 updates per month per browser.</p>
      </div>
      <div class="price-toolbar">
        <div>
          <strong data-price-source>Loading API</strong>
          <span data-price-updated>Fetching latest prices</span>
        </div>
        <button class="btn primary" type="button" data-refresh-prices>Check Cache</button>
      </div>
      <div class="price-alert" data-price-alert hidden></div>
      <div class="price-table-wrap">
        <table class="price-table">
          <thead>
            <tr>
              <th>Metal</th>
              <th>Symbol</th>
              <th>Reference price</th>
              <th>24h move</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody data-price-table>
            <tr><td colspan="5">Loading metal prices...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="grid three" style="margin-top:24px">
        <article class="card"><h3>Configurable endpoint</h3><p>Set <code>window.IR_METALS_PRICE_API_URL</code> before <code>app.js</code> to connect any JSON endpoint.</p></article>
        <article class="card"><h3>Supported payloads</h3><p>The parser accepts arrays, <code>{ prices: [] }</code>, <code>{ metals: [] }</code>, or simple <code>{ rates: {} }</code> objects.</p></article>
        <article class="card"><h3>Update limit</h3><p>The frontend cache refreshes after 8 hours, which equals about 90 live updates per month per browser.</p></article>
      </div>
    </section>`;
}

function renderCareers() {
  return `${pageHero("Careers", "Join a practical, safety-focused team moving essential materials back into productive use.")}
    <section class="page split">
      <div>
        <span class="eyebrow">Open positions</span>
        <h2>Current opportunities</h2>
        <ul class="check-list">
          <li>Yard Operations Coordinator</li>
          <li>Commercial Account Manager</li>
          <li>Truck Driver</li>
          <li>Safety & Compliance Assistant</li>
        </ul>
        <h3>Benefits</h3>
        <p>Stable work, practical training, safety equipment, growth paths, and a team that values reliability.</p>
      </div>
      ${applicationForm()}
    </section>`;
}

function applicationForm() {
  return `<form class="card form">
    <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name"></label>
    <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email"></label>
    <label class="field"><span>Position</span><select name="position"><option>Yard Operations Coordinator</option><option>Commercial Account Manager</option><option>Truck Driver</option><option>Safety & Compliance Assistant</option></select></label>
    <label class="field"><span>Message</span><textarea name="message"></textarea></label>
    <button class="btn primary" type="submit">Submit Application</button>
  </form>`;
}

function contactForm() {
  return `<form class="card form">
    <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name"></label>
    <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email"></label>
    <label class="field"><span>Phone</span><input type="tel" name="phone" autocomplete="tel"></label>
    <label class="field"><span>Material or service</span><input type="text" name="subject"></label>
    <label class="field"><span>Message</span><textarea name="message"></textarea></label>
    <button class="btn primary" type="submit">Send Message</button>
  </form>`;
}

function renderContact() {
  return `${pageHero("Contact", "Tell us what material you have, where it is located, and when it needs to move.")}
    <section class="page split">
      <div>
        <div class="map" aria-label="Interactive map placeholder"><div class="map-pin"><span>IR</span></div></div>
        <div class="grid three" style="margin-top:18px">
          <article class="card"><h3>Phone</h3><p>+972 54 422 2337</p></article>
          <article class="card"><h3>Email</h3><p>doron@irmetals.com</p></article>
          <article class="card"><h3>WhatsApp</h3><p>Fast quote photos and pickup requests.</p></article>
        </div>
      </div>
      ${contactForm()}
    </section>`;
}

const routes = {
  home: renderHome,
  about: renderAbout,
  services: renderServices,
  materials: renderMaterials,
  industries: renderIndustries,
  sustainability: renderSustainability,
  certifications: renderCertifications,
  news: renderNews,
  prices: renderPrices,
  careers: renderCareers,
  contact: renderContact
};

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Request quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: number >= 100 ? 0 : 2
  }).format(number);
}

function formatUpdatedAt(value) {
  if (!value || value === "Demo data" || value === "Live API") return value || "Unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderPriceRows(prices) {
  return prices.map(item => {
    const change = Number(item.change || 0);
    const changeClass = change >= 0 ? "up" : "down";
    const changePrefix = change > 0 ? "+" : "";
    return `
      <tr>
        <td><strong>${item.name || item.symbol}</strong></td>
        <td>${item.symbol || "-"}</td>
        <td>${formatPrice(item.price)}</td>
        <td><span class="price-change ${changeClass}">${changePrefix}${change.toFixed(2)}%</span></td>
        <td>${item.unit || "USD / metric ton"}</td>
      </tr>`;
  }).join("");
}

function renderPriceCards(prices) {
  return prices.slice(0, 4).map(item => {
    const change = Number(item.change || 0);
    const changeClass = change >= 0 ? "up" : "down";
    const changePrefix = change > 0 ? "+" : "";
    return `
      <article class="price-card">
        <span>${item.symbol || "MTL"}</span>
        <strong>${formatPrice(item.price)}</strong>
        <small>${item.name || "Metal"} <b class="${changeClass}">${changePrefix}${change.toFixed(2)}%</b></small>
      </article>`;
  }).join("");
}

async function hydratePrices() {
  const table = document.querySelector("[data-price-table]");
  const preview = document.querySelector("[data-price-preview]");
  const source = document.querySelector("[data-price-source]");
  const updated = document.querySelector("[data-price-updated]");
  const alert = document.querySelector("[data-price-alert]");

  if (!table && !preview) return;

  try {
    const data = await fetchMetalPrices();
    if (table) table.innerHTML = renderPriceRows(data.prices);
    if (preview) preview.innerHTML = renderPriceCards(data.prices);
    if (source) source.textContent = data.source === "demo" ? "Demo price feed" : data.source === "cached-live" ? "Cached live feed" : "Live price feed";
    if (updated) updated.textContent = `${data.source === "cached-live" ? "Cached from" : "Updated"} ${formatUpdatedAt(data.updatedAt)}`;
    if (alert) {
      alert.hidden = data.source !== "demo";
      alert.textContent = "Demo prices are shown because no live API endpoint is configured yet.";
    }
  } catch (error) {
    if (table) table.innerHTML = renderPriceRows(IR_METALS_DEMO_PRICES);
    if (preview) preview.innerHTML = renderPriceCards(IR_METALS_DEMO_PRICES);
    if (source) source.textContent = "Demo fallback feed";
    if (updated) updated.textContent = "Live API unavailable";
    if (alert) {
      alert.hidden = false;
      alert.textContent = `${error.message}. Showing demo reference prices.`;
    }
  }
}

function render() {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  const [route, slug] = hash.split("/");
  const app = document.getElementById("app");
  const renderer = routes[route] || routes.home;
  app.innerHTML = renderer(slug);
  document.querySelectorAll(".site-nav a").forEach(link => {
    const target = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", target === route || (route === "home" && target === "home"));
  });
  document.querySelector(".site-nav").classList.remove("open");
  document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
  hydratePrices();
}

document.querySelector(".nav-toggle").addEventListener("click", event => {
  const nav = document.querySelector(".site-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const button = event.target.querySelector("button[type='submit']");
  if (button) {
    button.textContent = "Sent";
    button.disabled = true;
  }
});

document.addEventListener("click", event => {
  if (event.target.closest("[data-refresh-prices]")) {
    hydratePrices();
  }
});

window.addEventListener("hashchange", render);
render();
