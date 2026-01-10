// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let charts = {};
    let currentTheme = localStorage.getItem('dashboard-theme') || 'light';
    let transactionsData = [];
    let activityData = [];
    
    // Elementos del DOM
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const themeToggle = document.getElementById('themeToggle');
    const currentDate = document.getElementById('currentDate');
    const exportBtn = document.getElementById('exportBtn');
    const exportModal = document.getElementById('exportModal');
    const cancelExport = document.getElementById('cancelExport');
    const confirmExport = document.getElementById('confirmExport');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const currentYear = document.getElementById('currentYear');
    const refreshDashboard = document.getElementById('refreshDashboard');
    const dateRange = document.getElementById('dateRange');
    const resetFilters = document.getElementById('resetFilters');
    const applyFilters = document.getElementById('applyFilters');
    const saveFilterPreset = document.getElementById('saveFilterPreset');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const amountMin = document.getElementById('amountMin');
    const amountMax = document.getElementById('amountMax');
    const minValue = document.getElementById('minValue');
    const maxValue = document.getElementById('maxValue');
    const chartActionBtns = document.querySelectorAll('.chart-action-btn');
    
    // Inicializar la aplicación
    function init() {
        // Establecer tema
        setTheme(currentTheme);
        
        // Configurar fecha actual
        updateCurrentDate();
        
        // Configurar año actual
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
        
        // Generar datos de ejemplo
        generateSampleData();
        
        // Inicializar gráficos
        initCharts();
        
        // Inicializar tablas
        renderTransactionsTable();
        renderActivityList();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Inicializar filtros
        initFilters();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Toggle sidebar en móviles
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // Toggle tema
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Botón exportar
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        // Cerrar modal
        if (cancelExport) {
            cancelExport.addEventListener('click', closeModal);
        }
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
        
        // Cerrar modal al hacer clic fuera
        if (exportModal) {
            exportModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
        
        // Confirmar exportación
        if (confirmExport) {
            confirmExport.addEventListener('click', exportData);
        }
        
        // Refrescar dashboard
        if (refreshDashboard) {
            refreshDashboard.addEventListener('click', refreshDashboardData);
        }
        
        // Cambiar rango de fecha
        if (dateRange) {
            dateRange.addEventListener('change', handleDateRangeChange);
        }
        
        // Botones de acción de gráficos
        chartActionBtns.forEach(button => {
            button.addEventListener('click', function() {
                const chartType = this.getAttribute('data-chart-type');
                const parent = this.closest('.chart-header');
                const chartContainer = parent.nextElementSibling;
                const chartId = chartContainer.querySelector('canvas').id;
                
                // Actualizar botones activos
                this.parentElement.querySelectorAll('.chart-action-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Cambiar tipo de gráfico
                changeChartType(chartId, chartType);
            });
        });
        
        // Filtros
        if (resetFilters) {
            resetFilters.addEventListener('click', resetAllFilters);
        }
        
        if (applyFilters) {
            applyFilters.addEventListener('click', applyAllFilters);
        }
        
        if (saveFilterPreset) {
            saveFilterPreset.addEventListener('click', saveFilterPresetHandler);
        }
        
        // Controladores de rango
        if (amountMin && amountMax) {
            amountMin.addEventListener('input', updateRangeValues);
            amountMax.addEventListener('input', updateRangeValues);
        }
    }
    
    // Alternar sidebar en móviles
    function toggleSidebar() {
        sidebar.classList.toggle('active');
    }
    
    // Alternar tema claro/oscuro
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('dashboard-theme', currentTheme);
        
        // Actualizar icono y texto
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Modo claro';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Modo oscuro';
        }
        
        // Actualizar gráficos para el nuevo tema
        updateChartsForTheme();
    }
    
    // Establecer tema
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Actualizar fecha actual
    function updateCurrentDate() {
        if (!currentDate) return;
        
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        currentDate.textContent = now.toLocaleDateString('es-ES', options);
    }
    
    // Generar datos de ejemplo
    function generateSampleData() {
        // Datos de transacciones
        transactionsData = [
            { id: 'TRX-001', customer: 'María González', date: '2023-10-15', amount: 245.50, status: 'completed' },
            { id: 'TRX-002', customer: 'Carlos Rodríguez', date: '2023-10-16', amount: 120.00, status: 'pending' },
            { id: 'TRX-003', customer: 'Ana Martínez', date: '2023-10-17', amount: 89.99, status: 'completed' },
            { id: 'TRX-004', customer: 'David López', date: '2023-10-18', amount: 450.75, status: 'completed' },
            { id: 'TRX-005', customer: 'Laura Sánchez', date: '2023-10-19', amount: 67.30, status: 'cancelled' },
            { id: 'TRX-006', customer: 'Pedro Fernández', date: '2023-10-20', amount: 199.99, status: 'completed' },
            { id: 'TRX-007', customer: 'Sofía Pérez', date: '2023-10-21', amount: 320.50, status: 'pending' }
        ];
        
        // Datos de actividad
        activityData = [
            { 
                icon: 'fas fa-user-plus', 
                title: 'Nuevo usuario registrado', 
                description: 'Juan Pérez se registró en la plataforma',
                time: 'Hace 10 minutos',
                color: 'success'
            },
            { 
                icon: 'fas fa-shopping-cart', 
                title: 'Nueva orden completada', 
                description: 'Orden #ORD-7821 por $245.50',
                time: 'Hace 25 minutos',
                color: 'primary'
            },
            { 
                icon: 'fas fa-chart-line', 
                title: 'Reporte generado', 
                description: 'Reporte de ventas mensual generado',
                time: 'Hace 1 hora',
                color: 'info'
            },
            { 
                icon: 'fas fa-exclamation-triangle', 
                title: 'Alerta de servidor', 
                description: 'Alto uso de CPU detectado',
                time: 'Hace 2 horas',
                color: 'warning'
            },
            { 
                icon: 'fas fa-cog', 
                title: 'Configuración actualizada', 
                description: 'Configuración de notificaciones actualizada',
                time: 'Hace 3 horas',
                color: 'secondary'
            }
        ];
    }
    
    // Inicializar gráficos
    function initCharts() {
        // Gráfico de ingresos (mini)
        charts.revenueChart = new Chart(document.getElementById('revenueChart'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ingresos',
                    data: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
                    borderColor: getChartColor('primary'),
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: getChartColor('primary'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: getMiniChartOptions()
        });
        
        // Gráfico de usuarios (mini)
        charts.usersChart = new Chart(document.getElementById('usersChart'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Usuarios',
                    data: [450, 520, 480, 600, 550, 700, 650],
                    borderColor: getChartColor('success'),
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: getChartColor('success'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: getMiniChartOptions()
        });
        
        // Gráfico de conversión (mini)
        charts.conversionChart = new Chart(document.getElementById('conversionChart'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Conversión',
                    data: [2.8, 3.1, 2.9, 3.4, 3.2, 3.0, 2.7],
                    borderColor: getChartColor('warning'),
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: getChartColor('warning'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: getMiniChartOptions()
        });
        
        // Gráfico de tiempo (mini)
        charts.timeChart = new Chart(document.getElementById('timeChart'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Tiempo',
                    data: [4.1, 4.3, 4.0, 4.5, 4.4, 4.2, 4.6],
                    borderColor: getChartColor('info'),
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: getChartColor('info'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: getMiniChartOptions()
        });
        
        // Gráfico principal de ingresos
        charts.revenueChartMain = new Chart(document.getElementById('revenueChartMain'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Ingresos ($)',
                    data: [12000, 19000, 15000, 22000, 18000, 24000, 21000, 28000, 25000, 30000, 27000, 32000],
                    borderColor: getChartColor('primary'),
                    backgroundColor: getChartColor('primary', 0.1),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: getChartColor('primary'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: getMainChartOptions('Ingresos Mensuales ($)')
        });
        
        // Gráfico de tráfico (dona)
        charts.trafficChart = new Chart(document.getElementById('trafficChart'), {
            type: 'doughnut',
            data: {
                labels: ['Directo', 'Buscadores', 'Social', 'Email', 'Referidos'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        getChartColor('primary'),
                        getChartColor('success'),
                        getChartColor('warning'),
                        getChartColor('info'),
                        getChartColor('secondary')
                    ],
                    borderWidth: 2,
                    borderColor: getChartColor('bg-card')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getChartColor('text-primary'),
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
        
        // Gráfico de categorías (barras)
        charts.categoryChart = new Chart(document.getElementById('categoryChart'), {
            type: 'bar',
            data: {
                labels: ['Electrónica', 'Moda', 'Hogar', 'Deportes', 'Libros', 'Juguetes'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [12000, 8000, 6000, 4000, 3000, 2000],
                    backgroundColor: [
                        getChartColor('primary'),
                        getChartColor('primary', 0.8),
                        getChartColor('primary', 0.6),
                        getChartColor('primary', 0.4),
                        getChartColor('primary', 0.2),
                        getChartColor('primary', 0.1)
                    ],
                    borderColor: getChartColor('primary'),
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: getMainChartOptions('Ventas por Categoría')
        });
        
        // Gráfico principal de usuarios
        charts.usersChartMain = new Chart(document.getElementById('usersChartMain'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    {
                        label: 'Usuarios Nuevos',
                        data: [450, 520, 480, 600, 550, 700, 650, 800, 750, 900, 850, 1000],
                        borderColor: getChartColor('success'),
                        backgroundColor: getChartColor('success', 0.1),
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: getChartColor('success'),
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: 'Usuarios Activos',
                        data: [1200, 1400, 1300, 1600, 1500, 1800, 1700, 2000, 1900, 2200, 2100, 2400],
                        borderColor: getChartColor('primary'),
                        backgroundColor: getChartColor('primary', 0.1),
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: getChartColor('primary'),
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }
                ]
            },
            options: getMainChartOptions('Tendencias de Usuarios')
        });
    }
    
    // Obtener opciones para gráficos mini
    function getMiniChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };
    }
    
    // Obtener opciones para gráficos principales
    function getMainChartOptions(title) {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: false,
                    text: title
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            if (value >= 1000) {
                                return '$' + (value / 1000) + 'k';
                            }
                            return '$' + value;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };
    }
    
    // Obtener color para gráficos según tema
    function getChartColor(type, alpha = 1) {
        const root = document.documentElement;
        let color;
        
        switch(type) {
            case 'primary':
                color = getComputedStyle(root).getPropertyValue('--primary-color').trim();
                break;
            case 'success':
                color = getComputedStyle(root).getPropertyValue('--success-color').trim();
                break;
            case 'warning':
                color = getComputedStyle(root).getPropertyValue('--warning-color').trim();
                break;
            case 'danger':
                color = getComputedStyle(root).getPropertyValue('--danger-color').trim();
                break;
            case 'info':
                color = getComputedStyle(root).getPropertyValue('--info-color').trim();
                break;
            case 'secondary':
                color = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
                break;
            case 'text-primary':
                color = getComputedStyle(root).getPropertyValue('--text-primary').trim();
                break;
            case 'bg-card':
                color = getComputedStyle(root).getPropertyValue('--bg-card').trim();
                break;
            default:
                color = getComputedStyle(root).getPropertyValue('--primary-color').trim();
        }
        
        if (alpha < 1) {
            // Convertir a rgba
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        
        return color;
    }
    
    // Actualizar gráficos para el tema actual
    function updateChartsForTheme() {
        // Actualizar colores de todos los gráficos
        Object.keys(charts).forEach(chartKey => {
            const chart = charts[chartKey];
            
            // Actualizar colores según el tipo de gráfico
            if (chartKey === 'revenueChartMain' || chartKey === 'usersChartMain') {
                // Gráficos de línea con relleno
                chart.data.datasets.forEach((dataset, index) => {
                    const colorType = index === 0 ? 'success' : 'primary';
                    dataset.borderColor = getChartColor(colorType);
                    dataset.backgroundColor = getChartColor(colorType, 0.1);
                    dataset.pointBackgroundColor = getChartColor(colorType);
                });
            } else if (chartKey === 'trafficChart') {
                // Gráfico de dona
                chart.data.datasets[0].backgroundColor = [
                    getChartColor('primary'),
                    getChartColor('success'),
                    getChartColor('warning'),
                    getChartColor('info'),
                    getChartColor('secondary')
                ];
                chart.data.datasets[0].borderColor = getChartColor('bg-card');
            } else if (chartKey === 'categoryChart') {
                // Gráfico de barras
                const baseColor = getChartColor('primary');
                chart.data.datasets[0].backgroundColor = [
                    baseColor,
                    getChartColor('primary', 0.8),
                    getChartColor('primary', 0.6),
                    getChartColor('primary', 0.4),
                    getChartColor('primary', 0.2),
                    getChartColor('primary', 0.1)
                ];
                chart.data.datasets[0].borderColor = baseColor;
            } else {
                // Gráficos mini
                const colorMap = {
                    'revenueChart': 'primary',
                    'usersChart': 'success',
                    'conversionChart': 'warning',
                    'timeChart': 'info'
                };
                
                if (colorMap[chartKey]) {
                    const colorType = colorMap[chartKey];
                    chart.data.datasets[0].borderColor = getChartColor(colorType);
                    chart.data.datasets[0].pointBackgroundColor = getChartColor(colorType);
                }
            }
            
            // Actualizar opciones de escalas
            const textColor = getChartColor('text-primary');
            const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
            
            if (chart.options && chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid.color = gridColor;
                    chart.options.scales.x.ticks.color = textColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                }
            }
            
            // Actualizar leyenda
            if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            chart.update();
        });
    }
    
    // Cambiar tipo de gráfico
    function changeChartType(chartId, newType) {
        const chart = charts[chartId];
        if (!chart) return;
        
        chart.config.type = newType;
        chart.update();
    }
    
    // Renderizar tabla de transacciones
    function renderTransactionsTable() {
        const tableBody = document.getElementById('transactionsTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        transactionsData.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Determinar clase de estado
            let statusClass = '';
            let statusText = '';
            
            switch(transaction.status) {
                case 'completed':
                    statusClass = 'status-completed';
                    statusText = 'Completado';
                    break;
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pendiente';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Cancelado';
                    break;
            }
            
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.date}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <a href="#" class="table-action" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Renderizar lista de actividades
    function renderActivityList() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        activityList.innerHTML = '';
        
        activityData.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            // Determinar color del icono
            let iconColor = '';
            switch(activity.color) {
                case 'primary':
                    iconColor = 'var(--primary-color)';
                    break;
                case 'success':
                    iconColor = 'var(--success-color)';
                    break;
                case 'warning':
                    iconColor = 'var(--warning-color)';
                    break;
                case 'info':
                    iconColor = 'var(--info-color)';
                    break;
                default:
                    iconColor = 'var(--secondary-color)';
            }
            
            activityItem.innerHTML = `
                <div class="activity-icon" style="background-color: ${iconColor}20; color: ${iconColor}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h5>${activity.title}</h5>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
    
    // Inicializar filtros
    function initFilters() {
        // Establecer fechas por defecto (mes actual)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Formatear fechas como YYYY-MM-DD
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        if (startDate) startDate.value = formatDate(firstDay);
        if (endDate) endDate.value = formatDate(lastDay);
        
        // Inicializar valores de rango
        updateRangeValues();
    }
    
    // Actualizar valores de rango
    function updateRangeValues() {
        if (minValue && amountMin) {
            minValue.textContent = `$${amountMin.value}`;
        }
        
        if (maxValue && amountMax) {
            maxValue.textContent = `$${amountMax.value}`;
        }
    }
    
    // Manejar cambio de rango de fecha
    function handleDateRangeChange() {
        const value = dateRange.value;
        let start, end;
        const now = new Date();
        
        switch(value) {
            case 'today':
                start = now;
                end = now;
                break;
            case 'week':
                start = new Date(now);
                start.setDate(now.getDate() - 7);
                end = now;
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                start = new Date(now.getFullYear(), quarter * 3, 1);
                end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
        }
        
        // Formatear fechas como YYYY-MM-DD
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        if (startDate && endDate) {
            startDate.value = formatDate(start);
            endDate.value = formatDate(end);
        }
        
        // Aplicar filtros automáticamente
        applyAllFilters();
    }
    
    // Restablecer todos los filtros
    function resetAllFilters() {
        // Restablecer fechas a mes actual
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        if (startDate) startDate.value = formatDate(firstDay);
        if (endDate) endDate.value = formatDate(lastDay);
        
        // Restablecer rango de fechas a "Esta semana"
        if (dateRange) dateRange.value = 'week';
        
        // Restablecer categorías
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            Array.from(categoryFilter.options).forEach(option => {
                option.selected = ['electronics', 'fashion'].includes(option.value);
            });
        }
        
        // Restablecer estados
        document.querySelectorAll('input[name="status"]').forEach(checkbox => {
            checkbox.checked = ['completed', 'pending'].includes(checkbox.value);
        });
        
        // Restablecer rango de monto
        if (amountMin) amountMin.value = 0;
        if (amountMax) amountMax.value = 1000;
        updateRangeValues();
        
        // Aplicar filtros
        applyAllFilters();
        
        // Mostrar notificación
        showNotification('Filtros restablecidos', 'success');
    }
    
    // Aplicar todos los filtros
    function applyAllFilters() {
        // Aquí normalmente se enviaría una solicitud al servidor
        // Para esta demo, solo simulamos la aplicación de filtros
        
        // Obtener valores de filtros
        const filters = {
            startDate: startDate ? startDate.value : '',
            endDate: endDate ? endDate.value : '',
            categories: getSelectedCategories(),
            statuses: getSelectedStatuses(),
            minAmount: amountMin ? parseInt(amountMin.value) : 0,
            maxAmount: amountMax ? parseInt(amountMax.value) : 1000
        };
        
        console.log('Filtros aplicados:', filters);
        
        // Simular actualización de datos
        simulateDataUpdate();
        
        // Mostrar notificación
        showNotification('Filtros aplicados correctamente', 'success');
    }
    
    // Obtener categorías seleccionadas
    function getSelectedCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return [];
        
        return Array.from(categoryFilter.selectedOptions).map(option => option.value);
    }
    
    // Obtener estados seleccionados
    function getSelectedStatuses() {
        const statusCheckboxes = document.querySelectorAll('input[name="status"]:checked');
        return Array.from(statusCheckboxes).map(checkbox => checkbox.value);
    }
    
    // Guardar preestablecido de filtros
    function saveFilterPresetHandler() {
        const presetName = prompt('Nombre del preestablecido:');
        if (!presetName) return;
        
        // Guardar en localStorage (simulación)
        const filters = {
            startDate: startDate ? startDate.value : '',
            endDate: endDate ? endDate.value : '',
            categories: getSelectedCategories(),
            statuses: getSelectedStatuses(),
            minAmount: amountMin ? parseInt(amountMin.value) : 0,
            maxAmount: amountMax ? parseInt(amountMax.value) : 1000,
            dateRange: dateRange ? dateRange.value : 'week'
        };
        
        // En una implementación real, se guardaría en una base de datos
        console.log('Preestablecido guardado:', presetName, filters);
        
        // Mostrar notificación
        showNotification(`Preestablecido "${presetName}" guardado`, 'success');
    }
    
    // Simular actualización de datos
    function simulateDataUpdate() {
        // Simular carga
        showLoading();
        
        // Simular retardo de red
        setTimeout(() => {
            // Actualizar métricas con valores aleatorios
            updateMetricsWithRandomData();
            
            // Actualizar gráficos
            updateChartsWithRandomData();
            
            // Ocultar carga
            hideLoading();
            
            // Mostrar notificación
            showNotification('Datos actualizados', 'info');
        }, 1000);
    }
    
    // Actualizar métricas con datos aleatorios
    function updateMetricsWithRandomData() {
        // Generar valores aleatorios dentro de un rango realista
        const revenueValue = document.getElementById('revenueValue');
        const usersValue = document.getElementById('usersValue');
        const conversionValue = document.getElementById('conversionValue');
        const timeValue = document.getElementById('timeValue');
        
        if (revenueValue) {
            const currentValue = parseFloat(revenueValue.textContent.replace('$', '').replace(',', ''));
            const newValue = currentValue + (Math.random() * 1000 - 500);
            revenueValue.textContent = `$${Math.max(0, Math.round(newValue)).toLocaleString()}`;
        }
        
        if (usersValue) {
            const currentValue = parseInt(usersValue.textContent.replace(',', ''));
            const newValue = currentValue + (Math.random() * 100 - 50);
            usersValue.textContent = Math.max(0, Math.round(newValue)).toLocaleString();
        }
        
        if (conversionValue) {
            const currentValue = parseFloat(conversionValue.textContent.replace('%', ''));
            const newValue = currentValue + (Math.random() * 0.5 - 0.25);
            conversionValue.textContent = `${Math.max(0, newValue).toFixed(2)}%`;
        }
        
        if (timeValue) {
            const currentValue = parseFloat(timeValue.textContent.replace('m', '').replace('s', '').trim());
            const newValue = currentValue + (Math.random() * 20 - 10);
            const minutes = Math.floor(Math.max(0, newValue) / 60);
            const seconds = Math.floor(Math.max(0, newValue) % 60);
            timeValue.textContent = `${minutes}m ${seconds}s`;
        }
    }
    
    // Actualizar gráficos con datos aleatorios
    function updateChartsWithRandomData() {
        // Actualizar gráficos mini con datos aleatorios
        Object.keys(charts).forEach(chartKey => {
            const chart = charts[chartKey];
            
            if (chartKey.includes('Chart') && !chartKey.includes('Main') && chartKey !== 'trafficChart' && chartKey !== 'categoryChart') {
                // Gráficos mini
                const newData = chart.data.datasets[0].data.map(value => {
                    return value + (Math.random() * 200 - 100);
                });
                
                chart.data.datasets[0].data = newData;
                chart.update();
            } else if (chartKey === 'revenueChartMain' || chartKey === 'usersChartMain') {
                // Gráficos principales
                chart.data.datasets.forEach(dataset => {
                    const newData = dataset.data.map(value => {
                        return value + (Math.random() * 1000 - 500);
                    });
                    dataset.data = newData;
                });
                chart.update();
            }
        });
    }
    
    // Mostrar indicador de carga
    function showLoading() {
        // Podrías agregar un spinner o overlay de carga aquí
        console.log('Cargando datos...');
    }
    
    // Ocultar indicador de carga
    function hideLoading() {
        console.log('Datos cargados');
    }
    
    // Mostrar notificación
    function showNotification(message, type = 'info') {
        // En una implementación real, usarías una librería de notificaciones
        // Para esta demo, solo usamos alert
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    // Refrescar datos del dashboard
    function refreshDashboardData() {
        simulateDataUpdate();
    }
    
    // Cerrar modal
    function closeModal() {
        exportModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Exportar datos
    function exportData() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const range = document.getElementById('exportDateRange').value;
        
        console.log(`Exportando datos en formato ${format} para el rango: ${range}`);
        
        // Simular exportación
        showNotification(`Exportando datos en formato ${format.toUpperCase()}...`, 'info');
        
        // Cerrar modal después de un retardo
        setTimeout(() => {
            closeModal();
            showNotification('Exportación completada', 'success');
        }, 1500);
    }
    
    // Inicializar la aplicación
    init();
});