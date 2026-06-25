import { glob } from "glob";
import fs from "fs-extra";
import path from "path";

const BASE_URL =
  "https://nikhilrathee1245-stack.github.io/legal-template-storage/";

const TEMPLATE_ROOT = ".";

// Files that are NOT legal templates — exclude them from the index
const EXCLUDED_FILES = [
  "package.json",
  "package-lock.json",
  "generate-index.js",
  "templates_index.json",
  "README.md"
];

async function main() {
  const files = await glob(
    `${TEMPLATE_ROOT}/**/*.{json,txt,docx,doc,rtf,pdf}`,
    { ignore: ["node_modules/**", ".git/**"] }
  );

  const index = files
    .filter((file) => {
      const basename = path.basename(file);
      return !EXCLUDED_FILES.includes(basename);
    })
    .map((file) => {
      const clean = file.replace(/\\/g, "/");
      const parts = clean.split("/");

      // FIXED: Your repo structure is <category>/<file>
      // parts[0] = real category folder (e.g. "BAIL", "Family Law")
      // parts[1] = filename
      // The old code used parts[2] which was always undefined → "General"
      const category = parts[0] || "General";

      // If there is a subfolder (parts.length > 2), capture it
      const subcategory =
        parts.length > 2 ? parts.slice(1, -1).join(" / ") : null;

      const filename = path.basename(clean, path.extname(clean));

      return {
        id: filename.toLowerCase().replace(/\s+/g, "_"),
        title: filename,
        language: "English",
        category,
        subcategory,
        path: clean,
        downloadUrl: BASE_URL + clean,
      };
    });

  await fs.writeJson("templates_index.json", index, { spaces: 2 });

  const categories = new Set(index.map((t) => t.category));
  console.log(`Generated ${index.length} template entries`);
  console.log(`Across ${categories.size} categories`);
  console.log(`Categories found:`, [...categories].sort().join(", "));
}

main();
