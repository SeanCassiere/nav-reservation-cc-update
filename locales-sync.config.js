const { resolve } = require("path");

// these are the default values being using in ./src/i18n.ts
const common = "common";
const en = "en";
const languagesCore = [common, en, "de", "fr", "es"];

// derived to remove en and the common directory
const secondaryLanguages = languagesCore.filter((l) => l !== en && l !== common);

const srcLocalesPath = resolve(__dirname, "public", "locales");

const config = {
  primaryLanguage: "en",
  secondaryLanguages,
  localesFolder: srcLocalesPath,
};

module.exports = config;