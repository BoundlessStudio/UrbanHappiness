/*
  # Add API Keys to User Profiles

  1. New Columns
    - `api_key` (text, unique) - User's API key for accessing mock endpoints
    - `api_key_created_at` (timestamp) - When the API key was created/last reset

  2. Security
    - API keys are unique across all users
    - Users can only view and manage their own API key
    - API key is automatically generated on profile creation
*/

-- Add API key columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'api_key'
  ) THEN
    ALTER TABLE profiles ADD COLUMN api_key text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'api_key_created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN api_key_created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS text AS $$
BEGIN
  RETURN 'msa_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have API keys
UPDATE profiles 
SET api_key = generate_api_key(), 
    api_key_created_at = now() 
WHERE api_key IS NULL;

-- Update the handle_new_user function to include API key generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, api_key, api_key_created_at)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    generate_api_key(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for API key lookups
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(api_key);