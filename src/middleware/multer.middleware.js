import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/temp');
    },
    filename: function (req, file, cb) {
      // Generate unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = file.originalname.split('.').pop()
      cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
  }
})

export const upload = multer({ storage: storage })