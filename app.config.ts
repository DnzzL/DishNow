export default defineAppConfig({
  ui: {
    primary: "red",
    gray: "cool",
    card: {
      divide: "",
      header: {
        padding: "px-6 pt-4",
      },
      body: {
        padding: "px-6 py-2",
      },
      footer: {
        padding: "px-6 pb-4",
      },
    },
  },
  app: {
    head: {
      script: [
        {
          hid: "flowbite",
          src: "https://unpkg.com/flowbite@1.8.1/dist/flowbite.js",
          defer: true,
        },
      ],
    },
  },
});
