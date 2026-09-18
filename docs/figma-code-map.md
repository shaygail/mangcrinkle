# Figma ↔ code map

Canonical agent rule: [`.cursor/rules/figma-code-map.mdc`](../.cursor/rules/figma-code-map.mdc).

**File:** [Mang Crinkle on Figma](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle) (`sYXsKO9gMyZ60JupTNPi4G`)

## Quick links

| Screen | Figma | App |
|---|---|---|
| Homepage (desktop) | [26:5](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=26-5) | `/` |
| Homepage (mobile) | [32:28](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=32-28) | `/` |
| Shop (mobile) | [32:167](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=32-167) | `/shop` |
| Shop (desktop) | [36:223](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=36-223) | `/shop` |
| Product detail (mobile) | [32:296](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=32-296) | `/shop/[productId]` |
| Product detail (desktop) | [36:375](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=36-375) | `/shop/[productId]` |
| Cart (filled) | [33:28](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=33-28) | `/cart` |
| Cart (empty) | [34:260](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=34-260) | `/cart` |
| Checkout | [34:28](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=34-28) | `/checkout` |
| Order confirmation | [34:159](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=34-159) | `/order/confirmation` |
| Box builder (6-pack) | [73:32](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=73-32) | `/shop/build/pack-6` |
| Box builder (12-pack) | [73:316](https://www.figma.com/design/sYXsKO9gMyZ60JupTNPi4G/Mang-Crinkle?node-id=73-316) | `/shop/build/pack-12` |

## Shared components

| Piece | Code |
|---|---|
| Announcement | `AnnouncementBar` |
| Header + Box | `Header` |
| Buttons | `Button` (`yellow` / `brown` / `outline-dark`, usually `pop`) |
| Product card | `ProductCard` (`compact` \| `shopMobile`) |
| Product detail | `ProductDetailClient` |
| Shop shell | `shop/ShopContent` |
| Cart / checkout / confirm | `cart/*PageClient` + `CheckoutForm` |

Update the `.mdc` rule when new screens or shared patterns are added.
