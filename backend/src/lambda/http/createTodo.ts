import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../buisinessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const item = await createTodo(userId, newTodo);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: item,
      }),
    };
  }
);

handler.use(cors({ credentials: true }));
