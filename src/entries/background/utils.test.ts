import { describe, expect, it, test } from "vitest";
import { sanitze } from "./utils";

describe("URL sanitation", () => {
  describe("Invalid pages", () => {
    test.each([
      "https://github.com",
      "https://github.com/",
      "https://github.com/account",
      "https://github.com/codespaces",
      "https://github.com/issues",
      "https://github.com/new",
      "https://github.com/notifications",
      "https://github.com/pulls",
      "https://github.com/sponsors",
      "https://gitlab.com/",
      "https://gitlab.com/MLNW",
      "https://google.com",
    ])("%s -> false", (url) => {
      expect(sanitze(url)).toBe(false);
    });
  });

  describe("Invalid formats", () => {
    test.each([
      "https:/github.com",
      "http//github.com/",
      "https://githubcom/account",
      "https://github .com/codespaces",
      "https://github,com/issues",
      "github.com/new",
      "htts://github.com/notifications",
    ])("%s -> false", (url) => {
      expect(sanitze(url)).toBe(false);
    });
  });

  describe("Valid pages", () => {
    test.each([
      ["https://github.com/foo/bar", "foo/bar"],
      ["https://github.com/foo/bar/pulls", "foo/bar"],
      ["https://github.com/foo/bar/pulls/1234?foo=bar", "foo/bar"],
      ["https://github.com/foo/bar/pulls#notes", "foo/bar"],
      ["https://github.com/foo/bar#readme", "foo/bar"],
      ["https://github.com/MLNW?tab=projects", "MLNW"],
      ["https://github.com/MLNW?tab=projects#card-1234", "MLNW"],
      ["https://github.com/MLNW?tab=repositories", "MLNW"],
      ["https://github.com/MLNW", "MLNW"],
      ["https://github.com/users/MLNW/projects/2?foo=bar", "MLNW"],
      ["https://github.com/users/MLNW/projects/2", "MLNW"],
    ])("%s -> %s", (url, expected) => {
      expect(sanitze(url)).toBe(expected);
    });
  });
});
