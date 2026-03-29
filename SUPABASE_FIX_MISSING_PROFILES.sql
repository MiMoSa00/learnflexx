-- Run this script in the Supabase SQL Editor to retroactively create profiles
-- for any users who signed up BEFORE you ran the FULL_SETUP script.

insert into public.profiles (id, full_name, phone, location, subscription_id)
select 
  id,
  raw_user_meta_data ->> 'full_name',
  raw_user_meta_data ->> 'phone',
  raw_user_meta_data ->> 'location',
  null
from auth.users
where not exists (
  select 1 from public.profiles where profiles.id = auth.users.id
);
