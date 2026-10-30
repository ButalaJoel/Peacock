// Product data generated from CATALOGUE_2026.pdf (the company catalogue is the source of truth).
// No prices anywhere: orders go through quotation requests.
// Wording, coverage, drying times and mixing ratios come straight from the catalogue.
// Images and product sheets are attached in products.js (from productImages.js / productSheets.js).

export const CATEGORIES = {
  "decorative": {
    "label": "Decorative Paints",
    "slug": "decorative-paints",
    "tagline": "Transforming spaces with color",
    "subcategories": [
      {
        "id": "interior",
        "label": "Interior"
      },
      {
        "id": "exterior",
        "label": "Exterior"
      },
      {
        "id": "primers",
        "label": "Primers"
      }
    ]
  },
  "industrial": {
    "label": "Industrial Coatings",
    "slug": "industrial-coatings",
    "tagline": "Engineered for durability and extreme performance",
    "subcategories": [
      {
        "id": "general",
        "label": "General Coatings"
      },
      {
        "id": "waterproofing",
        "label": "Waterproofing & Construction"
      },
      {
        "id": "other",
        "label": "Other"
      }
    ]
  },
  "woodcare": {
    "label": "Wood Care Paints",
    "slug": "wood-care-paints",
    "tagline": "Protecting and enhancing the beauty of wood",
    "subcategories": []
  },
  "thinners": {
    "label": "Thinners & Solvents",
    "slug": "thinners-solvents",
    "tagline": "Essential solvents for every project",
    "subcategories": []
  }
};

export const PRODUCTS = [
  {
    "id": "vinyl-silk-makula",
    "name": "Vinyl Silk Makula",
    "category": "decorative",
    "subcategories": [
      "interior"
    ],
    "desc": "A premium water based paint with a mid sheen, washable and abrasion resistant finish ideal for interiors.",
    "longDesc": "A premium water based paint with a mid sheen, washable and abrasion resistant finish ideal for interiors.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "1L/10-12 Sqm",
    "dryTime": "15-30 Minutes Touch dry. 1 hour Hard dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/10-12 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/10-12 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/10-12 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 16
    }
  },
  {
    "id": "weathershield-plus",
    "name": "Weathershield Plus",
    "category": "decorative",
    "subcategories": [
      "exterior"
    ],
    "desc": "A durable emulsion made with quality materials, resistant to heavy rainfall, sunlight, fungi and algae with excellent washability and high scrub resistance for exterior application.",
    "longDesc": "A durable emulsion made with quality materials, resistant to heavy rainfall, sunlight, fungi and algae with excellent washability and high scrub resistance for exterior application.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "1L/12 Sqm",
    "dryTime": "30-45 Minutes Touch dry. 60-90 Minutes Hard dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/12 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/12 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/12 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 17
    }
  },
  {
    "id": "premium-matt",
    "name": "Premium Matt",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "A high-performance, durable, washable matt emulsion for interior and exterior walls.",
    "longDesc": "A high-performance, durable, washable matt emulsion for interior and exterior walls. Ideal for high-traffic areas and moisture-prone areas. It resists stains, repels water and allows easy cleaning.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "1L/10 Sqm",
    "dryTime": "30-45 Minutes Touch dry. 60-90 Minutes Hard dry",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/10 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/10 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/10 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 18
    }
  },
  {
    "id": "undercoat-emulsion",
    "name": "Undercoat Emulsion",
    "category": "decorative",
    "subcategories": [
      "primers"
    ],
    "desc": "An interior wall primer designed for use on new plaster, previously painted walls and certain wooden surfaces.",
    "longDesc": "An interior wall primer designed for use on new plaster, previously painted walls and certain wooden surfaces.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller, brush or spray",
    "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster",
    "dryTime": "2 Hours Touch dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster"
      },
      {
        "size": "20L",
        "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 19
    }
  },
  {
    "id": "flat-emulsion",
    "name": "Flat Emulsion",
    "category": "decorative",
    "subcategories": [
      "interior"
    ],
    "desc": "A budget top coat paint that is designed for interior application to new plaster, old painted walls and some ceilings.",
    "longDesc": "A budget top coat paint that is designed for interior application to new plaster, old painted walls and some ceilings.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster, 1L/1-1.5 Sqm on roughcasts.",
    "dryTime": "20 Minutes Touch dry. 2 Hours Through dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster, 1L/1-1.5 Sqm on roughcasts."
      },
      {
        "size": "20L",
        "coverage": "1L/2-3 Sqm on fresh smooth wall screed plaster, 1L/1-1.5 Sqm on roughcasts."
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 20
    }
  },
  {
    "id": "super-matt-emulsion",
    "name": "Super Matt Emulsion",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "An acrylic emulsion with a matt finish, formulated for application on interior and exterior ceiling areas.",
    "longDesc": "An acrylic emulsion with a matt finish, formulated for application on interior and exterior ceiling areas. It can be used on surfaces of wood and cement plaster.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush, allow one hour of drying time between coats.",
    "coverage": "1L/8-10 Sqm",
    "dryTime": "15-30 Minutes Touch dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/8-10 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/8-10 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/8-10 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 21
    }
  },
  {
    "id": "floxy-tile-coating",
    "name": "Floxy Tile Coating",
    "category": "decorative",
    "subcategories": [
      "exterior"
    ],
    "desc": "A latex-based exterior emulsion with excellent coverage, water repellence, strong adhesion, and high scrub resistance.",
    "longDesc": "A latex-based exterior emulsion with excellent coverage, water repellence, strong adhesion, and high scrub resistance. Formulated for clay/concrete tiles, asbestos, and iron sheets, it contains unique ingredients that resist algae and fungi growth, ensuring long-lasting weather protection.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush.",
    "coverage": "1L/4 Sqm (1 coat)",
    "dryTime": "30 Minutes Touch dry. 2 Hours hard dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/4 Sqm (1 coat)"
      },
      {
        "size": "20L",
        "coverage": "1L/4 Sqm (1 coat)"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 22
    }
  },
  {
    "id": "undercoat-putty",
    "name": "Undercoat Putty",
    "category": "decorative",
    "subcategories": [
      "primers"
    ],
    "desc": "An interior and exterior Latex based filler formulated to fill cracks, dents in walls prior to application of subsequent coats to primer and finish coats.",
    "longDesc": "An interior and exterior Latex based filler formulated to fill cracks, dents in walls prior to application of subsequent coats to primer and finish coats.",
    "mixing": null,
    "application": "Use a steel float for very big jobs or a pallet knife for smaller jobs",
    "coverage": "1 kg/sqm",
    "dryTime": "10-20 Minutes.",
    "packSizes": [
      "1kg",
      "6kg",
      "30kg"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1kg",
        "coverage": "1 kg/sqm"
      },
      {
        "size": "6kg",
        "coverage": "1 kg/sqm"
      },
      {
        "size": "30kg",
        "coverage": "1 kg/sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 23
    }
  },
  {
    "id": "pearl-coat",
    "name": "Pearl Coat",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "Water-based polychromatic finish with selected pearl material, delivering a unique sheen.",
    "longDesc": "Water-based polychromatic finish with selected pearl material, delivering a unique sheen. Eco-friendly, non-toxic, odorless, washable, and safe for all interior and exterior environments.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "5- 6 Sqm per litre, but variations should be expected depending on the type of paint pattern.",
    "dryTime": "20 Minutes Touch dry. 2 hours Through dry",
    "packSizes": [
      "½L",
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "½L",
        "coverage": "5- 6 Sqm per litre, but variations should be expected depending on the type of paint pattern."
      },
      {
        "size": "1L",
        "coverage": "5- 6 Sqm per litre, but variations should be expected depending on the type of paint pattern."
      },
      {
        "size": "4L",
        "coverage": "5- 6 Sqm per litre, but variations should be expected depending on the type of paint pattern."
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 24
    }
  },
  {
    "id": "latex-primer-sealer",
    "name": "Latex Primer Sealer",
    "category": "decorative",
    "subcategories": [
      "primers"
    ],
    "desc": "A premium water-based wall primer that seals concrete and wood surfaces.",
    "longDesc": "A premium water-based wall primer that seals concrete and wood surfaces. Ideal for both interior and exterior use.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller, brush or spray.",
    "coverage": "4L/32-36 Sqm",
    "dryTime": "20-30 Minutes Touch dry. 1 hour Through dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "4L/32-36 Sqm"
      },
      {
        "size": "4L",
        "coverage": "4L/32-36 Sqm"
      },
      {
        "size": "20L",
        "coverage": "4L/32-36 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 25
    }
  },
  {
    "id": "plaster-primer",
    "name": "Plaster Primer",
    "category": "decorative",
    "subcategories": [
      "primers"
    ],
    "desc": "A water-based primer formulated for lime and cement plaster surfaces, suitable for both interior and exterior use.",
    "longDesc": "A water-based primer formulated for lime and cement plaster surfaces, suitable for both interior and exterior use. It provides a reliable base for applying topcoats - Standard Emulsion, Super Matt Vinyl Silk, and WeatherShield.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush.",
    "coverage": "1L/3.6 Sqm on fresh smooth plaster",
    "dryTime": "15-30 Minutes Touch dry. 45 Minutes 1 hour Hard dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/3.6 Sqm on fresh smooth plaster"
      },
      {
        "size": "20L",
        "coverage": "1L/3.6 Sqm on fresh smooth plaster"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 26
    }
  },
  {
    "id": "bond-aid",
    "name": "WB Bond Aid",
    "category": "decorative",
    "subcategories": [
      "primers"
    ],
    "desc": "Recommended in the catalogue's primer guide for glossy surfaces, for sealing porous or unstable surfaces, and for improving adhesion.",
    "longDesc": "Recommended in the catalogue's primer guide for glossy surfaces, for sealing porous or unstable surfaces, and for improving adhesion.",
    "mixing": null,
    "application": "",
    "coverage": "",
    "dryTime": "",
    "packSizes": [
      "5L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "5L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": null
    }
  },
  {
    "id": "acrylic-elastomeric-coating",
    "name": "Acrylic Elastomeric Coating",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "A thick emulsion-based coating that forms flexible, seamless barriers against moisture on interior and exterior walls, like flat roofs, and steel sheets.",
    "longDesc": "A thick emulsion-based coating that forms flexible, seamless barriers against moisture on interior and exterior walls, like flat roofs, and steel sheets. The rubber like dry layer resists UV damage and bridges cracks for added protection.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Airless spray, brush, or roller",
    "coverage": "1L/4 Sqm",
    "dryTime": "30-45 Minutes Touch dry. 1 Hour Recoatable",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/4 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/4 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 27
    }
  },
  {
    "id": "gloss-emulsion",
    "name": "Gloss Emulsion",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "A durable emulsion top coat with a waterborne acrylic co-polymer, offering high sheen, excellent scrub resistance, and good coverage.",
    "longDesc": "A durable emulsion top coat with a waterborne acrylic co-polymer, offering high sheen, excellent scrub resistance, and good coverage. Suitable for both interior and exterior surfaces.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Roller or brush",
    "coverage": "1L/10-12 Sqm",
    "dryTime": "30 Minutes touch dry. 2 Hours hard dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/10-12 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/10-12 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 28
    }
  },
  {
    "id": "mastic-textured-paint",
    "name": "Mastic Textured Paint",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "A water-based grit material designed to create a durable, textured finish on both interior and exterior walls.",
    "longDesc": "A water-based grit material designed to create a durable, textured finish on both interior and exterior walls. Commonly used to conceal surface imperfections such as on columns or boards.",
    "mixing": null,
    "application": "Use a steel float and a plastic float",
    "coverage": "1kg/2 Sqm",
    "dryTime": "30-40 Minutes Touch dry. 3-4 hours Through dry.",
    "packSizes": [
      "30kg"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "30kg",
        "coverage": "1kg/2 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 29
    }
  },
  {
    "id": "venetian-stucco",
    "name": "Venetian Stucco",
    "category": "decorative",
    "subcategories": [
      "interior"
    ],
    "desc": "A fine plaster based on a combination of naturally occurring additives, fillers and an assortment of additives, fillers and pigments to bring elegance to interior walls and ceilings with a resemblance to polished marble.",
    "longDesc": "A fine plaster based on a combination of naturally occurring additives, fillers and an assortment of additives, fillers and pigments to bring elegance to interior walls and ceilings with a resemblance to polished marble.",
    "mixing": null,
    "application": "Use a steel float/spatula or sandpaper.",
    "coverage": "1-1.2kgs/Sqm",
    "dryTime": "6-24 Hours",
    "packSizes": [
      "1kg",
      "4kg",
      "20kg"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1kg",
        "coverage": "1-1.2kgs/Sqm"
      },
      {
        "size": "4kg",
        "coverage": "1-1.2kgs/Sqm"
      },
      {
        "size": "20kg",
        "coverage": "1-1.2kgs/Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 30
    }
  },
  {
    "id": "acrylic-art-pallet",
    "name": "Acrylic Art Pallet",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "Acrylic emulsion paint is a water-based coating formulated with acrylic polymers as binders, providing excellent adhesion, durability, and weather resistance on masonry, plaster, and concrete substrates.",
    "longDesc": "Acrylic emulsion paint is a water-based coating formulated with acrylic polymers as binders, providing excellent adhesion, durability, and weather resistance on masonry, plaster, and concrete substrates. It offers a smooth, washable finish with low VOC emissions, fast drying (touch-dry in 30-60 minutes), and compatibility with interior/exterior applications.",
    "mixing": null,
    "application": "Brush, roller",
    "coverage": "1L/ 4.6 Sqm",
    "dryTime": "30 Minutes Touch dry.",
    "packSizes": [
      "½L",
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "½L",
        "coverage": "1L/ 4.6 Sqm"
      },
      {
        "size": "1L",
        "coverage": "1L/ 4.6 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/ 4.6 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 31
    }
  },
  {
    "id": "glaze-coat",
    "name": "Glaze Coat",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "A clear glossy high adhesion and non yellowing coating suitable for both interior and exterior use.",
    "longDesc": "A clear glossy high adhesion and non yellowing coating suitable for both interior and exterior use. Ideal for protecting textured paint finishes brickwork, art murals and wallpaper.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Use a roller or brush to apply to textured coating 18-24 hours after the base coat.",
    "coverage": "1L/4.6 Sqm",
    "dryTime": "30 Minutes Touch dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/4.6 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/4.6 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 32
    }
  },
  {
    "id": "standard-emulsion",
    "name": "Standard Emulsion",
    "category": "decorative",
    "subcategories": [
      "interior",
      "exterior"
    ],
    "desc": "An acrylic emulsion designed to withstand interior conditions and moderate exterior environments.",
    "longDesc": "An acrylic emulsion designed to withstand interior conditions and moderate exterior environments. Suitable for application on both wood and concrete surfaces.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of water"
    },
    "application": "Brush, roller.",
    "coverage": "4L/12-15 Sqm",
    "dryTime": "20-30 Minutes Touch Dry. 5 Hours Through Dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "4L/12-15 Sqm"
      },
      {
        "size": "20L",
        "coverage": "4L/12-15 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 33
    }
  },
  {
    "id": "2k-acrylic-polyurethane",
    "name": "2K Acrylic Polyurethane",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A dual component product formulated to give protection to steel, wood, plastic and concrete substrates.",
    "longDesc": "A dual component product formulated to give protection to steel, wood, plastic and concrete substrates. Highly recommended for use in industrial settings exposed to chemicals, water and abrasive agents.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 1 Litre of Thinner"
    },
    "application": "Roller or spray",
    "coverage": "",
    "dryTime": "1 Hour Touch dry. 6-8 hours Recoatable.",
    "packSizes": [
      "Part A 3L + Part B 1L"
    ],
    "kit": true,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "Part A 3L + Part B 1L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 36
    }
  },
  {
    "id": "auto-acrylic",
    "name": "Auto Acrylic",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A high-performance, two component polyurethane coating engineered for professional automotive refinishing.",
    "longDesc": "A high-performance, two component polyurethane coating engineered for professional automotive refinishing. This high-gloss formula provides exceptional durability, delivering a flawless finish with long-lasting protection.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 1 Litre of Urethane Thinner"
    },
    "application": "Spray gun.",
    "coverage": "",
    "dryTime": "30-40 Minutes Touch dry. 18-20 hours Hard dry.",
    "packSizes": [
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": ""
      },
      {
        "size": "4L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 37
    },
    "subtitle": "Acrylic 2K Resin Based Auto Refinish Paint"
  },
  {
    "id": "fast-dry-enamel",
    "name": "Fast Dry Enamel",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A fast-drying enamel paint, suitable for metal, wood, and concrete surfaces, providing a high-gloss finish, excellent abrasion resistance, and strong film hardness.",
    "longDesc": "A fast-drying enamel paint, suitable for metal, wood, and concrete surfaces, providing a high-gloss finish, excellent abrasion resistance, and strong film hardness. Perfect for use on buses, truck bodies and agricultural machinery.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 2 Litres of Thinner"
    },
    "application": "A spray gun or brush can be used.",
    "coverage": "1L/8 Sqm",
    "dryTime": "30 Minutes Touch dry. 4-5 hours Hard dry.",
    "packSizes": [
      "½L",
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "½L",
        "coverage": "1L/8 Sqm"
      },
      {
        "size": "1L",
        "coverage": "1L/8 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/8 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 38
    }
  },
  {
    "id": "epoxy-2k-enamel",
    "name": "Epoxy 2K Enamel",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A general-purpose, epoxy resin-based product, with exceptional gloss, designed for application to steel, wood and concrete that has been primed with the Peacock ST primer.",
    "longDesc": "A general-purpose, epoxy resin-based product, with exceptional gloss, designed for application to steel, wood and concrete that has been primed with the Peacock ST primer.",
    "mixing": {
      "label": "Mix",
      "value": "3:1:0.5 (3 litres base: 1 litre hardener: 0.5 litre Thinner)"
    },
    "application": "Brush, spray or mohair roller.",
    "coverage": "4L/32- 40 Sqm (dependent upon substrate type)",
    "dryTime": "60-90 Minutes Touch dry. 8- 12 Hours Through dry.",
    "packSizes": [
      "Base 3L + Hardener 1L"
    ],
    "kit": true,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "Base 3L + Hardener 1L",
        "coverage": "4L/32- 40 Sqm (dependent upon substrate type)"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 39
    }
  },
  {
    "id": "cellulose-enamel",
    "name": "Cellulose Enamel",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A quick-drying enamel for metal and wood, ideal for both interior and exterior use.",
    "longDesc": "A quick-drying enamel for metal and wood, ideal for both interior and exterior use. Provides excellent rust protection, abrasion resistance, and film hardness.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint : 2 Litres of Sync and Urethane Thinner"
    },
    "application": "Spray",
    "coverage": "1L/7 Sqm",
    "dryTime": "15 Minutes Touch Dry. 45 Minutes Hard Dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/7 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/7 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/7 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 40
    }
  },
  {
    "id": "epoxy-self-levelling",
    "name": "Epoxy Self Levelling",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A two component product high build pigmented epoxy based on high quality epoxy resins and a polyamine curing agent.",
    "longDesc": "A two component product high build pigmented epoxy based on high quality epoxy resins and a polyamine curing agent. It is formulated to give an excellent abrasion/chemical resistant finish.",
    "mixing": null,
    "application": "Mohair roller",
    "coverage": "1L/4 Sqm",
    "dryTime": "6 Hours Touch dry. 16-18 Hours Hard dry.",
    "packSizes": [
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/4 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 41
    }
  },
  {
    "id": "floxy-high-temperature-resistant-coating",
    "name": "Floxy High Temperature Resistant Coating",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A single-component, heat-resistant primer formulated with metallic pigments and advanced organic resin to withstand temperatures up to 650°C, while protecting against corrosion and weathering.",
    "longDesc": "A single-component, heat-resistant primer formulated with metallic pigments and advanced organic resin to withstand temperatures up to 650°C, while protecting against corrosion and weathering.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of paint: 1/2 Litre of Thinner"
    },
    "application": "Spray",
    "coverage": "1L/5.6 Sqm at 125μm 2.8sqm/1L at 250μm",
    "dryTime": "24 Hours Dry to Handle. 6 Hours Recoating time.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/5.6 Sqm at 125μm 2.8sqm/1L at 250μm"
      },
      {
        "size": "20L",
        "coverage": "1L/5.6 Sqm at 125μm 2.8sqm/1L at 250μm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 42
    }
  },
  {
    "id": "floxy-multipurpose-sealer",
    "name": "Floxy Multipurpose Sealer",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A UV resistant sealer based on a robust binder system, designed for application to well prepared surfaces of concrete, steel, timber, stone work.",
    "longDesc": "A UV resistant sealer based on a robust binder system, designed for application to well prepared surfaces of concrete, steel, timber, stone work.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint : 2 Litres of Thinner"
    },
    "application": "Spray or Roller",
    "coverage": "1L/6 Sqm",
    "dryTime": "30 Minutes Touch Dry. 3-4 hours Hard dry.",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "1L/6 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/6 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/6 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 43
    }
  },
  {
    "id": "floxy-st-primer",
    "name": "Floxy ST Primer",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A high solid, solvent free, two component epoxy based material recommended for use on surfaces with little or no preparation.",
    "longDesc": "A high solid, solvent free, two component epoxy based material recommended for use on surfaces with little or no preparation. It creates a moisture barrier on damp concrete surfaces as well as provide corrosion protection to steel substrates in harsh conditions.",
    "mixing": null,
    "application": "Airless Spray, Roller(Lint Free), and Brush",
    "coverage": "0.2mm thickness; 1L /6 Sqm (depending on substrate type)",
    "dryTime": "4 Hours Touch Dry. 10-12 Hours Recoatable. 4-5 Days Full Cure.",
    "packSizes": [
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "0.2mm thickness; 1L /6 Sqm (depending on substrate type)"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 44
    }
  },
  {
    "id": "road-marking-paint",
    "name": "Road Marking Paint",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A fast-drying product formulated for concrete, steel, and asphalt surfaces, offering excellent adhesion and chemical resistance well-suited for interior and exterior applications under demanding conditions.",
    "longDesc": "A fast-drying product formulated for concrete, steel, and asphalt surfaces, offering excellent adhesion and chemical resistance well-suited for interior and exterior applications under demanding conditions.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of paint: 1 Litre of Thinner"
    },
    "application": "Spray, Brush or Roller",
    "coverage": "1L/6 Sqm",
    "dryTime": "15-25 Minutes Touch Dry. 90 Minutes Recoatable.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/6 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/6 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 45
    }
  },
  {
    "id": "super-gloss",
    "name": "Super Gloss",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "An alkyd-based product that offers high opacity, a high gloss finish, and excellent resistance to algae and fungi.",
    "longDesc": "An alkyd-based product that offers high opacity, a high gloss finish, and excellent resistance to algae and fungi. It is suitable for well-prepared exterior and interior surfaces including concrete, wood, and metal. Delivers a smooth and shiny appearance.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of paint: 1 Litre of Peacock Thinner."
    },
    "application": "Brush or Spray Gun.",
    "coverage": "4L/20-24 Sqm",
    "dryTime": "3 - 4 Hours Touch dry. 8-10 Hours Hard dry",
    "packSizes": [
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": "4L/20-24 Sqm"
      },
      {
        "size": "4L",
        "coverage": "4L/20-24 Sqm"
      },
      {
        "size": "20L",
        "coverage": "4L/20-24 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 46
    }
  },
  {
    "id": "standard-hi-gloss",
    "name": "Standard Hi Gloss",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A budget alkyd-based product with moderate opacity that provides a glossy finish, designed for interior surfaces such as wood, steel, and concrete.",
    "longDesc": "A budget alkyd-based product with moderate opacity that provides a glossy finish, designed for interior surfaces such as wood, steel, and concrete.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 1 Litre of White Spirit/ Sync Thinner"
    },
    "application": "Brush, roller or spray",
    "coverage": "4L/10-12 Sqm",
    "dryTime": "4-5 Hours Touch dry. 16 -18 Hours Hard dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "4L/10-12 Sqm"
      },
      {
        "size": "20L",
        "coverage": "4L/10-12 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 47
    }
  },
  {
    "id": "rd-enamel",
    "name": "RD Enamel",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A rapid-drying, non-yellowing enamel with a high-performance binder and additives for a hard, abrasion-resistant finish.",
    "longDesc": "A rapid-drying, non-yellowing enamel with a high-performance binder and additives for a hard, abrasion-resistant finish. Designed for interior and exterior use on well-prepared wood, concrete, plastic, and steel surfaces.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 1 Litre of Sync Thinner"
    },
    "application": "Brush, Spray",
    "coverage": "1L/9-10 Sqm",
    "dryTime": "30-45 Minutes Touch Dry. 1 Hour Hard Dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/9-10 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/9-10 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 48
    }
  },
  {
    "id": "undercoat-oil",
    "name": "Undercoat Oil",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "An alkyd based undercoat with good opacity and filling properties.",
    "longDesc": "An alkyd based undercoat with good opacity and filling properties. Formulated for use on interior and exterior substrates such as steel, wood and concrete that are to be finished with standard and super gloss enamels",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of paint: 1 Litre of Sync Thinner"
    },
    "application": "Brush, Roller",
    "coverage": "1L/5 Sqm",
    "dryTime": "3 Hours touch dry. 10-12 Hours Through dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/5 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/5 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 49
    }
  },
  {
    "id": "concrete-sealer",
    "name": "Concrete Sealer",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A high-performance two-component sealer specially formulated for damp concrete surfaces and freshly plastered walls.",
    "longDesc": "A high-performance two-component sealer specially formulated for damp concrete surfaces and freshly plastered walls. It provides excellent water repellency, penetrates porous surfaces, and forms a durable protective coating with a high-gloss finish when used as a glaze coat.",
    "mixing": {
      "label": "Mix",
      "value": "3:1"
    },
    "application": "Brush, Roller",
    "coverage": "1L/6.5 sqm",
    "dryTime": "2-3 Hours",
    "packSizes": [
      "4L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/6.5 sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 50
    }
  },
  {
    "id": "bituminous-emulsion",
    "name": "Bituminous Emulsion",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A single component solvent free high build coating for both interior and exterior waterproofing of below ground structures such as vertical basement walls, floor slabs and foundations.",
    "longDesc": "A single component solvent free high build coating for both interior and exterior waterproofing of below ground structures such as vertical basement walls, floor slabs and foundations. It forms a seamless and durable waterproof layer with strong adhesion and also acts as an effective primer for asphalt based surfaces.",
    "mixing": {
      "label": "Mix",
      "value": "12 Litres of paint: 3 Litres of water"
    },
    "application": "Brush or a roller for both dry and damp concrete surfaces.",
    "coverage": "1L/2-3 Sqm depending on texture of the surface.",
    "dryTime": "15- 18 Hours Touch dry. 24 Hours Recoatable.",
    "packSizes": [
      "12L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "12L",
        "coverage": "1L/2-3 Sqm depending on texture of the surface."
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 51
    }
  },
  {
    "id": "metal-primer",
    "name": "Metal Primer",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A high-performance industrial metallic primer formulated to provide excellent adhesion and long-lasting protection to metal surfaces.",
    "longDesc": "A high-performance industrial metallic primer formulated to provide excellent adhesion and long-lasting protection to metal surfaces. Designed for use on properly prepared steel, aluminum, galvanized sheets and other metal substrates, it protects against rust, corrosion, moisture and chemical attack.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of paint: 1 Litre of Sync Thinner"
    },
    "application": "Spray gun or brush can be used",
    "coverage": "",
    "dryTime": "20-30 Minutes Touch dry. 3.5 Hours Hard dry.",
    "packSizes": [
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "1L",
        "coverage": ""
      },
      {
        "size": "4L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 52
    }
  },
  {
    "id": "skimmex",
    "name": "Skimmex",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A fine-grade cementitious-based powder modified with a variety of fine extenders & other additives.",
    "longDesc": "A fine-grade cementitious-based powder modified with a variety of fine extenders & other additives. It is mixed with water to create a smooth, thin layer over walls to cover imperfections, dents, cracks, and old textured paint. It is your solution for achieving a smooth finish before painting.",
    "mixing": {
      "label": "Mix",
      "value": "6-8 kgs of water, then slowly empty the contents of the bag into the water and mix with a hand mixer for 5 mins."
    },
    "application": "Trowel",
    "coverage": "1L/5 Sqm",
    "dryTime": "10-20 Minutes.",
    "packSizes": [
      "25kg"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "25kg",
        "coverage": "1L/5 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 53
    }
  },
  {
    "id": "waterproof-plaster",
    "name": "Waterproof Plaster",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A water-based material formulated with an assortment of versatile polymers and additives that enhance its performance as a barrier to water in walls affected by dampness.",
    "longDesc": "A water-based material formulated with an assortment of versatile polymers and additives that enhance its performance as a barrier to water in walls affected by dampness.",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 20 kgs of the cementitious dry mix material"
    },
    "application": "Roller",
    "coverage": "",
    "dryTime": "1 hour",
    "packSizes": [
      "4L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "4L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 54
    }
  },
  {
    "id": "aquaphob",
    "name": "Aquaphob",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A two-component, cementitious waterproofing system designed for both interior and exterior applications on vertical and horizontal surfaces.",
    "longDesc": "A two-component, cementitious waterproofing system designed for both interior and exterior applications on vertical and horizontal surfaces.",
    "mixing": null,
    "application": "Roller or trowel",
    "coverage": "1 Kg/ Sqm",
    "dryTime": "90 Minutes.",
    "packSizes": [
      "Grey powder 25kg + White liquid 10L"
    ],
    "kit": true,
    "colourSystems": [],
    "sizes": [
      {
        "size": "Grey powder 25kg + White liquid 10L",
        "coverage": "1 Kg/ Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 55
    }
  },
  {
    "id": "episive",
    "name": "Episive",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A two-component, high-strength epoxy adhesive formulated from a resin base and hardener.",
    "longDesc": "A two-component, high-strength epoxy adhesive formulated from a resin base and hardener. Suitable for bonding and repair applications on properly prepared metal, wood, concrete, stone, glass and hard plastic surfaces.",
    "mixing": {
      "label": "Mix",
      "value": "4.5 Kg Base : 0.5 Kg Hardener"
    },
    "application": "Scrapper",
    "coverage": "",
    "dryTime": "20 minutes Touch Dry",
    "packSizes": [
      "Base 4.5kg + Hardener 0.5kg"
    ],
    "kit": true,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "Base 4.5kg + Hardener 0.5kg",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 56
    }
  },
  {
    "id": "m-basecoat-aluminium",
    "name": "M-Basecoat Aluminium",
    "category": "industrial",
    "subcategories": [
      "general"
    ],
    "desc": "A premium product formulated with a unique binder system, assorted metallic and solid pigments to guarantee longevity and enhance the aesthetics of surface to which it is applied",
    "longDesc": "A premium product formulated with a unique binder system, assorted metallic and solid pigments to guarantee longevity and enhance the aesthetics of surface to which it is applied",
    "mixing": {
      "label": "Mix",
      "value": "4 Litres of Paint: 2 Litres of Urethane Thinner"
    },
    "application": "Spray",
    "coverage": "1L/8 Sqm",
    "dryTime": "15-20 Minutes Touch Dry. 30-45 Minutes Recoatable",
    "packSizes": [
      "4L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "4L",
        "coverage": "1L/8 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 57
    }
  },
  {
    "id": "polatex",
    "name": "Polatex",
    "category": "industrial",
    "subcategories": [
      "waterproofing"
    ],
    "desc": "A single-component, ready-to-use liquid polymer additive engineered to enhance the performance of cementitious mortars and slurries.",
    "longDesc": "A single-component, ready-to-use liquid polymer additive engineered to enhance the performance of cementitious mortars and slurries. It significantly improves bond strength between old and new concrete substrates and is essential for durable concrete repairs, flooring toppings, screeds, and waterproof renders.",
    "mixing": {
      "label": "Mix",
      "value": "4 parts Water : 1 part Polatex for renders/plasters"
    },
    "application": "Pour the Polatex C023 into an appropriate mixing container, to it add cement, aggregate and mix till a homogeneous mixture is achieved",
    "coverage": "Dependant on end application",
    "dryTime": "40-45 Minutes Touch dry. 60-90 Minutes Hard dry",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "4L",
        "coverage": "Dependant on end application"
      },
      {
        "size": "20L",
        "coverage": "Dependant on end application"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 58
    }
  },
  {
    "id": "hand-sanitizer",
    "name": "Hand Sanitizer",
    "category": "industrial",
    "subcategories": [
      "other"
    ],
    "desc": "",
    "longDesc": "",
    "mixing": null,
    "application": "Spray",
    "coverage": "",
    "dryTime": "",
    "packSizes": [
      "500ml",
      "5L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "500ml",
        "coverage": ""
      },
      {
        "size": "5L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 59
    }
  },
  {
    "id": "nc-sanding-sealer",
    "name": "NC Sanding Sealer",
    "category": "woodcare",
    "subcategories": [],
    "desc": "NC sanding sealer is a specialized wood care product formulated to effectively seal surface pores.",
    "longDesc": "NC sanding sealer is a specialized wood care product formulated to effectively seal surface pores. This fast-drying formula contains unique polishing agents that fill pores during sanding, creating a smooth, even finish ready for topcoats.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 2 Litres of Sync Thinner"
    },
    "application": "Brush, Spray & Immersion.",
    "coverage": "1L/4-6 Sqm",
    "dryTime": "15 Minutes Touch Dry. 30 Minutes Recoatable.",
    "packSizes": [
      "½L",
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [
      "Peacock Paints",
      "NCS",
      "BS 4800",
      "NOVA",
      "RAL"
    ],
    "sizes": [
      {
        "size": "½L",
        "coverage": "1L/4-6 Sqm"
      },
      {
        "size": "1L",
        "coverage": "1L/4-6 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/4-6 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 70
    }
  },
  {
    "id": "premium-lacquer",
    "name": "Premium Lacquer",
    "category": "woodcare",
    "subcategories": [],
    "desc": "A quick drying clear NC Lacquer for spray application to wood that dries to a semi-gloss sheen.",
    "longDesc": "A quick drying clear NC Lacquer for spray application to wood that dries to a semi-gloss sheen. It has excellent adhesion to properly prepared surfaces.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of paint: 2 Litre of Sync Thinner"
    },
    "application": "Spray, 2 coats are adequate to achieve a desired finish.",
    "coverage": "1L/6-10 Sqm",
    "dryTime": "15 Minutes Touch dry. 30 Minutes Recoatable.",
    "packSizes": [
      "½L",
      "1L",
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "½L",
        "coverage": "1L/6-10 Sqm"
      },
      {
        "size": "1L",
        "coverage": "1L/6-10 Sqm"
      },
      {
        "size": "4L",
        "coverage": "1L/6-10 Sqm"
      },
      {
        "size": "20L",
        "coverage": "1L/6-10 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 71
    }
  },
  {
    "id": "clear-varnish",
    "name": "Clear Varnish",
    "category": "woodcare",
    "subcategories": [],
    "desc": "A finish based on alkyd resins .",
    "longDesc": "A finish based on alkyd resins . Formulated to withstand conditions on the interior. It is meant to give wood products a glossy and Protective finish.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of paint: 1 Litre of High Gloss Thinner."
    },
    "application": "Use Brush or Spray Gun.",
    "coverage": "4L/28-30 Sqm",
    "dryTime": "4 - 5 Hours Touch dry. 16-18 Hours Through dry",
    "packSizes": [
      "1L",
      "4L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "1L",
        "coverage": "4L/28-30 Sqm"
      },
      {
        "size": "4L",
        "coverage": "4L/28-30 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 72
    }
  },
  {
    "id": "1k-polyurethane-varnish",
    "name": "1K Polyurethane Varnish",
    "category": "woodcare",
    "subcategories": [],
    "desc": "A single pack, fast drying, scratch resistant film hi-gloss varnish, formulated with special additives to facilitate its resistance to conditions on the exterior against effects of the weather.",
    "longDesc": "A single pack, fast drying, scratch resistant film hi-gloss varnish, formulated with special additives to facilitate its resistance to conditions on the exterior against effects of the weather.",
    "mixing": {
      "label": "Dilution",
      "value": "4 Litres of Paint: 1 Litre of White spirit and High gloss thinner"
    },
    "application": "Brush, roller or spray",
    "coverage": "4L/28-30 Sqm.",
    "dryTime": "3 Hours Touch dry. 8-10 Hours Through dry.",
    "packSizes": [
      "4L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "4L",
        "coverage": "4L/28-30 Sqm."
      },
      {
        "size": "20L",
        "coverage": "4L/28-30 Sqm."
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 73
    }
  },
  {
    "id": "2k-polyurethane-varnish",
    "name": "2K Polyurethane Varnish",
    "category": "woodcare",
    "subcategories": [],
    "desc": "A dual component wood care product, formulated with special resins & polishing agents that facilitate its functioning as a wood sealer.",
    "longDesc": "A dual component wood care product, formulated with special resins & polishing agents that facilitate its functioning as a wood sealer. It’s specially made to seal off the pores in the wood after 1-2 coats",
    "mixing": null,
    "application": "Spray",
    "coverage": "1L/6-8 Sqm",
    "dryTime": "30 Minutes Touch Dry. 45 Minutes Recoatable can be sanded without spoiling the sandpaper.",
    "packSizes": [
      "Base 4L + Hardener 2L"
    ],
    "kit": true,
    "colourSystems": [],
    "sizes": [
      {
        "size": "Base 4L + Hardener 2L",
        "coverage": "1L/6-8 Sqm"
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 74
    }
  },
  {
    "id": "tuff-hold-joinery-glue",
    "name": "Tuff Hold Joinery Glue",
    "category": "woodcare",
    "subcategories": [],
    "desc": "A versatile adhesive formulated to cover the demands of wood and joinery workshops.",
    "longDesc": "A versatile adhesive formulated to cover the demands of wood and joinery workshops. Surfaces to be joined together should be free of dirt, grease and oil.",
    "mixing": null,
    "application": "Brush",
    "coverage": "",
    "dryTime": "Will bind within 1.5 hours to 1 hour",
    "packSizes": [
      "½kg",
      "1kg",
      "20kg"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "½kg",
        "coverage": ""
      },
      {
        "size": "1kg",
        "coverage": ""
      },
      {
        "size": "20kg",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 75
    }
  },
  {
    "id": "urethane-thinner",
    "name": "Urethane Thinner",
    "category": "thinners",
    "subcategories": [],
    "desc": "Not so volatile thinner with strong solvency properties.",
    "longDesc": "Not so volatile thinner with strong solvency properties. Formulated to work with Auto paints, high end 2K-wood finishes.",
    "mixing": null,
    "application": "",
    "coverage": "",
    "dryTime": "",
    "packSizes": [
      "1L",
      "5L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "1L",
        "coverage": ""
      },
      {
        "size": "5L",
        "coverage": ""
      },
      {
        "size": "20L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 80
    }
  },
  {
    "id": "epoxy-thinner",
    "name": "Epoxy Thinner",
    "category": "thinners",
    "subcategories": [],
    "desc": "Used as a thinning solvent for epoxy 2k enamel",
    "longDesc": "Used as a thinning solvent for epoxy 2k enamel",
    "mixing": null,
    "application": "",
    "coverage": "",
    "dryTime": "",
    "packSizes": [
      "1L",
      "5L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "1L",
        "coverage": ""
      },
      {
        "size": "5L",
        "coverage": ""
      },
      {
        "size": "20L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 80
    }
  },
  {
    "id": "sync-thinner",
    "name": "Sync Thinner",
    "category": "thinners",
    "subcategories": [],
    "desc": "Will thin into finishes, varnishes, clear varnishes, road marking paints.",
    "longDesc": "Will thin into finishes, varnishes, clear varnishes, road marking paints. It can work as a paint remover as well.",
    "mixing": null,
    "application": "",
    "coverage": "",
    "dryTime": "",
    "packSizes": [
      "1L",
      "5L",
      "20L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "1L",
        "coverage": ""
      },
      {
        "size": "5L",
        "coverage": ""
      },
      {
        "size": "20L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 80
    }
  },
  {
    "id": "multi-surface-industrial-cleaner",
    "name": "Multi Surface Industrial Cleaner",
    "category": "thinners",
    "subcategories": [],
    "desc": "A water based, ready to use, highly effective biodegradable multi surface cleaner.",
    "longDesc": "A water based, ready to use, highly effective biodegradable multi surface cleaner. It is formulated to lift and remove soils, stains and grime on hard floors, and leaves your space and home clean, safe with a calming freshness.",
    "mixing": null,
    "application": "Mop, sponge or spray bottle",
    "coverage": "",
    "dryTime": "6-10 Minutes",
    "packSizes": [
      "5L"
    ],
    "kit": false,
    "colourSystems": [],
    "sizes": [
      {
        "size": "5L",
        "coverage": ""
      }
    ],
    "img": null,
    "catalogue": {
      "pdfPage": 81
    }
  }
];

// Colour samples (no prices - these go into the quote list like any other item)
export const SAMPLE_POT = {
  id: "colour-sample",
  name: "Colour sample pot",
  category: "samples",
  desc: "A tester pot to see the shade in your light.",
  img: null,
  sizes: [{ size: "100ml", coverage: "tester" }],
};

export const SAMPLE_BUNDLE = {
  id: "sample-bundle",
  name: "5 colour sample pots",
  category: "samples",
  desc: "Five tester pots.",
  img: null,
  sizes: [{ size: "5 pots", coverage: "5 testers" }],
};
