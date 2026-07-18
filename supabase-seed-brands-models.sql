-- =============================================================================
-- SEED: Major worldwide car manufacturers + their common models
-- Run this in the Supabase SQL Editor.
--
-- Idempotent WITHOUT relying on any UNIQUE constraint: each row is inserted
-- only if a matching row does not already exist (WHERE NOT EXISTS). Safe to
-- re-run; never duplicates and never overwrites what you already have.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) BRANDS
-- ---------------------------------------------------------------------------
insert into public.brands (name, name_ar, slug, is_active, sort_order)
select v.name, v.name_ar, v.slug, true, 10
from (
  values
    ('Toyota',        'تويوتا',        'toyota'),
    ('Honda',         'هوندا',         'honda'),
    ('Nissan',        'نيسان',         'nissan'),
    ('Hyundai',       'هيونداي',       'hyundai'),
    ('Kia',           'كيا',           'kia'),
    ('BMW',           'بي إم دبليو',   'bmw'),
    ('Mercedes-Benz', 'مرسيدس بنز',    'mercedes-benz'),
    ('Audi',          'أودي',          'audi'),
    ('Volkswagen',    'فولكس فاجن',    'volkswagen'),
    ('Ford',          'فورد',          'ford'),
    ('Chevrolet',     'شيفروليه',      'chevrolet'),
    ('GMC',           'جي إم سي',      'gmc'),
    ('Jeep',          'جيب',           'jeep'),
    ('Lexus',         'لكزس',          'lexus'),
    ('Mazda',         'مازدا',         'mazda'),
    ('Subaru',        'سوبارو',        'subaru'),
    ('Volvo',         'فولفو',         'volvo'),
    ('Land Rover',    'لاند روفر',     'land-rover'),
    ('Range Rover',   'رينج روفر',     'range-rover'),
    ('Porsche',       'بورش',          'porsche'),
    ('Ferrari',       'فيراري',        'ferrari'),
    ('Lamborghini',   'لامبورغيني',    'lamborghini'),
    ('Bentley',       'بنتلي',         'bentley'),
    ('Rolls-Royce',   'رولز رويس',     'rolls-royce'),
    ('Tesla',         'تسلا',          'tesla'),
    ('BYD',           'بي واي دي',     'byd'),
    ('Geely',         'جيلي',          'geely'),
    ('Changan',       'تشانجان',       'changan'),
    ('MG',            'إم جي',         'mg'),
    ('Peugeot',       'بيجو',          'peugeot'),
    ('Renault',       'رينو',          'renault'),
    ('Skoda',         'سكودا',         'skoda'),
    ('Suzuki',        'سوزوكي',        'suzuki'),
    ('Mitsubishi',    'ميتسوبيشي',     'mitsubishi'),
    ('Isuzu',         'إيسوزو',        'isuzu'),
    ('Infiniti',      'إنفينيتي',      'infiniti'),
    ('Acura',         'أكورا',         'acura'),
    ('Cadillac',      'كاديلاك',       'cadillac'),
    ('Lincoln',       'لينكولن',       'lincoln'),
    ('Mini',          'ميني',          'mini'),
    ('Jaguar',        'جاكوار',        'jaguar'),
    ('Alfa Romeo',    'ألفا روميو',    'alfa-romeo'),
    ('Fiat',          'فيات',          'fiat'),
    ('Aston Martin',  'أستون مارتن',   'aston-martin'),
    ('Maserati',      'مازيراتي',      'maserati'),
    ('McLaren',       'مكلارين',       'mclaren'),
    ('Bugatti',       'بوغاتي',        'bugatti'),
    ('Dodge',         'دودج',          'dodge'),
    ('RAM',           'رام',           'ram'),
    ('Chrysler',      'كرايسلر',       'chrysler'),
    ('Genesis',       'جينيسيس',       'genesis')
) as v(name, name_ar, slug)
where not exists (
  select 1 from public.brands b where b.slug = v.slug
);

-- ---------------------------------------------------------------------------
-- 2) MODELS  (common models per brand)
-- brand_id is resolved by slug so this block is independent of brand UUIDs.
-- ---------------------------------------------------------------------------
insert into public.models (brand_id, name, name_ar, slug, is_active, sort_order)
select b.id, m.name, m.name_ar, m.slug, true, 10
from (
  values
    -- Toyota
    ('toyota', 'Camry',        'كامري',        'toyota-camry'),
    ('toyota', 'Corolla',      'كورولا',       'toyota-corolla'),
    ('toyota', 'Land Cruiser', 'لاند كروزر',   'toyota-land-cruiser'),
    ('toyota', 'Prado',        'برادو',        'toyota-prado'),
    ('toyota', 'RAV4',         'راف 4',        'toyota-rav4'),
    ('toyota', 'Hilux',        'هايلكس',       'toyota-hilux'),
    ('toyota', 'Fortuner',     'فورتشنر',      'toyota-fortuner'),
    ('toyota', 'Yaris',        'يارس',         'toyota-yaris'),
    ('toyota', 'Highlander',   'هايلاندر',     'toyota-highlander'),
    ('toyota', 'Avalon',       'أفالون',       'toyota-avalon'),
    ('toyota', 'Supra',        'سوبرا',        'toyota-supra'),
    -- Honda
    ('honda', 'Civic',       'سيفيك',       'honda-civic'),
    ('honda', 'Accord',      'أكورد',       'honda-accord'),
    ('honda', 'CR-V',        'سي آر في',    'honda-cr-v'),
    ('honda', 'Pilot',       'بايلوت',      'honda-pilot'),
    ('honda', 'HR-V',        'إتش آر في',   'honda-hr-v'),
    ('honda', 'City',        'سيتي',        'honda-city'),
    ('honda', 'Odyssey',     'أوديسي',      'honda-odyssey'),
    -- Nissan
    ('nissan', 'Altima',    'التيما',      'nissan-altima'),
    ('nissan', 'Maxima',    'ماكسيما',     'nissan-maxima'),
    ('nissan', 'Sunny',     'صني',         'nissan-sunny'),
    ('nissan', 'Patrol',    'باترول',      'nissan-patrol'),
    ('nissan', 'X-Trail',   'إكس تريل',    'nissan-x-trail'),
    ('nissan', 'Kicks',     'كيكس',        'nissan-kicks'),
    ('nissan', 'Pathfinder','باثفايندر',   'nissan-pathfinder'),
    ('nissan', 'GT-R',      'جي تي آر',    'nissan-gt-r'),
    -- Hyundai
    ('hyundai', 'Elantra',   'إلنترا',      'hyundai-elantra'),
    ('hyundai', 'Sonata',    'سوناتا',      'hyundai-sonata'),
    ('hyundai', 'Accent',    'أكسنت',       'hyundai-accent'),
    ('hyundai', 'Tucson',    'توسان',       'hyundai-tucson'),
    ('hyundai', 'Santa Fe',  'سنتافي',      'hyundai-santa-fe'),
    ('hyundai', 'Palisade',  'باليسيد',     'hyundai-palisade'),
    ('hyundai', 'Creta',     'كريتا',       'hyundai-creta'),
    -- Kia
    ('kia', 'Optima',     'أوبتيما',     'kia-optima'),
    ('kia', 'Cerato',     'سيراتو',      'kia-cerato'),
    ('kia', 'Sportage',   'سبورتاج',     'kia-sportage'),
    ('kia', 'Sorento',    'سورينتو',     'kia-sorento'),
    ('kia', 'Seltos',     'سيلتوس',      'kia-seltos'),
    ('kia', 'Carnival',   'كرنفال',      'kia-carnival'),
    ('kia', 'Telluride',  'تيلورايد',    'kia-telluride'),
    -- BMW
    ('bmw', '3 Series',  'الفئة الثالثة', 'bmw-3-series'),
    ('bmw', '5 Series',  'الفئة الخامسة', 'bmw-5-series'),
    ('bmw', '7 Series',  'الفئة السابعة', 'bmw-7-series'),
    ('bmw', 'X1',        'إكس 1',        'bmw-x1'),
    ('bmw', 'X3',        'إكس 3',        'bmw-x3'),
    ('bmw', 'X5',        'إكس 5',        'bmw-x5'),
    ('bmw', 'X6',        'إكس 6',        'bmw-x6'),
    ('bmw', 'X7',        'إكس 7',        'bmw-x7'),
    ('bmw', 'M3',        'إم 3',         'bmw-m3'),
    ('bmw', 'M5',        'إم 5',         'bmw-m5'),
    -- Mercedes-Benz
    ('mercedes-benz', 'C-Class',  'الفئة C',   'mercedes-c-class'),
    ('mercedes-benz', 'E-Class',  'الفئة E',   'mercedes-e-class'),
    ('mercedes-benz', 'S-Class',  'الفئة S',   'mercedes-s-class'),
    ('mercedes-benz', 'A-Class',  'الفئة A',   'mercedes-a-class'),
    ('mercedes-benz', 'GLA',      'جي إل إيه', 'mercedes-gla'),
    ('mercedes-benz', 'GLC',      'جي إل سي',  'mercedes-glc'),
    ('mercedes-benz', 'GLE',      'جي إل إي',  'mercedes-gle'),
    ('mercedes-benz', 'GLS',      'جي إل إس',  'mercedes-gls'),
    ('mercedes-benz', 'G-Class',  'جي كلاس',   'mercedes-g-class'),
    -- Audi
    ('audi', 'A3',  'إيه 3',  'audi-a3'),
    ('audi', 'A4',  'إيه 4',  'audi-a4'),
    ('audi', 'A6',  'إيه 6',  'audi-a6'),
    ('audi', 'A8',  'إيه 8',  'audi-a8'),
    ('audi', 'Q3',  'كيو 3',  'audi-q3'),
    ('audi', 'Q5',  'كيو 5',  'audi-q5'),
    ('audi', 'Q7',  'كيو 7',  'audi-q7'),
    ('audi', 'Q8',  'كيو 8',  'audi-q8'),
    -- Volkswagen
    ('volkswagen', 'Golf',    'جولف',    'volkswagen-golf'),
    ('volkswagen', 'Passat',  'باسات',   'volkswagen-passat'),
    ('volkswagen', 'Tiguan',  'تيجوان',  'volkswagen-tiguan'),
    ('volkswagen', 'Touareg', 'طوارق',   'volkswagen-touareg'),
    ('volkswagen', 'Jetta',   'جيتا',    'volkswagen-jetta'),
    -- Ford
    ('ford', 'F-150',      'إف 150',    'ford-f-150'),
    ('ford', 'Mustang',    'موستانج',   'ford-mustang'),
    ('ford', 'Explorer',   'إكسبلورر',  'ford-explorer'),
    ('ford', 'Expedition', 'إكسبيديشن', 'ford-expedition'),
    ('ford', 'Edge',       'إيدج',      'ford-edge'),
    ('ford', 'Bronco',     'برونكو',    'ford-bronco'),
    ('ford', 'Ranger',     'رينجر',     'ford-ranger'),
    -- Chevrolet
    ('chevrolet', 'Malibu',    'ماليبو',    'chevrolet-malibu'),
    ('chevrolet', 'Camaro',    'كامارو',    'chevrolet-camaro'),
    ('chevrolet', 'Corvette',  'كورفيت',    'chevrolet-corvette'),
    ('chevrolet', 'Tahoe',     'تاهو',      'chevrolet-tahoe'),
    ('chevrolet', 'Suburban',  'سوبربان',   'chevrolet-suburban'),
    ('chevrolet', 'Silverado', 'سيلفرادو',  'chevrolet-silverado'),
    ('chevrolet', 'Traverse',  'ترافيرس',   'chevrolet-traverse'),
    -- GMC
    ('gmc', 'Sierra',  'سييرا',   'gmc-sierra'),
    ('gmc', 'Yukon',   'يوكن',    'gmc-yukon'),
    ('gmc', 'Acadia',  'أكاديا',  'gmc-acadia'),
    ('gmc', 'Terrain', 'تيرين',   'gmc-terrain'),
    -- Jeep
    ('jeep', 'Wrangler',        'رانجلر',        'jeep-wrangler'),
    ('jeep', 'Grand Cherokee',  'جراند شيروكي',  'jeep-grand-cherokee'),
    ('jeep', 'Cherokee',        'شيروكي',        'jeep-cherokee'),
    ('jeep', 'Compass',         'كومباس',        'jeep-compass'),
    ('jeep', 'Gladiator',       'جلادييتور',     'jeep-gladiator'),
    -- Lexus
    ('lexus', 'ES',  'إي إس',  'lexus-es'),
    ('lexus', 'IS',  'آي إس',  'lexus-is'),
    ('lexus', 'LS',  'إل إس',  'lexus-ls'),
    ('lexus', 'RX',  'آر إكس', 'lexus-rx'),
    ('lexus', 'NX',  'إن إكس', 'lexus-nx'),
    ('lexus', 'GX',  'جي إكس', 'lexus-gx'),
    ('lexus', 'LX',  'إل إكس', 'lexus-lx'),
    -- Mazda
    ('mazda', 'Mazda3',  'مازدا 3',  'mazda-3'),
    ('mazda', 'Mazda6',  'مازدا 6',  'mazda-6'),
    ('mazda', 'CX-3',    'سي إكس 3', 'mazda-cx-3'),
    ('mazda', 'CX-5',    'سي إكس 5', 'mazda-cx-5'),
    ('mazda', 'CX-9',    'سي إكس 9', 'mazda-cx-9'),
    ('mazda', 'MX-5',    'إم إكس 5', 'mazda-mx-5'),
    -- Subaru
    ('subaru', 'Impreza',   'إمبريزا',   'subaru-impreza'),
    ('subaru', 'Legacy',    'ليجاسي',    'subaru-legacy'),
    ('subaru', 'Outback',   'أوتباك',    'subaru-outback'),
    ('subaru', 'Forester',  'فورستر',    'subaru-forester'),
    ('subaru', 'WRX',       'دبليو آر إكس','subaru-wrx'),
    -- Volvo
    ('volvo', 'S60',  'إس 60',  'volvo-s60'),
    ('volvo', 'S90',  'إس 90',  'volvo-s90'),
    ('volvo', 'XC40', 'إكس سي 40','volvo-xc40'),
    ('volvo', 'XC60', 'إكس سي 60','volvo-xc60'),
    ('volvo', 'XC90', 'إكس سي 90','volvo-xc90'),
    -- Land Rover
    ('land-rover', 'Defender',   'ديفندر',    'land-rover-defender'),
    ('land-rover', 'Discovery',  'ديسكفري',   'land-rover-discovery'),
    ('land-rover', 'Freelander', 'فريلاندر',  'land-rover-freelander'),
    -- Range Rover
    ('range-rover', 'Range Rover',        'رينج روفر',        'range-rover-full'),
    ('range-rover', 'Range Rover Sport',  'رينج روفر سبورت',  'range-rover-sport'),
    ('range-rover', 'Evoque',             'إيفوك',            'range-rover-evoque'),
    ('range-rover', 'Velar',              'فيلار',            'range-rover-velar'),
    -- Porsche
    ('porsche', '911',       '911',       'porsche-911'),
    ('porsche', 'Cayenne',   'كايين',     'porsche-cayenne'),
    ('porsche', 'Macan',     'ماكان',     'porsche-macan'),
    ('porsche', 'Panamera',  'باناميرا',  'porsche-panamera'),
    ('porsche', 'Taycan',    'تايكان',    'porsche-taycan'),
    ('porsche', 'Cayman',    'كايمان',    'porsche-cayman'),
    -- Ferrari
    ('ferrari', 'Roma',       'روما',       'ferrari-roma'),
    ('ferrari', 'SF90',       'إس إف 90',   'ferrari-sf90'),
    ('ferrari', '296 GTB',    '296 جي تي بي','ferrari-296-gtb'),
    ('ferrari', 'F8 Tributo', 'إف 8',       'ferrari-f8-tributo'),
    ('ferrari', 'Purosangue', 'بوروسانجي',  'ferrari-purosangue'),
    -- Lamborghini
    ('lamborghini', 'Huracan',  'هوراكان',  'lamborghini-huracan'),
    ('lamborghini', 'Aventador','أفينتادور','lamborghini-aventador'),
    ('lamborghini', 'Urus',     'أوروس',    'lamborghini-urus'),
    ('lamborghini', 'Revuelto', 'ريفويلتو', 'lamborghini-revuelto'),
    -- Bentley
    ('bentley', 'Continental GT', 'كونتيننتال جي تي', 'bentley-continental-gt'),
    ('bentley', 'Bentayga',       'بنتايجا',          'bentley-bentayga'),
    ('bentley', 'Flying Spur',    'فلاينج سبير',      'bentley-flying-spur'),
    -- Rolls-Royce
    ('rolls-royce', 'Phantom',  'فانتوم',  'rolls-royce-phantom'),
    ('rolls-royce', 'Ghost',    'غوست',    'rolls-royce-ghost'),
    ('rolls-royce', 'Cullinan', 'كولينان', 'rolls-royce-cullinan'),
    ('rolls-royce', 'Spectre',  'سبكتر',   'rolls-royce-spectre'),
    -- Tesla
    ('tesla', 'Model S',  'موديل إس',  'tesla-model-s'),
    ('tesla', 'Model 3',  'موديل 3',   'tesla-model-3'),
    ('tesla', 'Model X',  'موديل إكس', 'tesla-model-x'),
    ('tesla', 'Model Y',  'موديل واي', 'tesla-model-y'),
    ('tesla', 'Cybertruck','سايبرتراك','tesla-cybertruck'),
    -- BYD
    ('byd', 'Atto 3', 'أتو 3',  'byd-atto-3'),
    ('byd', 'Han',    'هان',    'byd-han'),
    ('byd', 'Tang',   'تانج',   'byd-tang'),
    ('byd', 'Seal',   'سيل',    'byd-seal'),
    ('byd', 'Dolphin','دولفين', 'byd-dolphin'),
    -- Geely
    ('geely', 'Coolray',   'كولراي',   'geely-coolray'),
    ('geely', 'Emgrand',   'إمجراند',  'geely-emgrand'),
    ('geely', 'Azkarra',   'أزكارا',   'geely-azkarra'),
    ('geely', 'Tugella',   'توجيلا',   'geely-tugella'),
    -- Changan
    ('changan', 'CS35',   'سي إس 35', 'changan-cs35'),
    ('changan', 'CS75',   'سي إس 75', 'changan-cs75'),
    ('changan', 'CS85',   'سي إس 85', 'changan-cs85'),
    ('changan', 'Eado',   'إيدو',     'changan-eado'),
    -- MG
    ('mg', 'MG5',   'إم جي 5',  'mg-5'),
    ('mg', 'MG6',   'إم جي 6',  'mg-6'),
    ('mg', 'ZS',    'زد إس',    'mg-zs'),
    ('mg', 'HS',    'إتش إس',   'mg-hs'),
    ('mg', 'RX5',   'آر إكس 5', 'mg-rx5'),
    -- Peugeot
    ('peugeot', '208',  '208',  'peugeot-208'),
    ('peugeot', '308',  '308',  'peugeot-308'),
    ('peugeot', '2008', '2008', 'peugeot-2008'),
    ('peugeot', '3008', '3008', 'peugeot-3008'),
    ('peugeot', '5008', '5008', 'peugeot-5008'),
    -- Renault
    ('renault', 'Megane',  'ميجان',   'renault-megane'),
    ('renault', 'Clio',    'كليو',    'renault-clio'),
    ('renault', 'Duster',  'داستر',   'renault-duster'),
    ('renault', 'Koleos',  'كوليوس',  'renault-koleos'),
    ('renault', 'Captur',  'كابتشر',  'renault-captur'),
    -- Skoda
    ('skoda', 'Octavia',  'أوكتافيا', 'skoda-octavia'),
    ('skoda', 'Superb',   'سوبيرب',   'skoda-superb'),
    ('skoda', 'Kodiaq',   'كودياك',   'skoda-kodiaq'),
    ('skoda', 'Karoq',    'كاروك',    'skoda-karoq'),
    -- Suzuki
    ('suzuki', 'Swift',    'سويفت',    'suzuki-swift'),
    ('suzuki', 'Vitara',   'فيتارا',   'suzuki-vitara'),
    ('suzuki', 'Jimny',    'جيمني',    'suzuki-jimny'),
    ('suzuki', 'Baleno',   'بالينو',   'suzuki-baleno'),
    ('suzuki', 'Ciaz',     'سياز',     'suzuki-ciaz'),
    -- Mitsubishi
    ('mitsubishi', 'Lancer',    'لانسر',    'mitsubishi-lancer'),
    ('mitsubishi', 'Pajero',    'باجيرو',   'mitsubishi-pajero'),
    ('mitsubishi', 'Outlander', 'أوتلاندر', 'mitsubishi-outlander'),
    ('mitsubishi', 'ASX',       'إيه إس إكس','mitsubishi-asx'),
    ('mitsubishi', 'L200',      'إل 200',   'mitsubishi-l200'),
    -- Isuzu
    ('isuzu', 'D-Max',  'دي ماكس', 'isuzu-d-max'),
    ('isuzu', 'MU-X',   'إم يو إكس','isuzu-mu-x'),
    -- Infiniti
    ('infiniti', 'Q50',  'كيو 50',  'infiniti-q50'),
    ('infiniti', 'Q60',  'كيو 60',  'infiniti-q60'),
    ('infiniti', 'QX50', 'كيو إكس 50','infiniti-qx50'),
    ('infiniti', 'QX60', 'كيو إكس 60','infiniti-qx60'),
    ('infiniti', 'QX80', 'كيو إكس 80','infiniti-qx80'),
    -- Acura
    ('acura', 'ILX',  'آي إل إكس', 'acura-ilx'),
    ('acura', 'TLX',  'تي إل إكس', 'acura-tlx'),
    ('acura', 'MDX',  'إم دي إكس', 'acura-mdx'),
    ('acura', 'RDX',  'آر دي إكس', 'acura-rdx'),
    -- Cadillac
    ('cadillac', 'Escalade', 'إسكاليد',  'cadillac-escalade'),
    ('cadillac', 'CT5',      'سي تي 5',  'cadillac-ct5'),
    ('cadillac', 'XT5',      'إكس تي 5', 'cadillac-xt5'),
    ('cadillac', 'XT6',      'إكس تي 6', 'cadillac-xt6'),
    -- Lincoln
    ('lincoln', 'Navigator', 'نافيجيتور', 'lincoln-navigator'),
    ('lincoln', 'Aviator',   'أفييتور',   'lincoln-aviator'),
    ('lincoln', 'Nautilus',  'نوتيلوس',   'lincoln-nautilus'),
    ('lincoln', 'Corsair',   'كورسير',    'lincoln-corsair'),
    -- Mini
    ('mini', 'Cooper',    'كوبر',     'mini-cooper'),
    ('mini', 'Countryman','كنتريمان', 'mini-countryman'),
    ('mini', 'Clubman',   'كلوبمان',  'mini-clubman'),
    -- Jaguar
    ('jaguar', 'XE',    'إكس إي',   'jaguar-xe'),
    ('jaguar', 'XF',    'إكس إف',   'jaguar-xf'),
    ('jaguar', 'F-Pace','إف بيس',   'jaguar-f-pace'),
    ('jaguar', 'E-Pace','إي بيس',   'jaguar-e-pace'),
    ('jaguar', 'F-Type','إف تايب',  'jaguar-f-type'),
    -- Alfa Romeo
    ('alfa-romeo', 'Giulia',   'جوليا',    'alfa-romeo-giulia'),
    ('alfa-romeo', 'Stelvio',  'ستيلفيو',  'alfa-romeo-stelvio'),
    ('alfa-romeo', 'Tonale',   'تونالي',   'alfa-romeo-tonale'),
    -- Fiat
    ('fiat', '500',    '500',     'fiat-500'),
    ('fiat', 'Tipo',   'تيبو',    'fiat-tipo'),
    ('fiat', 'Panda',  'باندا',   'fiat-panda'),
    -- Aston Martin
    ('aston-martin', 'DB11',    'دي بي 11', 'aston-martin-db11'),
    ('aston-martin', 'DB12',    'دي بي 12', 'aston-martin-db12'),
    ('aston-martin', 'Vantage', 'فانتاج',   'aston-martin-vantage'),
    ('aston-martin', 'DBX',     'دي بي إكس','aston-martin-dbx'),
    -- Maserati
    ('maserati', 'Ghibli',    'غيبلي',    'maserati-ghibli'),
    ('maserati', 'Quattroporte','كواتروبورتي','maserati-quattroporte'),
    ('maserati', 'Levante',   'ليفانتي',  'maserati-levante'),
    ('maserati', 'Grecale',   'جريكالي',  'maserati-grecale'),
    ('maserati', 'MC20',      'إم سي 20', 'maserati-mc20'),
    -- McLaren
    ('mclaren', '720S',   '720 إس',  'mclaren-720s'),
    ('mclaren', '750S',   '750 إس',  'mclaren-750s'),
    ('mclaren', 'Artura', 'أرتورا',  'mclaren-artura'),
    ('mclaren', 'GT',     'جي تي',   'mclaren-gt'),
    -- Bugatti
    ('bugatti', 'Chiron',  'شيرون',  'bugatti-chiron'),
    ('bugatti', 'Veyron',  'فيرون',  'bugatti-veyron'),
    ('bugatti', 'Tourbillon','توربيون','bugatti-tourbillon'),
    -- Dodge
    ('dodge', 'Charger',   'تشارجر',   'dodge-charger'),
    ('dodge', 'Challenger','تشالنجر',  'dodge-challenger'),
    ('dodge', 'Durango',   'دورانجو',  'dodge-durango'),
    -- RAM
    ('ram', '1500',  '1500', 'ram-1500'),
    ('ram', '2500',  '2500', 'ram-2500'),
    ('ram', '3500',  '3500', 'ram-3500'),
    -- Chrysler
    ('chrysler', '300',      '300',       'chrysler-300'),
    ('chrysler', 'Pacifica', 'باسيفيكا',  'chrysler-pacifica'),
    -- Genesis
    ('genesis', 'G70',  'جي 70',   'genesis-g70'),
    ('genesis', 'G80',  'جي 80',   'genesis-g80'),
    ('genesis', 'G90',  'جي 90',   'genesis-g90'),
    ('genesis', 'GV70', 'جي في 70','genesis-gv70'),
    ('genesis', 'GV80', 'جي في 80','genesis-gv80')
) as m(brand_slug, name, name_ar, slug)
join public.brands b on b.slug = m.brand_slug
where not exists (
  select 1 from public.models mm
  where mm.brand_id = b.id and mm.slug = m.slug
);

-- ---------------------------------------------------------------------------
-- 3) Verify (optional — uncomment to see counts per brand)
-- ---------------------------------------------------------------------------
-- select b.name, count(m.id) as models
-- from public.brands b
-- left join public.models m on m.brand_id = b.id
-- group by b.name order by b.name;
