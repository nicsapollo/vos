import { diskStorage } from "multer";


export const storage = diskStorage({
  destination: "./uploads/menu_files",
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  }
});


function generateFilename(file) {
  return `${file.originalname}`;
}