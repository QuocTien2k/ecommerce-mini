import { Injectable } from '@nestjs/common';
import { cloudinaryConfig } from './cloudinary.config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private cloudinary;

  constructor() {
    this.cloudinary = cloudinaryConfig();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
