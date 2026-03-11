require("dotenv").config();
const { imageUploadUtil } = require("./helpers/cloudinary");

async function run() {
  try {
    const b64 = Buffer.from("test image content").toString("base64");
    const url = "data:image/png;base64," + b64;
    const result = await imageUploadUtil(url);
    console.log("SUCCESS:", result.url);
  } catch (e) {
    console.log("FAILED:", e);
  }
}

run();
