ALTER TABLE news ADD COLUMN badge_en TEXT;
ALTER TABLE news ADD COLUMN title_en TEXT;
ALTER TABLE news ADD COLUMN desc_en TEXT;
ALTER TABLE news ADD COLUMN date_en TEXT;

ALTER TABLE scheduled_articles ADD COLUMN badge_en TEXT;
ALTER TABLE scheduled_articles ADD COLUMN title_en TEXT;
ALTER TABLE scheduled_articles ADD COLUMN desc_en TEXT;

UPDATE news SET
  badge_en = 'Deal',
  title_en = '15% off professional cleaning',
  desc_en = 'Book comprehensive hygiene care (ultrasonic scaling and polishing) and get 20% off the procedure.',
  date_en = 'Until 31 March 2026'
WHERE id = 1;

UPDATE news SET
  badge_en = 'Deal',
  title_en = 'Teeth whitening - 20% off',
  desc_en = 'Get a radiant smile with 20% off Zoom4 whitening in March and April.',
  date_en = 'March - April 2026'
WHERE id = 2;

UPDATE news SET
  badge_en = 'News',
  title_en = 'New premium implant systems',
  desc_en = 'The clinic now offers new implant systems from leading global manufacturers. They provide high osseointegration rates, reliability and a natural aesthetic result.',
  date_en = 'January 2026'
WHERE id = 3;

UPDATE news SET
  badge_en = 'Info',
  title_en = 'Why regular dental check-ups matter',
  desc_en = 'Regular preventive check-ups help avoid serious dental problems. Our doctors recommend a dental examination at least twice a year.',
  date_en = 'January 2026'
WHERE id = 4;

UPDATE news SET
  badge_en = 'Info',
  title_en = 'Implant or bridge: what is better after losing one tooth',
  desc_en = 'The two most common ways to replace a tooth, compared honestly. A dental bridge is fast (2-3 weeks) and does not require surgery, but it requires irreversible reshaping of two healthy neighboring teeth. Bone under the bridge gradually shrinks. In 10-15 years, replacement is usually needed. A dental implant does not affect neighboring teeth, preserves bone, lasts 20-30+ years, and looks and feels like a natural tooth. Downsides: higher initial cost and 2-6 months of osseointegration. Over 20 years, an implant is more cost-effective. Modern standards recommend an implant as the preferred option. Find out which option suits you at a Dentis consultation: dentis.kr.ua',
  date_en = 'March 2026'
WHERE id = 5;

UPDATE news SET
  badge_en = 'Whitening',
  title_en = 'Teeth whitening at home or in the clinic: what to choose?',
  desc_en = 'A bright white smile is a dream for many people. There are many ways to make teeth lighter, from regular whitening toothpaste to laser whitening. But which method truly works, and which can cause harm? Causes of yellowing include coffee, tea, smoking, age-related changes, some antibiotics and genetics. Home whitening (toothpastes, strips, trays) can give 1-4 shades, but without dentist supervision there is a risk of gum damage. Professional whitening at Dentis includes chemical whitening, Zoom, laser whitening and night trays - up to 12 shades in one visit under doctor supervision. Contraindications: children under 16, pregnancy, active caries, crowns and veneers. For a stable result, book a visit at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 6;

UPDATE news SET
  badge_en = 'Implants',
  title_en = 'Dental implants: everything to know before the procedure',
  desc_en = 'Losing a tooth is not only an aesthetic problem. Without a tooth, bone tissue deteriorates, neighboring teeth shift, and chewing becomes worse. The modern answer is a dental implant. An implant is a titanium root placed in the bone, with a crown attached to it. It does not require reshaping neighboring teeth, preserves bone and lasts 20-30 years. The process includes CT diagnostics, placement under anesthesia, 2-6 months of osseointegration and a permanent crown. Indications: missing teeth, desire to replace a denture or bridge. Contraindications: uncontrolled diabetes, blood clotting disorders, pregnancy. Care is the same as for a natural tooth. Free consultation at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 7;

UPDATE news SET
  badge_en = 'Caries',
  title_en = 'Caries treatment: stages, methods and prevention',
  desc_en = 'Caries is the most common dental disease and affects more than 90% of adults. When detected early, it can be treated quickly and painlessly. Stages: spot lesion, superficial, medium, deep, pulpitis and periodontitis. The earlier the stage, the simpler and cheaper the treatment. Treatment includes anesthesia, removal of affected tissue, antiseptic care and a filling. At early stages, remineralization or Icon infiltration may be possible without drilling. Prevention: brush twice a day, floss daily, limit sugar, have check-ups every 6 months, and consider fissure sealing for children. A small filling is much cheaper than root canal treatment. Book a visit at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 8;

UPDATE news SET
  badge_en = 'Prosthetics',
  title_en = 'Dental prosthetics: types, benefits and how to choose',
  desc_en = 'A missing tooth is not only cosmetic. Neighboring teeth shift, bone shrinks and the facial shape changes. Fixed prosthetics include crowns (metal-ceramic, zirconia, e.max), bridges and veneers. Removable options include acrylic and nylon dentures. The best removable option is implant-supported, because it does not shift. All-on-4 and All-on-6 restore a full arch on 4-6 implants in 1-3 days - a fixed construction that preserves bone and looks like natural teeth. The choice depends on the number of missing teeth, bone condition and budget. Dentis provides up to 5 years of warranty on prosthetics: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 9;

UPDATE news SET
  badge_en = 'Whitening',
  title_en = 'Zoom teeth whitening: how it works and what to expect',
  desc_en = 'Zoom is a global standard for photo whitening. In 60-90 minutes, teeth can become 6-12 shades lighter. The principle: a gel with 25-35% hydrogen peroxide is activated by an LED lamp, and oxygen breaks down pigments. Three cycles last 15-20 minutes each. The procedure includes professional cleaning, gum protection, three Zoom cycles and remineralizing fluoride gel. Afterward: a white diet for 48 hours and no smoking. The effect lasts 1-3 years. Contraindications: pregnancy, age under 16, untreated caries, peroxide allergy. Zoom does not whiten crowns or fillings. Book Zoom whitening at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 10;

UPDATE news SET
  badge_en = 'Implants',
  title_en = 'All-on-4: full teeth restoration in one day',
  desc_en = 'All-on-4 is a revolutionary protocol: a full dental arch (10-14 teeth) is supported by 4 strategically placed implants. You arrive without teeth and leave with a smile the same day. Two front implants are placed vertically, and two back implants are placed at a 45 degree angle. This helps avoid atrophic areas and maxillary sinuses without bone grafting. Surgery day: removal of remaining teeth, 4 implants under anesthesia, and a temporary prosthesis on the same day. After 3-6 months, a permanent zirconia prosthesis is placed. Benefits: fixed teeth, natural chewing, bone preservation, durability of 15-20+ years. Free consultation and CT at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 11;

UPDATE news SET
  badge_en = 'Aesthetics',
  title_en = 'Dental veneers: what they are, who they suit and how long they last',
  desc_en = 'A veneer is a thin ceramic facing (0.3-0.7 mm) placed on the front surface of a tooth. It changes color, shape and size - like makeup for teeth. Indications: tetracycline stains, chips, gaps between teeth, uneven edges and worn enamel. Veneers are not suitable for severe crowding or bruxism. Types: ceramic e.max - 10-15 years; zirconia - 15-20 years and the strongest; lumineers - a reversible procedure without grinding; composite - completed in one visit and lasts 3-5 years. The process includes digital smile design, tooth preparation, temporary veneers and permanent veneers after 1-2 weeks. Veneers at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 12;

UPDATE news SET
  badge_en = 'Hygiene',
  title_en = 'Professional teeth cleaning: why, how and how often',
  desc_en = 'Even ideal home hygiene leaves hard-to-reach areas. Dental calculus accumulates there and becomes a major cause of caries, periodontitis and bad breath. Tartar cannot be removed with a toothbrush - only in the clinic. It causes gingivitis (bleeding gums), periodontitis (bone destruction) and halitosis. Professional cleaning includes ultrasonic scaling, Air Flow for coffee and smoking stains, polishing, fluoride treatment and hygiene instruction. After the procedure, teeth feel smooth and become 1-2 shades lighter, and gums stop bleeding. Recommended frequency: every 6 months. Book a visit at Dentis: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 13;

UPDATE news SET
  badge_en = 'Prosthetics',
  title_en = 'Dental crowns: when they are needed, types and lifespan',
  desc_en = 'A crown is an artificial cap that fully covers a tooth. It is indicated when more than 50% of a tooth is damaged, after nerve removal, with cracks or significant wear. Metal-ceramic crowns are strong and affordable, but metal may become visible near the gum over time. Zirconia crowns are metal-free, highly aesthetic and last 15-25 years. All-ceramic e.max is a premium choice for front teeth with the most natural look. The procedure includes tooth preparation, digital impression, temporary crown for 1-2 weeks and permanent fixation. Care: brushing, floss, irrigator and professional cleaning every 6 months. Dentis warranty is up to 5 years: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 14;

UPDATE news SET
  badge_en = 'Psychology',
  title_en = 'Fear of the dentist: how to overcome dentophobia and treat teeth',
  desc_en = 'Every third adult is afraid of the dentist. But fear is expensive: a small filling turns into root canal treatment and then extraction. Modern articaine-based anesthesia fully removes pain. Before the injection, anesthetic gel is applied, making the injection barely noticeable. For patients with strong fear, treatment under sedation (nitrous oxide or intravenous sedation) helps them relax and solve several problems in 1-2 visits. Start with an examination without treatment, agree on a hand signal, and tell the doctor about your fear by phone. At Dentis, you get patience, respect and modern pain control. First consultation is free: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 15;

UPDATE news SET
  badge_en = 'Implants',
  title_en = 'Implant or bridge: what is better after losing one tooth',
  desc_en = 'The two most common ways to replace a tooth, compared honestly. A dental bridge is fast (2-3 weeks) and does not require surgery, but it requires irreversible reshaping of two healthy neighboring teeth. Bone under the bridge gradually shrinks. In 10-15 years, replacement is usually needed. A dental implant does not affect neighboring teeth, preserves bone, lasts 20-30+ years, and looks and feels like a natural tooth. Downsides: higher initial cost and 2-6 months of osseointegration. Over 20 years, an implant is more cost-effective. Modern standards recommend an implant as the preferred option. Find out which option suits you at a Dentis consultation: dentis.kr.ua',
  date_en = '24 June 2026'
WHERE id = 16;

UPDATE news SET
  badge_en = 'Tips',
  title_en = 'How to choose a dentist in Kropyvnytskyi?',
  desc_en = 'Looking for reliable dentistry in Kropyvnytskyi? Today we cover an important topic: how to choose a dentist in Kropyvnytskyi. Regular care and timely visits help prevent complications. Our specialists in Kropyvnytskyi use modern equipment for high-quality and painless treatment. Book a consultation to learn more and receive an individual treatment plan.',
  date_en = '23 June 2026'
WHERE id = 17;
