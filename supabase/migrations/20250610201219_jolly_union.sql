/*
  # Fix Stripe Foreign Key References

  1. Changes
    - Fix foreign key constraint in stripe_customers table to properly reference auth.users
    - Ensure all Stripe tables have correct relationships
    - Add missing indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user data isolation
*/

-- Fix the foreign key constraint in stripe_customers table
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'stripe_customers_user_id_fkey' 
    AND table_name = 'stripe_customers'
  ) THEN
    ALTER TABLE stripe_customers DROP CONSTRAINT stripe_customers_user_id_fkey;
  END IF;
  
  -- Add correct foreign key constraint
  ALTER TABLE stripe_customers 
    ADD CONSTRAINT stripe_customers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_endpoints_project_id ON endpoints(project_id);

-- Ensure RLS policies are working correctly
GRANT SELECT ON stripe_user_subscriptions TO authenticated;
GRANT SELECT ON stripe_user_orders TO authenticated;