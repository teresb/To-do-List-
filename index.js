const API_URL = 'https://671909137fc4c5ff8f4c3092.mockapi.io/Tasks'; // Replace with your mock API URL

window.addEventListener('load', () => {
    const form = document.querySelector("#new-task");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // Load tasks from API
    const loadTasks = async () => {
        try {
            const response = await fetch(API_URL);
            const tasks = await response.json();
            tasks.forEach(task => createTaskElement(task.title, task.id)); // Assuming task has a title and id
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
    };

    const createTaskElement = (taskTitle, taskId) => {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskTitle;
        task_input_el.setAttribute("readonly", "readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerText = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerText = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', async () => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
                await updateTaskInAPI(taskId, task_input_el.value);
            }
        });

        task_delete_el.addEventListener('click', async () => {
            await removeTaskFromAPI(taskId);
            list_el.removeChild(task_el);
        });
    };

    const addTaskToAPI = async (task) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: task, completed: false }) // Mock API expects a title and completed status
            });
            const newTask = await response.json();
            createTaskElement(newTask.title, newTask.id); // Add the new task to the UI
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const updateTaskInAPI = async (taskId, newTitle) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle, completed: false }) // Update with the new title
            });
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const removeTaskFromAPI = async (taskId) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value.trim(); // Trim input value

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        addTaskToAPI(task); // Add task to API
        input.value = "";
    });

    loadTasks(); // Load tasks from the API when the page loads
});
