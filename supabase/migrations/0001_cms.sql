-- Additive Mang Crinkle CMS schema. Does not drop or alter existing order data.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  full_description text not null default '',
  ingredients text not null default '',
  allergens text not null default '',
  badge text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  available boolean not null default true,
  display_order integer not null default 0,
  allows_mixed_flavours boolean not null default false,
  show_in_box_builder boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  has_unpublished_changes boolean not null default true,
  revision integer not null default 1,
  published_payload jsonb,
  published_at timestamptz,
  legacy_product_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_flavours (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  slug text not null,
  name text not null,
  sort_order integer not null default 0,
  available boolean not null default true,
  unique (product_id, slug)
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  flavour_id uuid references public.product_flavours (id) on delete set null,
  sku text not null unique,
  label text not null,
  display_name text not null,
  published_display_name text,
  pack_size integer not null default 1 check (pack_size > 0),
  price_cents integer not null check (price_cents >= 0),
  published_price_cents integer,
  available boolean not null default true,
  published_available boolean,
  storefront_category text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  alt_text text not null default '',
  mime_type text not null,
  byte_size integer not null default 0,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete restrict,
  sort_order integer not null default 0
);

create table if not exists public.website_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  draft_payload jsonb not null default '{}'::jsonb,
  published_payload jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  has_unpublished_changes boolean not null default true,
  revision integer not null default 1,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.website_settings (
  id integer primary key default 1 check (id = 1),
  currency text not null default 'NZD',
  shop_open boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.website_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  revision_number integer not null,
  payload jsonb not null,
  published_at timestamptz not null default now(),
  unique (entity_type, entity_id, revision_number)
);

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products (status);
create index if not exists product_variants_product_idx on public.product_variants (product_id);
create index if not exists product_variants_status_idx on public.product_variants (status);

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cms_admins where user_id = auth.uid()
  );
$$;

create or replace view public.published_catalogue
with (security_invoker = false) as
select
  v.sku,
  v.published_display_name as display_name,
  v.label as variant_label,
  v.pack_size,
  v.published_price_cents as price_cents,
  v.published_available as available,
  v.storefront_category,
  v.sort_order as variant_sort,
  p.slug as product_slug,
  p.allows_mixed_flavours,
  p.display_order,
  p.show_in_box_builder,
  p.published_payload
from public.product_variants v
join public.products p on p.id = v.product_id
where p.status = 'published'
  and v.status = 'published'
  and v.published_price_cents is not null
  and v.published_display_name is not null
  and p.published_payload is not null;

create or replace view public.published_website
with (security_invoker = false) as
select key, published_payload, published_at
from public.website_content
where status = 'published'
  and published_payload is not null;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_flavours enable row level security;
alter table public.product_variants enable row level security;
alter table public.media_assets enable row level security;
alter table public.product_images enable row level security;
alter table public.website_content enable row level security;
alter table public.website_settings enable row level security;
alter table public.content_revisions enable row level security;
alter table public.cms_admins enable row level security;

drop policy if exists cms_admins_select_self on public.cms_admins;
create policy cms_admins_select_self on public.cms_admins
for select to authenticated
using (user_id = auth.uid());

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists flavours_admin_all on public.product_flavours;
create policy flavours_admin_all on public.product_flavours
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists variants_admin_all on public.product_variants;
create policy variants_admin_all on public.product_variants
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists media_admin_all on public.media_assets;
create policy media_admin_all on public.media_assets
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all on public.product_images
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists website_admin_all on public.website_content;
create policy website_admin_all on public.website_content
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists settings_admin_all on public.website_settings;
create policy settings_admin_all on public.website_settings
for all to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists revisions_admin_select on public.content_revisions;
create policy revisions_admin_select on public.content_revisions
for select to authenticated
using (public.is_cms_admin());

grant select on public.published_catalogue to anon, authenticated;
grant select on public.published_website to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
for select to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
for insert to authenticated
with check (bucket_id = 'media' and public.is_cms_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
for update to authenticated
using (bucket_id = 'media' and public.is_cms_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
for delete to authenticated
using (bucket_id = 'media' and public.is_cms_admin());

create or replace function public.save_variant_draft(payload jsonb, do_publish boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  expected int;
  current_rev int;
  new_rev int;
  variant jsonb;
  flavour uuid;
  target_sku text;
begin
  if not public.is_cms_admin() then
    raise exception 'not authorised';
  end if;

  pid := nullif(payload->>'id', '')::uuid;
  expected := coalesce((payload->>'expectedRevision')::int, 0);
  target_sku := payload->>'sku';

  if pid is null then
    insert into public.products (
      category_id, slug, name, short_description, full_description,
      ingredients, allergens, badge, image_url, featured, available,
      allows_mixed_flavours, show_in_box_builder, status, has_unpublished_changes
    )
    select
      c.id,
      payload->>'slug',
      payload->>'name',
      coalesce(payload->>'shortDescription', ''),
      coalesce(payload->>'fullDescription', ''),
      coalesce(payload->>'ingredients', ''),
      coalesce(payload->>'allergens', ''),
      coalesce(payload->>'badge', ''),
      coalesce(payload->>'imageUrl', ''),
      coalesce((payload->>'featured')::boolean, false),
      coalesce((payload->>'available')::boolean, true),
      coalesce((payload->>'allowsMixedFlavours')::boolean, false),
      coalesce((payload->>'showInBoxBuilder')::boolean, false),
      'draft',
      true
    from public.categories c
    where c.slug = payload->>'categorySlug'
    returning id, revision into pid, new_rev;
  else
    select revision into current_rev
    from public.products
    where id = pid
    for update;

    if current_rev is null then
      raise exception 'missing product';
    end if;
    if current_rev <> expected then
      raise exception 'revision conflict';
    end if;
    if (select status from public.products where id = pid) = 'archived' then
      raise exception 'archived';
    end if;

    new_rev := current_rev + 1;
    update public.products
    set
      name = payload->>'name',
      short_description = coalesce(payload->>'shortDescription', ''),
      full_description = coalesce(payload->>'fullDescription', ''),
      ingredients = coalesce(payload->>'ingredients', ''),
      allergens = coalesce(payload->>'allergens', ''),
      badge = coalesce(payload->>'badge', ''),
      image_url = coalesce(payload->>'imageUrl', ''),
      featured = coalesce((payload->>'featured')::boolean, false),
      available = coalesce((payload->>'available')::boolean, true),
      allows_mixed_flavours = coalesce((payload->>'allowsMixedFlavours')::boolean, false),
      show_in_box_builder = coalesce((payload->>'showInBoxBuilder')::boolean, false),
      has_unpublished_changes = true,
      revision = new_rev,
      updated_at = now()
    where id = pid;
  end if;

  for variant in
    select * from jsonb_array_elements(coalesce(payload->'variants', '[]'::jsonb))
  loop
    flavour := null;
    if nullif(variant->>'flavourSlug', '') is not null then
      insert into public.product_flavours (product_id, slug, name)
      values (pid, variant->>'flavourSlug', coalesce(variant->>'flavourName', variant->>'flavourSlug'))
      on conflict (product_id, slug) do update
      set name = excluded.name
      returning id into flavour;
    end if;

    insert into public.product_variants (
      product_id, flavour_id, sku, label, display_name, pack_size,
      price_cents, available, storefront_category, status
    )
    values (
      pid,
      flavour,
      variant->>'sku',
      variant->>'label',
      variant->>'displayName',
      coalesce((variant->>'packSize')::int, 1),
      (variant->>'priceCents')::int,
      coalesce((variant->>'available')::boolean, true),
      variant->>'storefrontCategory',
      'draft'
    )
    on conflict (sku) do update
    set
      display_name = excluded.display_name,
      label = excluded.label,
      pack_size = excluded.pack_size,
      price_cents = excluded.price_cents,
      available = excluded.available,
      storefront_category = excluded.storefront_category,
      flavour_id = coalesce(excluded.flavour_id, public.product_variants.flavour_id)
    where public.product_variants.product_id = pid
      and public.product_variants.status <> 'archived';
  end loop;

  if do_publish then
    update public.product_variants
    set
      published_price_cents = price_cents,
      published_available = available,
      published_display_name = display_name,
      status = 'published'
    where product_id = pid
      and sku = target_sku
      and status <> 'archived';

    if not found then
      raise exception 'missing variant';
    end if;

    update public.products
    set
      status = 'published',
      published_at = now(),
      published_payload = jsonb_build_object(
        'name', name,
        'shortDescription', short_description,
        'fullDescription', full_description,
        'ingredients', ingredients,
        'allergens', allergens,
        'badge', badge,
        'image', image_url,
        'featured', featured,
        'showInBoxBuilder', show_in_box_builder,
        'allowsMixedFlavours', allows_mixed_flavours
      ),
      has_unpublished_changes = true,
      updated_at = now()
    where id = pid;

    insert into public.content_revisions (entity_type, entity_id, revision_number, payload)
    values (
      'product',
      pid,
      new_rev,
      jsonb_build_object('sku', target_sku, 'payload', payload)
    );
  end if;

  update public.products
  set has_unpublished_changes = exists (
    select 1
    from public.product_variants v
    where v.product_id = pid
      and v.status <> 'archived'
      and (
        v.status <> 'published'
        or v.price_cents is distinct from v.published_price_cents
        or v.display_name is distinct from v.published_display_name
        or v.available is distinct from v.published_available
      )
  )
  where id = pid;

  return jsonb_build_object('id', pid, 'revision', new_rev);
end;
$$;

create or replace function public.save_website_content(doc_key text, payload jsonb, expected_revision integer, do_publish boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_rev int;
  new_rev int;
  doc_id uuid;
begin
  if not public.is_cms_admin() then
    raise exception 'not authorised';
  end if;

  select id, revision into doc_id, current_rev
  from public.website_content
  where key = doc_key
  for update;

  if doc_id is null then
    insert into public.website_content (key, draft_payload, status, has_unpublished_changes)
    values (doc_key, payload, 'draft', true)
    returning id, revision into doc_id, new_rev;
  else
    if current_rev <> expected_revision then
      raise exception 'revision conflict';
    end if;
    new_rev := current_rev + 1;
    update public.website_content
    set
      draft_payload = payload,
      has_unpublished_changes = true,
      revision = new_rev,
      updated_at = now()
    where id = doc_id;
  end if;

  if do_publish then
    update public.website_content
    set
      published_payload = draft_payload,
      status = 'published',
      has_unpublished_changes = false,
      published_at = now()
    where id = doc_id;

    insert into public.content_revisions (entity_type, entity_id, revision_number, payload)
    values ('website', doc_id, new_rev, payload);
  end if;

  return jsonb_build_object('id', doc_id, 'revision', new_rev);
end;
$$;

revoke all on function public.save_variant_draft(jsonb, boolean) from public;
revoke all on function public.save_website_content(text, jsonb, integer, boolean) from public;
grant execute on function public.save_variant_draft(jsonb, boolean) to authenticated;
grant execute on function public.save_website_content(text, jsonb, integer, boolean) to authenticated;
revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to authenticated, anon;
