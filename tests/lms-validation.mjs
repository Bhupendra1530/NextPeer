import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
const moduleUnderTest = { exports: {} };
const js = ts.transpileModule(
  fs.readFileSync(new URL("../lib/lms-validation.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
new Function("exports", "module", js)(moduleUnderTest.exports, moduleUnderTest);
const v = moduleUnderTest.exports;

test("external links reject unsafe schemes, credentials and missing values", () => {
  for (const input of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "https://user:password@example.com",
    "not a url",
    "",
  ])
    assert.throws(() => v.httpsUrl(input));
  assert.equal(
    v.httpsUrl(" https://example.com/work "),
    "https://example.com/work",
  );
  assert.equal(v.httpsUrl("", false), null);
});
test("text and number validation reject coercion and overlong answers", () => {
  assert.throws(() => v.text("   ", "Answer"));
  assert.throws(() => v.text("x".repeat(20001), "Answer", 20000));
  for (const score of [-1, 101, 1.5, "100", null, NaN])
    assert.throws(() => v.integer(score, "Score", 0, 100));
  assert.equal(v.integer(0, "Score", 0, 100), 0);
  assert.throws(() => v.boolean("false"));
});
test("timestamps require an explicit zone and preserve IST conversion", () => {
  assert.equal(
    v.timestamp("2030-01-15T18:30:00+05:30"),
    "2030-01-15T13:00:00.000Z",
  );
  assert.throws(() => v.timestamp("2030-01-15T18:30:00"));
  assert.throws(() => v.timestamp("invalid"));
  assert.equal(v.timestamp(null, false), null);
});
test("embedded recordings accept only known providers and valid IDs", () => {
  assert.equal(
    v.lessonEmbed("https://youtu.be/dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    v.lessonEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  );
  assert.equal(
    v.lessonEmbed("https://vimeo.com/123456789"),
    "https://player.vimeo.com/video/123456789",
  );
  for (const link of [
    "https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)",
    "http://youtu.be/dQw4w9WgXcQ",
    "https://example.com/recording",
  ])
    assert.equal(v.lessonEmbed(link), null);
});
