// Регистрация горячих клавиш для ArduBlock
document.addEventListener('DOMContentLoaded', function() {
    // F5 - Проверка кода
    hotkeys('f5', function(event, handler) {
        event.preventDefault();
        $('#btn_verify').trigger('click');
    });

    // F8 - Загрузка в Arduino
    hotkeys('f8', function(event, handler) {
        event.preventDefault();
        $('#btn_flash').trigger('click');
    });

    // Добавляем подсказки для горячих клавиш в тултипы кнопок
    $('#btn_verify').attr('title', function(i, oldTitle) {
        return oldTitle + ' (F5)';
    });
    
    $('#btn_flash').attr('title', function(i, oldTitle) {
        return oldTitle + ' (F8)';
    });

    // Дополнительные горячие клавиши
    hotkeys('ctrl+s', function(event, handler) {
        event.preventDefault();
        // Ctrl+S - Сохранение файла
        $('#btn_saveXML').trigger('click');
    });

    hotkeys('ctrl+o', function(event, handler) {
        event.preventDefault();
        // Ctrl+O - Открытие файла
        $('#btn_fakeload').trigger('click');
    });

    hotkeys('ctrl+n', function(event, handler) {
        event.preventDefault();
        // Ctrl+N - Новый файл
        $('#btn_new').trigger('click');
    });

    // Добавляем подсказки для дополнительных горячих клавиш
    $('#btn_saveXML').attr('title', function(i, oldTitle) {
        return oldTitle + ' (Ctrl+S)';
    });
    
    $('#btn_fakeload').attr('title', function(i, oldTitle) {
        return oldTitle + ' (Ctrl+O)';
    });
    
    $('#btn_new').attr('title', function(i, oldTitle) {
        return oldTitle + ' (Ctrl+N)';
    });
}); 