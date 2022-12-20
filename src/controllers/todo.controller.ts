import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) { }

  @post('/todos')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodo',
            exclude: ['id'],
          }),
        },
      },
    })
    todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.todoRepository.create(todo);
  }

  @get('/todos/count')
  @response(200, {
    description: 'Todo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.count(where);
  }

  @get('/todos')
  @response(200, {
    description: 'Array of Todo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Todo) filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }

  @patch('/todos')
  @response(200, {
    description: 'Todo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.updateAll(todo, where);
  }

  @get('/todos/{id}')
  @response(200, {
    description: 'Todo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }



  @patch('/todos/{id}')
  @response(204, {
    description: 'Todo PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @put('/todos/{id}')
  @response(204, {
    description: 'Todo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.replaceById(id, todo);
  }

  @del('/todos/{id}')
  @response(204, {
    description: 'Todo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.todoRepository.deleteById(id);
  }

  @post('/todos/link/{id}/{id2}')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async linkTodo(
    @param.path.string('id') id: string,
    @param.path.string('id2') id2: string,
  ): Promise<void> {
    const currentTodo: Todo = await this.todoRepository.findById(id)
    const linkTodo: Todo = await this.todoRepository.findById(id2)
    if (String(currentTodo.projectId) == String(linkTodo.projectId)) {
      return this.todoRepository.updateById(id, {linkTodoId: id2})
    }
    else throw new HttpErrors.Unauthorized("Unable to link")
  }
}
