class SerialMonitor {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.readLoop = null;
        this.isConnected = false;
        this.serialPorts = new SerialPorts();

        // DOM elements
        this.portSelect = document.getElementById('portSelect');
        this.connectButton = document.getElementById('connectButton');
        this.disconnectButton = document.getElementById('disconnectButton');
        this.status = document.getElementById('status');
        this.monitor = document.getElementById('monitor');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');

        // Bind event listeners
        this.connectButton.addEventListener('click', () => this.connect());
        this.disconnectButton.addEventListener('click', () => this.disconnect());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Initial port list update
        this.updatePortList();
    }

    async updatePortList() {
        try {
            const ports = await navigator.serial.getPorts();
            this.portSelect.innerHTML = '<option value="">Select a port</option>';
            
            ports.forEach(port => {
                const option = document.createElement('option');
                option.value = port;
                option.textContent = `Port ${port.getInfo().usbVendorId}`;
                this.portSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error getting ports:', error);
            this.log('Error getting ports: ' + error.message);
        }
    }

    async connect() {
        try {
            // Request port
            this.port = await this.serialPorts.requestPort();
            if (!this.port) return;
            
            // Open port with default settings
            await this.port.open({ baudRate: 9600 });
            
            // Set up reading
            const textDecoder = new TextDecoderStream();
            this.port.readable.pipeTo(textDecoder.writable);
            this.reader = textDecoder.readable.getReader();

            // Set up writing
            const textEncoder = new TextEncoderStream();
            textEncoder.readable.pipeTo(this.port.writable);
            this.writer = textEncoder.writable.getWriter();

            // Start reading loop
            this.readLoop = this.readLoop.bind(this);
            this.readLoop();

            // Update UI
            this.isConnected = true;
            this.updateUI();
            this.log('Connected to port');
            this.status.textContent = 'Connected';

        } catch (error) {
            console.error('Error connecting:', error);
            this.log('Error connecting: ' + error.message);
        }
    }

    async disconnect() {
        try {
            if (this.reader) {
                await this.reader.cancel();
                this.reader = null;
            }
            if (this.writer) {
                await this.writer.close();
                this.writer = null;
            }
            if (this.port) {
                await this.port.close();
                this.port = null;
            }

            // Update UI
            this.isConnected = false;
            this.updateUI();
            this.log('Disconnected');
            this.status.textContent = 'Not connected';

        } catch (error) {
            console.error('Error disconnecting:', error);
            this.log('Error disconnecting: ' + error.message);
        }
    }

    async readLoop() {
        try {
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    this.reader.releaseLock();
                    break;
                }
                this.log(value);
            }
        } catch (error) {
            console.error('Error reading:', error);
            this.log('Error reading: ' + error.message);
        }
    }

    async sendMessage() {
        if (!this.isConnected || !this.writer) return;

        const message = this.messageInput.value;
        if (!message) return;

        try {
            await this.writer.write(message + '\n');
            this.messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
            this.log('Error sending message: ' + error.message);
        }
    }

    log(message) {
        const line = document.createElement('div');
        line.textContent = message;
        this.monitor.appendChild(line);
        this.monitor.scrollTop = this.monitor.scrollHeight;
    }

    updateUI() {
        this.connectButton.disabled = this.isConnected;
        this.disconnectButton.disabled = !this.isConnected;
        this.messageInput.disabled = !this.isConnected;
        this.sendButton.disabled = !this.isConnected;
    }
}

// Initialize the serial monitor when the page loads
window.addEventListener('load', () => {
    new SerialMonitor();
});

// Загрузка прошивки на Arduino через Web Serial API
async function uploadHexToArduino() {
    console.log('uploadHexToArduino called');
    try {
        // Получаем выбранный порт
        const port = await navigator.serial.requestPort();
        console.log('Port requested:', port);
        await port.open({ baudRate: 115200 }); // 115200 для Arduino Uno/Nano/Mega
        console.log('Port opened');

        // Загружаем hex-файл
        const response = await fetch('firmware.hex');
        console.log('firmware.hex fetch response:', response);
        if (!response.ok) throw new Error('Не удалось загрузить firmware.hex');
        const hexText = await response.text();
        console.log('firmware.hex loaded, length:', hexText.length);

        // Преобразуем hex в байты (Intel HEX -> бинарник)
        // Здесь нужен парсер Intel HEX, например, intel-hex.browser.js
        // Для теста отправим как есть (но это не прошьёт Arduino стандартным загрузчиком!)
        const writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(hexText));
        console.log('HEX sent to port');
        await writer.close();
        await port.close();
        alert('HEX отправлен на порт! (но для реальной прошивки нужен загрузчик типа avrdude)');
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        alert('Ошибка загрузки: ' + e.message);
    }
}

document.getElementById('btn_verify').addEventListener('click', function(event) {
    console.log('btn_verify click handler called');
    event.preventDefault();
    event.stopPropagation();
    uploadHexToArduino();
}); 