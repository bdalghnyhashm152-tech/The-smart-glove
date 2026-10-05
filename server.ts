import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Smart Glove Backend' });
});

const PHRASE_MAP: Record<string, string> = {
  // Greetings
  'السلام عليكم': 'Peace be upon you (Hello)',
  'السلام عليكم ورحمة الله': 'Peace be upon you (Hello)',
  'مرحباً': 'Hello',
  'مرحباً / أهلاً وسهلاً': 'Hello / Welcome',
  'شكراً': 'Thank you',
  'شكراً جزيلاً لك': 'Thank you very much',
  'صباح الخير': 'Good morning',
  'مساء الخير': 'Good evening',
  'مع السلامة': 'Goodbye',
  'مع السلامة / إلى اللقاء': 'Goodbye / See you later',

  // Daily Needs
  'نعم': 'Yes',
  'نعم، أوافق': 'Yes, I agree',
  'لا': 'No',
  'لا، لا أريد': 'No, I decline',
  'أنا': 'I am',
  'جائع': 'hungry',
  'أنا جائع، أريد طعاماً': 'I am hungry, I want food',
  'أنا عطشان، أريد شرب ماء': 'I am thirsty, I need water',
  'أين دورة المياه من فضلك؟': 'Where is the restroom, please?',
  'من فضلك / لو سمحت': 'Please / Excuse me',
  'أنا شخص أصم وأتحدث بلغة الإشارة': 'I am deaf and communicate via sign language',
  'أحتاج إلى مساعدة من فضلك': 'I need some help please',
  'أنا متعب جداً وأحتاج للراحة': 'I am tired and need to rest',
  'أريد أن أنام الآن': 'I want to sleep now',
  'حسناً / ممتاز / موافق (OK)': 'OK / All good / Approved',

  // Family
  'أبي / والدي': 'Father / Dad',
  'أمي / والدتي': 'Mother / Mom',
  'أخي العزيز': 'My brother',
  'أختي العزيزة': 'My sister',
  'طفل / ابني الصغير': 'Child / Baby',
  'صديقي / صاحبي': 'My friend',

  // Questions
  'أين؟ / في أي مكان؟': 'Where is it?',
  'متى؟ / في أي وقت؟': 'When? / What time?',
  'كم السعر؟ / كم يكلف هذا؟': 'How much does this cost?',
  'ماذا؟ / ما هذا الشيء؟': 'What is this?',
  'كيف حالك اليوم؟ عساك بخير': 'How are you today?',

  // Places
  'البيت / منزلي': 'Home / My house',
  'المسجد / وقت الصلاة': 'Mosque / Prayer time',
  'المدرسة / الجامعة والتعليم': 'School / University',
  'السوبرماركت / البقالة والسوق': 'Supermarket / Grocery store',
  'الصيدلية / شراء دواء': 'Pharmacy / Medicine',
  'المطعم / أريد أن آكل وجبة': 'Restaurant / Dining',

  // Actions
  'أنا أريد / أحتاج هذا': 'I want / I need this',
  'أنا لا أريد هذا إطلاقاً': 'I do not want this',
  'أنا ذاهب / فلنذهب الآن': 'Let us go / I am leaving',
  'توقف من فضلك / انتظر قليلاً': 'Stop / Wait a moment please',
  'أريد دفع الحساب / الفاتورة': 'I want to pay the bill',
  'أريد أن أكتب لك / أو اقرأ ورقة': 'I want to write / read note',

  // Alphabet
  'حرف: الألف (ا)': 'Letter: Alif (ا)',
  'حرف: الباء (ب)': 'Letter: Baa (ب)',
  'حرف: الجيم (ج)': 'Letter: Jeem (ج)',
  'حرف: الدال (د)': 'Letter: Daal (د)',
  'حرف: الميم (م)': 'Letter: Meem (م)',
  'حرف: الياء (ي)': 'Letter: Yaa (ي)',

  // Time & Numbers
  'اليوم / هذا اليوم': 'Today / This day',
  'غداً / يوم غد إن شاء الله': 'Tomorrow',
  'الآن / فوراً في هذه اللحظة': 'Now / Right now',
  'الرقم: واحد (1)': 'Number: One (1)',
  'الرقم: اثنان (2) / إشارة النصر والسلام': 'Number: Two (2) / Victory',
  'الرقم: ثلاثة (3)': 'Number: Three (3)',
  'الرقم: أربعة (4)': 'Number: Four (4)',
  'الرقم: خمسة (5)': 'Number: Five (5)',

  // Emergency & Emotions
  '🚨 نداء طوارئ عاجل! أحتاج إسعاف ونجدة فورا!': '🚨 EMERGENCY! I need immediate medical help!',
  'أحتاج استشارة طبيب متخصص': 'I need a doctor / physician',
  'أشعر بألم حاد في هذا المكان': 'I feel sharp pain here',
  'من فضلك اتصل برقم عائلتي للطوارئ': 'Please call my emergency family contact',
  'أين أقرب مستشفى أو مركز صحي؟': 'Where is the nearest hospital or clinic?',
  'أنا أحبكم وأقدركم': 'I love you',
  'أنا سعيد جداً وفرحان': 'I am very happy and glad',
  'أنا آسف، أعتذر منك': 'I am so sorry, I apologize',
  'سعيد جداً بمعرفتك ولقائك': 'Nice to meet you',
  'أنا بخير وبصحة جيدة والحمد لله': 'I am doing well, thank God'
};

// AI Compose Sentence from sequential signs
app.post('/api/ai/compose', async (req, res) => {
  try {
    const { signs, context } = req.body;
    if (!signs || !Array.isArray(signs) || signs.length === 0) {
      return res.status(400).json({ error: 'No signs provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const joinedAr = signs.map((s: any) => (typeof s === 'string' ? s : s.arabic || s.label)).join(' ');
      const joinedEn = signs.map((s: any) => {
        if (typeof s === 'object' && s.english) return s.english;
        const text = typeof s === 'string' ? s : s.arabic || s.label;
        return PHRASE_MAP[text] || text;
      }).join(' ');

      return res.json({
        composedArabic: joinedAr,
        composedEnglish: joinedEn,
        summary: 'تم تجميع الإشارات مباشرة'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an assistive AI in "Smart Glove" (القفاز الذكي), translating Arabic sign language gestures detected by wearable sensors into natural, polite, and fluent spoken sentences for non-verbal / deaf users.

Gestures detected in sequence:
${JSON.stringify(signs)}

Context: ${context || 'General conversation'}

Instructions:
1. Compose a fluent, grammatically accurate Arabic sentence in clear Modern Standard Arabic (فصحى بسيطة معبرة) suitable for Text-to-Speech audio output.
2. Provide the natural English equivalent sentence.
3. Keep the user's intent accurate and courteous.

Output JSON only:
{
  "arabic": "العبارة العربية الفصيحة المترجمة",
  "english": "Fluent English spoken phrase",
  "summary": "موضوع العبارة"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      composedArabic: parsed.arabic || signs.map((s: any) => s.arabic || s).join(' '),
      composedEnglish: parsed.english || signs.map((s: any) => s.english || s).join(' '),
      summary: parsed.summary || 'ترجمة ذكية'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/compose:', error);
    // Fallback gracefully
    const signs = req.body.signs || [];
    const joinedAr = signs.map((s: any) => (typeof s === 'string' ? s : s.arabic || s.label)).join(' ');
    const joinedEn = signs.map((s: any) => {
      if (typeof s === 'object' && s.english) return s.english;
      const text = typeof s === 'string' ? s : s.arabic || s.label;
      return PHRASE_MAP[text] || text;
    }).join(' ');
    return res.json({
      composedArabic: joinedAr || 'تم التعرف على الإشارة',
      composedEnglish: joinedEn || 'Gesture detected',
      summary: 'ترجمة محلية'
    });
  }
});

// Speech-to-Sign hearing assistant endpoint
app.post('/api/ai/speech-to-sign', async (req, res) => {
  try {
    const { spokenText } = req.body;
    if (!spokenText) {
      return res.status(400).json({ error: 'spokenText is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        simplifiedArabic: spokenText,
        english: spokenText,
        keywords: [spokenText],
        responseSuggestions: ['نعم', 'لا', 'شكراً', 'أحتاج توضيح']
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `A hearing person said to a deaf smart glove user: "${spokenText}".
Help the deaf user understand quickly:
1. Provide simplified, easily readable Arabic text (مبسط وسريع الفهم).
2. English translation.
3. Extract 2 to 4 key keywords/sign concepts.
4. Suggest 3 quick glove responses the deaf user can pick.

Output JSON only:
{
  "simplifiedArabic": "...",
  "english": "...",
  "keywords": ["...", "..."],
  "responseSuggestions": ["...", "...", "..."]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/speech-to-sign:', error);
    const spokenText = req.body.spokenText || '';
    return res.json({
      simplifiedArabic: spokenText,
      english: spokenText,
      keywords: [spokenText],
      responseSuggestions: ['نعم', 'لا', 'شكراً']
    });
  }
});

// Vite in dev or static files in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
