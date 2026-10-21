import { esc } from "./dom.js";
export const external = (href, text, cls = "") =>
  `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
