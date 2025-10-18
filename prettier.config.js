export default {
  printWidth: 80,
  singleQuote: true,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  arrowParens: "always",
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
