import { calculateReadingTime } from "../../src/utils/readingTime.js";

describe("calculateReadingTime", () => {
  it("should return '1 min' for short text", () => {
    const text = "This is a short blog post.";
    expect(calculateReadingTime(text)).toBe("1 min");
  });

  it("should return correct reading time for 400 words (2 min)", () => {
    const text = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe("2 min");
  });

  it("should return '0 min' for empty text", () => {
    expect(calculateReadingTime("")).toBe("0 min");
  });

  it("should round up for partial minutes", () => {
    const text = Array(301).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe("2 min");
  });
});
