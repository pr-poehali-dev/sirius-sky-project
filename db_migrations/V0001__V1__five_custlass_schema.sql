
CREATE TABLE IF NOT EXISTS club_info (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Five Custlass',
  description TEXT NOT NULL DEFAULT '',
  founded TEXT NOT NULL DEFAULT '2024',
  country TEXT NOT NULL DEFAULT 'International',
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO club_info (title, description, founded, country)
VALUES ('Five Custlass', 'Профессиональная киберспортивная организация по Counter-Strike 2. Пять клинков — одна воля к победе.', '2024', 'International')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  real_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  hltv_rating NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  photo_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  kills_per_round NUMERIC(4,2) DEFAULT 0.70,
  headshot_pct INTEGER DEFAULT 45,
  maps_played INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO players (nickname, real_name, role, country, hltv_rating, kills_per_round, headshot_pct, maps_played, sort_order) VALUES
  ('xinto', 'Xinto', 'StarPlayer', 'UA', 1.31, 0.82, 52, 145, 1),
  ('ba7ka', 'Ba7ka', 'IGL', 'UA', 1.12, 0.71, 44, 150, 2),
  ('mef0mu', 'Mef0mu', 'Rifler', 'UA', 1.19, 0.78, 58, 138, 3),
  ('grommer', 'Grommer', 'Support', 'UA', 1.08, 0.68, 40, 152, 4),
  ('flai1', 'Flai1', 'AWPer', 'UA', 1.24, 0.75, 35, 141, 5)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  opponent TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT '',
  match_date TIMESTAMP,
  score_us INTEGER,
  score_them INTEGER,
  map TEXT DEFAULT '',
  result TEXT DEFAULT 'upcoming',
  stream_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT '',
  place TEXT NOT NULL DEFAULT '1st',
  year INTEGER NOT NULL DEFAULT 2024,
  prize TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);
