# Mang Crinkle CMS — Editor User Guide

This guide is for editing the **Mang Crinkle** website in **Strapi** (the CMS).  
You do **not** need to change code to update products, copy, footer links, or the pickup store.

Changes usually appear on the live site within about **1 minute** (the site re-fetches content automatically).

---

## 1. Log in

1. Open your Strapi Admin URL (ends with `/admin`), for example:
  `https://your-strapi-host.up.railway.app/admin`
2. Sign in with the admin email and password you were given.
3. On the left sidebar, open **Content Manager**.

**Tip:** There is no “Publish” button for most Mang Crinkle content — **Save** is enough.

---



## 2. What you can edit (quick map)


| What you want to change                 | Open in Content Manager |
| --------------------------------------- | ----------------------- |
| Menu items (name, price, photo, badge)  | **Product**             |
| Homepage hero, story, CTA, footer links | **Homepage**            |
| Shop page title and section blurbs      | **Shop Page**           |
| Cart / checkout / confirmation wording  | **Storefront Copy**     |
| Pickup store name, hours, time slots    | **Store Outlet**        |
| Customer quotes                         | **Testimonial**         |
| “How to order” steps on the homepage    | **Order Step**          |


---



## 3. Products (add or edit menu items)



### Edit an existing product

1. **Content Manager → Product**
2. Click the product (e.g. Signature Ube).
3. Update fields as needed.
4. Click **Save**.



### Add a new product

1. **Content Manager → Product → Create new entry**
2. Fill in the required fields:


| Field           | What to enter                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **productId**   | Unique ID in kebab-case, e.g. `matcha-crinkle`. Do not change this later if the product is already linked in carts. |
| **name**        | Display name, e.g. `Matcha Crinkle`                                                                                 |
| **description** | Short card / detail text                                                                                            |
| **price**       | Number, e.g. `5.00`                                                                                                 |
| **category**    | Pick one (see table below)                                                                                          |
| **image**       | Upload a photo (Media library)                                                                                      |


1. Optional fields:
  - **badge** — e.g. `Premium`, `Best Value`, `Gooey Lava Core`
  - **tier** — e.g. `Standard`, `Premium`
  - **note** — internal or extra note if needed
2. Click **Save**.



### Categories (where it appears on the shop)


| Category            | Shop section  |
| ------------------- | ------------- |
| `crinkle-standard`  | Crinkles      |
| `crinkle-premium`   | Crinkles      |
| `crinkle-signature` | Crinkles      |
| `crinkle-pack`      | Packs         |
| `lava`              | Lava Crinkles |
| `hot-drink`         | Hot Drinks    |
| `iced-drink`        | Iced Drinks   |




### Show on the mobile shop “All” feed

1. Turn **featuredOnShop** **ON**
2. Set **shopSortOrder** (lower numbers appear first), e.g. `1`, `2`, `3`…



### Show as a flavour in the Box Builder

1. Turn **showInBoxBuilder** **ON**
2. Set **boxBuilderSortOrder** (order of flavour cards)



### Pack products (6-pack / 12-pack)

For packs that open the Box Builder:


| productId | Pack size |
| --------- | --------- |
| `pack-3`  | 3         |
| `pack-6`  | 6         |
| `pack-12` | 12        |


Optional pack builder copy:

- **builderTitle** — e.g. `Assorted 6-Pack Box`
- **builderSubtitle** — e.g. `Choose 6 of your favorite freshly baked flavors.`

**Important:** Do not rename `productId` for `pack-6` / `pack-12` unless a developer updates the site code. You *can* change their names, prices, images, and builder titles freely.

---



## 4. Homepage

1. **Content Manager → Homepage** (there is only one entry — open it)
2. Edit the sections you need:


| Area                         | Typical fields                                                        |
| ---------------------------- | --------------------------------------------------------------------- |
| Top announcement bar         | **announcementText**                                                  |
| Hero title / subtitle / body | **heroTitle**, **heroSubtitle**, **heroDescription**                  |
| Mobile hero eyebrow          | **heroEyebrow**                                                       |
| Desktop hero side panel      | **heroPanelEyebrow**, **heroPanelTitle**, **heroPanelBody**           |
| Highlight pills              | **heroHighlights** (add/remove labels)                                |
| Hero button                  | **heroButtonText**, **heroButtonLink** (usually `/shop`)              |
| Hero / story / CTA images    | **heroImage**, **storyImage**, **ctaBackgroundImage**                 |
| Story                        | **storyTitle**, **storyBody**, **storyButtonText**                    |
| Story marquee                | **storyMarqueeQuotes**                                                |
| How to order heading         | **howToOrderTitle**, **howToOrderSubtitle**, **howToOrderButtonText** |
| Fan favourites heading       | **bestSellersTitle**                                                  |
| CTA banner                   | **ctaTitle**, **ctaBody**, **ctaButtonText**, **ctaMarqueeText**      |
| Footer brand line            | **footerTagline**, **siteDescription**, **footerCopyright**           |


1. Click **Save**.



### Footer links

Still on **Homepage**:

1. Find **footerMenuLinks**, **footerExploreLinks**, **footerSocialLinks**
2. For each link set:
  - **label** — text shown (e.g. `Shop All`)
  - **href** — path or URL (e.g. `/shop`, `/shop/ube`, `https://instagram.com/...`)
3. Add / remove / reorder entries as needed
4. **Save**

Common paths:

- `/` — home  
- `/shop` — shop  
- `/shop/ube` — Ube product page  
- `/shop?category=packs` — packs filter  
- `/#order` — how-to-order section on home

---



## 5. Shop Page

1. **Content Manager → Shop Page**
2. Edit:


| Field                                | Shows on                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| **title**                            | Shop heading (e.g. `The Crinkle Shop`)                              |
| **subtitle**                         | Small line above title                                              |
| **description**                      | Line under the title                                                |
| **sections**                         | Titles/subtitles for Crinkles, Packs, Lava, Hot Drinks, Iced Drinks |
| **howToOrderEyebrow / Title / Body** | Teaser at bottom of shop                                            |
| **howToOrderLinkText / Href**        | Desktop “see steps” link                                            |


1. **Save**

For each section, keep **sectionKey** as one of:  
`crinkles`, `packs`, `lava`, `hot-drinks`, `iced-drinks` — only edit **title** and **subtitle**.

---



## 6. Store Outlet (pickup location)

1. **Content Manager → Store Outlet**
2. Edit:


| Field             | Used for                                                  |
| ----------------- | --------------------------------------------------------- |
| **name**          | Checkout & confirmation (e.g. `Manila Town Kitchen (HQ)`) |
| **cartLabel**     | Cart sidebar (can be longer)                              |
| **hours**         | Opening hours line                                        |
| **address**       | Optional address                                          |
| **pickupNote**    | Note under the chosen pickup window                       |
| **pickupWindows** | List of time slots customers can choose                   |


1. To change times: add/remove/reorder **pickupWindows** entries (each has a **label**, e.g. `3:30 - 4:00 PM`)
2. **Save**

---



## 7. Storefront Copy (cart / checkout / confirmation)

1. **Content Manager → Storefront Copy**
2. Edit titles and button labels, for example:
  - Cart empty state title / body / button  
  - Checkout title / place-order button  
  - Confirmation title / body / button
3. **Save**

---



## 8. Testimonials

1. **Content Manager → Testimonial**
2. **Create new entry** or open an existing one
3. Set **quote**, **author**, and **sortOrder** (lower = earlier)
4. **Save**

---



## 9. Order Steps (homepage “How to Order”)

1. **Content Manager → Order Step**
2. Edit or create steps with:
  - **stepNumber** (e.g. `1`)
  - **title**
  - **emoji** (optional)
  - **description**
  - **sortOrder**
3. **Save**

---



## 10. Uploading images

1. In any image field, click to open the **Media Library**
2. Upload a JPG/PNG/WebP
3. Select it and confirm
4. **Save** the entry

Use clear, well-lit product photos. Large files work, but medium-sized images load faster.

---



## 11. After you save — checklist

1. Wait about a minute, then hard-refresh the website (`Cmd+Shift+R` / `Ctrl+Shift+R`)
2. Check the right place:


| You edited…       | Check on the site                             |
| ----------------- | --------------------------------------------- |
| Product           | `/shop` and product detail                    |
| Featured flags    | Mobile shop “All” feed                        |
| Box builder flags | `/shop/build/pack-6` or `/shop/build/pack-12` |
| Homepage          | `/`                                           |
| Footer links      | Bottom of any page                            |
| Shop Page         | `/shop`                                       |
| Store Outlet      | `/cart` → pickup box, then checkout           |
| Storefront Copy   | `/cart`, `/checkout`, confirmation            |


---



## 12. What not to change (without a developer)

- **Content-Type Builder** (schemas) — leave this alone  
- **Settings / API Tokens / Users & Permissions** unless you are an admin  
- Renaming **productId** for packs (`pack-6`, `pack-12`) or core items already in use  
- Deleting products that customers may still have in their cart

---



## 13. Need help?


| Issue                            | Try this                                                  |
| -------------------------------- | --------------------------------------------------------- |
| Change not showing               | Wait 1 minute, hard-refresh; confirm you clicked **Save** |
| Product missing from shop        | Check **category** is set correctly                       |
| Product missing from “All” feed  | Turn on **featuredOnShop**                                |
| Flavour missing from Box Builder | Turn on **showInBoxBuilder**                              |
| Broken footer link               | Check **href** starts with `/` for internal pages         |
| Image missing                    | Re-select media and Save again                            |


For account access or a broken admin login, contact the person who manages your Strapi / Railway hosting.