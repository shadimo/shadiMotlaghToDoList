//select Dom Element
const app = document.querySelector("#app");
const inputToDo = document.querySelector("#todo-title");
const TodoListElements = document.querySelector("#todos-list");
const donesListElements = document.querySelector("#dones-list");
const formTodo = document.querySelector("#form-todo");
const inputToDoTitle = document.querySelector("#todo-title");
const submitAddButton = document.querySelector(".add-todo");
const submitEditButton = document.querySelector(".submit-edit-todo");
const DoneButton = document.querySelector(".send-done");
const UndoButton = document.querySelector(".Undo-done");
inputToDo.focus();
//url
const url = "  http://localhost:3000";
//get todo
const getToDOs = async () => {
  const response = await fetch(url + "/todos");
  const todos = await response.json();

  for (const todo of todos) {
    TodoListElements.innerHTML += `<li data-id= "${todo.id}">
          <h2>
           ${todo.title}
           </h2>

                       <i class="edit-todo">Edit</i>
                      <i class="delete-todo">Delete</i>
                      <i class="send-done" ">done</i>



           </li>`;
  }
};
//get done
const getDones = async () => {
  const response = await fetch(url + "/dones");
  const dones = await response.json();
  dones.innerHTML = "";
  for (const done of dones) {
    donesListElements.innerHTML += `<li data-id= "${done.id}">
       <h2>
         ${done.title}
           </h2>


           <i class="Undo-done">Undo</i>
           <i class="delete-done">Delete</i>

           </li>`;
  }
};
// create ToDo
const createToDo = async (data) => {
  const response = await fetch(url + "/todos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};
// create todo function
formTodo.addEventListener("submit", function (e) {
  const data = {
    title: inputToDo.value,
  };
  e.preventDefault();
  if (inputToDo.value.trim()) {
    createToDo(data);
  } else {
    alert("you have to enter a task!!");
  }
});
//delete todo function
const DeleteToDo = async (id) => {
  const response = await fetch(url + `/todos/${id}`, {
    method: "DELETE",
  });
};

app.addEventListener("click", function (e) {
  const id = e.target.parentElement.dataset.id;
  if (e.target.classList.contains("delete-todo")) {
    const isOk = confirm("Are you sure?");
    if (isOk) {
      DeleteToDo(id);
    }
  }
  if (e.target.classList.contains("edit-todo")) {
    submitAddButton.style.display = "none";
    submitEditButton.style.display = "block ";
    getToDo(id);
    submitEditButton.id = id;
  }
  if (e.target.classList.contains("send-done")) {
    const isOk = confirm("Are you sure?");
    if (isOk) {
      sendTodos(id);
      DoneButton.id = id;
    }
  }
});
//get single task and put it in form
const getToDo = async (id) => {
  const response = await fetch(url + `/todos/${id}`);
  const todo = await response.json();
  inputToDo.value = todo.title;
};

//Edit job function
const editToDo = async (id) => {
  const data = {
    title: inputToDoTitle.value,
  };

  if (inputToDoTitle.value.trim()) {
    const response = await fetch(url + `/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } else {
    alert("you can't let title empty");
  }
};
submitEditButton.addEventListener("click", function () {
  editToDo(this.id);
});
//send todo to done
const sendTodos = async (id) => {
  const response = await fetch(url + `/todos/${id}`);
  const todo = await response.json();
  const responseDone = await fetch(url + `/dones`, {
    method: "POST",
    body: JSON.stringify({ title: todo.title }),
    headers: { "Content-Type": "application/json" },
  });
  await fetch(url + `/todos/${id}`, {
    method: "DELETE",
  });
};
//delete Done
const DeleteToDone = async (id) => {
  const response = await fetch(url + `/dones/${id}`, {
    method: "DELETE",
  });
};
//undo dones function
const undoDone = async (id) => {
  const response = await fetch(url + `/dones/${id}`);
  const done = await response.json();
  const responsetodo = await fetch(url + `/todos`, {
    method: "POST",
    body: JSON.stringify({ title: done.title }),
    headers: { "Content-Type": "application/json" },
  });
  await fetch(url + `/dones/${id}`, {
    method: "DELETE",
  });
};
app.addEventListener("click", function (e) {
  const id = e.target.parentElement.dataset.id;
  if (e.target.classList.contains("delete-done")) {
    const isOk = confirm("Are you sure?");
    if (isOk) {
      DeleteToDone(id);
    }
  }
  if (e.target.classList.contains("Undo-done")) {
    const isOk = confirm("Are you sure?");
    if (isOk) {
      undoDone(id);
      UndoButton.id = id;
    }
  }
});
getToDOs();
getDones();
