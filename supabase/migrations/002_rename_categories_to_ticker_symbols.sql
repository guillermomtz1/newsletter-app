-- Rename categories column to ticker_symbols
ALTER TABLE public.user_preferences 
RENAME COLUMN categories TO ticker_symbols;

