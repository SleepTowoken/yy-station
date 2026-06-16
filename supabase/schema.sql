-- 垚总远程加油站 / 阶段 3 Supabase schema
-- 前台暗号只是轻量入口，不是安全边界。
-- 真正安全边界：Supabase Auth + admin_users + Row Level Security。
-- 匿名用户只允许主动提交 insert；后台读取和更新仅允许 admin_users 中的管理员。

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  mood text,
  heal_result text,
  note text,
  read boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.supply_requests (
  id uuid primary key default gen_random_uuid(),
  drink_name text,
  drink_category text,
  sugar_preference text default '无糖 / 不额外加糖',
  ice_preference text,
  delivery_method text,
  address text,
  phone text,
  contact_note text,
  available_time text,
  user_note text,
  status text default 'pending' check (status in ('pending', 'arranged', 'delivered', 'cancelled')),
  order_platform text,
  pickup_code text,
  eta text,
  admin_note text,
  sensitive_cleared boolean default false,
  read boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.rhythm_logs (
  id uuid primary key default gen_random_uuid(),
  current_status text,
  soft_reminder text,
  rest_status text,
  note text,
  read boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.outfit_logs (
  id uuid primary key default gen_random_uuid(),
  style text,
  mode text,
  generated_comment text,
  user_note text,
  image_path text,
  reviewed boolean default false,
  read boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.spark_logs (
  id uuid primary key default gen_random_uuid(),
  fire_status text,
  action_type text,
  generated_text text,
  note text,
  read boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.guest_messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists admin_users_email_idx on public.admin_users (email);
create index if not exists mood_logs_created_at_idx on public.mood_logs (created_at desc);
create index if not exists mood_logs_read_idx on public.mood_logs (read);
create index if not exists supply_requests_created_at_idx on public.supply_requests (created_at desc);
create index if not exists supply_requests_read_idx on public.supply_requests (read);
create index if not exists supply_requests_status_idx on public.supply_requests (status);
create index if not exists rhythm_logs_created_at_idx on public.rhythm_logs (created_at desc);
create index if not exists rhythm_logs_read_idx on public.rhythm_logs (read);
create index if not exists outfit_logs_created_at_idx on public.outfit_logs (created_at desc);
create index if not exists outfit_logs_read_idx on public.outfit_logs (read);
create index if not exists outfit_logs_reviewed_idx on public.outfit_logs (reviewed);
create index if not exists spark_logs_created_at_idx on public.spark_logs (created_at desc);
create index if not exists spark_logs_read_idx on public.spark_logs (read);
create index if not exists guest_messages_created_at_idx on public.guest_messages (created_at desc);
create index if not exists guest_messages_read_idx on public.guest_messages (read);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_supply_requests_updated_at on public.supply_requests;
create trigger set_supply_requests_updated_at
before update on public.supply_requests
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.mood_logs enable row level security;
alter table public.supply_requests enable row level security;
alter table public.rhythm_logs enable row level security;
alter table public.outfit_logs enable row level security;
alter table public.spark_logs enable row level security;
alter table public.guest_messages enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Anyone can insert mood logs" on public.mood_logs;
create policy "Anyone can insert mood logs"
on public.mood_logs
for insert
to anon
with check (true);

drop policy if exists "Admins can insert mood logs from frontend" on public.mood_logs;
create policy "Admins can insert mood logs from frontend"
on public.mood_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Only admins can read mood logs" on public.mood_logs;
create policy "Only admins can read mood logs"
on public.mood_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update mood logs" on public.mood_logs;
create policy "Only admins can update mood logs"
on public.mood_logs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can insert supply requests" on public.supply_requests;
create policy "Anyone can insert supply requests"
on public.supply_requests
for insert
to anon
with check (true);

drop policy if exists "Admins can insert supply requests from frontend" on public.supply_requests;
create policy "Admins can insert supply requests from frontend"
on public.supply_requests
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Only admins can read supply requests" on public.supply_requests;
create policy "Only admins can read supply requests"
on public.supply_requests
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update supply requests" on public.supply_requests;
create policy "Only admins can update supply requests"
on public.supply_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can insert rhythm logs" on public.rhythm_logs;
create policy "Anyone can insert rhythm logs"
on public.rhythm_logs
for insert
to anon
with check (true);

drop policy if exists "Admins can insert rhythm logs from frontend" on public.rhythm_logs;
create policy "Admins can insert rhythm logs from frontend"
on public.rhythm_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Only admins can read rhythm logs" on public.rhythm_logs;
create policy "Only admins can read rhythm logs"
on public.rhythm_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update rhythm logs" on public.rhythm_logs;
create policy "Only admins can update rhythm logs"
on public.rhythm_logs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can insert outfit logs" on public.outfit_logs;
create policy "Anyone can insert outfit logs"
on public.outfit_logs
for insert
to anon
with check (true);

drop policy if exists "Admins can insert outfit logs from frontend" on public.outfit_logs;
create policy "Admins can insert outfit logs from frontend"
on public.outfit_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Only admins can read outfit logs" on public.outfit_logs;
create policy "Only admins can read outfit logs"
on public.outfit_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update outfit logs" on public.outfit_logs;
create policy "Only admins can update outfit logs"
on public.outfit_logs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can insert spark logs" on public.spark_logs;
create policy "Anyone can insert spark logs"
on public.spark_logs
for insert
to anon
with check (true);

drop policy if exists "Admins can insert spark logs from frontend" on public.spark_logs;
create policy "Admins can insert spark logs from frontend"
on public.spark_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Only admins can read spark logs" on public.spark_logs;
create policy "Only admins can read spark logs"
on public.spark_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update spark logs" on public.spark_logs;
create policy "Only admins can update spark logs"
on public.spark_logs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- guest_messages 阶段 2 只预留建表和后台读取能力；前台暂不暴露入口，也暂不开放匿名 insert。
drop policy if exists "Anyone can insert guest messages" on public.guest_messages;

drop policy if exists "Only admins can read guest messages" on public.guest_messages;
create policy "Only admins can read guest messages"
on public.guest_messages
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can update guest messages" on public.guest_messages;
create policy "Only admins can update guest messages"
on public.guest_messages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 阶段 3：今日穿搭图片进入 Supabase Storage 私有 bucket。
-- 前台只能在用户主动点击发送时上传；匿名用户不能读取图片。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'outfit-images',
  'outfit-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload outfit images" on storage.objects;
create policy "Anyone can upload outfit images"
on storage.objects
for insert
to anon
with check (bucket_id = 'outfit-images');

drop policy if exists "Admins can upload outfit images" on storage.objects;
create policy "Admins can upload outfit images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'outfit-images' and public.is_admin());

drop policy if exists "Only admins can read outfit images" on storage.objects;
create policy "Only admins can read outfit images"
on storage.objects
for select
to authenticated
using (bucket_id = 'outfit-images' and public.is_admin());

comment on table public.admin_users is '管理员白名单。只有 Supabase Auth 用户同时存在于此表，才可读取后台数据。';
comment on table public.supply_requests is '能量补给请求。address、phone、contact_note 属于敏感信息，后台可清除。';
comment on column public.supply_requests.sensitive_cleared is '为 true 表示地址、电话、取餐备注等敏感字段已由管理员清除。';
comment on column public.outfit_logs.image_path is '今日穿搭图片在私有 Storage bucket 中的对象路径，不是公开 URL。';
