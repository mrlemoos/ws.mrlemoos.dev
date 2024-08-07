import "dotenv/config";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "src",
  experimental: {
    websocket: true,
  },
});
