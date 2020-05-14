import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getAllTodosByUser } from '../../buisinessLogic/todos';
import { getUserId } from '../utils';

const logger = createLogger('getTodos');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);

    const userId = getUserId(event);
    const items = await getAllTodosByUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      }),
    };
  }
);

handler.use(cors({ credentials: true }));
