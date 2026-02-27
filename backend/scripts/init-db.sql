-- Dogan Consult landing + leads
create table if not exists landing_strings (
  id serial primary key,
  key varchar(128) not null unique,
  en_text text,
  ar_text text
);

create table if not exists leads (
  id serial primary key,
  name varchar(256),
  email varchar(256) not null,
  company varchar(256),
  message text,
  created_at timestamptz default now()
);

insert into landing_strings (key, en_text, ar_text) values
  ('hero_headline', 'ICT Engineering, Delivered.', 'هندسة تقنية المعلومات والاتصالات، مُنفّذة.'),
  ('hero_subline', 'Design, build, and operate enterprise-grade ICT environments.', 'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية.')
on conflict (key) do update set en_text = excluded.en_text, ar_text = excluded.ar_text;
