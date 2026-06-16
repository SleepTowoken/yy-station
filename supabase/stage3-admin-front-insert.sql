-- 垚总远程加油站 / 阶段 3 登录态前台发送修复
-- 原因：同一浏览器登录后台后，前台 Supabase 请求会带 authenticated 身份。
-- 这里只允许 admin_users 中的管理员在 authenticated 身份下继续执行前台主动 insert。
-- 非管理员 authenticated 用户仍然不能读取或写入后台数据。

drop policy if exists "Admins can insert mood logs from frontend" on public.mood_logs;
create policy "Admins can insert mood logs from frontend"
on public.mood_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can insert supply requests from frontend" on public.supply_requests;
create policy "Admins can insert supply requests from frontend"
on public.supply_requests
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can insert rhythm logs from frontend" on public.rhythm_logs;
create policy "Admins can insert rhythm logs from frontend"
on public.rhythm_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can insert outfit logs from frontend" on public.outfit_logs;
create policy "Admins can insert outfit logs from frontend"
on public.outfit_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can insert spark logs from frontend" on public.spark_logs;
create policy "Admins can insert spark logs from frontend"
on public.spark_logs
for insert
to authenticated
with check (public.is_admin());
