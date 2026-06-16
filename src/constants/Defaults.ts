import type { Ad } from "@services/feed/ads";

export const ads = [
  {
    id: 0,
    businessId: 0,
    businessName: "TravelTipsGo",
    title: "TravelTipsGo Membership",
    imageId: 46,
    text: "Make your destination private.",
    linkLabel: "Join now!",
    link: "https://traveltipsgo.com/membership",
    picture:
      "https://firebasestorage.googleapis.com/v0/b/traveltips-imagestore.firebasestorage.app/o/assets%2FDefaultAds%2Fdefault_ads_1.jpeg?alt=media&token=3db4b4f0-80c6-4de5-8f39-0c89ac2cd779",
    subStatus: "active",
    status: "active",
    templateId: 1,
    renewSub: true,
  },
  {
    id: 0,
    businessId: 0,
    businessName: "TravelTipsGo",
    title: "Partner with us!",
    imageId: 47,
    text: "Promote your business",
    linkLabel: "Join Now",
    link: "https://traveltipsgo.com/partnership",
    picture:
      "https://firebasestorage.googleapis.com/v0/b/traveltips-imagestore.firebasestorage.app/o/assets%2FDefaultAds%2Fdefault_ads_2.jpeg?alt=media&token=9ec1b2a8-40a9-42d1-8415-29c8451ee85b",
    subStatus: "active",
    status: "active",
    templateId: 2,
    renewSub: true,
  },
] as Ad[];

export const getRandomDefaultAd = () => {
  return ads[Math.floor(Math.random() * ads.length)];
};
