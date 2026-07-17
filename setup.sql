-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  "displayOrder" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY,
  "categoryId" UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "imagePath" TEXT,
  "displayOrder" INTEGER DEFAULT 0
);

-- Note: We use double quotes around camelCase columns to preserve casing in PostgreSQL.
