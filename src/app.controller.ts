import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CreateImageDto } from './app.dto';
import { File } from 'buffer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
  @Post('create-image')
  @UseInterceptors(FileInterceptor('profile_pic'))
  async createImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ): Promise<string | any> {
    if (!file) {
      return {
        error: 'File Not Found',
      };
    }

    return this.appService.createImage(file, createImageDto);
  }
}
