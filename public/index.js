const API_URL = "http://localhost:3000/todos";

const addTodoForm = document.getElementById("addTodoForm");
const titleInput = document.getElementById("titleInput");
const container = document.getElementById("container");

const fetchTodos = async () => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`fetch todos failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("error fetch todos");
  }
};

const fetchTodoById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error(`fetch a todo failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("error fetch single todo");
  }
};

const renderTodos = (todos) => {
  const div = document.createElement("div");
  div.className = "todos-list-container";

  const ul = document.createElement("ul");

  todos.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.id = item.id;

    // Todo Title
    const title = document.createElement("span");
    title.textContent = item.title;
    title.className = "todo-title";

    if (item.done) {
      title.classList.add("done");
    }

    // Button Container
    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    // Finish Button
    const finishBtn = document.createElement("button");
    finishBtn.textContent = item.done ? "uncheck" : "finish";

    finishBtn.className = item.done
      ? "action-btn uncheck-btn"
      : "action-btn finish-btn";

    // Update Button
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "update";

    updateBtn.className = "action-btn update-btn";

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.className = "action-btn delete-btn";

    // event listener
    deleteBtn.addEventListener("click", handleDelete);
    updateBtn.addEventListener("click", handleUpdate);
    finishBtn.addEventListener("click", handleFinish);

    // Append
    btnContainer.appendChild(finishBtn);
    if (!item.done) {
      btnContainer.appendChild(updateBtn);
    }
    btnContainer.appendChild(deleteBtn);

    li.appendChild(title);
    li.appendChild(btnContainer);
    ul.appendChild(li);
  });

  div.appendChild(ul);
  container.appendChild(div);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();

  if (title === "") {
    alert("please fill the title");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to add todo");
    }

    titleInput.value = "";
    fetchTodos();
  } catch (error) {
    console.error(`failed to add new todo: ${error}`);
  }
};

const handleFinish = async (e) => {
  e.preventDefault();

  const id = e.target.closest("li").dataset.id;

  try {
    const item = await fetchTodoById(id);

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title: item.title,
        done: item.done === 1 ? 0 : 1,
      }),
    });

    if (!res.ok) {
      throw new Error(`failed update todo's isDone with id: ${id}`);
    }

    fetchTodos();
  } catch (error) {
    console.error(`failed toogle todo: ${error}`);
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();

  const id = e.target.closest("li").dataset.id;

  const newTitle = prompt("Enter new title:");

  if (!newTitle) {
    return;
  }

  try {
    const item = await fetchTodoById(id);

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title: newTitle,
        done: item.done,
      }),
    });

    if (!res.ok) {
      throw new Error(`failed update todo title with id: ${id}`);
    }

    fetchTodos();
  } catch (error) {
    console.error(`failed update todo title: ${error}`);
  }
};

const handleDelete = async (e) => {
  e.preventDefault();

  const id = e.target.closest("li").dataset.id;

  const confirmed = confirm("Are you sure you want to delete this todo?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`failed delete todo with id: ${id}`);
    }

    fetchTodos();
  } catch (error) {
    console.error(`Error delete todo: ${error}`);
  }
};

addTodoForm.addEventListener("submit", handleSubmit);

const init = async () => {
  const data = await fetchTodos();
  if (data) {
    renderTodos(data);
  }
};

init();
