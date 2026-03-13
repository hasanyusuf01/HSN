-- ============================================================
-- Luxe Essence - Seed Data
-- Run AFTER the migration script
-- NOTE: Create an admin user first via Supabase Auth,
--       then update their role manually or via the query below.
-- ============================================================

-- CATEGORIES
insert into public.categories (id, name, slug, description) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Luxury Oud',  'luxury-oud',  'Ancient wood, deep warmth and mystique'),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'Oriental',    'oriental',    'Spices, amber, resins and sensuality'),
  ('a1b2c3d4-0001-0001-0001-000000000003', 'Floral',      'floral',      'Blooming gardens captured in a bottle'),
  ('a1b2c3d4-0001-0001-0001-000000000004', 'Woody',       'woody',       'Earthy, grounded and sophisticated'),
  ('a1b2c3d4-0001-0001-0001-000000000005', 'Fresh',       'fresh',       'Clean, airy and invigorating')
on conflict (slug) do nothing;

-- PRODUCTS
insert into public.products (
  id, name, slug, short_description, full_description, brand,
  price, discount_price, stock, category_id, featured, is_active,
  fragrance_notes, size_options, image_urls, created_at, updated_at
) values
(
  'b2c3d4e5-0002-0002-0002-000000000001',
  'Oud Royale',
  'oud-royale',
  'A regal blend of Cambodian oud and dark rose — majestic, long-lasting, unforgettable.',
  'Oud Royale is our crown jewel, crafted from the rarest Cambodian agarwood aged over 20 years. Opening with a burst of saffron and black pepper, it evolves into a heart of dark Bulgarian rose and smoky oud. The base is an endless trail of amber, musk, and sandalwood that will leave an impression for hours. A fragrance worthy of royalty.',
  'Luxe Essence',
  79.99, 69.99, 25,
  'a1b2c3d4-0001-0001-0001-000000000001',
  true, true,
  '{"top": ["Saffron", "Black Pepper", "Bergamot"], "middle": ["Cambodian Oud", "Bulgarian Rose", "Incense"], "base": ["Amber", "Sandalwood", "White Musk"]}',
  '[{"size": "30ml", "price": 49.99}, {"size": "50ml", "price": 69.99}, {"size": "100ml", "price": 99.99}]',
  '["https://images.unsplash.com/photo-1588514912908-a927ef3f0e96?q=80&w=800", "https://images.unsplash.com/photo-1590156562745-5daf50b69200?q=80&w=800"]',
  now(), now()
),
(
  'b2c3d4e5-0002-0002-0002-000000000002',
  'Amber Silk',
  'amber-silk',
  'Warm golden amber meets delicate white flowers in this silky, skin-close oriental.',
  'Amber Silk is a tender embrace of warmth and femininity. The opening dazzles with Italian bergamot and pink pepper before melting into a heart of jasmine and soft amber resin. The base is a whisper of vanilla, labdanum, and precious woods that lingers like a fond memory. Perfect for evenings and special occasions.',
  'Luxe Essence',
  59.99, null, 40,
  'a1b2c3d4-0001-0001-0001-000000000002',
  true, true,
  '{"top": ["Bergamot", "Pink Pepper", "Mandarin"], "middle": ["Jasmine", "Ylang-Ylang", "Amber Resin"], "base": ["Vanilla", "Labdanum", "Cedar"]}',
  '[{"size": "30ml", "price": 39.99}, {"size": "50ml", "price": 59.99}]',
  '["https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=800", "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800"]',
  now(), now()
),
(
  'b2c3d4e5-0002-0002-0002-000000000003',
  'Noir Bloom',
  'noir-bloom',
  'Dark florals wrapped in smoke and velvet — a bold, feminine statement scent.',
  'Noir Bloom is the intersection of light and shadow. A violet leaf and black currant opening gives way to a deep heart of black rose, tuberose, and a hint of leather. The dry down reveals patchouli, vetiver, and dark musk — mysterious, sensual, and thoroughly modern. For the woman who dares to be different.',
  'Luxe Essence',
  49.99, null, 30,
  'a1b2c3d4-0001-0001-0001-000000000003',
  true, true,
  '{"top": ["Violet Leaf", "Black Currant", "Cardamom"], "middle": ["Black Rose", "Tuberose", "Leather"], "base": ["Patchouli", "Vetiver", "Dark Musk"]}',
  '[{"size": "50ml", "price": 49.99}, {"size": "100ml", "price": 79.99}]',
  '["https://images.unsplash.com/photo-1598521101657-1c1ad0e6b0e3?q=80&w=800"]',
  now(), now()
),
(
  'b2c3d4e5-0002-0002-0002-000000000004',
  'Cedar & Snow',
  'cedar-and-snow',
  'Crisp winter air, aromatic cedarwood and white woods — clean, elevated, unisex.',
  'Cedar & Snow captures the pristine stillness of a forest in winter. Juniper berry and cold mint open with an almost tangible freshness. The heart builds with Virginia cedarwood, birch, and a whisper of orris before settling into a clean base of white musk and cashmeran. Effortlessly wearable from morning to evening.',
  'Luxe Essence',
  54.99, null, 20,
  'a1b2c3d4-0001-0001-0001-000000000004',
  false, true,
  '{"top": ["Juniper Berry", "Cold Mint", "Grapefruit"], "middle": ["Virginia Cedar", "Birch", "Orris"], "base": ["White Musk", "Cashmeran", "Ambrette"]}',
  '[{"size": "50ml", "price": 54.99}, {"size": "100ml", "price": 84.99}]',
  '["https://images.unsplash.com/photo-1605652441986-8c72e43c5f43?q=80&w=800"]',
  now(), now()
),
(
  'b2c3d4e5-0002-0002-0002-000000000005',
  'Rose Absolu',
  'rose-absolu',
  'Turkish rose at its purest — the absolute essence of the world's most beloved flower.',
  'Rose Absolu is an ode to the most cherished flower in perfumery. Sourced from the finest Turkish Damascena roses, this fragrance is a pure celebration of rose in all its facets: fresh petals, honeyed sweetness, and powdery depth. A touch of oud and vetiver grounds the composition and lends unexpected longevity and complexity.',
  'Luxe Essence',
  69.99, 59.99, 15,
  'a1b2c3d4-0001-0001-0001-000000000003',
  true, true,
  '{"top": ["Turkish Rose", "Litchi", "Peach"], "middle": ["Rose Absolute", "Geranium", "Honey"], "base": ["Oud", "Vetiver", "Musk"]}',
  '[{"size": "30ml", "price": 44.99}, {"size": "50ml", "price": 59.99}]',
  '["https://images.unsplash.com/photo-1590156206657-aec37e06ef4a?q=80&w=800"]',
  now(), now()
),
(
  'b2c3d4e5-0002-0002-0002-000000000006',
  'Saffron Noir',
  'saffron-noir',
  'Intoxicating saffron and black oud — a bold, smoky oriental for the bold spirit.',
  'Saffron Noir is an intoxicating journey to the ancient spice markets of the East. It opens with raw saffron and rose, then evolves into a smoky heart of black oud and frankincense. The base rests on a foundation of dark amber, leather, and labdanum. Provocative, powerful, and deeply mesmerizing.',
  'Luxe Essence',
  89.99, null, 10,
  'a1b2c3d4-0001-0001-0001-000000000001',
  false, true,
  '{"top": ["Saffron", "Bulgarian Rose", "Ginger"], "middle": ["Black Oud", "Frankincense", "Smoke"], "base": ["Dark Amber", "Leather", "Labdanum"]}',
  '[{"size": "50ml", "price": 89.99}]',
  '["https://images.unsplash.com/photo-1595535873420-a599195b3f4a?q=80&w=800"]',
  now(), now()
)
on conflict (slug) do nothing;

-- ============================================================
-- MAKE A USER ADMIN (run after creating user via Supabase Auth)
-- Replace the email with your admin email
-- ============================================================
-- update public.profiles
-- set role = 'admin'
-- where id = (
--   select id from auth.users where email = 'admin@luxeessence.com'
-- );
