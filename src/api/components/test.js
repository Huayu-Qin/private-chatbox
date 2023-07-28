import { dirname } from "path";
import { fileURLToPath } from "url";

console.log(fileURLToPath(dirname(dirname(dirname(dirname(import.meta.url))))));
