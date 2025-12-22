-- Migration: Add is_apology column to flower_entries table
-- Run this in your Supabase SQL Editor

-- Add the is_apology column (boolean, defaults to false)
ALTER TABLE flower_entries 
ADD COLUMN IF NOT EXISTS is_apology boolean DEFAULT false;

-- Add the recipient_pin column if it doesn't exist (for consistency with is_compliment)
ALTER TABLE flower_entries 
ADD COLUMN IF NOT EXISTS recipient_pin text;

-- Add the is_compliment column if it doesn't exist (for consistency)
ALTER TABLE flower_entries 
ADD COLUMN IF NOT EXISTS is_compliment boolean DEFAULT false;

