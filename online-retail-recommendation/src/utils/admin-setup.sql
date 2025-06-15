-- Admin Setup Script
-- Run this SQL in the Supabase SQL Editor to grant admin role to a user

-- Replace 'user@example.com' with the actual email of the user you want to make admin
-- This will find the user by email and assign them the admin role

INSERT INTO public.user_roles (user_id, role)
SELECT 
  auth.users.id,
  'admin'::app_role
FROM auth.users 
WHERE auth.users.email = 'user@example.com'  -- Replace with actual email
ON CONFLICT (user_id, role) DO NOTHING;

-- To check current user roles:
-- SELECT u.email, ur.role 
-- FROM auth.users u 
-- JOIN public.user_roles ur ON u.id = ur.user_id;

-- To remove admin role from a user:
-- DELETE FROM public.user_roles 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
-- AND role = 'admin';