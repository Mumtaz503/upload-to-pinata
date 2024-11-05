const {
  storePropertyImages,
  storePropertyMetadata,
} = require("./uploadToIPFS");

let uRIS;
const imagesFolderPath = "./images";
// This is the template of the metadata for the host
// We can add these values from the input form in the front-end
const metadataTemplate = {
  title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  mainImage: "",
  galleryImages: {
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
    image7: "",
    image8: "",
    image9: "",
    image10: "", //Total 10 images allocation for the gallery
  },
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus bibendum velit, et ullamcorper nibh interdum nec. In hac habitasse platea dictumst. Nullam sit amet massa non velit aliquet tincidunt. Nullam tristique enim nisi, id scelerisque ipsum faucibus ut. Integer ultrices lorem eu est volutpat, vel molestie ligula porttitor. Donec faucibus feugiat nulla, non tristique elit pulvinar at. Suspendisse potenti. Phasellus vestibulum fermentum velit non ullamcorper. Phasellus vel consequat est. Mauris sollicitudin fringilla semper.Vestibulum dapibus odio eget nulla gravida laoreet. Integer auctor, turpis ut fermentum euismod, dolor arcu vehicula eros, eu laoreet dolor ligula non metus. Curabitur luctus risus purus, id varius velit feugiat id. Mauris sed suscipit lorem. Aenean ut orci nec sapien condimentum elementum in a lectus. Fusce auctor malesuada ex, eu euismod mauris lacinia at. Donec vulputate tortor nec libero eleifend posuere. Aenean vel mi id erat scelerisque volutpat at sit amet sapien. Nulla facilisi. Morbi at leo quis velit posuere sagittis. Maecenas cursus libero ut neque malesuada, eget vehicula felis posuere. Vivamus malesuada, orci in ullamcorper congue, ex ipsum pharetra turpis, nec euismod ligula justo non lacus. Sed ornare ac elit ac vehicula.",
  hostId: "1212bgdshucvb7355",
  price: 200,
  location: {
    name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus bibendum velit, et ullamcorper nibh interdum nec.",
    coordinates: {
      x: 40.689247,
      y: -74.044502,
    },
  },
  bathroom: 1,
  roomSize: 100, //sq feet
  offers: {
    kitchen: true,
    dedicatedWorkspace: false,
    centralAirConditioning: true,
    washingMachine: true,
    freeStreetParking: false,
    balcony: false,
    wiFi: true,
    beachFront: false,
  },
};

async function main() {
  // We first upload the images to Pinata
  const { responses: uploadedImagesResponses } = await storePropertyImages(
    imagesFolderPath
  );

  if (!uploadedImagesResponses || uploadedImagesResponses.length === 0) {
    console.error("No images were uploaded.");
    return;
  }

  // Create a copy of metadata template to add the image URIs
  let uriMetadata = { ...metadataTemplate };

  // Set the first image as the main image
  uriMetadata.mainImage = `ipfs://${uploadedImagesResponses[0].IpfsHash}`;

  // Set the remaining images in galleryImages
  uploadedImagesResponses.slice(1).forEach((response, index) => {
    const imageKey = `image${index + 1}`;
    uriMetadata.galleryImages[imageKey] = `ipfs://${response.IpfsHash}`;
  });
  console.log(`Uploading ${uriMetadata.title}...`);
  //Once the images are uploaded store the metadata
  const res = await storePropertyMetadata(uriMetadata);
  uRIS = `ipfs://${res.IpfsHash}`;

  console.log("URI uploaded: ", uRIS);
}

main().catch((error) => console.error("Error in main function:", error));
