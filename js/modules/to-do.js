/* eslint-disable no-unused-expressions */
const empty = document.querySelector('[data-empty]');
const taskList = document.querySelector('[data-task-list]');
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');

let data = [];

// сохранение данных в localStorage

const saveToLocalStorage = () => localStorage.setItem('tasks_data', JSON.stringify(data));

// проверка на наличие задач в списке
const isEmpty = () => {
  // eslint-disable-next-line no-unused-expressions
  taskList.childElementCount === 0 ? empty.style.display = 'block' : empty.style.display = 'none';
};

// удаление задачи из массива data

const deleteTaskFromData = (task) => {
  data = data.filter((item) => item.id !== Number(task.id));
};

// обработчик удаления задачи
const setDeleteTask = (task) => {
  const deleteBtn = task.querySelector('[data-delete-btn]');
  deleteBtn.addEventListener('click', () => {
    deleteTaskFromData(task);
    saveToLocalStorage();
    task.remove();
    isEmpty();
  });
};

// изменение статуса задачи в массиве data

const changeTaskStatus = (task) => {
  const currentTask = data.find((item) => item.id === Number(task.id));
  currentTask.complete = !currentTask.complete;
};

// обработчик зачеркивания задачи
const setCompleteTask = (task) => {
  const completeBtn = task.querySelector('[data-complete-btn]');
  completeBtn.addEventListener('click', () => {
    changeTaskStatus(task);
    saveToLocalStorage();
    task.classList.toggle('to-do__task--complete');
  });
};

// проверка на статус задачи и изменение элемента
const isTaskComplete = (task, taskElement) => task.complete ? taskElement.classList.add('to-do__task--complete') : taskElement.classList.remove('to-do__task--complete');

// отрисовка задачи
const renderTask = (newTask) => {
  const taskTemplate = document.querySelector('#task').content.querySelector('[data-task]').cloneNode(true);
  isTaskComplete(newTask, taskTemplate);
  const taskContent = taskTemplate.querySelector('p');
  taskContent.textContent = newTask.text;
  taskTemplate.setAttribute('id', newTask.id);
  setDeleteTask(taskTemplate);
  setCompleteTask(taskTemplate);
  taskList.append(taskTemplate);
};

// отрисовка на основе данных из localStorage
const renderFromLocalStorage = (renderTaskFu) => {
  if (localStorage.getItem('tasks_data')) {
    const tasks = JSON.parse(localStorage.getItem('tasks_data'));
    tasks.forEach((task) => {
      data.push(task);
      renderTaskFu(task);
    });
  }
};

// добавление задачи
const addTask = (taskText) => {
  const newTask = {
    id: Date.now(),
    text: taskText,
    complete: false,
  };

  data.push(newTask);
  saveToLocalStorage();
  renderTask(newTask);
};

// сетер
const setToDo = () => {
  if (!form) {
    return;
  }
  renderFromLocalStorage(renderTask);
  isEmpty();
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addTask(input.value);
    isEmpty();
    input.value = '';
  });
};

export {setToDo};
