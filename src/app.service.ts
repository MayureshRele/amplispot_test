import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './app.dto';
import nodeHtmlToImage from 'node-html-to-image';
import * as fs from 'fs';
@Injectable()
export class AppService {
  async getHello() {
    return 'Hello Word';
  }

  async createImage(
    files: Express.Multer.File,
    createImageDto: CreateImageDto,
  ): Promise<string> {
    try {
      const uploadedFile = await this.saveFileToPublicFolder(files);
      console.log(uploadedFile, 'this');
      const htmlText = `<div style="border: 2px solid #000; border-radius: 0.125rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); margin: 0.75rem; padding: 0.5rem;">
  <div class="profilePic" style="position: relative;">
    <img
      src="file.jpg"
      alt="profilePic"
      style="width: 135px; height: 135px; position: absolute; top: 41px; left: 291px; border-radius: 1rem;"
    />
  </div>
  <img src="testImg.jpg" alt="testImg" style="/* Add your styles for the 'testImg' here */" />
  <div class="relative">
    <div class="info" style="position: absolute; bottom: 35px; left: 386px; font-size: 2rem; text-transform: capitalize; font-weight: 600; /* Add your desired text styles */">
      First Name Last Name
    </div>
  </div>
</div>
`;
      // await nodeHtmlToImage({
      //   output: './image.png',
      //   html: htmlText,
      // });

      return uploadedFile;
    } catch (error) {
      console.log(error, 'error');
      return error;
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
}
