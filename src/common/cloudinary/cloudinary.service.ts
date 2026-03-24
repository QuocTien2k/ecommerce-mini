import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  private cloudinary;
  constructor() {
    this.cloudinary = cloudinaryConfig();
  }
  async uploadImage(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
