"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;

/**
 * Convert a string into a URL‑friendly slug.
 * @param {string} input
 * @returns {string}
 */
function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "")
    .replaceAll(/-+/g, "-");
}
