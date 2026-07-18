# BPP Car Marketplace — Complete Backend Architecture

## Table of Contents
1. [Design Principles](#1-design-principles)
2. [Naming Conventions](#2-naming-conventions)
3. [Database Schema](#3-database-schema)
4. [Relationships](#4-relationships)
5. [Indexes](#5-indexes)
6. [Row Level Security](#6-row-level-security)
7. [Authentication](#7-authentication)
8. [Storage Architecture](#8-storage-architecture)
9. [API Architecture](#9-api-architecture)
10. [Services Layer](#10-services-layer)
11. [Validation Strategy](#11-validation-strategy)
12. [Image Pipeline](#12-image-pipeline)
13. [Caching Strategy](#13-caching-strategy)
14. [Scalability Plan](#14-scalability-plan)

---

## 1. Design Principles

### Why These Principles

| Principle | Reason |
|---|---|
| **Bilingual by default** | Arabic is primary. Every user-facing string has `_ar` and `_en` columns. No translation table — at 10K rows the join overhead outweighs the storage cost. |
| **Soft deletes** | `deleted_at` on every mutable table. Never lose data. Enables recovery and audit. |
| **Timestamps everywhere** | `created_at`, `updated_at` on every table. Enables cache invalidation, audit trails, and sort-by-recent. |
| **UUID primary keys** | No sequential ID guessing. Safe for public-facing APIs. Supabase native. |
| **Slugs for public URLs** | SEO-friendly, human-readable. Indexed for fast lookups. |
| **Separate brand/model tables** | Normalized for consistency. One brand has many models. Prevents "Mercedes" vs "Mersedes" typos. |
| **No polymorphic relations** | Every FK has a clear single target. Simpler queries, simpler RLS. |
| **Explicit null semantics** | `nullable` columns mean "not set". `NOT NULL` with defaults means "required". |

### Why NOT These Alternatives

| Rejected Approach | Why |
|---|---|
| Translation tables | Over-normalized for bilingual. 3x more queries for every page render. |
| Sequential integer IDs | Predictable, guessable, leak business metrics. |
| JSON for vehicle specs | Loses queryability. Can't filter by fuel_type inside JSONB efficiently at scale. |
| Single `status` field without CHECK | Risk of invalid values. We use PostgreSQL ENUMs. |
| Polymorphic `imageable_type` | RLS cannot enforce cross-table policies safely. |

---

## 2. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Tables | `snake_case`, plural | `vehicles`, `vehicle_images` |
| Columns | `snake_case` | `fuel_type`, `is_primary` |
| Primary keys | `id` (UUID) | `id uuid DEFAULT gen_random_uuid()` |
| Foreign keys | `{table_singular}_id` | `vehicle_id`, `brand_id` |
| Indexes | `idx_{table}_{columns}` | `idx_vehicles_status_created_at` |
| Unique constraints | `uq_{table}_{columns}` | `uq_vehicles_slug` |
| Enums | `enum_{name}` | `enum_vehicle_status`, `enum_fuel_type` |
| Storage buckets | `kebab-case` | `vehicle-images`, `avatars` |
| API routes | `/api/v1/{resource}` | `/api/v1/vehicles` |
| Services | `{Entity}Service` | `VehicleService`, `ImageService` |

---

## 3. Database Schema

### 3.1 ENUM Types

```
enum_vehicle_status  → available | sold | reserved | pending | draft
enum_fuel_type      → gasoline | diesel | electric | hybrid | plug_in_hybrid
enum_transmission   → automatic | manual | cvt | dual_clutch
enum_body_type      → sedan | suv | coupe | convertible | hatchback | truck | van | wagon | pickup
enum_inquiry_status → new | contacted | qualified | closed_won | closed_lost
enum_message_status → unread | read | archived
enum_user_role      → super_admin | admin | editor
enum_image_type     → primary | gallery | detail | interior
```

**Why ENUMs over VARCHAR with CHECK:**
- Type safety at the database level
- 1 byte storage vs variable VARCHAR
- Query optimizer can use enum values directly
- Impossible to insert invalid data

**Why these specific statuses:**
- `draft` added to vehicle status — admins can save incomplete listings
- `pending` separates "under review" from "ready to publish"
- Inquiry statuses follow a sales funnel model

### 3.2 Core Tables

#### `profiles` (extends Supabase auth.users)
```
id            UUID        PK → auth.users.id
email         TEXT        NOT NULL
full_name     TEXT        NOT NULL
full_name_ar  TEXT
avatar_url    TEXT
role          enum_user_role  NOT NULL DEFAULT 'editor'
is_active     BOOLEAN     NOT NULL DEFAULT true
phone         TEXT
last_login_at TIMESTAMPTZ
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```

**Why a profiles table instead of extending auth.users:**
- Supabase auth.users is managed by Supabase. We cannot add columns.
- profiles gives us full control over admin metadata.
- 1:1 relationship with auth.users via FK.
- RLS can reference `auth.uid()` to match `profiles.id`.

#### `brands`
```
id            UUID        PK
name          TEXT        NOT NULL UNIQUE
name_ar       TEXT        NOT NULL
slug          TEXT        NOT NULL UNIQUE
logo_url      TEXT
is_active     BOOLEAN     NOT NULL DEFAULT true
sort_order    INTEGER     NOT NULL DEFAULT 0
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```

**Why brands table instead of a TEXT column on vehicles:**
- Consistent naming. "Mercedes-Benz" vs "Mercedes" vs "Mersedes" is prevented.
- Logo stored once, not repeated per vehicle.
- `is_active` allows hiding brands without deleting.
- `sort_order` controls display order on filter UI.

#### `models`
```
id            UUID        PK
brand_id      UUID        NOT NULL FK → brands.id
name          TEXT        NOT NULL
name_ar       TEXT        NOT NULL
slug          TEXT        NOT NULL
is_active     BOOLEAN     NOT NULL DEFAULT true
sort_order    INTEGER     NOT NULL DEFAULT 0
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()

UNIQUE (brand_id, slug)
```

**Why composite unique on (brand_id, slug):**
- "C-Class" exists under Mercedes AND could exist under another brand logically.
- slug is unique per brand, not globally.
- URL pattern: `/vehicles/mercedes-benz/c-class` — brand in path, model slug follows.

#### `vehicles`
```
id              UUID            PK
slug            TEXT            NOT NULL UNIQUE
brand_id        UUID            NOT NULL FK → brands.id
model_id        UUID            NOT NULL FK → models.id
year            SMALLINT        NOT NULL
price           NUMERIC(12,3)   NOT NULL
currency        TEXT            NOT NULL DEFAULT 'KWD'
mileage         INTEGER         NOT NULL DEFAULT 0
fuel_type       enum_fuel_type  NOT NULL
transmission    enum_transmission NOT NULL
body_type       enum_body_type  NOT NULL
engine_size     TEXT
horsepower      SMALLINT
color           TEXT            NOT NULL
color_ar        TEXT            NOT NULL
interior_color  TEXT
interior_color_ar TEXT
vin             TEXT            UNIQUE
description     TEXT            NOT NULL DEFAULT ''
description_ar  TEXT            NOT NULL DEFAULT ''
features        TEXT[]          NOT NULL DEFAULT '{}'
features_ar     TEXT[]          NOT NULL DEFAULT '{}'
status          enum_vehicle_status NOT NULL DEFAULT 'draft'
is_featured     BOOLEAN         NOT NULL DEFAULT false
featured_order  SMALLINT
seo_title       TEXT
seo_title_ar    TEXT
seo_description TEXT
seo_description_ar TEXT
published_at    TIMESTAMPTZ
deleted_at      TIMESTAMPTZ
created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
created_by      UUID            FK → profiles.id
updated_by      UUID            FK → profiles.id
```

**Why `NUMERIC(12,3)` for price:**
- Kuwaiti Dinar has 3 decimal places (fils).
- NUMERIC is exact — no floating point errors.
- 12 digits supports up to 999,999,999.999 KWD (~$3B).
- NEVER use FLOAT/DOUBLE for money.

**Why `SMALLINT` for year:**
- Years fit in 2 bytes (32,767 max). Saves 2 bytes per row vs INTEGER.
- At 10K vehicles = 20KB saved. Small but principled.

**Why `TEXT[]` for features:**
- PostgreSQL arrays are native, indexable, and fast.
- No junction table needed for simple tag-like data.
- GIN index makes array contains queries instant.

**Why `is_featured` + `featured_order`:**
- `is_featured` is a boolean for quick filtering.
- `featured_order` controls display sequence (NULL = not featured, lower = first).
- Homepage queries: `WHERE is_featured = true ORDER BY featured_order`.

**Why `published_at` separate from `created_at`:**
- Admin creates draft, edits, then publishes.
- `created_at` = when record was created.
- `published_at` = when it went live. Can be backdated for scheduling.

**Why `deleted_at` (soft delete):**
- Never lose data accidentally.
- RLS filters `WHERE deleted_at IS NULL`.
- Admin can recover deleted vehicles.
- Audit trail preserved.

#### `vehicle_images`
```
id            UUID        PK
vehicle_id    UUID        NOT NULL FK → vehicles.id
storage_path  TEXT        NOT NULL
url           TEXT        NOT NULL
alt           TEXT        NOT NULL DEFAULT ''
alt_ar        TEXT        NOT NULL DEFAULT ''
image_type    enum_image_type NOT NULL DEFAULT 'gallery'
is_primary    BOOLEAN     NOT NULL DEFAULT false
sort_order    INTEGER     NOT NULL DEFAULT 0
width         INTEGER
height        INTEGER
file_size     INTEGER
blur_hash     TEXT
created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
```

**Why `storage_path` AND `url`:**
- `storage_path` = the Supabase storage key (e.g., `vehicles/abc123/1.webp`)
- `url` = the full public URL (cached for read performance)
- If we migrate storage providers, we only update `url`, not `storage_path`.

**Why `blur_hash`:**
- Progressive image loading. Show blurred placeholder while full image loads.
- Mercedes/Audi pattern — tiny string encodes a blurred preview.
- Stored in DB so the frontend never fetches the full image to show a placeholder.

**Why `image_type` enum:**
- Separates hero images from gallery from detail shots.
- Frontend queries: `WHERE image_type = 'primary'` for card thumbnails.
- Admin can manage different image slots.

#### `inquiries`
```
id            UUID              PK
vehicle_id    UUID              NOT NULL FK → vehicles.id
name          TEXT              NOT NULL
email         TEXT              NOT NULL
phone         TEXT              NOT NULL
message       TEXT              NOT NULL DEFAULT ''
status        enum_inquiry_status NOT NULL DEFAULT 'new'
notes         TEXT              NOT NULL DEFAULT ''
responded_at  TIMESTAMPTZ
created_at    TIMESTAMPTZ       NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ       NOT NULL DEFAULT now()
```

**Why `notes` field:**
- Admin internal notes about the inquiry.
- "Customer prefers white. Called on 15 Jan. Follow up next week."
- Never visible to the customer.

**Why `responded_at`:**
- Metrics: average response time.
- UI: show "Responded" badge after admin replies.

#### `contact_messages`
```
id            UUID                  PK
name          TEXT                  NOT NULL
email         TEXT                  NOT NULL
phone         TEXT
subject       TEXT
message       TEXT                  NOT NULL
status        enum_message_status   NOT NULL DEFAULT 'unread'
notes         TEXT                  NOT NULL DEFAULT ''
created_at    TIMESTAMPTZ           NOT NULL DEFAULT now()
updated_at    TIMESTAMPTZ           NOT NULL DEFAULT now()
```

**Why separate from `inquiries`:**
- Inquiries are tied to a specific vehicle.
- Contact messages are general ("I want to sell my car", "Partnership inquiry").
- Different admin workflows for each.

#### `settings`
```
key           TEXT        PK
value         JSONB       NOT NULL
category      TEXT        NOT NULL DEFAULT 'general'
description   TEXT
updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
updated_by    UUID        FK → profiles.id
```

**Why JSONB value:**
- Flexible: strings, numbers, booleans, arrays, objects.
- `site_name` → `"BLACK POWER PROTECTION"` (string)
- `contact_phone` → `"+965XXXXXXX"` (string)
- `social_links` → `{"instagram": "...", "twitter": "..."}` (object)
- `business_hours` → `[{"day": "Sunday", "open": "9:00"}]` (array)
- `hero_slides` → `[{...}, {...}]` (array of objects)

**Why `category` column:**
- Groups settings for UI: `general`, `contact`, `social`, `seo`, `appearance`.
- Admin panel shows settings in categorized tabs.

---

## 4. Relationships

```
auth.users  1:1  profiles
profiles    1:N  vehicles          (created_by, updated_by)
brands      1:N  models
brands      1:N  vehicles
models      1:N  vehicles
vehicles    1:N  vehicle_images
vehicles    1:N  inquiries
```

**Why no Many-to-Many anywhere:**
- A vehicle belongs to exactly one brand and one model.
- A brand has many models. Simple 1:N.
- No vehicle tagging system (features are arrays, not relational).
- If we add tags later, a `vehicle_tags` junction table is trivial.

---

## 5. Indexes

### Primary Key Indexes (Automatic)
Every `id UUID PK` gets a clustered B-tree index automatically.

### Unique Constraint Indexes
```
uq_brands_slug          ON brands(slug)
uq_brands_name          ON brands(name)
uq_models_brand_slug    ON models(brand_id, slug)
uq_vehicles_slug        ON vehicles(slug)
uq_vehicles_vin         ON vehicles(vin) WHERE vin IS NOT NULL
```

### Performance Indexes

#### Vehicles (the most queried table)
```
idx_vehicles_status_publicated
  ON vehicles(status, published_at DESC)
  WHERE deleted_at IS NULL

  WHY: Homepage "Available vehicles" query.
  The partial WHERE clause (deleted_at IS NULL) makes this
  index ~30% smaller than a full index. PostgreSQL only
  indexes non-deleted rows.

idx_vehicles_brand_id
  ON vehicles(brand_id)
  WHERE deleted_at IS NULL

  WHY: "Show all Mercedes" filter. Every brand click hits this.

idx_vehicles_model_id
  ON vehicles(model_id)
  WHERE deleted_at IS NULL

  WHY: "Show all C-Class" within a brand. Second-level filter.

idx_vehicles_price
  ON vehicles(price)
  WHERE deleted_at IS NULL AND status = 'available'

  WHY: "Sort by price" and "Price range filter".
  Only indexes available vehicles — sold ones excluded.

idx_vehicles_year
  ON vehicles(year DESC)
  WHERE deleted_at IS NULL AND status = 'available'

  WHY: "Sort by newest" is the default sort.

idx_vehicles_created_at
  ON vehicles(created_at DESC)
  WHERE deleted_at IS NULL

  WHY: "Recently added" listing. Admin dashboard vehicle list.

idx_vehicles_featured
  ON vehicles(featured_order ASC NULLS LAST)
  WHERE is_featured = true AND deleted_at IS NULL AND status = 'available'

  WHY: Homepage featured section. Very selective index.
  Only ~20-30 rows max. Instant query.

idx_vehicles_body_type
  ON vehicles(body_type)
  WHERE deleted_at IS NULL AND status = 'available'

  WHY: Body type filter on listing page.

idx_vehicles_fuel_type
  ON vehicles(fuel_type)
  WHERE deleted_at IS NULL AND status = 'available'

  WHY: Fuel type filter.

idx_vehicles_mileage
  ON vehicles(mileage)
  WHERE deleted_at IS NULL AND status = 'available'

  WHY: "Sort by lowest mileage" option.
```

#### Composite Indexes (Multi-Column Filters)
```
idx_vehicles_brand_status_year
  ON vehicles(brand_id, status, year DESC)
  WHERE deleted_at IS NULL

  WHY: "Show available Mercedes from newest to oldest".
  Covers the most common filter combination.
  Single index scan, no second lookup.

idx_vehicles_price_status_year
  ON vehicles(price, status, year DESC)
  WHERE deleted_at IS NULL

  WHY: "Sort by price within available vehicles".
  Covers price range + status filter.

idx_vehicles_search
  ON vehicles USING GIN (
    to_tsvector('simple', COALESCE(description, '') || ' ' || COALESCE(description_ar, ''))
  )
  WHERE deleted_at IS NULL

  WHY: Full-text search on descriptions.
  'simple' config handles Arabic + English without language-specific stemming.
  GIN index makes LIKE '%keyword%' queries instant at 10K rows.
```

#### Other Tables
```
idx_models_brand_id       ON models(brand_id)
idx_vehicle_images_vehicle ON vehicle_images(vehicle_id, sort_order)
idx_vehicle_images_type   ON vehicle_images(vehicle_id, image_type)
idx_inquiries_vehicle     ON inquiries(vehicle_id)
idx_inquiries_status      ON inquiries(status, created_at DESC)
idx_inquiries_created     ON inquiries(created_at DESC)
idx_contact_status        ON contact_messages(status, created_at DESC)
idx_settings_category     ON settings(category)
idx_profiles_role         ON profiles(role) WHERE is_active = true
```

### Why Partial Indexes (WHERE clause on indexes):
- At 10K vehicles, a full index on `vehicles(status)` is ~500KB.
- `WHERE deleted_at IS NULL` reduces it to ~480KB (most aren't deleted).
- `WHERE deleted_at IS NULL AND status = 'available'` reduces to ~300KB.
- Smaller index = faster scans, less memory, faster writes.

### Why No Index on `created_at` Without Filter:
- Admin sorts are infrequent. Full table scan at 10K rows is ~15ms.
- Not worth the write overhead for every INSERT.
- Only indexed with partial clause for common queries.

---

## 6. Row Level Security

### Policy Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    RLS POLICY LAYERS                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: PUBLIC (anon)                                  │
│  ├── SELECT on brands (is_active = true)                 │
│  ├── SELECT on models (is_active = true)                 │
│  ├── SELECT on vehicles (status = 'available')           │
│  ├── SELECT on vehicle_images (via vehicle join)         │
│  ├── INSERT on inquiries (anyone can submit)             │
│  ├── INSERT on contact_messages (anyone can submit)      │
│  └── SELECT on settings (public category only)           │
│                                                          │
│  Layer 2: ADMIN (authenticated + role check)             │
│  ├── ALL on vehicles (role IN ('super_admin','admin'))   │
│  ├── ALL on vehicle_images (role IN ('super_admin','admin')) │
│  ├── ALL on brands (role IN ('super_admin','admin'))     │
│  ├── ALL on models (role IN ('super_admin','admin'))     │
│  ├── ALL on inquiries (role IN ('super_admin','admin'))  │
│  ├── ALL on contact_messages (role IN ('super_admin','admin')) │
│  ├── ALL on settings (role = 'super_admin')              │
│  ├── UPDATE on profiles (own profile only)               │
│  └── SELECT on all profiles (admin role only)            │
│                                                          │
│  Layer 3: SUPER ADMIN ONLY                              │
│  ├── DELETE on any table (hard delete for emergencies)   │
│  ├── UPDATE profiles.role (super_admin only)             │
│  └── ALL on settings                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Why This Layered Approach:

**PUBLIC can read vehicles:**
- The whole point is to display vehicles on the website.
- `WHERE status = 'available'` ensures only published vehicles show.
- `WHERE deleted_at IS NULL` is enforced at the application level AND RLS.

**PUBLIC can INSERT inquiries/contact_messages:**
- Contact forms are public. No auth required.
- But they CANNOT read other people's inquiries.
- They CANNOT update or delete.

**ADMIN can do everything on operational tables:**
- Manage vehicles, images, brands, models.
- Respond to inquiries.
- Role is checked via `profiles.role`.

**SUPER ADMIN controls settings and users:**
- Website settings are sensitive. Only super_admin changes them.
- Role management is restricted to prevent privilege escalation.

### RLS Helper Function

```
CREATE FUNCTION public.get_user_role()
RETURNS enum_user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
    AND is_active = true
  )
$$;

CREATE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
$$;
```

**Why SECURITY DEFINER:**
- These functions run with the privileges of the function owner (postgres).
- They can read the `profiles` table even when the calling user's RLS would block it.
- This is the standard Supabase pattern for role-checking.

### Per-Table RLS Policies

```
── vehicles ──
  "Public can view available vehicles"
    FOR SELECT USING (status = 'available' AND deleted_at IS NULL)

  "Admins can view all vehicles"
    FOR SELECT USING (is_admin())

  "Admins can insert vehicles"
    FOR INSERT WITH CHECK (is_admin())

  "Admins can update vehicles"
    FOR UPDATE USING (is_admin())

  "Super admins can delete vehicles"
    FOR DELETE USING (is_super_admin())

── vehicle_images ──
  "Public can view images of available vehicles"
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM vehicles
        WHERE vehicles.id = vehicle_images.vehicle_id
        AND vehicles.status = 'available'
        AND vehicles.deleted_at IS NULL
      )
    )

  "Admins can manage all vehicle images"
    FOR ALL USING (is_admin())

── brands ──
  "Public can view active brands"
    FOR SELECT USING (is_active = true)

  "Admins can manage brands"
    FOR ALL USING (is_admin())

── models ──
  "Public can view active models of active brands"
    FOR SELECT USING (
      is_active = true
      AND EXISTS (SELECT 1 FROM brands WHERE brands.id = models.brand_id AND brands.is_active = true)
    )

  "Admins can manage models"
    FOR ALL USING (is_admin())

── inquiries ──
  "Anyone can submit inquiries"
    FOR INSERT WITH CHECK (true)

  "Admins can view all inquiries"
    FOR SELECT USING (is_admin())

  "Admins can update inquiries"
    FOR UPDATE USING (is_admin())

── contact_messages ──
  "Anyone can submit messages"
    FOR INSERT WITH CHECK (true)

  "Admins can manage messages"
    FOR ALL USING (is_admin())

── settings ──
  "Public can read public settings"
    FOR SELECT USING (category IN ('general', 'contact', 'social', 'seo'))

  "Super admins can manage all settings"
    FOR ALL USING (is_super_admin())

── profiles ──
  "Users can view own profile"
    FOR SELECT USING (id = auth.uid())

  "Admins can view all profiles"
    FOR SELECT USING (is_admin())

  "Users can update own profile"
    FOR UPDATE USING (id = auth.uid())
```

---

## 7. Authentication

### Auth Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Admin Login │────▶│ Supabase     │────▶│ JWT Token    │
│  (email/pw)  │     │ Auth         │     │ (contains    │
│              │     │              │     │  user_id)    │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                                        ┌───────▼───────┐
                                        │ Middleware     │
                                        │ validates JWT │
                                        │ loads profile │
                                        └───────┬───────┘
                                                │
                                        ┌───────▼───────┐
                                        │ RLS policies  │
                                        │ check role    │
                                        └───────────────┘
```

### Why Supabase Auth (not custom JWT):
1. **Managed**: No server to maintain for token refresh.
2. **Secure**: Tokens are short-lived, auto-refreshed.
3. **MFA ready**: Can add TOTP later for admin security.
4. **OAuth ready**: Can add Google login later.

### Session Management

```
Server Component:
  → createClient() reads cookies
  → supabase.auth.getUser() validates session
  → Returns user or null

Client Component:
  → createClient() uses browser cookies
  → supabase.auth.getSession() from memory
  → Auth state listener for real-time updates

Middleware:
  → Validates token on every request
  → Refreshes expired tokens automatically
  → Redirects unauthenticated users away from /admin
```

### Admin Role Seeding

```
First super_admin is created via:
  1. Supabase Dashboard → Auth → Create User
  2. SQL: INSERT INTO profiles (id, email, role) VALUES (..., 'super_admin')
  
Future admins:
  super_admin invites via admin panel → creates auth user → inserts profile
```

---

## 8. Storage Architecture

### Bucket Structure

```
vehicle-images/
  {vehicle_id}/
    1.webp          (primary image)
    2.webp          (gallery image)
    3.webp          (detail image)
    ...

avatars/
  {user_id}.webp

settings/
  logo.webp
  favicon.ico
  og-image.webp
```

### Bucket Policies

```
vehicle-images (public bucket):
  ├── Public can READ
  ├── Authenticated admin can UPLOAD
  ├── Authenticated admin can DELETE
  └── Max file size: 5MB

avatars (private bucket):
  ├── Owner can READ own avatar
  ├── Admins can READ all avatars
  ├── Authenticated user can UPLOAD own
  └── Max file size: 2MB

settings (private bucket):
  ├── Public can READ
  ├── Super admin can UPLOAD
  └── Max file size: 5MB
```

### Why `vehicle-images` is PUBLIC:
- Vehicle images must load on the public website.
- Public bucket = CDN-cached URLs with no signed URL overhead.
- Every page load would need a signed URL otherwise. Too slow.

### Why `avatars` is PRIVATE:
- Admin avatars should not be publicly guessable URLs.
- Signed URLs with expiry.

### Folder per vehicle:
- Clean organization. Deleting a vehicle = deleting its folder.
- No orphaned files scattered in root.
- Easy to list all images for a vehicle.

---

## 9. API Architecture

### Route Structure

```
src/app/api/
├── v1/
│   ├── vehicles/
│   │   ├── route.ts              GET  (list) + POST (create)
│   │   ├── [id]/
│   │   │   ├── route.ts          GET (single) + PATCH (update) + DELETE
│   │   │   └── images/
│   │   │       ├── route.ts      GET (list) + POST (upload)
│   │   │       └── [imageId]/
│   │   │           └── route.ts  PATCH (reorder) + DELETE
│   │   └── featured/
│   │       └── route.ts          GET (featured vehicles)
│   │
│   ├── brands/
│   │   ├── route.ts              GET + POST
│   │   └── [id]/
│   │       └── route.ts          GET + PATCH + DELETE
│   │
│   ├── models/
│   │   ├── route.ts              GET (filtered by brand) + POST
│   │   └── [id]/
│   │       └── route.ts          GET + PATCH + DELETE
│   │
│   ├── inquiries/
│   │   ├── route.ts              GET (admin) + POST (public)
│   │   └── [id]/
│   │       └── route.ts          GET + PATCH (status update)
│   │
│   ├── contact/
│   │   ├── route.ts              GET (admin) + POST (public)
│   │   └── [id]/
│   │       └── route.ts          GET + PATCH + DELETE
│   │
│   ├── settings/
│   │   ├── route.ts              GET (public subset) + PATCH (super_admin)
│   │   └── [key]/
│   │       └── route.ts          GET + PATCH
│   │
│   ├── upload/
│   │   └── route.ts              POST (image upload + processing)
│   │
│   └── auth/
│       ├── login/
│       │   └── route.ts          POST
│       ├── logout/
│       │   └── route.ts          POST
│       └── me/
│           └── route.ts          GET
```

### API Response Format

```
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 342,
    "totalPages": 29
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Price must be greater than 0",
    "details": [
      { "field": "price", "message": "Must be > 0" }
    ]
  }
}
```

### Why This Response Format:
- `success` boolean allows quick client-side branching.
- `meta` for pagination is separate from `data` — consistent structure.
- Error `code` is machine-readable. `message` is human-readable.
- `details` array enables per-field error highlighting in forms.

### Query Parameters (GET /api/v1/vehicles)

```
?page=1              Page number (default: 1)
&limit=12            Items per page (default: 12, max: 48)
&brand=mercedes-benz Brand slug filter
&model=c-class       Model slug filter
&year_from=2020      Minimum year
&year_to=2024        Maximum year
&price_from=50000    Minimum price (KWD)
&price_to=200000     Maximum price (KWD)
&fuel_type= gasoline  Fuel type filter
&transmission=auto   Transmission filter
&body_type=suv       Body type filter
&status=available    Status filter (admin: all, public: available only)
&search=mercedes     Full-text search
&sort=price_asc      Sort field + direction
&fields=id,slug,price,minimal field selection
```

---

## 10. Services Layer

### Architecture

```
src/lib/services/
├── vehicle.service.ts
├── brand.service.ts
├── model.service.ts
├── image.service.ts
├── inquiry.service.ts
├── contact.service.ts
├── settings.service.ts
├── auth.service.ts
└── index.ts (re-exports)
```

### Service Pattern

```
Every service follows this pattern:

export class VehicleService {
  // ── READ ──
  static async list(filters, pagination): Promise<PaginatedResult<Vehicle>>
  static async getById(id): Promise<Vehicle | null>
  static async getBySlug(slug): Promise<Vehicle | null>
  static async getFeatured(limit): Promise<Vehicle[]>
  static async getStats(): Promise<VehicleStats>
  
  // ── WRITE ──
  static async create(data, userId): Promise<Vehicle>
  static async update(id, data, userId): Promise<Vehicle>
  static async softDelete(id, userId): Promise<void>
  static async restore(id, userId): Promise<void>
  static async publish(id, userId): Promise<Vehicle>
  static async unpublish(id, userId): Promise<Vehicle>
  
  // ── SEARCH ──
  static async search(query, filters): Promise<PaginatedResult<Vehicle>>
}
```

### Why Static Methods (not instance methods):
- Services are stateless. No need to instantiate.
- `VehicleService.list(...)` is cleaner than `new VehicleService().list(...)`.
- Each method creates its own Supabase client (server-side).
- No shared state between requests = no memory leaks.

### Why NOT ORM (Prisma/Drizzle):
- Supabase IS the ORM. It generates types from the schema.
- Adding Prisma on top of Supabase is redundant.
- We write raw queries only for complex joins that Supabase client doesn't support.
- For 95% of operations, Supabase client methods are sufficient.

### Service Layer Responsibilities:
1. **Query building** — Construct Supabase queries with filters/sort/pagination
2. **Data transformation** — Convert snake_case DB → camelCase API response
3. **Business rules** — "Can't delete a vehicle with active inquiries"
4. **Cache checks** — "Is this slug cached? Return cache. Otherwise query DB."
5. **Error wrapping** — Convert Supabase errors to meaningful API errors

---

## 11. Validation Strategy

### Architecture

```
src/lib/validation/
├── vehicle.schema.ts
├── brand.schema.ts
├── model.schema.ts
├── inquiry.schema.ts
├── contact.schema.ts
├── settings.schema.ts
├── auth.schema.ts
└── index.ts (re-exports)
```

### Validation Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Zod Schemas (Type + Runtime)       │
│  Validates shape, types, ranges, formats     │
├─────────────────────────────────────────────┤
│  Layer 2: Database Constraints               │
│  NOT NULL, UNIQUE, CHECK, ENUM, FK           │
├─────────────────────────────────────────────┤
│  Layer 3: RLS Policies                      │
│  Who can do what                            │
└─────────────────────────────────────────────┘
```

**Why three layers:**
- Layer 1 catches 99% of bad data before it hits the database.
- Layer 2 is the safety net — database rejects invalid data regardless of application bugs.
- Layer 3 ensures only authorized users can write.

### Example Vehicle Validation

```
createVehicleSchema = z.object({
  brand_id: z.string().uuid(),
  model_id: z.string().uuid(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive().max(999_999_999.999),
  mileage: z.number().int().min(0).max(999_999),
  fuel_type: z.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid']),
  transmission: z.enum(['automatic', 'manual', 'cvt', 'dual_clutch']),
  body_type: z.enum(['sedan', 'suv', 'coupe', 'convertible', 'hatchback', 'truck', 'van', 'wagon', 'pickup']),
  color: z.string().min(1).max(50),
  color_ar: z.string().min(1).max(50),
  description: z.string().max(5000),
  description_ar: z.string().max(5000),
  features: z.array(z.string().max(100)).max(50),
  features_ar: z.array(z.string().max(100)).max(50),
  engine_size: z.string().max(20).optional(),
  horsepower: z.number().int().min(0).max(2000).optional(),
  interior_color: z.string().max(50).optional(),
  interior_color_ar: z.string().max(50).optional(),
  vin: z.string().length(17).optional(),
  status: z.enum(['draft', 'pending', 'available']).default('draft'),
  is_featured: z.boolean().default(false),
  seo_title: z.string().max(70).optional(),
  seo_title_ar: z.string().max(70).optional(),
  seo_description: z.string().max(160).optional(),
  seo_description_ar: z.string().max(160).optional(),
})

updateVehicleSchema = createVehicleSchema.partial()
```

**Why `max(999_999_999.999)` on price:**
- Prevents absurd values. A $3 billion car doesn't exist.
- Database constraint matches Zod constraint.

**Why separate `color` and `color_ar`:**
- Colors have different names in Arabic and English.
- "أبيض لؤلؤي" (Pearl White) vs "Pearl White".

---

## 12. Image Pipeline

### Upload Flow

```
1. Admin selects file(s) in browser
   ↓
2. Client-side validation:
   - File type: webp, avif, jpg, png
   - File size: < 5MB
   - Dimensions: < 8000x8000
   ↓
3. POST /api/v1/upload
   ↓
4. Server-side processing:
   a. Generate UUID filename
   b. Convert to WebP via sharp (if not already)
   c. Resize to max 2400px wide (maintains aspect ratio)
   d. Generate 3 sizes:
      - full: 2400px (detail view)
      - card: 800px (listing card)
      - thumb: 400px (thumbnail)
   e. Generate blur_hash for placeholder
   f. Upload all 3 to Supabase Storage
   g. Insert record into vehicle_images
   ↓
5. Return image data with URLs
```

### Why WebP:
- 25-35% smaller than JPEG at same quality.
- Supported by 97%+ of browsers.
- Supabase Storage serves with correct Content-Type.

### Why 3 Sizes:
- `full` (2400px) → Vehicle detail page hero
- `card` (800px) → Vehicle listing cards
- `thumb` (400px) → Admin dashboard, thumbnails
- Serving a 4000px image on a 600px card wastes bandwidth.

### Why blur_hash:
- 20-30 bytes string encodes a blurred preview.
- No extra image file needed.
- Frontend renders a colored rectangle while full image loads.
- Pattern used by Instagram, Airbnb, Mercedes-Benz.

### Storage URL Pattern:
```
https://{project-ref}.supabase.co/storage/v1/object/public/vehicle-images/{vehicle_id}/full.webp
https://{project-ref}.supabase.co/storage/v1/object/public/vehicle-images/{vehicle_id}/card.webp
https://{project-ref}.supabase.co/storage/v1/object/public/vehicle-images/{vehicle_id}/thumb.webp
```

---

## 13. Caching Strategy

### What to Cache (and Why)

| Data | Cache Duration | Strategy | Why |
|---|---|---|---|
| Settings | 5 minutes | Server-side in-memory | Changes rarely. Every page load needs site name, phone, etc. |
| Brands list | 1 hour | Server-side in-memory | Changes very rarely. Filter sidebar needs this. |
| Models list | 1 hour | Server-side in-memory | Changes very rarely. Filtered by brand. |
| Vehicle listing | 60 seconds | Stale-while-revalidate | Updates when new vehicles are added. 60s delay is acceptable. |
| Single vehicle | 300 seconds | Cache + invalidate on update | Detail pages are viewed longer. Less frequent refresh. |
| Featured vehicles | 120 seconds | Server-side in-memory | Homepage. Changes when admin updates featured list. |
| Search results | 30 seconds | Never cache | Search queries are unique. Cache would be useless. |
| Static pages | CDN | ISR with 24h revalidation | About, Terms, Privacy — change rarely. |

### Cache Invalidation

```
When admin updates a vehicle:
  1. Update database
  2. Invalidate vehicle cache (by ID and slug)
  3. Invalidate vehicle listing cache
  4. Invalidate featured vehicles cache (if is_featured changed)
  5. Invalidate settings cache (if settings changed)

When admin uploads an image:
  1. Upload to storage
  2. Update vehicle_images record
  3. Invalidate vehicle cache (new image URL)
```

### Why NOT Redis (yet):
- At 10K vehicles, in-memory Map/Object is fast enough.
- Supabase queries with proper indexes are < 20ms.
- Adding Redis = another service to maintain, monitor, pay for.
- Re-evaluate at 50K+ vehicles.

### Cache Implementation Pattern

```
class Cache<T> {
  private store: Map<string, { data: T; expiry: number }>
  
  get(key): T | null
  set(key, data, ttlMs): void
  invalidate(key): void
  invalidatePattern(pattern): void
  clear(): void
}
```

### Client-Side Caching (SWR / React Query pattern):
- Use `fetch` with `next: { revalidate: 60 }` for server components.
- Client components use a simple cache hook.
- Stale data shown immediately, fresh data fetched in background.
- Pattern: show cached → fetch → update if changed → no flash.

---

## 14. Scalability Plan

### Current Scale: 0 → 10,000 Vehicles

| Concern | Solution | Threshold to Re-evaluate |
|---|---|---|
| **Database size** | 10K vehicles × ~2KB each = ~20MB. Tiny. | 100K+ vehicles |
| **Image storage** | 10K vehicles × 10 images × 500KB = ~50GB. | 100K+ vehicles |
| **Query performance** | Partial indexes keep queries < 20ms. | 50K+ vehicles |
| **API response time** | Pagination limits response size. | Never an issue |
| **Connection pool** | Supabase default pool (15 connections) is fine. | 100+ concurrent users |
| **CDN** | Supabase Storage CDN handles image delivery. | Never an issue |

### When to Scale (and How)

```
10K vehicles:    Current architecture. No changes needed.
50K vehicles:    Add Redis for caching. Add read replicas.
100K vehicles:   Consider dedicated Supabase instance. Add Elasticsearch for search.
500K vehicles:   Migrate to dedicated PostgreSQL. Full-text search via Elasticsearch.
1M+ vehicles:    Microservice architecture. Separate search, images, API services.
```

### Database Maintenance Plan

```
Weekly:
  - VACUUM ANALYZE on high-write tables (inquiries, contact_messages)
  - Check index usage statistics
  - Monitor slow query log

Monthly:
  - Review table bloat
  - Update statistics
  - Review and clean orphaned storage files

Quarterly:
  - Review RLS policies for new tables
  - Audit admin access logs
  - Review and update validation schemas
```

### Read/Write Ratio Expected:
- **Reads**: 95% (browsing vehicles, loading pages)
- **Writes**: 5% (admin updates, inquiry submissions)
- This is a read-heavy workload. Optimize for reads: indexes, caching, CDN.

---

## File Structure Summary

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          Browser client
│   │   ├── server.ts          Server client + service role
│   │   └── queries.ts         Complex queries
│   ├── services/
│   │   ├── vehicle.service.ts
│   │   ├── brand.service.ts
│   │   ├── model.service.ts
│   │   ├── image.service.ts
│   │   ├── inquiry.service.ts
│   │   ├── contact.service.ts
│   │   ├── settings.service.ts
│   │   ├── auth.service.ts
│   │   └── index.ts
│   ├── validation/
│   │   ├── vehicle.schema.ts
│   │   ├── brand.schema.ts
│   │   ├── model.schema.ts
│   │   ├── inquiry.schema.ts
│   │   ├── contact.schema.ts
│   │   ├── settings.schema.ts
│   │   ├── auth.schema.ts
│   │   └── index.ts
│   ├── cache/
│   │   └── index.ts           Cache utility class
│   ├── storage/
│   │   └── image-upload.ts    Image processing pipeline
│   ├── auth/
│   │   └── middleware.ts      Auth helpers
│   ├── utils/
│   │   └── index.ts           Existing utilities
│   ├── constants/
│   │   └── index.ts           Existing constants
│   └── motion.ts              Existing motion
├── app/api/
│   └── v1/
│       ├── vehicles/
│       ├── brands/
│       ├── models/
│       ├── inquiries/
│       ├── contact/
│       ├── settings/
│       ├── upload/
│       └── auth/
```
