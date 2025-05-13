// Web API для замены Electron API
const WebAPI = {
    // Версия приложения
    getVersion: () => '1.0.0',

    // Сохранение файлов
    saveFile: async (content, options) => {
        const blob = new Blob([content], { type: options.type || 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = options.filename || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    // Загрузка файлов
    loadFile: () => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            };
            input.click();
        });
    },

    // Модальные окна
    showDialog: (options) => {
        return new Promise((resolve) => {
            const result = window.confirm(options.message);
            resolve(result);
        });
    },

    // Сохранение скетча
    saveSketch: async (content, type) => {
        const options = {
            filename: `sketch.${type}`,
            type: type === 'ino' ? 'text/plain' : 'application/octet-stream'
        };
        await WebAPI.saveFile(content, options);
    },

    // Загрузка скетча
    loadSketch: async () => {
        return await WebAPI.loadFile();
    }
};

// Экспорт API
window.WebAPI = WebAPI; 