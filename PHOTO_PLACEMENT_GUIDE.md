# 📸 Photo Asset Placement Guide - Roma Mart

**Last Updated:** December 1, 2025  
**Purpose:** Comprehensive guide for where to place all photos once taken

---

## 🗂️ Directory Structure

```
/public/images/
├── /locations/
│   └── /wellington/
│       ├── exterior-main.jpg          ← Primary storefront (CRITICAL)
│       ├── exterior-entrance.jpg
│       ├── exterior-angle.jpg
│       ├── interior-aisle.jpg
│       ├── interior-checkout.jpg
│       ├── interior-rocafe.jpg
│       └── thumb.jpg                  ← Thumbnail (400x400)
│
├── /rocafe/
│   ├── cappuccino-small.jpg
│   ├── cappuccino-medium.jpg
│   ├── cappuccino-large.jpg
│   ├── iced-latte-small.jpg
│   ├── iced-latte-medium.jpg
│   ├── muffin-blueberry.jpg
│   ├── croissant.jpg
│   └── [... other menu items]
│
├── /services/
│   ├── atm-machine.jpg
│   ├── bitcoin-atm.jpg
│   ├── halal-meat-section.jpg
│   ├── gift-cards-display.jpg
│   └── [... service photos]
│
├── /team/
│   ├── manager.jpg
│   └── [... staff photos]
│
└── /brand/
    ├── logo.png                       ← Main logo (512x512)
    ├── logo-white.png                 ← White version for dark backgrounds
    ├── favicon.ico                    ← Browser tab icon (32x32)
    └── og-image.png                   ← Social media preview (1200x630)
```

---

## 🎯 CRITICAL PHOTOS (Priority 1 - Get These First!)

### 1. **Favicon** `/public/favicon.ico`
**What:** Tiny icon in browser tab  
**Size:** 32x32 pixels  
**File Size:** <10KB  
**Method:** Use Canva or favicon.io to create from logo  
**Priority:** CRITICAL

**Steps:**
1. Create 512x512 version of logo
2. Go to https://favicon.io/favicon-converter/
3. Upload logo, download favicon.ico
4. Place in `/public/favicon.ico` (root of public folder)

---

### 2. **OG Image** `/public/og-image.png`
**What:** Preview image when sharing site on social media  
**Size:** 1200x630 pixels  
**File Size:** <200KB  
**Design:** Store photo with logo overlay + "Roma Mart Convenience"  
**Priority:** CRITICAL

**Content Ideas:**
- Store exterior + logo + tagline
- Collage: store + products + RoCafé
- Keep text minimal (shows as thumbnail)

---

### 3. **Main Logo** `/public/images/brand/logo.png`
**What:** Primary brand logo  
**Size:** 512x512 pixels (square)  
**File Size:** <100KB  
**Format:** PNG with transparency  
**Priority:** HIGH

**Usage:**
- About page
- Email signatures
- Print materials
- Partner presentations

---

### 4. **Store Exterior (Main)** `/public/images/locations/wellington/exterior-main.jpg`
**What:** PRIMARY location photo  
**Size:** 1920x1080px  
**File Size:** <500KB  
**Shot:** Full storefront, centered, 10am-2pm  
**Priority:** CRITICAL

**This photo appears:**
- Locations page (hero image)
- Homepage location section
- Google Business Profile
- Social media posts

**Must Have:**
- Store name/signage visible
- Entrance clearly shown
- No cars blocking view
- Straight, level shot

---

## 🏢 LOCATION PHOTOS (Priority 2)

### Wellington Store Exterior (3 shots)

| Photo | Filename | Size | Purpose |
|-------|----------|------|---------|
| **Main Storefront** | `exterior-main.jpg` | 1920x1080 | Primary location image |
| **Entrance Close-up** | `exterior-entrance.jpg` | 1920x1080 | Shows doors, accessibility |
| **Angled Shot** | `exterior-angle.jpg` | 1920x1080 | Dynamic perspective |

**Path:** `/public/images/locations/wellington/`

---

### Wellington Store Interior (6 shots)

| Photo | Filename | Size | Purpose |
|-------|----------|------|---------|
| **Main Aisle** | `interior-aisle.jpg` | 1920x1080 | Store overview |
| **Checkout Counter** | `interior-checkout.jpg` | 1920x1080 | Point of sale area |
| **RoCafé Area** | `interior-rocafe.jpg` | 1920x1080 | Café corner |
| **Product Display 1** | `interior-products-1.jpg` | 1920x1080 | Snacks/chips |
| **Product Display 2** | `interior-products-2.jpg` | 1920x1080 | Refrigerated drinks |
| **Product Display 3** | `interior-products-3.jpg` | 1920x1080 | International products |

**Path:** `/public/images/locations/wellington/`

---

### Location Thumbnail
**Filename:** `thumb.jpg`  
**Size:** 400x400px (square crop of exterior-main.jpg)  
**Usage:** Location cards, mobile view  
**Path:** `/public/images/locations/wellington/thumb.jpg`

---

## ☕ ROCAFÉ MENU PHOTOS (Priority 3)

### Hot Coffee Drinks

| Item | Filename | Sizes Needed | Notes |
|------|----------|--------------|-------|
| **Cappuccino** | `cappuccino-{size}.jpg` | small, medium, large | Show foam art |
| **Latte** | `latte-{size}.jpg` | small, medium, large | Side angle with steam |
| **Espresso** | `espresso-single.jpg`, `espresso-double.jpg` | single, double | Close-up shot |
| **Americano** | `americano-{size}.jpg` | small, medium, large | Simple, clean |

**Path:** `/public/images/rocafe/`  
**Size:** 800x800px (square)  
**File Size:** <200KB each

---

### Cold Drinks

| Item | Filename | Sizes Needed | Notes |
|------|----------|--------------|-------|
| **Iced Coffee** | `iced-coffee-{size}.jpg` | small, medium, large | Show condensation |
| **Iced Latte** | `iced-latte-{size}.jpg` | small, medium, large | Layers visible |
| **Frappe** | `frappe-{size}.jpg` | medium, large | Whipped cream on top |
| **Cold Brew** | `cold-brew-{size}.jpg` | small, medium, large | Clear glass |
| **Smoothie** | `smoothie-{flavor}.jpg` | by flavor | Colorful, straw visible |

**Path:** `/public/images/rocafe/`

---

### Pastries & Snacks

| Item | Filename | Notes |
|------|----------|-------|
| **Blueberry Muffin** | `muffin-blueberry.jpg` | Close-up, show texture |
| **Chocolate Muffin** | `muffin-chocolate.jpg` | Break one open |
| **Croissant** | `croissant.jpg` | 45° angle, flaky layers |
| **Danish** | `danish.jpg` | Show filling |
| **Cookies** | `cookies-assorted.jpg` | 3-4 arranged |
| **Donut** | `donut-{type}.jpg` | Overhead or 45° |

**Path:** `/public/images/rocafe/`  
**Size:** 800x800px  
**Style:** Close-up, show details

---

### Optional RoCafé Photos

- `rocafe-counter.jpg` - Overview of café setup
- `rocafe-menu-board.jpg` - Menu display
- `rocafe-equipment.jpg` - Coffee machine (if branded)

---

## 🛠️ SERVICE PHOTOS (Priority 4 - Optional)

### Service Area Photos

| Service | Filename | Notes |
|---------|----------|-------|
| **ATM** | `atm-machine.jpg` | Machine in store |
| **Bitcoin ATM** | `bitcoin-atm.jpg` | Close-up of BTM |
| **Halal Meat Section** | `halal-meat-section.jpg` | Fridge/freezer display |
| **Gift Cards** | `gift-cards-display.jpg` | Card rack |
| **Printing Area** | `printing-station.jpg` | Optional |
| **Package Counter** | `package-counter.jpg` | Pickup area |

**Path:** `/public/images/services/`  
**Size:** 1200x800px  
**Usage:** Service detail pages (future enhancement)

---

## 👥 TEAM PHOTOS (Priority 5 - Optional)

### Staff Headshots

**Filename:** `manager.jpg`, `staff-{name}.jpg`  
**Size:** 400x400px (square)  
**Style:** Professional, smiling, neutral background  
**Path:** `/public/images/team/`

**Usage:**
- About page "Our Team" section
- Future feature: "Meet the Manager"

**Photo Requirements:**
- Clean, simple background
- Good lighting (natural light preferred)
- Professional but friendly
- Consistent style across all staff photos

---

## 🎨 BRAND ASSETS (Priority 1)

### Logo Variations Needed

1. **Primary Logo** - `/public/images/brand/logo.png`
   - 512x512px PNG with transparency
   - Full color version
   - Use on white/light backgrounds

2. **Logo White** - `/public/images/brand/logo-white.png`
   - 512x512px PNG with transparency
   - White/light version
   - Use on dark backgrounds (navy, black)

3. **Logo Horizontal** - `/public/images/brand/logo-horizontal.png`
   - 1200x400px PNG
   - Optional: for email headers, banners

4. **Favicon** - `/public/favicon.ico`
   - 32x32px ICO format
   - Simplified logo icon
   - CRITICAL for browser tabs

5. **OG Image** - `/public/og-image.png`
   - 1200x630px PNG/JPG
   - Social media preview
   - CRITICAL for sharing

---

## 📊 Photo Priority Summary

### **Do These FIRST (Tomorrow):**
1. ✅ **Store exterior main** - Primary location photo
2. ✅ **Favicon** - Browser tab icon
3. ✅ **OG Image** - Social sharing preview
4. ✅ **Logo** - Brand asset

### **Do These SECOND:**
5. ✅ Store exterior (entrance + angle shots)
6. ✅ Store interior (6 shots - aisle, checkout, café, products)
7. ✅ Location thumbnail (crop from exterior)

### **Do These THIRD:**
8. ✅ RoCafé hot drinks (cappuccino, latte, espresso)
9. ✅ RoCafé cold drinks (iced coffee, iced latte, frappe)
10. ✅ Pastries (muffins, croissant, cookies)

### **Do These LATER:**
11. ⏳ Service area photos (ATM, BTM, halal section)
12. ⏳ Team headshots (manager, staff)
13. ⏳ Additional RoCafé items (smoothies, juices)

---

## 🔧 After Taking Photos

### Step 1: Transfer to Computer
- AirDrop, iCloud, or email
- Keep originals in separate folder (backup)

### Step 2: Edit
- Brighten (+10 to +20)
- Crop to correct size
- Straighten if needed
- Export as JPG

### Step 3: Optimize
- Use TinyPNG.com or Squoosh.app
- Target file sizes:
  - Favicon: <10KB
  - OG Image: <200KB
  - Location photos: <500KB
  - Menu items: <200KB
  - Service photos: <300KB

### Step 4: Rename
- Follow naming convention exactly
- Use lowercase, hyphens (not spaces)
- Example: `exterior-main.jpg` NOT `Exterior Main.JPG`

### Step 5: Place in Folders
- Copy to correct directory
- Keep backups of originals

### Step 6: Update Code
- Replace placeholder images
- Test on live site
- Check mobile view

---

## 📝 Quick Reference: What Goes Where

```
CRITICAL (Browser/Social):
└─ /public/
   ├─ favicon.ico          ← Browser tab icon
   └─ og-image.png         ← Social media preview

LOCATION PHOTOS:
└─ /public/images/locations/wellington/
   ├─ exterior-main.jpg    ← HERO IMAGE
   ├─ exterior-entrance.jpg
   ├─ exterior-angle.jpg
   ├─ interior-aisle.jpg
   ├─ interior-checkout.jpg
   ├─ interior-rocafe.jpg
   └─ thumb.jpg

MENU ITEMS:
└─ /public/images/rocafe/
   ├─ cappuccino-small.jpg
   ├─ iced-latte-medium.jpg
   ├─ muffin-blueberry.jpg
   └─ [... all menu items]

SERVICES:
└─ /public/images/services/
   ├─ atm-machine.jpg
   ├─ bitcoin-atm.jpg
   └─ halal-meat-section.jpg

BRAND:
└─ /public/images/brand/
   ├─ logo.png
   ├─ logo-white.png
   └─ logo-horizontal.png (optional)
```

---

## 💡 Pro Tips

1. **Take 5-10 shots per item** - Pick the best later
2. **Use window light** - 10am-2pm for interiors
3. **Keep it simple** - Clean backgrounds, no clutter
4. **Consistent style** - Same lighting/editing for all photos
5. **Backup everything** - Keep originals in separate folder
6. **Test on mobile** - Most users browse on phones
7. **Update regularly** - Refresh photos every 6-12 months

---

## ❓ Questions?

**Q: Can I use AI-generated images instead?**  
A: Yes for menu items! But use real photos for:
- Store exterior/interior (authenticity)
- Team photos (trust)
- Service areas (shows actual setup)

**Q: What if I don't have all photos yet?**  
A: Prioritize in this order:
1. Store exterior main (CRITICAL)
2. Favicon + OG image (CRITICAL)
3. Interior shots
4. Menu items
5. Everything else

**Q: Can I hire a photographer?**  
A: Absolutely! Show them this guide. Budget:
- Amateur: $100-200 (2-3 hours)
- Professional: $300-500 (half day)
- Professional + editing: $800-1200

**Q: How often should I update photos?**  
A: 
- Store photos: Every 6-12 months
- Menu items: When items change
- Seasonal: Update for holidays/seasons
- Team: When staff changes

---

## ✅ Checklist

**Before Shooting:**
- [ ] Read STORE_PHOTOGRAPHY_GUIDE.md
- [ ] Read MENU_PHOTOGRAPHY_GUIDE.md
- [ ] Clean store thoroughly
- [ ] Charge phone to 100%
- [ ] Free up 5GB storage
- [ ] Turn on ALL lights
- [ ] Remove clutter

**After Shooting:**
- [ ] Transfer photos to computer
- [ ] Edit (brighten, crop, straighten)
- [ ] Optimize file sizes
- [ ] Rename following convention
- [ ] Place in correct folders
- [ ] Test on live site
- [ ] Backup originals

---

**Ready to shoot? Use the photography guides and this placement guide together!** 📸