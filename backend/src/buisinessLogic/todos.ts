import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { TodosAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { createLogger } from '../utils/logger';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoStorage } from '../dataLayer/todosStorage';

const todosAccess = new TodosAccess();
const todoStorage = new TodoStorage();
const logger = createLogger('todos');

export async function getAllTodosByUser(userId: string): Promise<TodoItem[]> {
  logger.info('Getting all todos for userid: ' + userId);
  return todosAccess.getAllTodosByUser(userId);
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4();
  logger.info('Creating new todo with id: ' + todoId + ' for userid: ' + userId);

  // create the todoItem ready for storage, we will return this
  // to the front end also
  const todoItem = {
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: todoStorage.getStorageUrl(todoId),
    ...createTodoRequest,
  };

  await todosAccess.storeTodo(todoItem);
  return todoItem;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
  logger.info('Deleting todo: ' + todoId + ' for userid: ' + userId);
  await todosAccess.deleteTodo(userId, todoId);
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  logger.info('Updating todo: ' + todoId + ' for userId: ' + userId);
  return await todosAccess.updateTodo(userId, todoId, updateTodoRequest);
}

export async function createSignedUrl(todoId: string) {
  logger.info('Creating signed URL for todoId: ' + todoId);
  return todoStorage.getUploadUrl(todoId);
}
