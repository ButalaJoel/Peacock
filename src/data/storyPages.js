// Our Story pages. Everything here comes from the Peacock Paints catalogue (CATALOGUE_2026.pdf).
// The earlier Sustainability, Community and Foundation pages were removed because the catalogue does not support them.
// Add them back when the company supplies approved text.
import { B } from "./theme.js";

export const storyPages = {
  about: {
    title: "About Peacock Paints",
    subtitle: "Protect. Preserve. Prolong.",
    hg: "linear-gradient(135deg, " + B.coral + "ee, " + B.coralDk + ")",
    sections: [
      { t: "Who we are", i: "globe", c: "Peacock Paints Limited is a proudly East African paint manufacturing company committed to delivering innovative, affordable and high-quality coating solutions that beautify and protect surfaces in homes, industries and institutions.\n\nBuilt on a legacy of research, durability and customer trust, we continue to redefine paint experiences across the region through consistent standards and product performance." },
      { t: "History", i: "heart", c: "Peacock Paints Limited was founded in August 1988 and began operations at Plot 95, Sixth Street, Industrial Area, Kampala. In January 1997, the company relocated to its current premises at Plot 56, Sixth Street, Industrial Area.\n\nWe were established at a time when most paint products on the Ugandan market were imported from Kenya. As the nation emerged from a period of political and economic challenges, demand grew for reliable, locally manufactured paint solutions. Peacock Paints was created to meet that need, providing quality coatings designed for local conditions and customer expectations." },
      { t: "What we make", i: "palette", c: "A full range of Decorative, Industrial and Wood Care coatings, supported by compatible primers, sealers, construction chemicals, custom coatings and painting accessories, from surface preparation to final finish." },
      { t: "Awards and recognition", i: "users", c: "Best exhibitor at UGITF in 2007, 2008 and 2011.\n\nBest Paint at KACITA 2009/10.\n\nBest overall exhibitor at PEWOSA.\n\nTop 100 Mid Sized Companies, 2017." },
    ],
    stats: [],
  },
  vision: {
    title: "Vision, Mission and Values",
    subtitle: "What guides Peacock Paints",
    hg: "linear-gradient(135deg, " + B.teal + "ee, " + B.tealDk + ")",
    sections: [
      { t: "Vision", i: "globe", c: "To be a leading paint and coatings manufacturer in the East African region." },
      { t: "Mission", i: "heart", c: "We focus on customer satisfaction by applying relevant product expertise to deliver high quality, standardized products at competitively affordable prices." },
      { t: "Core values", i: "users", c: "Excellence\n\nTeamwork\n\nIntegrity\n\nHonesty" },
    ],
    stats: [{ n: "Excellence", l: "Core value" }, { n: "Teamwork", l: "Core value" }, { n: "Integrity", l: "Core value" }, { n: "Honesty", l: "Core value" }],
  },
  "why-peacock": {
    title: "Why choose Peacock Paints?",
    subtitle: "Protect. Preserve. Prolong.",
    hg: "linear-gradient(135deg, " + B.gold + "ee, #C89820)",
    sections: [
      { t: "Locally manufactured excellence", i: "globe", c: "Proudly made in Uganda to world-class standards, our products are formulated to perform in tropical conditions, resisting heavy rainfall, intense sunlight, humidity and everyday wear." },
      { t: "Complete paint system solutions", i: "palette", c: "A full range of Decorative, Industrial and Wood Care coatings supported by compatible primers, sealers, construction chemicals and project accessories, from surface preparation to final finish." },
      { t: "Customer-focused support", i: "users", c: "From colour selection and substrate preparation to on-site technical guidance, our expert team supports you at every stage to help you achieve impeccable finishes." },
      { t: "Technology-driven formulas", i: "leaf", c: "We use advanced colour pigments, eco-conscious binders and durable resin technology to deliver rich colour, long-lasting performance and environmentally responsible coatings." },
      { t: "Trusted across East Africa", i: "heart", c: "Specified by professionals and institutions across the region, including homes, hotels, factories, schools, hospitals and public buildings. Peacock Paints is known for reliability, value and outstanding performance." },
      { t: "More than colour", i: "truck", c: "We help you protect your investment, elevate spaces and create lasting impressions, because every surface deserves a finish that works as hard as you do." },
    ],
    stats: [{ n: "30+", l: "Years of coatings" }, { n: "5", l: "Colour systems" }, { n: "3", l: "Product ranges" }, { n: "Uganda", l: "Made in" }],
  },
};
