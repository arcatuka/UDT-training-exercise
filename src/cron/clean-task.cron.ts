import {createBindingFromClass} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';
@cronJob()
class cleanTodo extends CronJob {
  constructor(
    @repository(TodoRepository)
    public todorepository: TodoRepository
  ) {
    super({
      name: 'clean-task-cronjob',
      onTick: async () => {
        console.log('running cronjob')
        await DeleteTodo(todorepository)
      },
      cronTime: '0 0 1 * * *',
      timeZone: 'Asia/Ho_Chi_Minh',
      start: true,
      runOnInit: true,
    });
  }
}

export const cleanTodoBiding = createBindingFromClass(cleanTodo)

async function DeleteTodo(todoRepository: TodoRepository) {
  let todos: Todo[] = []
  const updatedTodos: Todo[] = []
  try {
    todos = await todoRepository.find({
      where: {
        status: 'done'
      }
    })
    updatedTodos.push(...todos)
    console.log(updatedTodos)
    await Promise.all(
      updatedTodos.map(item => todoRepository.deleteById(item.id))
    );
    console.log('Cronjob: ran successfully!')
  }

  catch (err) {
    console.warn('ran failed! Error: ', err)
  }
}
