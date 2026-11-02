import { describe, expect, it } from "vitest";
import {
  cleanSaved,
  decodeSelection,
  encodeSelection,
  MAX_SAVED,
  mergeSaved,
  toggleSaved,
} from "~/features/shop/selection";

describe("cleanSaved", () => {
  it("drops malformed, duplicate and unsafe entries", () => {
    const result = cleanSaved([
      { id: "cup", variant: "" },
      { id: "cup", variant: "large" },
      { id: "bad id", variant: "" },
      { id: "tee", variant: "../x" },
      null,
      "text",
      { id: "print", variant: "a3" },
    ]);
    expect(result).toEqual([
      { id: "cup", variant: "" },
      { id: "print", variant: "a3" },
    ]);
  });

  it("rejects anything that is not a list and caps the length", () => {
    expect(cleanSaved({ id: "cup" })).toEqual([]);
    const many = Array.from({ length: MAX_SAVED + 10 }, (_, index) => ({ id: `item-${index}`, variant: "" }));
    expect(cleanSaved(many)).toHaveLength(MAX_SAVED);
  });
});

describe("encodeSelection / decodeSelection", () => {
  it("round-trips ids and variants", () => {
    const items = [
      { id: "cup", variant: "" },
      { id: "tee", variant: "black-m" },
    ];
    const code = encodeSelection(items);
    expect(code).toBe("cup.tee~black-m");
    expect(decodeSelection(code)).toEqual(items);
  });

  it.each(["", "cup..tee", "cup~", "cup~a~b", "cup tee", "cup.cup", "💥", "a".repeat(7000)])(
    "rejects the tampered code %j",
    (code) => {
      expect(decodeSelection(code)).toBeNull();
    },
  );

  it("rejects more entries than a selection may hold", () => {
    const code = Array.from({ length: MAX_SAVED + 1 }, (_, index) => `item-${index}`).join(".");
    expect(decodeSelection(code)).toBeNull();
  });
});

describe("toggleSaved", () => {
  it("adds, removes and respects the limit", () => {
    const added = toggleSaved([], "cup", "large");
    expect(added).toEqual([{ id: "cup", variant: "large" }]);
    expect(toggleSaved(added, "cup")).toEqual([]);
    const full = Array.from({ length: MAX_SAVED }, (_, index) => ({ id: `item-${index}`, variant: "" }));
    expect(toggleSaved(full, "extra")).toEqual(full);
  });
});

describe("mergeSaved", () => {
  it("appends new objects and lets shared variants win", () => {
    const merged = mergeSaved(
      [
        { id: "cup", variant: "" },
        { id: "tee", variant: "s" },
      ],
      [
        { id: "tee", variant: "m" },
        { id: "print", variant: "" },
      ],
    );
    expect(merged).toEqual([
      { id: "cup", variant: "" },
      { id: "tee", variant: "m" },
      { id: "print", variant: "" },
    ]);
  });
});
