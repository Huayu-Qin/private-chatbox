import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export default function multerPDF() {
  // get the current directory
  const __dirname = dirname(fileURLToPath(import.meta.url));
  console.log(__dirname);
  // set the configuration for multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "/public/uploads");
      // use the absolute path to store the file
      cb(null, "/Users/huayuqin/quasar-project/public/upload");
    },
    filename: function (req, file, cb) {
      // set the name of the file
      cb(null, file.fieldname + "_" + Date.now() + ".pdf");
    },
  });

  // build a multer instance
  const upload = multer({ storage: storage });
  return upload;
}
