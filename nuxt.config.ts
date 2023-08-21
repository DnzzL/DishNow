// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || "http://localhost:8090",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxthq/ui", "@vueuse/nuxt"],
  colorMode: {
    preference: "light",
  },
  ui: {
    icons: ["tabler"],
  },
});
