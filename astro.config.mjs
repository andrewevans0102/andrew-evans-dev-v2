import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://www.andrewevans.dev",
  integrations: [mdx(), sitemap(), react(), partytown({      
    // https://www.kevinzunigacuellar.com/blog/google-analytics-in-astro/
    // Adds dataLayer.push as a forwarding-event.
    config: {
      forward: ["dataLayer.push"],
    },})]
});