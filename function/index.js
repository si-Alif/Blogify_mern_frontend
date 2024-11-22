const sharp = require("sharp");

module.exports = async function (req, res) {
  try {
    const { image } = req.payload; // Assume image is sent as base64 in the payload

    // Convert base64 string to buffer
    const imageBuffer = Buffer.from(image, "base64");

    // Compress the image
    const compressedImage = await sharp(imageBuffer)
      .resize({ width: 800 }) // Resize width to 800px (adjust as needed)
      .jpeg({ quality: 80 })  // Convert to JPEG with 80% quality
      .toBuffer();

    // Send back compressed image as base64
    res.json({
      success: true,
      compressedImage: compressedImage.toString("base64"),
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};
