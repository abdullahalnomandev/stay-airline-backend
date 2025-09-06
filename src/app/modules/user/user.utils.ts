import multer from 'multer';


// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory where uploaded files will be stored
        console.log(file)
        cb(null, 'uploads-test-file/'); 
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });
export default upload;
