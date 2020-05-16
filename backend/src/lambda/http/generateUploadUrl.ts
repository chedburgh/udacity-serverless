import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { createSignedUrl } from '../../buisinessLogic/todos';

const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const todoId = event.pathParameters.todoId;

    if (!todoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing todoId',
        }),
      };
    }

    const signedUrl = await createSignedUrl(todoId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: signedUrl,
      }),
    };
  }
);

handler.use(cors({ credentials: true }));
