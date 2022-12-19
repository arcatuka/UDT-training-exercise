import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Todo,
} from '../models';
import {TodoRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class TodoTodoController {
  constructor(
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) { }

  @get('/todos/{id}/todo', {
    responses: {
      '200': {
        description: 'Todo has one Todo',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Todo),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Todo> {
    return this.todoRepository.todo(id).get(filter);
  }

  @post('/todos/{id}/todo', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Todo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodoInTodo',
            exclude: ['id'],
            optional: ['linkTodoId']
          }),
        },
      },
    }) todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.todoRepository.todo(id).create(todo);
  }

  @patch('/todos/{id}/todo', {
    responses: {
      '200': {
        description: 'Todo.Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.todo(id).patch(todo, where);
  }

  @del('/todos/{id}/todo', {
    responses: {
      '200': {
        description: 'Todo.Todo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.todo(id).delete(where);
  }
}
