-- ============================================================
-- Luxe Essence Perfume Store - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  brand text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  stock integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  is_active boolean not null default true,
  fragrance_notes jsonb,
  size_options jsonb,
  image_urls jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method text not null default 'cod',
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  selected_size text
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_featured on public.products(featured) where is_active = true;
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at for products
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Helper: is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES policies
create policy "Users view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins view all profiles"
  on public.profiles for select using (public.is_admin());

-- CATEGORIES policies (public read, admin write)
create policy "Anyone can view categories"
  on public.categories for select using (true);

create policy "Admins manage categories"
  on public.categories for all using (public.is_admin());

-- PRODUCTS policies (public read active products, admin all)
create policy "Anyone can view active products"
  on public.products for select using (is_active = true);

create policy "Admins manage all products"
  on public.products for all using (public.is_admin());

-- ORDERS policies
create policy "Users view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users create own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Admins manage all orders"
  on public.orders for all using (public.is_admin());

-- ORDER ITEMS policies
create policy "Users view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users create order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Admins manage all order items"
  on public.order_items for all using (public.is_admin());

-- ============================================================
-- STORAGE
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
