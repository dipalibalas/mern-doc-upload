const test = require("node:test");
const assert = require("node:assert/strict");
const { textToTipTap } = require("../utils/fileParser");

test("textToTipTap converts plain text into paragraph nodes", () => {
  const result = textToTipTap("Hello\n\nWorld");

  assert.equal(result.type, "doc");
  assert.equal(result.content.length, 2);
  assert.equal(result.content[0].type, "paragraph");
  assert.equal(result.content[0].content[0].text, "Hello");
  assert.equal(result.content[1].content[0].text, "World");
});

test("textToTipTap returns an empty paragraph for blank input", () => {
  const result = textToTipTap("   \n  ");

  assert.equal(result.content.length, 1);
  assert.equal(result.content[0].type, "paragraph");
});
