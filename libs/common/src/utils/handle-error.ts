/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const handleError = (error: any): never => {
  if (error.response) {
    throw new HttpException(error.response.data, error.response.status);
  }

  if (error instanceof HttpException) {
    throw error;
  }

  throw new InternalServerErrorException(
    error.message || 'Internal server error',
  );
};
