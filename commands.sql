CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    LIKES integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES (
    'DerBK',
    'https://derbk.com/ancientevils/best-laid-plans-the-path-to-carcosa/',
    'Best-Laid Plans: The Path to Carcosa',
    10
);

INSERT INTO blogs (author, url, title)
VALUES (
    'DerBK',
    'https://derbk.com/ancientevils/best-laid-plans-the-dunwich-legacy/',
    'Best-Laid Plans: The Dunwich Legacy'
);