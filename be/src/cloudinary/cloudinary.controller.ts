import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SuccessResponse } from '../core/success.response';

@Controller('upload')
@ApiTags('Upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The file has been uploaded successfully to cloudinary',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);

    return new SuccessResponse({
      message: 'Upload file thành công!',
      metadata: { data: result },
    });
  }
}
