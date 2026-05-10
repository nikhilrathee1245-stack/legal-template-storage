import { glob } from "glob";
import fs from "fs-extra";
import path from "path";

const BASE_URL =
  "https://nikhilrathee1245-stack.github.io/legal-template-storage/";

const TEMPLATE_ROOT = ".";

async function main() {
  const files = await glob(
  `${TEMPLATE_ROOT}/**/*.{json,txt,docx,doc,rtf,pdf}`
);

  const index = files.map((file) => {
    const clean = file.replace(/\\/g, "/");

    const parts = clean.split("/");

    const language = parts[1] || "Unknown";
    const category = parts[2] || "General";

    const filename = path.basename(
      clean,
      path.extname(clean)
    );

    return {
      id: filename
        .toLowerCase()
        .replace(/\s+/g, "_"),

      title: filename,

      language,

      category,

      path: clean,

      downloadUrl: BASE_URL + clean
    };
  });

  await fs.writeJson(
    "templates_index.json",
    index,
    { spaces: 2 }
  );

  console.log(
    `Generated ${index.length} template entries`
  );
}

main();