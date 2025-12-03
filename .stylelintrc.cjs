module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "no-duplicate-selectors": null,
    "declaration-block-single-line-max-declarations": null,
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "screen",
          "layer",
          "responsive",
          "config"
        ]
      }
    ]
  }
};
