// Paint Advisor logic. Every product fact comes from the catalogue data (products.catalogue.js).
// No AI model and no invented facts: it matches words in the question to catalogue text and quotes the catalogue.
// It never gives prices, health or safety advice, or promises about delivery. Those go to the team.

const has = (text, re) => re.test(text);
const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9+ ]+/g, " ").replace(/\s+/g, " ").trim();
const GENERIC = new Set(["paint", "paints", "coating", "coatings", "the", "and", "for", "with", "a", "of", "plus", "premium", "standard", "super", "emulsion", "enamel", "primer", "sealer", "varnish", "thinner", "gloss", "matt"]);

const sub = (p, id) => (p.subcategories || []).includes(id);
// kind "listed": the catalogue lists the product under that category. kind "mention": the catalogue text mentions it.
export const SURFACES = {
  interior: { label: "interior walls", kind: "listed", test: p => sub(p, "interior") && !sub(p, "primers") },
  exterior: { label: "exterior walls", kind: "listed", test: p => sub(p, "exterior") && !sub(p, "primers") },
  rain: { label: "rain and weather resistance", kind: "mention", re: /\b(rain|rainfall|weather\w*)/g },
  wood: { label: "wood", kind: "mention", re: /\bwood\w*/g, bonus: p => (p.category === "woodcare" ? 10 : 0) },
  metal: { label: "metal", kind: "mention", re: /\b(metal\w*|steel|iron)\b/g },
  concrete: { label: "concrete", kind: "mention", re: /\bconcrete\b/g },
  floor: { label: "floors", kind: "mention", re: /\bfloor\w*/g },
  plaster: { label: "plaster", kind: "mention", re: /\bplaster\w*/g },
  waterproof: { label: "waterproofing and damp", kind: "mention", re: /(waterproof\w*|damp|leak\w*|water repel\w*)/g },
  tiles: { label: "tiles", kind: "mention", re: /\btiles?\b/g },
  ceiling: { label: "ceilings", kind: "mention", re: /ceiling\w*/g },
  fill: { label: "filling cracks", kind: "mention", re: /(crack\w*|filler)/g },
  primer: { label: "primers and sealers", kind: "listed", test: p => sub(p, "primers") || /(primer|sealer)/.test(norm(p.name)) },
  roof: { label: "roofs", kind: "mention", re: /\broof\w*/g },
};
const matchCount = (p, re) => (hay(p).match(re) || []).length;
const NOT_FOR_RECOMMENDING = new Set(["hand-sanitizer"]);
const SURFACE_WORDS = [
  ["rain", /\b(rain|rainy|rainfall|storm|weather ?proof|wet season)\b/],
  ["waterproof", /\b(waterproof|waterproofing|damp|dampness|leak|leaks|leaking|seepage|moisture)\b/],
  ["ceiling", /\bceilings?\b/],
  ["tiles", /\btiles?\b/],
  ["roof", /\broofs?\b/],
  ["floor", /\b(floor|floors|flooring|screed)\b/],
  ["fill", /\b(cracks?|fill|filler|putty|holes?)\b/],
  ["primer", /\b(primer|primers|sealer|sealers|undercoat|base coat)\b/],
  ["plaster", /\b(plaster|plastering|skim|skimming)\b/],
  ["concrete", /\b(concrete|cement)\b/],
  ["metal", /\b(metal|steel|iron|gate|gates|grill|grille)\b/],
  ["wood", /\b(wood|wooden|timber|furniture|door|doors|cabinet|cabinets|varnish)\b/],
  ["exterior", /\b(exterior|outside|outdoor|outdoors|external|facade|fence)\b/],
  ["interior", /\b(interior|inside|indoor|indoors|internal|bedroom|living room|kitchen|bathroom|walls?|room)\b/],
];

function hay(p) { return norm([p.name, p.subtitle, p.desc, p.longDesc].filter(Boolean).join(" ")); }

// Surface words that are also part of product names ("Metal Primer"): the name only counts if the full name is typed.
const COMMON = new Set(["metal", "concrete", "tile", "tiles", "wood", "clear", "plaster", "waterproof", "floor", "ceiling", "roof", "hand", "multi", "surface", "industrial", "cleaner", "road", "marking", "joinery", "glue", "self", "levelling", "high", "temperature", "resistant", "multipurpose"]);
export function findProducts(query, products) {
  const q = " " + norm(query) + " ";
  const scored = [];
  for (const p of products) {
    const name = norm(p.name);
    let score = 0;
    if (q.includes(" " + name + " ")) score = 10;
    else {
      const toks = name.split(" ").filter(t => t.length > 2);
      const distinct = toks.filter(t => !GENERIC.has(t));
      const hitD = distinct.filter(t => q.includes(" " + t + " "));
      const strong = distinct.filter(t => !COMMON.has(t));
      if (distinct.length && hitD.length === distinct.length && strong.length) score = 6 + hitD.length / toks.length;
      else if (distinct.length > 1 && strong.length && strong.every(t => q.includes(" " + t + " "))) score = 3;
    }
    if (score >= 3) scored.push({ p, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

const FACTS = [
  { key: "coverage", re: /\b(cover|covers|coverage|sqm|square met|per litre|how far|spread)\b/, label: "Coverage", get: p => p.coverage },
  { key: "dryTime", re: /\b(dry|drying|dries|recoat|re coat|touch dry|hard dry|wait)\b/, label: "Drying time", get: p => p.dryTime },
  { key: "mixing", re: /\b(mix|mixing|dilute|dilution|ratio|thin|thinning|hardener|water down)\b/, label: "Mixing", get: p => (p.mixing ? p.mixing.label + ": " + p.mixing.value : null) },
  { key: "application", re: /\b(apply|application|brush|roller|spray|use it)\b/, label: "Application", get: p => p.application },
  { key: "packSizes", re: /(\b(size|sizes|pack|packs|tin|tins|bucket|buckets|litre|litres|available in|kg)\b|\b\d+ ?(l|kg|ml)\b)/, label: "Pack sizes", get: p => (p.packSizes && p.packSizes.length ? p.packSizes.join(", ") : null) },
  { key: "colourSystems", re: /\b(colour systems?|colours? available|shades?|ral|ncs|nova|bs ?4800)\b/, label: "Colour systems", get: p => (p.colourSystems && p.colourSystems.length ? p.colourSystems.join(", ") : null) },
  { key: "sheet", re: /\b(data ?sheet|datasheet|technical|tds|pdf|specification|spec)\b/, label: "Data sheet", get: p => p.sheet },
];

const firstSentence = s => { const t = String(s || "").trim(); const i = t.search(/[.!?](\s|$)/); return i > 20 ? t.slice(0, i + 1) : t; };

export function createAdvisor(products, config) {
  const contact = (config && config.contact) || {};
  const byId = Object.fromEntries(products.map(p => [p.id, p]));
  const talk = { type: "page", page: "contact", label: "Talk to our team" };
  const quote = { type: "quote", label: "Request a quote" };
  const out = (text, extra) => Object.assign({ text, products: [], actions: [], chips: [] }, extra || {});

  const recommend = key => {
    const sf = SURFACES[key];
    let list = products.filter(p => !NOT_FOR_RECOMMENDING.has(p.id) && p.category !== "thinners");
    if (sf.test) list = list.filter(sf.test);
    else {
      list = list.map(p => ({ p, n: matchCount(p, sf.re) + (sf.bonus ? sf.bonus(p) : 0) })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).map(x => x.p);
    }
    if (!list.length) return out("The catalogue doesn't list a product for " + sf.label + ". Our team can advise you.", { actions: [talk] });
    const shown = list.slice(0, 4);
    const verb = sf.kind === "listed" ? "are listed for " : "mention ";
    return out(
      "These catalogue products " + verb + sf.label + (list.length > shown.length ? " (showing " + shown.length + " of " + list.length + ")" : "") + ":",
      {
        products: shown.map(p => p.id),
        actions: [{ type: "page", page: "estimator", label: "How much do I need?" }, quote, talk],
        note: "Open a product to compare finishes. For a recommendation for your exact job, our team is happy to help.",
      });
  };

  const factAnswer = (p, wanted) => {
    const lines = wanted.map(f => {
      const v = f.get(p);
      if (!v) return f.label + ": the catalogue doesn't list this for " + p.name + ". Please check the product page or ask our team.";
      return f.label + ": " + v;
    });
    const acts = [{ type: "product", id: p.id, label: "View " + p.name }];
    if (wanted.some(f => f.key === "coverage")) acts.push({ type: "page", page: "estimator", label: "Estimate how much I need" });
    if (wanted.some(f => f.key === "sheet") && p.sheet) acts.unshift({ type: "link", href: p.sheet, label: "Open data sheet (PDF)" });
    acts.push(talk);
    return out(p.name + "\n" + lines.join("\n") + "\n(From the Peacock catalogue.)", { actions: acts });
  };

  function reply(raw) {
    const text = norm(raw);
    if (!text) return out("Ask me about a product, a surface, or how to order.");

    if (/^(hi|hello|hey|good (morning|afternoon|evening)|hallo|hola|yo)\b/.test(text) && text.split(" ").length <= 4) return greeting();
    if (/\b(thanks|thank you|asante|cheers)\b/.test(text)) return out("You're welcome. Ask me anything else about our products.", { actions: [quote] });
    if (/\b(human|person|agent|someone|staff|call you|phone|speak to|talk to|representative|sales)\b/.test(text)) return out("Our team will gladly help. You can reach us here:", { actions: [talk, { type: "whatsapp", label: "Chat on WhatsApp" }] });
    if (/\b(price|prices|cost|costs|cheap|cheaper|expensive|discount|how much (is|are|does|do)|rate|rates)\b/.test(text) && !/how much (paint|product|do i need|will i need)/.test(text))
      return out("We don't show prices on the website. Add the products you want to your list and request a quote. Our sales desk replies with your quotation.", { actions: [quote, { type: "page", page: "decorative-paints", label: "Browse products" }, talk] });
    if (/\b(safe|safety|toxic|toxicity|harmful|voc|fumes?|smell|odour|odor|pregnan|baby|children|child|pets?|allerg\w*|ingredients?|flammable|hazard|health|skin|swallow)\b/.test(text))
      return out("I can't advise on health or safety. Please read the product data sheet and the label, and ask our technical team about your situation.", { actions: [talk, { type: "whatsapp", label: "Chat on WhatsApp" }] });
    if (/\b(order|buy|purchase|checkout|check out|how do i get|pay|payment)\b/.test(text))
      return out("There is no online checkout. Add products to your list, then request a quote. You send it to our sales desk by WhatsApp or email, and they reply with your quotation.", { actions: [quote, { type: "page", page: "decorative-paints", label: "Browse products" }] });
    if (/\bsamples?\b/.test(text)) return out("You can add colour sample pots to your request. Samples let you see the real colour in your own light.", { actions: [{ type: "page", page: "all-colours", label: "Choose colours" }, quote] });
    const biz = (config && config.business) || {};
    if (/\b(open|opens|opening|hours|close|closes|closing|closed|saturday|sunday|weekend|weekday|weekdays|what time)\b/.test(text) && biz.hours)
      return out("Our opening hours:\n" + biz.hours.map(h => h.days + ": " + h.time).join("\n"), { actions: [talk, { type: "whatsapp", label: "Chat on WhatsApp" }] });
    if (/\b(delivery|deliver|delivers|delivered|shipping|transport)\b/.test(text) && biz.delivery)
      return out(biz.delivery + " For anything else about delivery, please ask our team.", { actions: [quote, talk, { type: "whatsapp", label: "Chat on WhatsApp" }] });
    if (/\b(stockist|stockists|where (can i|do i|to) (buy|find|get)|shop|store|branch|location|address|visit|office|where are you)\b/.test(text)) {
      const where = contact.address ? "Our address: " + contact.address + ". " : "";
      return out(where + "For opening hours or delivery, just ask me, or contact our team.", { actions: [talk, { type: "whatsapp", label: "Chat on WhatsApp" }] });
    }
    if (/\b(distributor|distribution|dealer|reseller|wholesale|stock your)\b/.test(text)) return out("We welcome distributor enquiries.", { actions: [{ type: "page", page: "distributor", label: "Become a Distributor" }, talk] });

    const named = findProducts(raw, products);
    const wanted = FACTS.filter(f => f.re.test(text));
    if (named.length) {
      const top = named[0];
      if (named.length > 1 && top.score < 10) {
        return out("Did you mean one of these?", { products: named.slice(0, 4).map(t => t.p.id), actions: [talk] });
      }
      if (wanted.length) return factAnswer(top.p, wanted);
      return out(top.p.name + (firstSentence(top.p.desc) ? ": " + firstSentence(top.p.desc) : ": see the product page for details."), { products: [top.p.id], actions: [{ type: "page", page: "estimator", label: "How much do I need?" }, quote] });
    }

    if (/\b(how (much|many)|litres? (do|will)|tins?|buckets?|quantity|calculate|estimate|estimator|enough paint)\b/.test(text))
      return out("Use the paint estimator to work out how much you need. It uses the coverage listed in our catalogue.", { actions: [{ type: "page", page: "estimator", label: "Open the estimator" }, quote] });

    if (/\b(colou?rs?|shade|shades|match|matching|ral|ncs|nova|bs ?4800|swatch|palette)\b/.test(text))
      return out("To choose a colour, try our colour picker with a photo, browse the Peacock colours, or see the colour systems we work with. We can also match NCS, BS 4800, NOVA and RAL, so please ask our team about your project. Order a sample to see the real colour in your own light.", { actions: [{ type: "page", page: "colour-picker", label: "Find a colour from a photo" }, { type: "page", page: "all-colours", label: "Browse colours" }, { type: "page", page: "colour-systems", label: "Colour systems" }, talk] });

    for (const [key, re] of SURFACE_WORDS) if (re.test(text)) return recommend(key);

    const toks = text.split(" ").filter(t => t.length > 3 && !GENERIC.has(t));
    const hits = products.map(p => ({ p, n: toks.filter(t => (" " + hay(p) + " ").includes(" " + t + " ")).length })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
    if (hits.length && hits[0].n >= 1 && toks.length) return out("The closest products I found in the catalogue:", { products: hits.map(h => h.p.id), actions: [talk] });
    return out("I can only answer from the Peacock catalogue, and I couldn't find that. Try choosing a surface below, or ask our team.", { actions: [talk, { type: "whatsapp", label: "Chat on WhatsApp" }], chips: START_CHIPS });
  }

  function greeting() {
    return out("Hello, I'm the Paint Advisor. I answer from the Peacock Paints catalogue. I can suggest products for a surface, give coverage, drying times and mixing details, tell you our opening hours and delivery, and point you to the quote form. I can't give prices. You can type or use the microphone.", { chips: START_CHIPS });
  }
  return { reply, greeting, byId, recommend };
}

export const START_CHIPS = [
  "Opening hours",
  "Do you deliver?",
"Paint for interior walls", "Paint for exterior walls", "Something for rainy weather", "Paint for wood", "Paint for metal", "Waterproofing", "How do I order?", "Help choosing a colour"];
