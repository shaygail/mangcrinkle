import { Recipe } from "@/types";

import { PLACEHOLDERS } from "@/lib/images";

export const recipes: Recipe[] = [
  {
    id: "blt",
    title: "BLT with Terry Ho's Yum Yum Sauce",
    image: PLACEHOLDERS.cookie,
    prep: "10 min",
    cook: "10 min",
    serves: "1-2",
    description:
      "Crispy bacon, fresh lettuce, juicy tomatoes, and a spread of Terry Ho's Yum Yum Sauce give this classic sandwich an irresistible twist.",
  },
  {
    id: "salmon-bowl",
    title: "Salmon Bowl with Terry Ho's Yum Yum Sauce",
    image: PLACEHOLDERS.cookie,
    prep: "15 min",
    cook: "15 min",
    serves: "2",
    description:
      "Flaky salmon, fresh toppings, and creamy Terry Ho's Yum Yum Sauce make this bowl a delicious balance of wholesome and satisfying.",
  },
  {
    id: "shrimp-fried-rice",
    title: "Shrimp Fried Rice with Terry Ho's Yum Yum Sauce",
    image: PLACEHOLDERS.cookie,
    prep: "15 min",
    cook: "15 min",
    serves: "2-3",
    description:
      "Tender shrimp, savory fried rice, and a drizzle of Terry Ho's Yum Yum Sauce come together for a quick, restaurant-style meal at home.",
  },
  {
    id: "hibachi-vegetables",
    title: "Hibachi Vegetables with Terry Ho's Yum Yum Sauce",
    image: PLACEHOLDERS.cookie,
    prep: "10 min",
    cook: "10 min",
    serves: "3-4",
    description:
      "Fresh vegetables are sautéed hibachi-style and finished with Terry Ho's Yum Yum Sauce for a simple side packed with flavor.",
  },
];
