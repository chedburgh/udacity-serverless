import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { createLogger } from '../utils/logger';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const logger = createLogger('todosAccess');
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosLocalIndex = process.env.TODOS_LOCAL_INDEX,
    private readonly todosTodoIdIndex = process.env.TODOS_TODOID_INDEX
  ) {}

  async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items for userId: ' + userId);

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosLocalIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      })
      .promise();

    return result.Items as TodoItem[];
  }

  async storeTodo(todoItem: TodoItem): Promise<void> {
    logger.info('Creating a new todo for userId: ' + todoItem.userId + ' with todoId: ' + todoItem.todoId);

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem,
      })
      .promise();
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    logger.info('Deleting todo for userId: ' + userId + ' with todoId: ' + todoId);

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId: userId, todoId: todoId },
      })
      .promise();
  }

  async updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
    logger.info('Updating todo with todoId: ' + todoId);

    const result = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId: userId, todoId: todoId },
        UpdateExpression: 'set #todoname = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': updateTodoRequest.name,
          ':dueDate': updateTodoRequest.dueDate,
          ':done': updateTodoRequest.done,
        },
        ExpressionAttributeNames: {
          '#todoname': 'name',
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    logger.info('Updated todo in database as follows: ' + result.Attributes);

    return result.Attributes as TodoItem;
  }

  async setTodoAttachmentUrl(todoId: string, url: string): Promise<void> {
    logger.info('Updating todoId: ' + todoId + ' with url: ' + url);

    const items = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosTodoIdIndex,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: { ':todoId': todoId },
      })
      .promise();

    if (items.Count !== 1) {
      logger.error('The todoId:' + todoId + ' does not exist in the database');
      return;
    }

    logger.info(items);

    const item = items.Items[0] as TodoItem;

    const updated_item = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId: item.userId, todoId: todoId },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
          ':url': url,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    logger.info('Updated Item is now: ' + updated_item);
  }
}
