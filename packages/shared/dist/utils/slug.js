"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(input) {
    return input
        .trim()
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(/[^a-z0-9-]/g, "")
        .replaceAll(/-+/g, "-");
}
