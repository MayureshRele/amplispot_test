import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './app.dto';
import nodeHtmlToImage from 'node-html-to-image';
import * as fs from 'fs';
import { s3 } from './app.helper';
import handlebars from 'handlebars';
import { IUploadImageResponse } from './app.types';
@Injectable()
export class AppService {
  async getHello() {
    return 'Hello Word';
  }

  async createImage(
    files: Express.Multer.File,
    createImageDto: CreateImageDto,
  ): Promise<IUploadImageResponse> {
    try {
      const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
      // Upload the image to S3
      const uploadedFile = await this.s3_upload(
        files.buffer, // Use the buffer directly
        AWS_S3_BUCKET,
        files.originalname,
        files.mimetype,
      );
      // Get Template Handlebar Template
      const templateSource = fs.readFileSync('src/template.hbs', 'utf8');
      const template = handlebars.compile(templateSource);

      const templateData = {
        backgroundImageUrl: process.env.BACKGROUNDIMGURL,
        profilePicUrl: uploadedFile.Location,
        name: `${createImageDto.first_Name} ${createImageDto.last_Name}`,
      };

      const htmlText = template(templateData);

      // Generate the image
      const imageBuffer = await nodeHtmlToImage({
        html: htmlText,
        puppeteerArgs: {
          defaultViewport: {
            width: 1366,
            height: 643,
          },
        },
        encoding: 'binary',
      });

      // Upload the generated image to S3

      const finalImage = await this.s3_upload(
        imageBuffer,
        AWS_S3_BUCKET,
        templateData.name,
        'image/png',
      );

      return {
        file: finalImage.Location,
      };
    } catch (error) {
      console.error(error, 'error');
      throw error; // Re-throw the error for handling at a higher level
    }
  }

  saveFileToPublicFolder(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const publicPath = 'public'; // Specify the public folder path

      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }

      const filePath = `${publicPath}/${file.originalname}`;

      fs.writeFile(filePath, file.buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(filePath);
        }
      });
    });
  }
  async s3_upload(file, bucket, name, mimetype) {
    console.log({ file, bucket, name, mimetype });
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION,
      },
    };

    return await s3.upload(params).promise();
  }
}
