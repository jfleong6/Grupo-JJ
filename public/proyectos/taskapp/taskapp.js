// taskapp.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let tasks = JSON.parse(localStorage.getItem('taskapp_tasks')) || [];
    let currentTheme = localStorage.getItem('taskapp_theme') || 'light';
    let currentView = 'board';
    let currentTaskId = null;
    let draggedTask = null;
    
    // Elementos del DOM
    const themeToggle = document.getElementById('themeToggle');
    const syncBtn = document.getElementById('syncBtn');
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskCategory = document.getElementById('taskCategory');
    const priorityButtons = document.querySelectorAll('.priority-btn');
    const taskReminder = document.getElementById('taskReminder');
    const quickReminders = document.querySelectorAll('.quick-reminder');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const exportTasksBtn = document.getElementById('exportTasks');
    const viewButtons = document.querySelectorAll('.view-btn');
    const boardContainer = document.getElementById('boardContainer');
    const listContainer = document.getElementById('listContainer');
    const todoList = document.getElementById('todoList');
    const progressList = document.getElementById('progressList');
    const doneList = document.getElementById('doneList');
    const addTaskButtons = document.querySelectorAll('.add-task-btn');
    const taskModal = document.getElementById('taskModal');
    const editTaskForm = document.getElementById('editTaskForm');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const saveTaskChangesBtn = document.getElementById('saveTaskChanges');
    const deleteTaskBtn = document.getElementById('deleteTask');
    const exportModal = document.getElementById('exportModal');
    const cancelExportBtn = document.getElementById('cancelExport');
    const confirmExportBtn = document.getElementById('confirmExport');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const snoozeAllBtn = document.getElementById('snoozeAll');
    const demoResetBtn = document.getElementById('demoReset');
    const currentYear = document.getElementById('currentYear');
    
    // Elementos de estadísticas
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');
    const overdueTasksEl = document.getElementById('overdueTasks');
    
    // Contadores de columnas
    const todoCountEl = document.getElementById('todoCount');
    const progressCountEl = document.getElementById('progressCount');
    const doneCountEl = document.getElementById('doneCount');
    
    // Inicializar la aplicación
    function init() {
        // Establecer tema
        setTheme(currentTheme);
        
        // Configurar año actual
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
        
        // Cargar datos de ejemplo si no hay tareas
        if (tasks.length === 0) {
            loadSampleTasks();
        }
        
        // Inicializar interfaz
        renderAllTasks();
        updateStats();
        setupEventListeners();
        setupDragAndDrop();
        checkReminders();
        
        // Configurar fecha mínima para recordatorios
        const now = new Date();
        const formattedNow = now.toISOString().slice(0, 16);
        if (taskReminder) {
            taskReminder.min = formattedNow;
        }
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Toggle tema
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Botón de sincronización
        if (syncBtn) {
            syncBtn.addEventListener('click', simulateSync);
        }
        
        // Formulario de nueva tarea
        if (taskForm) {
            taskForm.addEventListener('submit', addNewTask);
        }
        
        // Botones de prioridad
        priorityButtons.forEach(button => {
            button.addEventListener('click', function() {
                priorityButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Recordatorios rápidos
        quickReminders.forEach(button => {
            button.addEventListener('click', function() {
                const hours = parseInt(this.getAttribute('data-hours'));
                setQuickReminder(hours);
            });
        });
        
        // Aplicar filtros
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }
        
        // Limpiar tareas completadas
        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        }
        
        // Exportar tareas
        if (exportTasksBtn) {
            exportTasksBtn.addEventListener('click', () => {
                exportModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        // Cambiar vista (tablero/lista)
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                changeView(view);
                
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Botones para agregar tareas a columnas
        addTaskButtons.forEach(button => {
            button.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                openTaskModalForColumn(column);
            });
        });
        
        // Modal de edición
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', closeTaskModal);
        }
        
        if (saveTaskChangesBtn) {
            saveTaskChangesBtn.addEventListener('click', saveTaskChanges);
        }
        
        if (deleteTaskBtn) {
            deleteTaskBtn.addEventListener('click', deleteCurrentTask);
        }
        
        // Modal de exportación
        if (cancelExportBtn) {
            cancelExportBtn.addEventListener('click', closeExportModal);
        }
        
        if (confirmExportBtn) {
            confirmExportBtn.addEventListener('click', exportTasks);
        }
        
        // Cerrar modales
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Cerrar modales al hacer clic fuera
        if (taskModal) {
            taskModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeTaskModal();
                }
            });
        }
        
        if (exportModal) {
            exportModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeExportModal();
                }
            });
        }
        
        // Posponer todos los recordatorios
        if (snoozeAllBtn) {
            snoozeAllBtn.addEventListener('click', snoozeAllReminders);
        }
        
        // Reiniciar demo
        if (demoResetBtn) {
            demoResetBtn.addEventListener('click', resetDemo);
        }
    }
    
    // Configurar arrastrar y soltar
    function setupDragAndDrop() {
        // Configurar elementos arrastrables
        document.addEventListener('dragstart', function(e) {
            if (e.target.classList.contains('task-card')) {
                draggedTask = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id);
            }
        });
        
        document.addEventListener('dragend', function(e) {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
                draggedTask = null;
            }
        });
        
        // Configurar zonas de destino
        const dropZones = document.querySelectorAll('.task-list');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                if (draggedTask) {
                    const taskId = draggedTask.id.replace('task-', '');
                    const newStatus = this.getAttribute('data-status');
                    
                    // Actualizar estado de la tarea
                    updateTaskStatus(taskId, newStatus);
                    
                    // Mover la tarea a la nueva columna
                    this.appendChild(draggedTask);
                    
                    // Actualizar estadísticas
                    updateStats();
                    updateColumnCounts();
                    
                    // Mostrar notificación
                    showNotification('Tarea movida', 'success');
                }
            });
        });
    }
    
    // Alternar tema claro/oscuro
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('taskapp_theme', currentTheme);
        
        // Actualizar icono
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    // Establecer tema
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Simular sincronización en la nube
    function simulateSync() {
        // Cambiar estado del botón
        const syncIcon = syncBtn.querySelector('i');
        const syncText = syncBtn.querySelector('span');
        const lastSync = document.querySelector('.last-sync');
        
        syncBtn.style.backgroundColor = '#ffd166';
        syncBtn.style.color = '#1e293b';
        syncIcon.className = 'fas fa-sync fa-spin';
        syncText.textContent = 'Sincronizando...';
        
        // Simular retardo de red
        setTimeout(() => {
            // Guardar en localStorage (simulación de nube)
            localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
            
            // Restaurar botón
            syncBtn.style.backgroundColor = '';
            syncBtn.style.color = '';
            syncIcon.className = 'fas fa-cloud';
            syncText.textContent = 'Sincronizado';
            
            // Actualizar última sincronización
            if (lastSync) {
                lastSync.textContent = 'Ahora mismo';
            }
            
            // Mostrar notificación
            showNotification('Tareas sincronizadas en la nube', 'success');
            
            // Restaurar texto después de un tiempo
            setTimeout(() => {
                if (lastSync) {
                    lastSync.textContent = 'Hace 2 min';
                }
            }, 30000);
        }, 1500);
    }
    
    // Agregar nueva tarea
    function addNewTask(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const category = taskCategory.value;
        const priority = document.querySelector('.priority-btn.active').getAttribute('data-priority');
        const reminder = taskReminder.value;
        
        if (!title) {
            showNotification('Por favor ingresa un título para la tarea', 'error');
            return;
        }
        
        // Crear nueva tarea
        const newTask = {
            id: generateId(),
            title: title,
            description: description,
            category: category,
            priority: priority,
            status: 'todo',
            createdAt: new Date().toISOString(),
            dueDate: null,
            reminder: reminder ? new Date(reminder).toISOString() : null,
            completedAt: null
        };
        
        // Agregar a la lista
        tasks.push(newTask);
        
        // Actualizar interfaz
        renderTask(newTask);
        updateStats();
        updateColumnCounts();
        
        // Limpiar formulario
        taskForm.reset();
        priorityButtons.forEach(btn => {
            if (btn.getAttribute('data-priority') === 'medium') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Mostrar notificación
        showNotification('Tarea agregada correctamente', 'success');
        
        // Sincronizar automáticamente
        simulateSync();
    }
    
    // Establecer recordatorio rápido
    function setQuickReminder(hours) {
        const now = new Date();
        const reminderDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
        
        // Formatear para input datetime-local (YYYY-MM-DDTHH:MM)
        const formattedDate = reminderDate.toISOString().slice(0, 16);
        taskReminder.value = formattedDate;
    }
    
    // Aplicar filtros
    function applyFilters() {
        // Obtener categorías seleccionadas
        const categoryCheckboxes = document.querySelectorAll('.category-filters input:checked');
        const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
        
        // Obtener prioridades seleccionadas
        const priorityCheckboxes = document.querySelectorAll('.priority-filters input:checked');
        const selectedPriorities = Array.from(priorityCheckboxes).map(cb => cb.value);
        
        // Filtrar y renderizar tareas
        renderAllTasks(selectedCategories, selectedPriorities);
        
        // Mostrar notificación
        showNotification('Filtros aplicados', 'success');
    }
    
    // Cambiar vista (tablero/lista)
    function changeView(view) {
        currentView = view;
        
        if (view === 'board') {
            boardContainer.style.display = 'flex';
            listContainer.classList.add('hidden');
            renderAllTasks();
        } else {
            boardContainer.style.display = 'none';
            listContainer.classList.remove('hidden');
            renderListView();
        }
    }
    
    // Renderizar todas las tareas
    function renderAllTasks(filterCategories = null, filterPriorities = null) {
        // Limpiar columnas
        clearTaskColumns();
        
        // Filtrar tareas
        let filteredTasks = tasks;
        
        if (filterCategories && filterCategories.length > 0) {
            filteredTasks = filteredTasks.filter(task => filterCategories.includes(task.category));
        }
        
        if (filterPriorities && filterPriorities.length > 0) {
            filteredTasks = filteredTasks.filter(task => filterPriorities.includes(task.priority));
        }
        
        // Renderizar cada tarea en su columna correspondiente
        filteredTasks.forEach(task => {
            renderTask(task);
        });
        
        // Actualizar contadores
        updateColumnCounts();
    }
    
    // Limpiar columnas de tareas
    function clearTaskColumns() {
        const taskLists = document.querySelectorAll('.task-list');
        taskLists.forEach(list => {
            // Mantener el mensaje de columna vacía
            const emptyMsg = list.querySelector('.empty-column');
            list.innerHTML = '';
            if (emptyMsg) {
                list.appendChild(emptyMsg);
            }
        });
    }
    
    // Renderizar una tarea individual
    function renderTask(task) {
        const taskElement = createTaskElement(task);
        const targetList = getTaskListByStatus(task.status);
        
        // Insertar tarea en la lista correspondiente
        if (targetList) {
            const emptyMsg = targetList.querySelector('.empty-column');
            if (emptyMsg) {
                emptyMsg.remove();
            }
            targetList.appendChild(taskElement);
        }
    }
    
    // Crear elemento HTML para una tarea
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.id = `task-${task.id}`;
        taskElement.className = `task-card ${task.category} ${task.priority}`;
        taskElement.draggable = true;
        
        // Formatear fecha si existe
        let dueDateText = '';
        let dueDateClass = '';
        
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            dueDateText = dueDate.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
            });
            
            if (dueDate < today && task.status !== 'done') {
                dueDateClass = 'overdue';
            }
        }
        
        // Verificar si tiene recordatorio próximo
        let reminderBadge = '';
        if (task.reminder) {
            const reminderTime = new Date(task.reminder);
            const now = new Date();
            const timeDiff = reminderTime - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff > 0 && hoursDiff < 24) {
                reminderBadge = '<span class="task-action-btn"><i class="fas fa-bell"></i></span>';
            }
        }
        
        taskElement.innerHTML = `
            <div class="task-card-header">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    ${reminderBadge}
                    <button class="task-action-btn edit-task" data-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn complete-task" data-id="${task.id}">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-footer">
                <div class="task-meta">
                    <span class="task-category ${task.category}">${getCategoryName(task.category)}</span>
                    <span class="task-priority ${task.priority}">${getPriorityName(task.priority)}</span>
                </div>
                ${task.dueDate ? `<div class="task-due-date ${dueDateClass}"><i class="far fa-calendar"></i> ${dueDateText}</div>` : ''}
            </div>
        `;
        
        // Agregar eventos a los botones
        const editBtn = taskElement.querySelector('.edit-task');
        const completeBtn = taskElement.querySelector('.complete-task');
        
        editBtn.addEventListener('click', () => openTaskModalForEdit(task.id));
        completeBtn.addEventListener('click', () => toggleTaskComplete(task.id));
        
        return taskElement;
    }
    
    // Obtener lista por estado
    function getTaskListByStatus(status) {
        switch(status) {
            case 'todo': return todoList;
            case 'progress': return progressList;
            case 'done': return doneList;
            default: return todoList;
        }
    }
    
    // Actualizar estadísticas
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'done').length;
        const pending = tasks.filter(task => task.status !== 'done').length;
        
        // Calcular tareas atrasadas
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdue = tasks.filter(task => {
            if (task.status === 'done' || !task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
        }).length;
        
        // Actualizar elementos
        if (totalTasksEl) totalTasksEl.textContent = total;
        if (completedTasksEl) completedTasksEl.textContent = completed;
        if (pendingTasksEl) pendingTasksEl.textContent = pending;
        if (overdueTasksEl) overdueTasksEl.textContent = overdue;
    }
    
    // Actualizar contadores de columnas
    function updateColumnCounts() {
        const todoCount = tasks.filter(task => task.status === 'todo').length;
        const progressCount = tasks.filter(task => task.status === 'progress').length;
        const doneCount = tasks.filter(task => task.status === 'done').length;
        
        if (todoCountEl) todoCountEl.textContent = todoCount;
        if (progressCountEl) progressCountEl.textContent = progressCount;
        if (doneCountEl) doneCountEl.textContent = doneCount;
    }
    
    // Limpiar tareas completadas
    function clearCompletedTasks() {
        // Confirmar acción
        if (!confirm('¿Estás seguro de que quieres eliminar todas las tareas completadas?')) {
            return;
        }
        
        // Filtrar tareas no completadas
        tasks = tasks.filter(task => task.status !== 'done');
        
        // Actualizar interfaz
        renderAllTasks();
        updateStats();
        updateColumnCounts();
        
        // Guardar cambios
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        
        // Mostrar notificación
        showNotification('Tareas completadas eliminadas', 'success');
    }
    
    // Exportar tareas
    function exportTasks() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const filter = document.getElementById('exportFilter').value;
        
        // Filtrar tareas según selección
        let tasksToExport = tasks;
        
        switch(filter) {
            case 'todo':
                tasksToExport = tasks.filter(task => task.status !== 'done');
                break;
            case 'done':
                tasksToExport = tasks.filter(task => task.status === 'done');
                break;
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                tasksToExport = tasks.filter(task => {
                    if (!task.dueDate) return false;
                    const taskDate = task.dueDate.split('T')[0];
                    return taskDate === today;
                });
                break;
        }
        
        // Preparar datos para exportación
        let exportData, fileName, mimeType;
        
        if (format === 'json') {
            exportData = JSON.stringify(tasksToExport, null, 2);
            fileName = `tasks_${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        } else if (format === 'csv') {
            // Convertir a CSV
            const headers = ['ID', 'Título', 'Descripción', 'Categoría', 'Prioridad', 'Estado', 'Fecha creación', 'Fecha límite'];
            const rows = tasksToExport.map(task => [
                task.id,
                `"${task.title.replace(/"/g, '""')}"`,
                `"${(task.description || '').replace(/"/g, '""')}"`,
                task.category,
                task.priority,
                task.status,
                task.createdAt,
                task.dueDate || ''
            ]);
            
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            exportData = csvContent;
            fileName = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        } else {
            // Para PDF, mostramos mensaje (en una app real, se generaría el PDF)
            showNotification('Exportación a PDF simulada. En una aplicación real, se generaría un documento PDF.', 'info');
            closeExportModal();
            return;
        }
        
        // Crear y descargar archivo
        const blob = new Blob([exportData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Cerrar modal y mostrar notificación
        closeExportModal();
        showNotification(`Tareas exportadas en formato ${format.toUpperCase()}`, 'success');
    }
    
    // Cerrar modal de exportación
    function closeExportModal() {
        exportModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Renderizar vista de lista
    function renderListView() {
        const listView = document.getElementById('taskListView');
        listView.innerHTML = '';
        
        // Ordenar tareas por fecha de creación (más recientes primero)
        const sortedTasks = [...tasks].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // Crear elementos de lista
        sortedTasks.forEach(task => {
            const listItem = createListItem(task);
            listView.appendChild(listItem);
        });
    }
    
    // Crear elemento para vista de lista
    function createListItem(task) {
        const listItem = document.createElement('div');
        listItem.className = `list-task-item ${task.status === 'done' ? 'completed' : ''}`;
        listItem.style.borderLeftColor = getCategoryColor(task.category);
        
        // Formatear fechas
        const createdDate = new Date(task.createdAt).toLocaleDateString('es-ES');
        let dueDateText = '';
        
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            dueDateText = dueDate.toLocaleDateString('es-ES');
        }
        
        listItem.innerHTML = `
            <div class="list-task-checkbox">
                <input type="checkbox" ${task.status === 'done' ? 'checked' : ''} data-id="${task.id}">
            </div>
            <div class="list-task-content">
                <div class="list-task-title ${task.status === 'done' ? 'completed' : ''}">
                    ${task.title}
                    <span class="task-priority ${task.priority}">${getPriorityName(task.priority)}</span>
                </div>
                ${task.description ? `<div class="list-task-description">${task.description}</div>` : ''}
                <div class="list-task-meta">
                    <span class="task-category ${task.category}">${getCategoryName(task.category)}</span>
                    <span><i class="far fa-calendar"></i> ${createdDate}</span>
                    ${dueDateText ? `<span><i class="far fa-clock"></i> ${dueDateText}</span>` : ''}
                </div>
            </div>
            <div class="list-task-actions">
                <button class="task-action-btn edit-task" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action-btn delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Agregar eventos
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        const editBtn = listItem.querySelector('.edit-task');
        const deleteBtn = listItem.querySelector('.delete-task');
        
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
        editBtn.addEventListener('click', () => openTaskModalForEdit(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        return listItem;
    }
    
    // Abrir modal para editar tarea
    function openTaskModalForEdit(taskId) {
        currentTaskId = taskId;
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return;
        
        // Llenar formulario con datos de la tarea
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskStatus').value = task.status;
        
        // Establecer prioridad
        const priorityBtns = document.querySelectorAll('#editTaskForm .priority-btn');
        priorityBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-priority') === task.priority) {
                btn.classList.add('active');
            }
        });
        
        // Establecer fecha límite
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
            document.getElementById('editTaskDueDate').value = dueDate;
        } else {
            document.getElementById('editTaskDueDate').value = '';
        }
        
        // Establecer recordatorio
        if (task.reminder) {
            const reminder = new Date(task.reminder).toISOString().slice(0, 16);
            document.getElementById('editTaskReminder').value = reminder;
        } else {
            document.getElementById('editTaskReminder').value = '';
        }
        
        // Mostrar modal
        taskModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Abrir modal para agregar tarea a columna específica
    function openTaskModalForColumn(column) {
        // Limpiar formulario principal
        taskForm.reset();
        
        // Establecer prioridad media por defecto
        priorityButtons.forEach(btn => {
            if (btn.getAttribute('data-priority') === 'medium') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Establecer categoría por defecto según columna
        if (column === 'work') {
            taskCategory.value = 'work';
        } else if (column === 'study') {
            taskCategory.value = 'study';
        }
        
        // Enfocar en el campo de título
        taskTitle.focus();
    }
    
    // Cerrar modal de tarea
    function closeTaskModal() {
        taskModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        currentTaskId = null;
    }
    
    // Guardar cambios en tarea
    function saveTaskChanges() {
        if (!currentTaskId) return;
        
        const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
        if (taskIndex === -1) return;
        
        // Obtener valores del formulario
        const title = document.getElementById('editTaskTitle').value.trim();
        const description = document.getElementById('editTaskDescription').value.trim();
        const category = document.getElementById('editTaskCategory').value;
        const status = document.getElementById('editTaskStatus').value;
        const priority = document.querySelector('#editTaskForm .priority-btn.active').getAttribute('data-priority');
        const dueDate = document.getElementById('editTaskDueDate').value;
        const reminder = document.getElementById('editTaskReminder').value;
        
        if (!title) {
            showNotification('El título es obligatorio', 'error');
            return;
        }
        
        // Actualizar tarea
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            description,
            category,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            reminder: reminder ? new Date(reminder).toISOString() : null,
            completedAt: status === 'done' && tasks[taskIndex].status !== 'done' ? new Date().toISOString() : tasks[taskIndex].completedAt
        };
        
        // Actualizar interfaz
        renderAllTasks();
        updateStats();
        updateColumnCounts();
        
        // Guardar cambios
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        
        // Cerrar modal y mostrar notificación
        closeTaskModal();
        showNotification('Tarea actualizada', 'success');
        
        // Sincronizar
        simulateSync();
    }
    
    // Eliminar tarea actual
    function deleteCurrentTask() {
        if (!currentTaskId) return;
        
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return;
        }
        
        deleteTask(currentTaskId);
        closeTaskModal();
    }
    
    // Eliminar tarea por ID
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Actualizar interfaz
        renderAllTasks();
        updateStats();
        updateColumnCounts();
        
        // Guardar cambios
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        
        // Mostrar notificación
        showNotification('Tarea eliminada', 'success');
        
        // Sincronizar
        simulateSync();
    }
    
    // Alternar estado de completado
    function toggleTaskComplete(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        const task = tasks[taskIndex];
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        
        // Actualizar tarea
        tasks[taskIndex] = {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : null
        };
        
        // Actualizar interfaz
        renderAllTasks();
        updateStats();
        updateColumnCounts();
        
        // Guardar cambios
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        
        // Mostrar notificación
        showNotification(`Tarea ${newStatus === 'done' ? 'completada' : 'marcada como pendiente'}`, 'success');
        
        // Sincronizar
        simulateSync();
    }
    
    // Actualizar estado de tarea (para drag and drop)
    function updateTaskStatus(taskId, newStatus) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : tasks[taskIndex].completedAt
        };
        
        // Guardar cambios
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
    }
    
    // Verificar recordatorios
    function checkReminders() {
        const now = new Date();
        const remindersList = document.getElementById('remindersList');
        
        // Filtrar recordatorios próximos (en las próximas 24 horas)
        const upcomingReminders = tasks.filter(task => {
            if (!task.reminder || task.status === 'done') return false;
            
            const reminderTime = new Date(task.reminder);
            const timeDiff = reminderTime - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            return hoursDiff > 0 && hoursDiff <= 24;
        });
        
        // Limpiar lista de recordatorios
        remindersList.innerHTML = '';
        
        if (upcomingReminders.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-reminders';
            emptyMsg.innerHTML = `
                <i class="fas fa-bell-slash"></i>
                <p>No hay recordatorios próximos</p>
            `;
            remindersList.appendChild(emptyMsg);
            return;
        }
        
        // Ordenar por tiempo más próximo
        upcomingReminders.sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
        
        // Mostrar recordatorios
        upcomingReminders.forEach(task => {
            const reminderItem = createReminderItem(task);
            remindersList.appendChild(reminderItem);
        });
    }
    
    // Crear elemento de recordatorio
    function createReminderItem(task) {
        const reminderTime = new Date(task.reminder);
        const now = new Date();
        const timeDiff = reminderTime - now;
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeText = '';
        if (hoursDiff > 0) {
            timeText = `En ${hoursDiff}h ${minutesDiff > 0 ? `${minutesDiff}m` : ''}`;
        } else {
            timeText = `En ${minutesDiff}m`;
        }
        
        const formattedTime = reminderTime.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item';
        reminderItem.innerHTML = `
            <div class="reminder-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="reminder-content">
                <div class="reminder-title">${task.title}</div>
                <div class="reminder-time">${formattedTime} - ${timeText}</div>
                <div class="task-category ${task.category}">${getCategoryName(task.category)}</div>
            </div>
            <div class="reminder-actions">
                <button class="btn btn-text snooze-reminder" data-id="${task.id}">
                    <i class="fas fa-clock"></i> Posponer
                </button>
                <button class="btn btn-text complete-reminder" data-id="${task.id}">
                    <i class="fas fa-check"></i> Completar
                </button>
            </div>
        `;
        
        // Agregar eventos
        const snoozeBtn = reminderItem.querySelector('.snooze-reminder');
        const completeBtn = reminderItem.querySelector('.complete-reminder');
        
        snoozeBtn.addEventListener('click', () => snoozeReminder(task.id));
        completeBtn.addEventListener('click', () => toggleTaskComplete(task.id));
        
        return reminderItem;
    }
    
    // Posponer recordatorio
    function snoozeReminder(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        // Posponer 1 hora
        const newReminderTime = new Date();
        newReminderTime.setHours(newReminderTime.getHours() + 1);
        
        tasks[taskIndex].reminder = newReminderTime.toISOString();
        
        // Actualizar interfaz
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        checkReminders();
        
        // Mostrar notificación
        showNotification('Recordatorio pospuesto 1 hora', 'success');
    }
    
    // Posponer todos los recordatorios
    function snoozeAllReminders() {
        tasks.forEach(task => {
            if (task.reminder && task.status !== 'done') {
                const newReminderTime = new Date(task.reminder);
                newReminderTime.setHours(newReminderTime.getHours() + 1);
                task.reminder = newReminderTime.toISOString();
            }
        });
        
        // Actualizar interfaz
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
        checkReminders();
        
        // Mostrar notificación
        showNotification('Todos los recordatorios pospuestos 1 hora', 'success');
    }
    
    // Reiniciar demo
    function resetDemo() {
        if (!confirm('¿Estás seguro de que quieres reiniciar la demo? Se perderán todas las tareas actuales.')) {
            return;
        }
        
        // Limpiar localStorage
        localStorage.removeItem('taskapp_tasks');
        
        // Reiniciar variables
        tasks = [];
        
        // Cargar datos de ejemplo
        loadSampleTasks();
        
        // Actualizar interfaz
        renderAllTasks();
        updateStats();
        updateColumnCounts();
        checkReminders();
        
        // Mostrar notificación
        showNotification('Demo reiniciada con datos de ejemplo', 'success');
    }
    
    // Cargar tareas de ejemplo
    function loadSampleTasks() {
        const sampleTasks = [
            {
                id: generateId(),
                title: 'Comprar víveres para la semana',
                description: 'Leche, huevos, pan, frutas y verduras',
                category: 'shopping',
                priority: 'medium',
                status: 'todo',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                reminder: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null
            },
            {
                id: generateId(),
                title: 'Preparar presentación para reunión',
                description: 'Crear slides para la presentación del proyecto Alpha',
                category: 'work',
                priority: 'high',
                status: 'progress',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                reminder: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
                completedAt: null
            },
            {
                id: generateId(),
                title: 'Estudiar para examen de matemáticas',
                description: 'Repasar capítulos 5 y 6 del libro de texto',
                category: 'study',
                priority: 'high',
                status: 'todo',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                reminder: null,
                completedAt: null
            },
            {
                id: generateId(),
                title: 'Ir al gimnasio',
                description: 'Rutina de piernas y cardio',
                category: 'health',
                priority: 'medium',
                status: 'todo',
                createdAt: new Date().toISOString(),
                dueDate: new Date().toISOString(),
                reminder: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                completedAt: null
            },
            {
                id: generateId(),
                title: 'Llamar a mamá',
                description: 'Felicitarla por su aniversario',
                category: 'personal',
                priority: 'low',
                status: 'done',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                reminder: null,
                completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: generateId(),
                title: 'Actualizar portfolio en línea',
                description: 'Agregar proyectos recientes y actualizar información de contacto',
                category: 'work',
                priority: 'medium',
                status: 'progress',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                reminder: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null
            }
        ];
        
        tasks = sampleTasks;
        localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
    }
    
    // Mostrar notificación
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${type === 'success' ? 'Éxito' : type === 'warning' ? 'Advertencia' : type === 'error' ? 'Error' : 'Información'}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Eliminar notificación después de 5 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Funciones auxiliares
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function getCategoryName(category) {
        const names = {
            personal: 'Personal',
            work: 'Trabajo',
            study: 'Estudio',
            health: 'Salud',
            shopping: 'Compras'
        };
        return names[category] || category;
    }
    
    function getPriorityName(priority) {
        const names = {
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
        };
        return names[priority] || priority;
    }
    
    function getCategoryColor(category) {
        const colors = {
            personal: 'var(--category-personal)',
            work: 'var(--category-work)',
            study: 'var(--category-study)',
            health: 'var(--category-health)',
            shopping: 'var(--category-shopping)'
        };
        return colors[category] || 'var(--primary-color)';
    }
    
    // Inicializar la aplicación
    init();
    
    // Verificar recordatorios cada minuto
    setInterval(checkReminders, 60000);
});