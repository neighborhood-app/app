// // Require the cloudinary library
// const cloudinary = require('cloudinary').v2;

// // Return "https" URLs by setting secure: true
// cloudinary.config({
//   secure: true,
// });

// // Log the configuration
// console.log(cloudinary.config());

// // Uploads an image file //
// const uploadImage = async (imagePath: File | string, publicId: number): Promise<string | void> => {
//   // Allow overwriting the asset with new versions
//   const options = {
//       public_id: publicId,
//       overwrite: true,
//     };

//     try {
//       // Upload the image
//       const result = await cloudinary.uploader.upload(imagePath, options);
//       console.log(result);
//       return result.secure_url;
//     } catch (error) {
//       console.error(error);
//     }
// };


// // Gets details of an uploaded image //
// const getAssetInfo = async (publicId: number) => {

//     // Return colors in the response
//     const options = {
//       colors: true,
//     };

//     try {
//         // Get details about the asset
//         const result = await cloudinary.api.resource(publicId, options);
//         console.log(result);
//         return result.colors;
//         } catch (error) {
//         console.error(error);
//     }
// };


// // Creates an HTML image tag with a transformation that
// // results in a circular thumbnail crop of the image  
// // focused on the faces, applying an outline of the  
// // first color, and setting a background of the second color.
// const createImageTag = (publicId: number, ...colors: string[]) => {

//     // Set the effect color and background color
//     const [effectColor, backgroundColor] = colors;

//     // Create an image tag with transformations applied to the src URL
//     const imageTag = cloudinary.image(publicId, {
//       transformation: [
//         { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
//         { radius: 'max' },
//         { effect: 'outline:10', color: effectColor },
//         { background: backgroundColor },
//       ],
//     });

//     return imageTag;
// };

// export {
//   uploadImage,
//   getAssetInfo,
//   createImageTag
// }