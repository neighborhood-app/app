import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';

// import styles from './CouldImg.module.css';

export default function CloudImg({ src, className }: { src: string; className: string }) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dwlk6urra',
    },
  });

  // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
  const myImage = cld.image(src);

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

  // Render the image in a React component.
  return <AdvancedImage className={className} cldImg={myImage} />;
}
