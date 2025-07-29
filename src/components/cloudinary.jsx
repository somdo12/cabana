import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const Cloudinaries = ({imagename}) => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dfxtpej7u' } });

    // Use this sample image or upload your own via the Media Explorer
    const img = cld
        .image(imagename)
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

    return (<AdvancedImage cldImg={img} />);
};

export default Cloudinaries;