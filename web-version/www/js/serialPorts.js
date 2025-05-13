/**
 * SerialPorts class - Handles Web Serial API communication
 * This class manages serial port connections, port selection, and port list updates
 * Current implementation status:
 * ✓ Port selection via system dialog
 * ✓ Port list population
 * ✓ Basic port connection
 * ✓ Error handling
 * 
 * TODO:
 * - Implement data reading/writing
 * - Add port monitoring
 * - Add connection status indicators
 * - Add baud rate configuration
 */
class SerialPorts {
    constructor() {
        // Get references to UI elements
        this.portSelect = document.getElementById('portserie');
        this.requestPortBtn = document.getElementById('requestPortBtn');
        this.port = null;

        if (this.portSelect && this.requestPortBtn) {
            // Add event listeners for port selection and request
            this.portSelect.addEventListener('click', () => this.handlePortSelectClick());
            this.requestPortBtn.addEventListener('click', () => this.handleRequestPort());
            this.updatePortList();
        }
    }

    /**
     * Handles port request through system dialog
     * Opens selected port and updates port list
     */
    async handleRequestPort() {
        console.log('Requesting port access...');
        try {
            // Request port access through system dialog
            this.port = await navigator.serial.requestPort({
                // Port filters can be added here
                // Example: Arduino vendor ID
                // filters: [
                //     { usbVendorId: 0x2341 }
                // ]
            });
            
            console.log('Port selected:', this.port);
            const info = this.port.getInfo();
            console.log('Port info:', info);

            // Open port with default baud rate
            await this.port.open({ baudRate: 9600 });
            console.log('Port opened successfully');

            // Update available ports list
            await this.updatePortList();
            
            // Add selected port to dropdown if not exists
            const portExists = Array.from(this.portSelect.options).some(
                option => option.value === info.usbVendorId.toString()
            );
            
            if (!portExists) {
                const option = document.createElement('option');
                option.value = info.usbVendorId.toString();
                option.textContent = `Port ${info.usbVendorId} (${info.usbProductId})`;
                this.portSelect.appendChild(option);
            }

            // Select the port in dropdown
            this.portSelect.value = info.usbVendorId.toString();
            
        } catch (error) {
            console.error('Error requesting port:', error);
            if (error.name === 'NotFoundError') {
                console.log('No port selected by user');
            } else if (error.name === 'SecurityError') {
                console.log('Security error - make sure you\'re using HTTPS or localhost');
            }
        }
    }

    /**
     * Handles port select dropdown click
     * Logs available ports information
     */
    async handlePortSelectClick() {
        console.log('Port select clicked, checking available ports...');
        try {
            const ports = await navigator.serial.getPorts();
            console.log('Available ports:', ports);
            
            // Log information about each available port
            ports.forEach((port, index) => {
                const info = port.getInfo();
                console.log(`Port ${index + 1}:`, {
                    usbVendorId: info.usbVendorId,
                    usbProductId: info.usbProductId
                });
            });
        } catch (error) {
            console.error('Error getting ports:', error);
        }
    }

    /**
     * Updates the port selection dropdown with available ports
     */
    async updatePortList() {
        try {
            const ports = await navigator.serial.getPorts();
            console.log('Updating port list, found ports:', ports.length);
            
            // Clear and reset dropdown
            this.portSelect.innerHTML = '<option value="">Select a port</option>';
            
            // Add each available port to dropdown
            ports.forEach((port, index) => {
                const option = document.createElement('option');
                const info = port.getInfo();
                option.value = info.usbVendorId.toString();
                option.textContent = `Port ${info.usbVendorId} (${info.usbProductId})`;
                this.portSelect.appendChild(option);
            });

            console.log('Port list updated');
        } catch (error) {
            console.error('Error getting ports:', error);
        }
    }

    /**
     * Requests a new port through system dialog
     * @returns {Promise<SerialPort|null>} The selected port or null if cancelled
     */
    async requestPort() {
        try {
            console.log('Requesting new port...');
            const port = await navigator.serial.requestPort();
            console.log('Port requested successfully:', port);
            await this.updatePortList();
            return port;
        } catch (error) {
            console.error('Error requesting port:', error);
            return null;
        }
    }
}

// Initialize SerialPorts when the page loads
window.addEventListener('load', () => {
    console.log('Initializing SerialPorts...');
    new SerialPorts();
}); 