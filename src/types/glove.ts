// Types for Smart Glove (القفاز الذكي)

export interface FlexSensors {
  thumb: number;   // 0 (straight) to 100 (fully bent)
  index: number;   // 0 to 100
  middle: number;  // 0 to 100
  ring: number;    // 0 to 100
  pinky: number;   // 0 to 100
}

export interface IMUSensors {
  pitch: number;   // -90 to +90 degrees (tilt up/down)
  roll: number;    // -90 to +90 degrees (tilt left/right)
  yaw: number;     // 0 to 360 degrees
  movementVelocity?: number; // 0 to 100
}

export interface GloveState {
  isConnected: boolean;
  isSimulated: boolean;
  deviceName: string;
  batteryLevel: number; // 0 to 100
  signalStrength: number; // RSSI or percentage
  sensors: FlexSensors;
  imu: IMUSensors;
  touchContact: boolean; // thumb touching index or fist contact
  lastUpdated: number;
}

export type GestureCategory =
  | 'greetings'
  | 'daily_needs'
  | 'emergency'
  | 'emotions'
  | 'family'
  | 'questions'
  | 'places'
  | 'actions'
  | 'numbers'
  | 'alphabet'
  | 'medical'
  | 'custom';

export interface GestureDefinition {
  id: string;
  arabic: string;
  english: string;
  category: GestureCategory;
  descriptionAr: string;
  descriptionEn: string;
  targetSensors: FlexSensors;
  targetIMU?: {
    pitch?: number;
    roll?: number;
  };
  targetContact?: boolean;
  tolerance?: number; // default tolerance score
  isEmergency?: boolean;
  iconName?: string;
  isCustom?: boolean;
}

export interface RecognizedGesture {
  gesture: GestureDefinition;
  confidence: number; // 0 to 100%
  timestamp: number;
}

export interface TranslationHistoryItem {
  id: string;
  arabic: string;
  english: string;
  timestamp: number;
  source: 'glove' | 'camera' | 'ai_composer' | 'quick_reply';
  category?: GestureCategory;
  isEmergency?: boolean;
}

export interface ConversationMessage {
  id: string;
  sender: 'deaf_user' | 'hearing_user' | 'system';
  arabicText: string;
  englishText: string;
  timestamp: number;
  audioSpoken?: boolean;
  matchedSigns?: string[];
}
