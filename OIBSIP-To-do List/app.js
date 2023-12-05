//variables
let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodosDiv = document.querySelector(".completed-todos");
const unCompletedTodosDiv = document.querySelector(".uncompleted-todos");
const audio = new Audio("sound.mp3");

//get todo list on first boot
window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems != null) {
    todoLists = JSON.parse(storageTodoItems);
  }
  render();
};

//Get the content typed into the input
todoInput.addEventListener("keyup", (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode === 13) {
    addTodo(value);

    todoInput.value = "";
    todoInput.focus();
  }
});

//Add todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });
  console.log(todoItems);

  saveAndRender();
}

//Remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

//mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }
    return todo;
  });
  audio.play();

  saveAndRender();
}

//mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }
    return todo;
  });
  audio.play();

  saveAndRender();
}

//save in localStorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//Render
function render() {
  let unCompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);

  completedTodosDiv.innerHTML = "";
  unCompletedTodosDiv.innerHTML = "";

  if (unCompletedTodos.length > 0) {
    unCompletedTodos.forEach((todo) => {
      unCompletedTodosDiv.append(createTodoElement(todo));
    });
  } else {
    unCompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted mision</div>`;
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length}/ ${todoItems.length})</div>`;

    completedTodos.forEach((todo) => {
      completedTodosDiv.append(createTodoElement(todo));
    });
  }
}

//save and render
function saveAndRender() {
  save();
  render();
}

//create todo list item
function createTodoElement(todo) {
  //create todolist container
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data-id", todo.id);
  todoDiv.className = "todo-item";

  //create todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  //checkbox
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.addEventListener("click", (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
  });

  //Delete button for list
  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"stroke-linecap="round"stroke-linejoin="round"> 
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                              </svg>`;
  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
