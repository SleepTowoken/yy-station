-- 垚总远程加油站 / 阶段 3 Storage 配置
-- 只配置今日穿搭图片私有 bucket 和 Storage RLS。
-- 不创建函数，不改阶段 2 表结构。

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'outfit-images',
  'outfit-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
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

comment on column public.outfit_logs.image_path is '今日穿搭图片在私有 Storage bucket 中的对象路径，不是公开 URL。';
