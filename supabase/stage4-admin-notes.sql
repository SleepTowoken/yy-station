-- 阶段 4：垚总补给箱 / 管理员小纸条
-- 本文件只创建管理员发布内容所需的表和 RLS。
-- 不创建已读表、访问日志表、在线状态表，也不记录前台查看行为。

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text not null,
  note_type text not null default 'note',
  status text not null default 'draft',
  pinned boolean not null default false,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,

  constraint admin_notes_note_type_check
    check (note_type in ('note', 'comfort', 'reminder', 'goodnight')),

  constraint admin_notes_status_check
    check (status in ('draft', 'published', 'archived')),

  constraint admin_notes_content_length_check
    check (char_length(content) <= 5000),

  constraint admin_notes_title_length_check
    check (title is null or char_length(title) <= 120)
);

create index if not exists admin_notes_public_list_idx
on public.admin_notes (status, pinned desc, published_at desc, created_at desc);

create index if not exists admin_notes_admin_list_idx
on public.admin_notes (status, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_notes_updated_at on public.admin_notes;

create trigger set_admin_notes_updated_at
before update on public.admin_notes
for each row
execute function public.set_updated_at();

alter table public.admin_notes enable row level security;

drop policy if exists "Anyone can read published admin notes" on public.admin_notes;
create policy "Anyone can read published admin notes"
on public.admin_notes
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all admin notes" on public.admin_notes;
create policy "Admins can read all admin notes"
on public.admin_notes
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert admin notes" on public.admin_notes;
create policy "Admins can insert admin notes"
on public.admin_notes
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update admin notes" on public.admin_notes;
create policy "Admins can update admin notes"
on public.admin_notes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

comment on table public.admin_notes is '垚总补给箱小纸条。前台只读取 published 内容，不记录查看行为。';
comment on column public.admin_notes.note_type is 'note 小纸条 / comfort 鼓励 / reminder 温柔提醒 / goodnight 晚安。';
comment on column public.admin_notes.status is 'draft 草稿 / published 已发布 / archived 已下架。';
