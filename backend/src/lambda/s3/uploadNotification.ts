import 'source-map-support/register';
import { S3Handler, S3Event } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { setAttachmentUrl } from '../../buisinessLogic/todos';

const logger = createLogger('updateTodo');

export const handler: S3Handler = async (event: S3Event) => {
  logger.info('Processing event: ' + event);

  for (const record of event.Records) {
    const key = record.s3.object.key;
    logger.info('Upload notification for todoId: ' + key);
    await setAttachmentUrl(key);
  }
};
