import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { deleteTodo } from '../../buisinessLogic/todos';
import { getUserId } from '../utils';

const logger = createLogger('deleteTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);

    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;

    await deleteTodo(userId, todoId);

    return {
      statusCode: 204,
      body: '',
    };
  }
);

handler.use(cors({ credentials: true }));
