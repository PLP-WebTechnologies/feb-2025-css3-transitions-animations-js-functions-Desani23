document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const toggleAnimationCheckbox = document.getElementById('toggleAnimation');
  const STORAGE_KEY = 'myTodoList';
  const ANIMATION_PREF_KEY = 'todoAnimationEnabled';

  let tasks = [];

  // Load animation preference from localStorage or default true
  function loadAnimationPref() {
    const pref = localStorage.getItem(ANIMATION_PREF_KEY);
    if (pref !== null) {
      toggleAnimationCheckbox.checked = pref === 'true';
    } else {
      toggleAnimationCheckbox.checked = true;
    }
  }

  // Save animation preference
  function saveAnimationPref() {
    localStorage.setItem(ANIMATION_PREF_KEY, toggleAnimationCheckbox.checked.toString());
  }

  // Load tasks from localStorage
  function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tasks = JSON.parse(saved);
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Create task DOM element
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    if (toggleAnimationCheckbox.checked) {
      li.classList.add('animate-in');
      // Remove animation class after it ends
      li.addEventListener('animationend', () => {
        li.classList.remove('animate-in');
      });
    }

    // Checkbox for completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      if (task.completed) li.classList.add('completed');
      else li.classList.remove('completed');
      saveTasks();
    });

    // Task text
    const span = document.createElement('span');
    span.textContent = task.text;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
      if (toggleAnimationCheckbox.checked) {
        li.classList.add('animate-out');
        li.addEventListener('animationend', () => {
          taskList.removeChild(li);
        }, { once: true });
      } else {
        taskList.removeChild(li);
      }
      // Remove from tasks array
      tasks = tasks.filter(t => t !== task);
      saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
  }

  // Render all tasks
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  // Add new task
  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = { text, completed: false };
    tasks.push(newTask);
    saveTasks();

    taskList.appendChild(createTaskElement(newTask));
    taskInput.value = '';
  });

  // Animation toggle checkbox event
  toggleAnimationCheckbox.addEventListener('change', () => {
    saveAnimationPref();
  });

  // Initial load
  loadAnimationPref();
  loadTasks();
  renderTasks();
});
