import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { Logger } from '@nestjs/common';

import { envSchemas } from './schemas';
import { CommonService } from 'src/common/services';

const expanded = dotenvExpand.expand(dotenv.config()).parsed;

export const result = CommonService.validateWithZod(envSchemas, expanded);

if (result.success === false) {
  result.issues.forEach((issue) => {
    const [field = ''] = issue.path;
    Logger.error(`${field}(${issue.message})`, 'Environment');
  });

  throw new Error('Environment validation failed');
}

export const Environment = result.data;
