import { db } from './server/db';
import { contentBlocks } from './server/db/schema';

const fallbacks = {
"contact_whatsapp": "https://wa.me/201005550190?text=Hello%20Capital%20Hills",
"contact_address": "HQ: Galleria 40, Zayed | Downtown, New Cairo\\nSales & Customer Service: Arkan Plaza, Zayed",
"global_facebook_url": "#",
"global_instagram_url": "#",
"global_logo_full_light": "/capital-hills-logo-full-light.png",
"global_logo_full_maroon": "/capital-hills-logo-full-maroon.png",
"global_logo_icon_light": "/capital-hills-icon-light.png",
"global_logo_icon_maroon": "/capital-hills-icon-maroon.png",
"global_header_talk": "Talk to us",
"global_footer_text": "Building communities that inspire. From prime commercial spaces to elegant residential developments, we deliver quality, trust, and lasting value.",
"global_footer_desc": "Homes with sound thinking behind them. For the way Egyptians actually live.",
"global_footer_explore": "Explore",
"global_footer_visit": "Visit",
"global_footer_need": "Need a second opinion?",
"global_footer_need_desc": "Tell us what you are looking for. A real person will call with a clear answer.",
"global_footer_copy": "© 2026 Capital Hills Developments",
"global_footer_slogan": "Built for better decisions.",
"contact_eyebrow": "A real person is close by",
"contact_title_1": "Let's make the",
"contact_title_2": "next step feel simple.",
"contact_desc": "Call, message, or book a quiet walk-through. Tell us what you are considering and we will bring useful answers.",
"contact_form_eyebrow": "Have a quick question?",
"contact_form_title": "We can start there.",
"contact_form_desc": "No forms that go into a black hole. Leave your number and a sentence, and a member of our team will call.",
"contact_map_url": "https://www.google.com/maps?q=Galleria+40,+Sheikh+Zayed,+Egypt&output=embed",
"home_hero_bg": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000",
"hero_title": "A clearer path",
"hero_subtitle": "Thoughtfully planned communities. A better tomorrow.",
"stat_1_suf": "",
"stat_1_lbl": "Key projects delivered",
"stat_2_suf": "",
"stat_2_lbl": "Prime Egyptian cities",
"stat_3_suf": "",
"stat_3_lbl": "Year established",
"stat_4_suf": " yrs",
"stat_4_lbl": "Max instalment plan",
"home_why_eyebrow": "Why Capital Hills",
"home_why_title_1": "Invest With",
"home_why_title_2": "Trust.",
"home_why_desc": "We believe real estate is more than a property. It is a decision about your future, your family, your business, and your investment.",
"home_cta_bg": "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1000",
"home_cta_eyebrow": "One good conversation",
"home_cta_title": "Let's find the place that makes sense for you.",
"home_cta_desc": "Tell us your city, your range, and what you need. We will come back with useful options, not a sales pitch.",
"home_chairman_img": "/chairman.png",
"chairman_name_1": "Eng. Mohamed Salah",
"chairman_name_2": "Abdel Qader",
"chairman_title": "Chairman — Capital Hills Developments",
"chairman_quote": "Trust is more than a promise. It is the foundation of everything we build.",
"chairman_p1": "At Capital Hills Developments, we believe real estate development is about more than building. It is about shaping communities, creating lasting value, and building trust that stands the test of time.",
"chairman_p2": "For the past 10 years, we have been building our presence in the real estate sector, guided by a commitment to developing destinations that meet our customers' evolving needs — combining thoughtful planning, quality, and strategic locations with a long-term perspective.",
"chairman_p3": "We recognize that every project represents an important decision for our customers — whether they are choosing a home, growing a business, or making an investment. This responsibility guides our approach and reinforces our commitment to delivering value at every stage of the journey.",
"chairman_p4": "As we continue to grow, we remain focused on building strong relationships with our customers, partners, and communities, while fostering an environment where our people can grow, contribute, and succeed.",
"whyus_hero_bg": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000",
"whyus_hero_title": "WHAT DEFINES US",
"whyus_hero_desc_1": "Since 2017, we have been shaping Cairo's landscape by connecting East and West through developments that merge modern architecture with practical functionality and a clear understanding of our clients' aspirations. Every project we deliver is guided by a commitment to long-term value, serving as an investment for our clients while enriching the wider community.",
"whyus_hero_desc_2": "From dynamic commercial hubs that drive business growth to lifestyle-focused residential spaces that elevate everyday living, our portfolio reflects a vision of progress, innovation, and sustainability. At Capital Hills Developments, we don't just build for today — we build for generations to come.",
"whyus_core_title": "CORE VALUES",
"whyus_story_title_1": "Every Story",
"whyus_story_title_2": "has",
"whyus_story_title_3": "A Start.",
"whyus_story_eyebrow": "THIS IS OURS",
"whyus_story_p1": "Long before Capital Hills was established, the foundations were already in place.",
"whyus_story_p2": "Since 2017, the company delivered standalone buildings across Hadayek October and 6th of October, focused on solid construction and reliable execution.",
"whyus_story_p3": "In 2020, this experience evolved into Capital Hills Developments, marking the shift from individual projects to large-scale, mixed-use destinations. Today, Capital Hills continues to build integrated developments that support modern living, business growth, and long-term value.",
"whyus_mission_title": "The Path We Build",
"whyus_mission_desc": "We build integrated communities and deliver real, measurable returns on every investment on time, every time, with a personal relationship behind every deal.",
"whyus_vision_title": "The World We See",
"whyus_vision_desc": "To be a trusted real estate partner, creating communities and investment opportunities that deliver lasting value.",
"whyus_cta_eyebrow": "Ready to see what we've built?",
"whyus_cta_title": "Browse our latest projects."
};

async function run() {
  console.log('Seeding missing fallbacks...');
  for (const [key, val] of Object.entries(fallbacks)) {
    // onConflictDoNothing to preserve any existing values in db
    await db.insert(contentBlocks).values({ id: key, value: val }).onConflictDoNothing();
  }
  console.log('Done.');
  process.exit(0);
}

run();
