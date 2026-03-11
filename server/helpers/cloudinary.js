const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const https = require("https");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

let clockOffset = 0;
let offsetFetched = false;

async function getClockOffset() {
  if (offsetFetched) return clockOffset;
  return new Promise((resolve) => {
    https.get("https://api.cloudinary.com", (res) => {
      const serverTime = new Date(res.headers.date).getTime();
      clockOffset = serverTime - Date.now();
      offsetFetched = true;
      resolve(clockOffset);
    }).on('error', () => resolve(0));
  });
}

// pre-fetch clock offset so the first upload doesn't block waiting for it
getClockOffset();

async function imageUploadUtil(file) {
  const offset = await getClockOffset();
  const timestamp = Math.floor((Date.now() + offset) / 1000);

  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    timestamp: timestamp,
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
