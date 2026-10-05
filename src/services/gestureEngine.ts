import { FlexSensors, GestureDefinition, IMUSensors, RecognizedGesture } from '../types/glove';

export const BUILTIN_GESTURES: GestureDefinition[] = [
  // 1. Greetings (التحيات)
  {
    id: 'salam',
    arabic: 'السلام عليكم ورحمة الله',
    english: 'Peace be upon you (Hello)',
    category: 'greetings',
    descriptionAr: 'كف مفتوح مستقيم موجه للأمام مع ميلان للأعلى',
    descriptionEn: 'Open flat hand facing outwards and upright',
    targetSensors: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 10, roll: 0 },
    tolerance: 25,
    iconName: 'Hand'
  },
  {
    id: 'marhaban',
    arabic: 'مرحباً / أهلاً وسهلاً',
    english: 'Hello / Welcome',
    category: 'greetings',
    descriptionAr: 'تلويح بالكف المفتوح مع ثني خفيف للإبهام',
    descriptionEn: 'Gentle wave with open palm',
    targetSensors: { thumb: 20, index: 5, middle: 5, ring: 10, pinky: 10 },
    targetIMU: { pitch: 25, roll: 15 },
    tolerance: 28,
    iconName: 'Smile'
  },
  {
    id: 'shukran',
    arabic: 'شكراً جزيلاً لك',
    english: 'Thank you very much',
    category: 'greetings',
    descriptionAr: 'الأصابع ممتدة ومضمومة تنطلق من الذقن للأمام',
    descriptionEn: 'Fingers straight, hand moving forward from chin',
    targetSensors: { thumb: 10, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: -15, roll: 0 },
    tolerance: 25,
    iconName: 'HeartHandshake'
  },
  {
    id: 'sabah_alkhair',
    arabic: 'صباح الخير',
    english: 'Good morning',
    category: 'greetings',
    descriptionAr: 'الكف مفتوح يتجه لأعلى كشروق الشمس',
    descriptionEn: 'Palm opens upward like rising sun',
    targetSensors: { thumb: 15, index: 0, middle: 0, ring: 10, pinky: 15 },
    targetIMU: { pitch: 45, roll: 0 },
    tolerance: 28,
    iconName: 'Sun'
  },
  {
    id: 'masaa_alkhair',
    arabic: 'مساء الخير',
    english: 'Good evening',
    category: 'greetings',
    descriptionAr: 'الكف يميل لأسفل كغروب الشمس',
    descriptionEn: 'Palm moves downward gently',
    targetSensors: { thumb: 10, index: 15, middle: 20, ring: 25, pinky: 30 },
    targetIMU: { pitch: -45, roll: 0 },
    tolerance: 28,
    iconName: 'Moon'
  },
  {
    id: 'maasalama',
    arabic: 'مع السلامة / إلى اللقاء',
    english: 'Goodbye / See you later',
    category: 'greetings',
    descriptionAr: 'تلويح باليد يميناً ويساراً مع فتح الأصابع',
    descriptionEn: 'Side to side waving palm',
    targetSensors: { thumb: 15, index: 10, middle: 10, ring: 15, pinky: 20 },
    targetIMU: { pitch: 30, roll: -30 },
    tolerance: 30,
    iconName: 'LogOut'
  },

  // 2. Daily Needs (الحاجات اليومية)
  {
    id: 'need_water',
    arabic: 'أنا عطشان، أريد شرب ماء',
    english: 'I am thirsty, I need water',
    category: 'daily_needs',
    descriptionAr: 'ثلاثة أصابع ممتدة (سبابة، وسطى، بنصر) قرب الفم',
    descriptionEn: 'Three fingers extended (W sign) near mouth',
    targetSensors: { thumb: 80, index: 5, middle: 5, ring: 5, pinky: 85 },
    targetIMU: { pitch: 15, roll: 20 },
    tolerance: 25,
    iconName: 'Droplet'
  },
  {
    id: 'need_food',
    arabic: 'أنا جائع، أريد طعاماً',
    english: 'I am hungry, I want food',
    category: 'daily_needs',
    descriptionAr: 'جميع الأصابع مقوسة ومجتمعة تتجه نحو الفم',
    descriptionEn: 'All fingers bunched and curved to mouth',
    targetSensors: { thumb: 60, index: 65, middle: 70, ring: 70, pinky: 65 },
    targetIMU: { pitch: 30, roll: 0 },
    tolerance: 25,
    iconName: 'Utensils'
  },
  {
    id: 'restroom',
    arabic: 'أين دورة المياه من فضلك؟',
    english: 'Where is the restroom, please?',
    category: 'daily_needs',
    descriptionAr: 'قبضة مع بروز الإبهام بين السبابة والوسطى (حرف T)',
    descriptionEn: 'Fist with thumb poking through index (T sign shake)',
    targetSensors: { thumb: 40, index: 85, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: 0, roll: 25 },
    targetContact: true,
    tolerance: 26,
    iconName: 'Bath'
  },
  {
    id: 'yes',
    arabic: 'نعم، أوافق',
    english: 'Yes, I agree',
    category: 'daily_needs',
    descriptionAr: 'قبضة مغلقة تميل للأمام كالإيماءة بالرأس',
    descriptionEn: 'Closed fist nodding up and down',
    targetSensors: { thumb: 85, index: 85, middle: 85, ring: 85, pinky: 85 },
    targetIMU: { pitch: -25, roll: 0 },
    tolerance: 25,
    iconName: 'CheckCircle'
  },
  {
    id: 'no',
    arabic: 'لا، لا أريد',
    english: 'No, I decline',
    category: 'daily_needs',
    descriptionAr: 'ضم السبابة والوسطى بقوة مع الإبهام',
    descriptionEn: 'Index and middle snap against thumb',
    targetSensors: { thumb: 50, index: 55, middle: 55, ring: 95, pinky: 95 },
    targetIMU: { pitch: 0, roll: 0 },
    targetContact: true,
    tolerance: 25,
    iconName: 'XCircle'
  },
  {
    id: 'please',
    arabic: 'من فضلك / لو سمحت',
    english: 'Please / If you please',
    category: 'daily_needs',
    descriptionAr: 'راحة اليد منبسطة فوق الصدر بحركة دائرية',
    descriptionEn: 'Open flat hand circling chest',
    targetSensors: { thumb: 10, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: -5, roll: 30 },
    tolerance: 25,
    iconName: 'HelpCircle'
  },
  {
    id: 'i_am_deaf',
    arabic: 'أنا شخص أصم وأتحدث بلغة الإشارة',
    english: 'I am deaf and communicate via sign language',
    category: 'daily_needs',
    descriptionAr: 'السبابة ممتدة تنتقل من الأذن إلى الفم',
    descriptionEn: 'Index finger pointing from ear towards mouth',
    targetSensors: { thumb: 75, index: 0, middle: 85, ring: 90, pinky: 90 },
    targetIMU: { pitch: 35, roll: -15 },
    tolerance: 25,
    iconName: 'EarOff'
  },
  {
    id: 'need_help',
    arabic: 'أحتاج إلى مساعدة من فضلك',
    english: 'I need some help please',
    category: 'daily_needs',
    descriptionAr: 'إبهام مرفوع لأعلى (Thumbs Up) محمول بكف أخرى',
    descriptionEn: 'Thumbs up sign held upright',
    targetSensors: { thumb: 0, index: 95, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: 30, roll: 0 },
    tolerance: 25,
    iconName: 'HelpingHand'
  },
  {
    id: 'tired',
    arabic: 'أنا متعب جداً وأحتاج للراحة',
    english: 'I am tired and need to rest',
    category: 'daily_needs',
    descriptionAr: 'اليدان تسقطان بانحناء الأصابع للأسفل',
    descriptionEn: 'Curved relaxed fingers dropping downward',
    targetSensors: { thumb: 40, index: 50, middle: 60, ring: 60, pinky: 60 },
    targetIMU: { pitch: -60, roll: 0 },
    tolerance: 26,
    iconName: 'Coffee'
  },
  {
    id: 'want_sleep',
    arabic: 'أريد أن أنام الآن',
    english: 'I want to sleep now',
    category: 'daily_needs',
    descriptionAr: 'الكف مسطح ومائل بجانب الخد',
    descriptionEn: 'Flat palm resting on tilted cheek',
    targetSensors: { thumb: 10, index: 5, middle: 5, ring: 5, pinky: 5 },
    targetIMU: { pitch: 10, roll: 55 },
    tolerance: 26,
    iconName: 'Bed'
  },

  // 3. Emergency & Health (الطوارئ والصحة)
  {
    id: 'emergency_sos',
    arabic: '🚨 نداء طوارئ عاجل! أحتاج إسعاف ونجدة فورا!',
    english: '🚨 EMERGENCY! I need immediate medical help/ambulance!',
    category: 'emergency',
    descriptionAr: 'قبضة قوية مغلقة تماماً مع اهتزاز مستمر',
    descriptionEn: 'Tight clenched fist raised with urgent alert',
    targetSensors: { thumb: 100, index: 100, middle: 100, ring: 100, pinky: 100 },
    targetIMU: { pitch: 45, roll: 0 },
    tolerance: 22,
    isEmergency: true,
    iconName: 'AlertTriangle'
  },
  {
    id: 'doctor',
    arabic: 'أحتاج استشارة طبيب متخصص',
    english: 'I need a doctor / physician',
    category: 'emergency',
    descriptionAr: 'حرف M أو إصبعان يلامسان معصم اليد لقياس النبض',
    descriptionEn: 'Two fingers tapping wrist pulse',
    targetSensors: { thumb: 70, index: 10, middle: 10, ring: 85, pinky: 85 },
    targetIMU: { pitch: -30, roll: 10 },
    tolerance: 25,
    iconName: 'Stethoscope'
  },
  {
    id: 'severe_pain',
    arabic: 'أشعر بألم حاد في هذا المكان',
    english: 'I feel sharp pain here',
    category: 'emergency',
    descriptionAr: 'السبابتان تلتويان باتجاه موضع الألم',
    descriptionEn: 'Index finger twisting sharply',
    targetSensors: { thumb: 80, index: 0, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: -10, roll: 40 },
    tolerance: 26,
    iconName: 'Activity'
  },
  {
    id: 'call_family',
    arabic: 'من فضلك اتصل برقم عائلتي للطوارئ',
    english: 'Please call my emergency family contact',
    category: 'emergency',
    descriptionAr: 'الإبهام والخنصر ممتدان (رمز الهاتف) عند الأذن',
    descriptionEn: 'Thumb and pinky extended (phone sign) at ear',
    targetSensors: { thumb: 0, index: 95, middle: 95, ring: 95, pinky: 0 },
    targetIMU: { pitch: 20, roll: -45 },
    tolerance: 24,
    iconName: 'PhoneCall'
  },
  {
    id: 'hospital',
    arabic: 'أين أقرب مستشفى أو مركز صحي؟',
    english: 'Where is the nearest hospital or clinic?',
    category: 'emergency',
    descriptionAr: 'رسم إشارة الصليب أو الهلال على الكتف بالسبابة والوسطى',
    descriptionEn: 'Cross or crescent sign on upper arm',
    targetSensors: { thumb: 60, index: 5, middle: 5, ring: 90, pinky: 90 },
    targetIMU: { pitch: 15, roll: -20 },
    tolerance: 26,
    iconName: 'Hospital'
  },

  // 4. Emotions & Social (المشاعر والاجتماعيات)
  {
    id: 'love_you',
    arabic: 'أنا أحبكم وأقدركم',
    english: 'I love you (ILY sign)',
    category: 'emotions',
    descriptionAr: 'إشارة I Love You العالمية: إبهام وسبابة وخنصر ممتدة',
    descriptionEn: 'Universal ILY sign (Thumb, Index, Pinky extended)',
    targetSensors: { thumb: 0, index: 0, middle: 95, ring: 95, pinky: 0 },
    targetIMU: { pitch: 15, roll: 0 },
    tolerance: 24,
    iconName: 'Heart'
  },
  {
    id: 'happy',
    arabic: 'أنا سعيد جداً وفرحان',
    english: 'I am very happy and glad',
    category: 'emotions',
    descriptionAr: 'راحة اليد منبسطة تمسح الصدر لأعلى عدة مرات',
    descriptionEn: 'Open palm sweeping up chest with joy',
    targetSensors: { thumb: 15, index: 5, middle: 5, ring: 5, pinky: 5 },
    targetIMU: { pitch: 50, roll: -10 },
    tolerance: 26,
    iconName: 'Smile'
  },
  {
    id: 'sorry',
    arabic: 'أنا آسف، أعتذر منك',
    english: 'I am so sorry, I apologize',
    category: 'emotions',
    descriptionAr: 'قبضة بحرف A تدور على موضع القلب بالصدر',
    descriptionEn: 'Closed fist rubbing circularly on chest',
    targetSensors: { thumb: 30, index: 90, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: 0, roll: 45 },
    tolerance: 25,
    iconName: 'Frown'
  },
  {
    id: 'nice_to_meet_you',
    arabic: 'سعيد جداً بمعرفتك ولقائك',
    english: 'Nice to meet you',
    category: 'emotions',
    descriptionAr: 'السبابتان ممتدتان تلتقيان وجهاً لوجه',
    descriptionEn: 'Two index fingers meeting face to face',
    targetSensors: { thumb: 70, index: 0, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: 0, roll: -35 },
    tolerance: 25,
    iconName: 'UserCheck'
  },

  // 5. Numbers & Signs (الأرقام والإشارات)
  {
    id: 'number_1',
    arabic: 'الرقم: واحد (1)',
    english: 'Number: One (1)',
    category: 'numbers',
    descriptionAr: 'السبابة ممتدة للأعلى وباقي الأصابع مضمومة',
    descriptionEn: 'Index finger pointing straight up',
    targetSensors: { thumb: 90, index: 0, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: 60, roll: 0 },
    tolerance: 24,
    iconName: 'Hash'
  },
  {
    id: 'number_2_peace',
    arabic: 'الرقم: اثنان (2) / إشارة النصر والسلام',
    english: 'Number: Two (2) / Victory & Peace',
    category: 'numbers',
    descriptionAr: 'السبابة والوسطى ممتدتان على شكل V',
    descriptionEn: 'Index and middle fingers extended (V sign)',
    targetSensors: { thumb: 90, index: 0, middle: 0, ring: 95, pinky: 95 },
    targetIMU: { pitch: 50, roll: 0 },
    tolerance: 24,
    iconName: 'Award'
  },
  {
    id: 'number_3',
    arabic: 'الرقم: ثلاثة (3)',
    english: 'Number: Three (3)',
    category: 'numbers',
    descriptionAr: 'الإبهام والسبابة والوسطى ممتدة',
    descriptionEn: 'Thumb, index, and middle extended',
    targetSensors: { thumb: 0, index: 0, middle: 0, ring: 95, pinky: 95 },
    targetIMU: { pitch: 50, roll: 0 },
    tolerance: 24,
    iconName: 'Hash'
  },
  {
    id: 'number_4',
    arabic: 'الرقم: أربعة (4)',
    english: 'Number: Four (4)',
    category: 'numbers',
    descriptionAr: 'أربعة أصابع ممتدة والإبهام مطوي للداخل',
    descriptionEn: 'Four fingers extended, thumb folded',
    targetSensors: { thumb: 95, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 50, roll: 0 },
    tolerance: 24,
    iconName: 'Hash'
  },
  {
    id: 'number_5',
    arabic: 'الرقم: خمسة (5)',
    english: 'Number: Five (5)',
    category: 'numbers',
    descriptionAr: 'جميع الأصابع الخمسة مفرودة تماماً',
    descriptionEn: 'All five fingers widely spread',
    targetSensors: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 50, roll: 0 },
    tolerance: 25,
    iconName: 'Hand'
  },
  {
    id: 'ok_sign',
    arabic: 'حسناً / ممتاز / موافق (OK)',
    english: 'OK / All good / Approved',
    category: 'daily_needs',
    descriptionAr: 'الإبهام يلامس السبابة بشكل دائري والثلاثة ممتدة',
    descriptionEn: 'Thumb and index form circle, other 3 extended',
    targetSensors: { thumb: 45, index: 50, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 20, roll: 0 },
    targetContact: true,
    tolerance: 25,
    iconName: 'Check'
  },

  // 6. Family (الأسرة والعائلة)
  {
    id: 'father',
    arabic: 'أبي / والدي',
    english: 'Father / Dad',
    category: 'family',
    descriptionAr: 'إبهام الكف المفتوحة يلامس الجبهة (إشارة الأب المعتمدة)',
    descriptionEn: 'Thumb of open 5-hand taps forehead',
    targetSensors: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 65, roll: 10 },
    tolerance: 26,
    iconName: 'Users'
  },
  {
    id: 'mother',
    arabic: 'أمي / والدتي',
    english: 'Mother / Mom',
    category: 'family',
    descriptionAr: 'إبهام الكف المفتوحة يلامس الذقن (إشارة الأم المعتمدة)',
    descriptionEn: 'Thumb of open 5-hand taps chin',
    targetSensors: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: -20, roll: 10 },
    tolerance: 26,
    iconName: 'Heart'
  },
  {
    id: 'brother',
    arabic: 'أخي العزيز',
    english: 'My brother',
    category: 'family',
    descriptionAr: 'سبابتان ممتدتان متطابقتان مع حركة من الجبهة للأمام',
    descriptionEn: 'Index finger moving from forehead into matching index',
    targetSensors: { thumb: 75, index: 0, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: 20, roll: 0 },
    tolerance: 25,
    iconName: 'User'
  },
  {
    id: 'sister',
    arabic: 'أختي العزيزة',
    english: 'My sister',
    category: 'family',
    descriptionAr: 'سبابة تنطلق من الخد والذقن لتلتقي باليد الأخرى',
    descriptionEn: 'Index moving from cheek/chin to match other hand',
    targetSensors: { thumb: 70, index: 5, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: -10, roll: 15 },
    tolerance: 25,
    iconName: 'UserCheck'
  },
  {
    id: 'child',
    arabic: 'طفل / ابني الصغير',
    english: 'Child / Baby',
    category: 'family',
    descriptionAr: 'كف مبسوطة لأسفل تمايل على مستوى منخفض كأنها تربت على رأس طفل',
    descriptionEn: 'Palm patting downward at child head height',
    targetSensors: { thumb: 20, index: 10, middle: 10, ring: 10, pinky: 10 },
    targetIMU: { pitch: -70, roll: 0 },
    tolerance: 26,
    iconName: 'Smile'
  },
  {
    id: 'friend',
    arabic: 'صديقي / صاحبي',
    english: 'My friend',
    category: 'family',
    descriptionAr: 'السبابتان معقوفتان ومتشابكتان كحلقة متماسكة',
    descriptionEn: 'Hooked index fingers interlocking',
    targetSensors: { thumb: 80, index: 45, middle: 85, ring: 85, pinky: 85 },
    targetIMU: { pitch: 0, roll: 20 },
    targetContact: true,
    tolerance: 26,
    iconName: 'HeartHandshake'
  },

  // 7. Questions (الأسئلة والاستفسار)
  {
    id: 'where',
    arabic: 'أين؟ / في أي مكان؟',
    english: 'Where is it?',
    category: 'questions',
    descriptionAr: 'السبابة ممتدة للأعلى وتتمايل يمنة ويسرة مع نظرة تساؤل',
    descriptionEn: 'Index finger pointing up and oscillating side to side',
    targetSensors: { thumb: 85, index: 0, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: 40, roll: 30 },
    tolerance: 27,
    iconName: 'HelpCircle'
  },
  {
    id: 'when',
    arabic: 'متى؟ / في أي وقت؟',
    english: 'When? / What time?',
    category: 'questions',
    descriptionAr: 'السبابة تدور حول سبابة اليد الأخرى كعقرب الساعة',
    descriptionEn: 'Index finger circling like clock hands',
    targetSensors: { thumb: 80, index: 0, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: -5, roll: -30 },
    tolerance: 26,
    iconName: 'Clock'
  },
  {
    id: 'how_much',
    arabic: 'كم السعر؟ / كم يكلف هذا؟',
    english: 'How much does this cost?',
    category: 'questions',
    descriptionAr: 'فرك الإبهام مع أطراف السبابة والوسطى (حركة النقود والحساب)',
    descriptionEn: 'Fingers rubbing thumb (money / cost sign)',
    targetSensors: { thumb: 40, index: 45, middle: 45, ring: 80, pinky: 85 },
    targetIMU: { pitch: 10, roll: 0 },
    targetContact: true,
    tolerance: 26,
    iconName: 'DollarSign'
  },
  {
    id: 'what',
    arabic: 'ماذا؟ / ما هذا الشيء؟',
    english: 'What is this?',
    category: 'questions',
    descriptionAr: 'كف مفتوح لأعلى يهتز أفقياً بحركة تساؤلية',
    descriptionEn: 'Open palm facing up shaking horizontally',
    targetSensors: { thumb: 10, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 0, roll: 75 },
    tolerance: 27,
    iconName: 'HelpCircle'
  },
  {
    id: 'how_are_you',
    arabic: 'كيف حالك اليوم؟ عساك بخير',
    english: 'How are you today?',
    category: 'questions',
    descriptionAr: 'اليدان من الصدر تنفتحان للأمام مع إبهامين مرفوعين',
    descriptionEn: 'Hands moving outward from chest ending in thumbs up',
    targetSensors: { thumb: 0, index: 75, middle: 80, ring: 85, pinky: 85 },
    targetIMU: { pitch: 35, roll: 20 },
    tolerance: 28,
    iconName: 'Smile'
  },

  // 8. Places & Facilities (الأماكن والمرافق)
  {
    id: 'home_house',
    arabic: 'البيت / منزلي',
    english: 'Home / My house',
    category: 'places',
    descriptionAr: 'الكفان يتلاقيان بأطراف الأصابع على شكل سقف مثلث للبيت',
    descriptionEn: 'Fingertips touch forming a roof triangle shape',
    targetSensors: { thumb: 15, index: 10, middle: 10, ring: 15, pinky: 15 },
    targetIMU: { pitch: 55, roll: -35 },
    tolerance: 26,
    iconName: 'Home'
  },
  {
    id: 'mosque_prayer',
    arabic: 'المسجد / وقت الصلاة',
    english: 'Mosque / Prayer time',
    category: 'places',
    descriptionAr: 'الكفان مفتوحان ومرفوعان للدعاء والصلاة',
    descriptionEn: 'Open palms facing up together in prayer',
    targetSensors: { thumb: 10, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 30, roll: 60 },
    tolerance: 26,
    iconName: 'Sun'
  },
  {
    id: 'school',
    arabic: 'المدرسة / الجامعة والتعليم',
    english: 'School / University',
    category: 'places',
    descriptionAr: 'كف تصفق باسترخاء فوق الكف الأخرى مرتين (رمز التعلم والكتاب)',
    descriptionEn: 'Hand clapping lightly on other palm (school / book sign)',
    targetSensors: { thumb: 20, index: 15, middle: 15, ring: 20, pinky: 20 },
    targetIMU: { pitch: -10, roll: 45 },
    tolerance: 26,
    iconName: 'Book'
  },
  {
    id: 'supermarket',
    arabic: 'السوبرماركت / البقالة والسوق',
    english: 'Supermarket / Grocery store',
    category: 'places',
    descriptionAr: 'الأصابع مجموعة تتجه للأمام كأنها تضع مشتريات بسلة',
    descriptionEn: 'Fingers pinched moving forward as if shopping into cart',
    targetSensors: { thumb: 55, index: 60, middle: 60, ring: 65, pinky: 65 },
    targetIMU: { pitch: -15, roll: 0 },
    tolerance: 26,
    iconName: 'ShoppingCart'
  },
  {
    id: 'pharmacy',
    arabic: 'الصيدلية / شراء دواء',
    english: 'Pharmacy / Medicine',
    category: 'places',
    descriptionAr: 'الإصبع الأوسط يدور داخل كف اليد الأخرى كطحن حبوب الدواء',
    descriptionEn: 'Middle finger twisting into palm (medicine / pill sign)',
    targetSensors: { thumb: 70, index: 80, middle: 30, ring: 85, pinky: 85 },
    targetIMU: { pitch: -25, roll: 10 },
    tolerance: 25,
    iconName: 'Plus'
  },
  {
    id: 'restaurant',
    arabic: 'المطعم / أريد أن آكل وجبة',
    english: 'Restaurant / Dining',
    category: 'places',
    descriptionAr: 'حرف R أو أصابع تمسح جانبي الفم بلطف (مكان الطعام)',
    descriptionEn: 'Fingers wiping side of mouth then pointing outward',
    targetSensors: { thumb: 60, index: 10, middle: 10, ring: 90, pinky: 90 },
    targetIMU: { pitch: 15, roll: 10 },
    tolerance: 25,
    iconName: 'Utensils'
  },

  // 9. Actions (الأفعال والحاجات الحياتية)
  {
    id: 'i_want',
    arabic: 'أنا أريد / أحتاج هذا',
    english: 'I want / I need this',
    category: 'actions',
    descriptionAr: 'الكفان مفتوحتان ومقوستان تُسحبان باتجاه الصدر برغبة',
    descriptionEn: 'Claw hands pulling toward chest (Want sign)',
    targetSensors: { thumb: 45, index: 50, middle: 50, ring: 50, pinky: 50 },
    targetIMU: { pitch: 10, roll: 20 },
    tolerance: 26,
    iconName: 'Check'
  },
  {
    id: 'i_dont_want',
    arabic: 'أنا لا أريد هذا إطلاقاً',
    english: 'I do not want this',
    category: 'actions',
    descriptionAr: 'الكف تبدأ من الصدر وتُدفع للخارج مع قلبها للأسفل (رفض)',
    descriptionEn: 'Hands start at chest and push away turning downward',
    targetSensors: { thumb: 30, index: 20, middle: 20, ring: 20, pinky: 20 },
    targetIMU: { pitch: -45, roll: 40 },
    tolerance: 26,
    iconName: 'X'
  },
  {
    id: 'go_leave',
    arabic: 'أنا ذاهب / فلنذهب الآن',
    english: 'Let us go / I am leaving',
    category: 'actions',
    descriptionAr: 'سبابتان ممتدتان تنطلقان معاً باتجاه الوجهة المحددة',
    descriptionEn: 'Index fingers pointing and sweeping forward (Go sign)',
    targetSensors: { thumb: 80, index: 0, middle: 85, ring: 85, pinky: 85 },
    targetIMU: { pitch: -10, roll: -15 },
    tolerance: 25,
    iconName: 'Navigation'
  },
  {
    id: 'stop_wait',
    arabic: 'توقف من فضلك / انتظر قليلاً',
    english: 'Stop / Wait a moment please',
    category: 'actions',
    descriptionAr: 'كف مفتوحة مستقيمة تقطع كف اليد الأخرى عمودياً بحزم',
    descriptionEn: 'Open flat hand slicing firmly onto other palm (Stop sign)',
    targetSensors: { thumb: 5, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 0, roll: -90 },
    tolerance: 25,
    iconName: 'Pause'
  },
  {
    id: 'pay_bill',
    arabic: 'أريد دفع الحساب / الفاتورة',
    english: 'I want to pay the bill',
    category: 'actions',
    descriptionAr: 'ظهر إبهام اليد يمسح كف اليد الأخرى للأمام (دفع نقود)',
    descriptionEn: 'Thumb sliding forward across palm (Pay sign)',
    targetSensors: { thumb: 35, index: 65, middle: 70, ring: 85, pinky: 85 },
    targetIMU: { pitch: -20, roll: 30 },
    tolerance: 25,
    iconName: 'CreditCard'
  },
  {
    id: 'write_read',
    arabic: 'أريد أن أكتب لك / أو اقرأ ورقة',
    english: 'I want to write / read note',
    category: 'actions',
    descriptionAr: 'الإبهام والسبابة يمسكان قلماً وهمياً ويكتبان على الكف الأخرى',
    descriptionEn: 'Thumb and index holding imaginary pen writing on palm',
    targetSensors: { thumb: 50, index: 45, middle: 80, ring: 85, pinky: 85 },
    targetIMU: { pitch: -15, roll: 15 },
    targetContact: true,
    tolerance: 25,
    iconName: 'Edit3'
  },

  // 10. Arabic Alphabet Fingerspelling (الحروف الهجائية باليد)
  {
    id: 'letter_alif',
    arabic: 'حرف: الألف (ا)',
    english: 'Letter: Alif (ا)',
    category: 'alphabet',
    descriptionAr: 'قبضة مع إبهام ممتد للأعلى بمحاذاة السبابة (رمز الألف والعمود)',
    descriptionEn: 'Fist with thumb upright along index finger',
    targetSensors: { thumb: 0, index: 95, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: 75, roll: 0 },
    tolerance: 24,
    iconName: 'Type'
  },
  {
    id: 'letter_baa',
    arabic: 'حرف: الباء (ب)',
    english: 'Letter: Baa (ب)',
    category: 'alphabet',
    descriptionAr: 'أربعة أصابع ممتدة للأعلى مع طي الإبهام فوق راحة اليد (مثل B)',
    descriptionEn: 'Four fingers upright together, thumb folded across palm',
    targetSensors: { thumb: 90, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 65, roll: 0 },
    tolerance: 24,
    iconName: 'Type'
  },
  {
    id: 'letter_jeem',
    arabic: 'حرف: الجيم (ج)',
    english: 'Letter: Jeem (ج)',
    category: 'alphabet',
    descriptionAr: 'الأصابع مقوسة على شكل نصف دائرة كحرف C أو تجويف الجيم',
    descriptionEn: 'All fingers curved like a C shape',
    targetSensors: { thumb: 50, index: 50, middle: 50, ring: 50, pinky: 50 },
    targetIMU: { pitch: 10, roll: 45 },
    tolerance: 26,
    iconName: 'Type'
  },
  {
    id: 'letter_daal',
    arabic: 'حرف: الدال (د)',
    english: 'Letter: Daal (د)',
    category: 'alphabet',
    descriptionAr: 'السبابة والإبهام يشكلان زاوية حادة مفتوحة تشبه رسم حرف الدال',
    descriptionEn: 'Index and thumb form an open acute angle',
    targetSensors: { thumb: 30, index: 20, middle: 90, ring: 90, pinky: 90 },
    targetIMU: { pitch: 20, roll: 10 },
    tolerance: 25,
    iconName: 'Type'
  },
  {
    id: 'letter_meem',
    arabic: 'حرف: الميم (م)',
    english: 'Letter: Meem (م)',
    category: 'alphabet',
    descriptionAr: 'قبضة مطوية تماماً مع دوران الإبهام لأسفل كدائرة حرف الميم',
    descriptionEn: 'Tight fist with thumb tucked under pointing down',
    targetSensors: { thumb: 95, index: 95, middle: 95, ring: 95, pinky: 95 },
    targetIMU: { pitch: -40, roll: 0 },
    tolerance: 24,
    iconName: 'Type'
  },
  {
    id: 'letter_yaa',
    arabic: 'حرف: الياء (ي)',
    english: 'Letter: Yaa (ي)',
    category: 'alphabet',
    descriptionAr: 'الإبهام والخنصر ممتدان للأعلى وباقي الأصابع مطوية (رمز Y)',
    descriptionEn: 'Thumb and pinky extended (Y sign)',
    targetSensors: { thumb: 0, index: 95, middle: 95, ring: 95, pinky: 0 },
    targetIMU: { pitch: 45, roll: 0 },
    tolerance: 24,
    iconName: 'Type'
  },

  // 11. Time & Numbers (الوقت والأرقام)
  {
    id: 'time_today',
    arabic: 'اليوم / هذا اليوم',
    english: 'Today / This day',
    category: 'daily_needs',
    descriptionAr: 'الكفان على شكل حرف Y ينخفضان لأسفل مرتين أمام الصدر',
    descriptionEn: 'Y-hands dropping downward twice (Today sign)',
    targetSensors: { thumb: 0, index: 95, middle: 95, ring: 95, pinky: 0 },
    targetIMU: { pitch: -20, roll: 0 },
    tolerance: 25,
    iconName: 'Calendar'
  },
  {
    id: 'time_tomorrow',
    arabic: 'غداً / يوم غد إن شاء الله',
    english: 'Tomorrow',
    category: 'daily_needs',
    descriptionAr: 'إبهام مرفوع يلمس الخد ثم يدور للأمام (إشارة الغد)',
    descriptionEn: 'Thumbs-up moving forward from jawline (Tomorrow sign)',
    targetSensors: { thumb: 0, index: 85, middle: 85, ring: 85, pinky: 85 },
    targetIMU: { pitch: 10, roll: 35 },
    tolerance: 26,
    iconName: 'Calendar'
  },
  {
    id: 'time_now',
    arabic: 'الآن / فوراً في هذه اللحظة',
    english: 'Now / Right now',
    category: 'daily_needs',
    descriptionAr: 'اليدان مثنيتان تهبطان للأسفل بحزم إشارة للحظة الحالية',
    descriptionEn: 'Curved hands thrusting downward firmly (Now sign)',
    targetSensors: { thumb: 25, index: 40, middle: 40, ring: 40, pinky: 40 },
    targetIMU: { pitch: -50, roll: 0 },
    tolerance: 26,
    iconName: 'Clock'
  },
  {
    id: 'feeling_fine',
    arabic: 'أنا بخير وبصحة جيدة والحمد لله',
    english: 'I am doing well, thank God',
    category: 'emotions',
    descriptionAr: 'كف مفتوحة تلامس الصدر بالإبهام ثم تتقدم للأمام بفرح',
    descriptionEn: 'Open 5-hand thumb touching chest then opening forward',
    targetSensors: { thumb: 5, index: 0, middle: 0, ring: 0, pinky: 0 },
    targetIMU: { pitch: 20, roll: 10 },
    tolerance: 26,
    iconName: 'Heart'
  }
];

class GestureEngine {
  private customGestures: GestureDefinition[] = [];
  private lastTriggeredId: string | null = null;
  private lastTriggerTime = 0;

  constructor() {
    this.loadCustomGestures();
  }

  public loadCustomGestures() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('smart_glove_custom_gestures');
        if (saved) {
          this.customGestures = JSON.parse(saved);
        }
      }
    } catch {
      this.customGestures = [];
    }
  }

  public saveCustomGesture(gesture: GestureDefinition) {
    this.customGestures.push(gesture);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smart_glove_custom_gestures', JSON.stringify(this.customGestures));
      }
    } catch {
      // ignore
    }
  }

  public deleteCustomGesture(id: string) {
    this.customGestures = this.customGestures.filter(g => g.id !== id);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smart_glove_custom_gestures', JSON.stringify(this.customGestures));
      }
    } catch {
      // ignore
    }
  }

  public getAllGestures(): GestureDefinition[] {
    return [...BUILTIN_GESTURES, ...this.customGestures];
  }

  // Calculate distance between current sensors and a target gesture
  public evaluateMatch(
    sensors: FlexSensors,
    imu: IMUSensors,
    touchContact: boolean,
    candidate: GestureDefinition
  ): number {
    const t = candidate.targetSensors;

    // Weights for flex sensors (5 fingers)
    const dThumb = Math.abs(sensors.thumb - t.thumb);
    const dIndex = Math.abs(sensors.index - t.index);
    const dMiddle = Math.abs(sensors.middle - t.middle);
    const dRing = Math.abs(sensors.ring - t.ring);
    const dPinky = Math.abs(sensors.pinky - t.pinky);

    // Average finger error (0 to 100)
    const avgFingerDiff = (dThumb * 1.1 + dIndex * 1.2 + dMiddle * 1.0 + dRing * 0.9 + dPinky * 0.8) / 5.0;

    // IMU evaluation if specified
    let imuPenalty = 0;
    if (candidate.targetIMU) {
      if (candidate.targetIMU.pitch !== undefined) {
        const diffPitch = Math.abs(imu.pitch - candidate.targetIMU.pitch);
        imuPenalty += Math.min(25, diffPitch * 0.3);
      }
      if (candidate.targetIMU.roll !== undefined) {
        const diffRoll = Math.abs(imu.roll - candidate.targetIMU.roll);
        imuPenalty += Math.min(25, diffRoll * 0.25);
      }
    }

    // Contact sensor bonus / penalty
    let contactPenalty = 0;
    if (candidate.targetContact !== undefined) {
      if (candidate.targetContact !== touchContact) {
        contactPenalty = 15;
      }
    }

    const totalError = avgFingerDiff + imuPenalty + contactPenalty;
    const maxTolerance = candidate.tolerance || 30;

    // Convert to percentage confidence
    const score = Math.max(0, 100 - (totalError / maxTolerance) * 45);
    return Math.round(score);
  }

  // Recognize best matching gesture from current glove state
  public recognize(
    sensors: FlexSensors,
    imu: IMUSensors,
    touchContact: boolean,
    confidenceThreshold = 72
  ): RecognizedGesture | null {
    const all = this.getAllGestures();
    let bestGesture: GestureDefinition | null = null;
    let highestConfidence = 0;

    for (const g of all) {
      const conf = this.evaluateMatch(sensors, imu, touchContact, g);
      if (conf > highestConfidence) {
        highestConfidence = conf;
        bestGesture = g;
      }
    }

    if (bestGesture && highestConfidence >= confidenceThreshold) {
      return {
        gesture: bestGesture,
        confidence: highestConfidence,
        timestamp: Date.now()
      };
    }

    return null;
  }
}

export const gestureEngine = new GestureEngine();
