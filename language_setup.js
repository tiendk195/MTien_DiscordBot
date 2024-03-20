const language = require("i18n");
language.configure({
  locales: ["en", "vi"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  objectNotation: true,
  register: global,
  logWarnFn: function () {},
});
module.exports = language;
