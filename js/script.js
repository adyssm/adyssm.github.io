document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const filterInput = document.getElementById('filter-input');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 

   
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    const renderTasks = (filterText = '') => {
        todoList.innerHTML = ''; 

        const filteredTasks = tasks.filter(task =>
            task.text.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredTasks.length === 0) {
            const noTaskRow = document.createElement('tr');
            noTaskRow.innerHTML = '<td colspan="4" class="no-task-found">No task found</td>';
            todoList.appendChild(noTaskRow);
            return;
        }

        filteredTasks.forEach((task, index) => {
            const row = document.createElement('tr');
            if (task.completed) {
                row.classList.add('completed-task');
            }

            row.innerHTML = `
                <td>${task.text}</td>
                <td>${task.dueDate || 'N/A'}</td>
                <td>${task.completed ? 'Completed' : 'Pending'}</td>
                <td class="actions">
                    <button class="complete-btn" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            todoList.appendChild(row);
        });

        attachEventListeners(); 
    };

   
    const addTask = () => {
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;

        if (todoText === '') {
            alert('Task cannot be empty!');
            return;
        }

        const newTask = {
            text: todoText,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        todoInput.value = ''; 
        dueDateInput.value = ''; 
    };

   
    const deleteTask = (index) => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks(filterInput.value); 
        }
    };

    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(filterInput.value); 
    };
    
    const deleteAllTasks = () => {
        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    };

    const attachEventListeners = () => {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => {
                
                const index = parseInt(e.target.dataset.index);
              
                const filteredTasks = tasks.filter(task =>
                    task.text.toLowerCase().includes(filterInput.value.toLowerCase())
                );
                const originalIndex = tasks.findIndex(task => task === filteredTasks[index]);
                deleteTask(originalIndex);
            };
        });

        document.querySelectorAll('.complete-btn').forEach(button => {
            button.onclick = (e) => {
                const index = parseInt(e.target.dataset.index);
                const filteredTasks = tasks.filter(task =>
                    task.text.toLowerCase().includes(filterInput.value.toLowerCase())
                );
                const originalIndex = tasks.findIndex(task => task === filteredTasks[index]);
                toggleComplete(originalIndex);
            };
        });
    };


    addTodoBtn.addEventListener('click', addTask);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterInput.addEventListener('input', (e) => {
        renderTasks(e.target.value);
    });

    deleteAllBtn.addEventListener('click', deleteAllTasks);


    renderTasks();
});
