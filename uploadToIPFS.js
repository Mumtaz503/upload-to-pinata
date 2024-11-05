const pinataSdk = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Your API key for pinata app
const pinataApiKey = process.env.PINATA_API_KEY;
// Your API secret
const pinataApiSecret = process.env.PINATA_API_SECRET;
//Create a new instance of Pinata
const pinata = new pinataSdk(pinataApiKey, pinataApiSecret);

// The folder path to the images but we can modify it to upload images at runtime
// This function uploads the images to Pinata
async function storePropertyImages(imagesFolderPath) {
  const pathToImages = path.resolve(imagesFolderPath);
  const imageFiles = fs.readdirSync(pathToImages);

  let responses = [];

  console.log("Uploading image files to Pinata...");

  // Uploading each image in the folder
  for (const fileIndex in imageFiles) {
    console.log(`working on image index: ${fileIndex}...`);
    const readStream = fs.createReadStream(
      `${pathToImages}/${imageFiles[fileIndex]}`
    );
    /**
     * Pinata metadata options.
     * @notice It is different from URI metadata. This metadata contains information like name of the file on IPFS
     */
    const options = {
      pinataMetadata: {
        name: imageFiles[fileIndex],
      },
    };
    try {
      const response = await pinata.pinFileToIPFS(readStream, options);
      responses.push(response);
    } catch (error) {
      console.error(error);
    }
  }
  return { responses, imageFiles };
}

// This function stores the JSON metadata object to Pinata
async function storePropertyMetadata(metadataJsonObj) {
  // Same options for the Pinata metadata
  const options = {
    pinataMetadata: {
      name: metadataJsonObj.hostId || "Property Metadata",
    },
  };
  try {
    const res = await pinata.pinJSONToIPFS(metadataJsonObj, options);
    return res;
  } catch (error) {
    console.error(error);
  }
  return null;
}

module.exports = {
  storePropertyImages,
  storePropertyMetadata,
};
