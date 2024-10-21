window.addEventListener('load', () => {
    const form = document.querySelector("#new-task");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        createTaskElement(task);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        createTaskElement(task);
        saveTaskToLocalStorage(task);
        input.value = "";
    });

    function createTaskElement(task) {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task;
        task_input_el.setAttribute("readonly", "readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
                updateTaskInLocalStorage(task, task_input_el.value);
            }
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            removeTaskFromLocalStorage(task);
        });
    }

    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldTask, newTask) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.indexOf(oldTask);
        if (taskIndex > -1) {
            tasks[taskIndex] = newTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
