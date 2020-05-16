import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { updateTodo } from '../../buisinessLogic/todos';
import { getUserId } from '../utils';

const logger = createLogger('updateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);

    const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;

    if (!todoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing todoId'
        })
      }
    }

    const item = await updateTodo(userId, todoId, updateTodoRequest);

    return {
      statusCode: 204,
      body: JSON.stringify({
        item: item,
      }),
    };
  }
);

handler.use(cors({ credentials: true }));
