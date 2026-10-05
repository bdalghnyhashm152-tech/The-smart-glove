// Web Bluetooth Service for connecting physical smart gloves (ESP32 / Arduino / nRF) or simulation

export class BluetoothService {
  private device: any = null;
  private server: any = null;
  private characteristic: any = null;
  public isConnected = false;
  public isConnecting = false;

  // Real Web Bluetooth connection
  async connectRealGlove(
    onDataReceived: (data: {
      thumb: number;
      index: number;
      middle: number;
      ring: number;
      pinky: number;
      pitch: number;
      roll: number;
      touch: boolean;
    }) => void,
    onDisconnect: () => void
  ): Promise<{ success: boolean; deviceName?: string; error?: string }> {
    if (!('bluetooth' in navigator)) {
      return { success: false, error: 'البلوتوث غير مدعوم في هذا المتصفح. استخدم Chrome أو Edge.' };
    }

    try {
      this.isConnecting = true;
      // Request Bluetooth device with Nordic UART or custom glove service
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART
          '0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10 / CC2541
          'battery_service',
          'device_information'
        ]
      });

      this.device = device;
      device.addEventListener('gattserverdisconnected', () => {
        this.isConnected = false;
        onDisconnect();
      });

      const server = await device.gatt.connect();
      this.server = server;
      this.isConnected = true;
      this.isConnecting = false;

      // Try to bind UART RX characteristic if available
      try {
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
        const char = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
        this.characteristic = char;
        await char.startNotifications();
        char.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target.value;
          const decoder = new TextDecoder('utf-8');
          const str = decoder.decode(value);
          // Expect CSV or JSON: thumb,index,middle,ring,pinky,pitch,roll,touch
          try {
            const parts = str.trim().split(',');
            if (parts.length >= 5) {
              onDataReceived({
                thumb: Number(parts[0]) || 0,
                index: Number(parts[1]) || 0,
                middle: Number(parts[2]) || 0,
                ring: Number(parts[3]) || 0,
                pinky: Number(parts[4]) || 0,
                pitch: Number(parts[5]) || 0,
                roll: Number(parts[6]) || 0,
                touch: parts[7] === '1' || parts[7] === 'true'
              });
            }
          } catch {
            // raw string parse fallback
          }
        });
      } catch {
        // Connected to GATT without standard UART, device registered
      }

      return { success: true, deviceName: device.name || 'Smart Glove BLE' };
    } catch (err: any) {
      this.isConnecting = false;
      this.isConnected = false;
      return { success: false, error: err.message || 'تم إلغاء الاتصال بالبلوتوث' };
    }
  }

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }
}

export const bluetoothService = new BluetoothService();
