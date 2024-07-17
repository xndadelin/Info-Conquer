const { defineConfig } = require("cypress");
require('dotenv').config();
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
        ...config.env
      }
      return config
    },
    baseUrl: "http://localhost:3000",
  },
});
