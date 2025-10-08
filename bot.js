require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const OpenAIService = require('./services/openai');
const GeminiService = require('./services/gemini');
const { 
  mainMenuKeyboard, 
  packageSelectionKeyboard, 
  donationKeyboard, 
  socialKeyboard 
} = require('./utils/keyboards');

// Inisialisasi bot dengan token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Inisialisasi services
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY);
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);

// Variabel konstan
const OWNER_INFO = {
  username: process.env.OWNER_USERNAME || '@ProjectCrystal',
  phone: process.env.OWNER_PHONE || '087898680815'
};

const PACKAGE_INFO = {
  basic: {
    name: '💎 Paket Basic',
    price: 'Rp15.000',
    features: [
      'Bot sederhana dengan tombol interaktif',
      'Respon otomatis & menu utama',
      'Siap dipakai di grup atau personal'
    ]
  },
  pro: {
    name: '🔮 Paket Pro',
    price: 'Rp30.000',
    features: [
      'Semua fitur Basic',
      'Custom tampilan & perintah tambahan',
      'Integrasi API sederhana (misalnya data, link, dll)'
    ]
  },
  premium: {
    name: '🚀 Paket Premium',
    price: 'Rp50.000',
    features: [
      'Semua fitur Pro',
      'Integrasi OpenAI & Gemini (Veo 3)',
      'Dukungan prioritas & pengaturan tampilan eksklusif'
    ]
  }
};

// ===== HANDLER UTAMA =====

// Start command - Menu utama
bot.start(async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  const welcomeMessage = `👋 Hai, ${username}!
Selamat datang di 💎 Crystal AI Agent, asisten virtual cerdas yang siap bantu kamu menciptakan berbagai jenis bot Telegram dengan cepat, mudah, dan hasil yang elegan! 🤖✨

Aku hadir buat kamu yang ingin punya bot keren entah itu untuk bisnis, komunitas, promosi, atau sekadar hiburan pribadi. Dengan sistem yang dirancang profesional, kamu tinggal pilih paket, jelaskan idemu, dan biarkan kami wujudkan bot impianmu! 💼

Melalui Crystal AI Agent, kamu juga bisa berinteraksi dengan AI bertenaga OpenAI untuk ngobrol seputar ide, inspirasi, atau sekadar curhat ringan 💬. Dan kalau kamu suka berkreasi, fitur Gemini (Veo 3) siap bantu kamu membuat gambar dan video dari deskripsi yang kamu berikan 🎨🎥.

Kami percaya bahwa teknologi seharusnya mempermudah hidup, bukan mempersulitnya dan itulah alasan Crystal AI Agent dibuat.
Terima kasih sudah mampir! 💫
Ayo mulai perjalananmu bersama Crystal AI Agent sekarang 🚀
Jadi, yuk jelajahi semua fitur kami lewat tombol di bawah ini 👇`;

  await ctx.reply(welcomeMessage, mainMenuKeyboard());
});

// ===== HANDLER CALLBACK QUERY =====

// Handler untuk callback queries (tombol inline)
bot.action('order_bot', async (ctx) => {
  const orderMessage = `Pilih Paket Pembuatan Bot Telegram Kamu!

Terima kasih sudah tertarik untuk membuat bot bersama Crystal AI Agent 💎
Kami menawarkan tiga pilihan paket yang bisa kamu sesuaikan dengan kebutuhan dan budget kamu.
Semua paket sudah termasuk panduan penggunaan serta dukungan teknis dasar dari tim kami 🤝
✨ Berikut pilihan paketnya:`;

  await ctx.editMessageText(orderMessage, packageSelectionKeyboard());
});

bot.action('donasi', async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  const donationMessage = `Hai, ${username}! 👋
Kalau kamu merasa bot ini bermanfaat, yuk bantu kami terus berkembang lewat donasi kecilmu 💎

Setiap donasi yang kamu berikan akan dipakai untuk:
🤖 Pengembangan fitur baru
🧠 Pemeliharaan server & API
✨ Peningkatan performa dan tampilan bot

Tak peduli besar atau kecilnya, setiap dukungan kamu sangat berarti buat kami 🙏
Terima kasih sudah jadi bagian dari perjalanan Crystal AI Agent 💫`;

  // Kirim gambar QRIS terlebih dahulu
  await ctx.replyWithPhoto('https://i.postimg.cc/Pq300qFJ/Screenshot-20251008-195611.jpg', {
    caption: donationMessage,
    ...donationKeyboard()
  });
});

bot.action('join_group', async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  const groupMessage = `Hai, ${username}! 🤗
Yuk gabung ke Grup Resmi Crystal AI Agent 🎯
Di sana kamu bisa:
💬 Berdiskusi langsung seputar pembuatan bot Telegram
🤖 Berbagi ide & pengalaman dengan pengguna lain
🧩 Dapat tips dan trik eksklusif seputar AI & pengembangan bot

Temukan komunitas yang seru, aktif, dan saling membantu di sini 👇`;

  await ctx.editMessageText(groupMessage, socialKeyboard());
});

bot.action('join_channel', async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  const channelMessage = `Halo juga, ${username}! 🚀
Jangan cuma ngobrol di grup — kamu juga wajib bergabung ke Channel Resmi Crystal AI Agent biar gak ketinggalan update penting 😎

Melalui channel ini, kamu akan dapat:
📰 Informasi & pembaruan fitur terbaru
🎁 Promo & event spesial
💡 Insight menarik tentang AI dan pengembangan bot

Klik link di bawah ini dan stay updated setiap hari 👇`;

  await ctx.editMessageText(channelMessage, socialKeyboard());
});

// Handler untuk pilihan paket
bot.action('package_basic', async (ctx) => {
  await sendPackageInfo(ctx, 'basic');
});

bot.action('package_pro', async (ctx) => {
  await sendPackageInfo(ctx, 'pro');
});

bot.action('package_premium', async (ctx) => {
  await sendPackageInfo(ctx, 'premium');
});

// Fungsi helper untuk mengirim info paket
async function sendPackageInfo(ctx, packageType) {
  const package = PACKAGE_INFO[packageType];
  const featuresText = package.features.map(feature => `➡️ ${feature}`).join('\n');
  
  const packageMessage = `
${package.name} – ${package.price}
${featuresText}

Silakan hubungi admin untuk proses pembuatan bot 👇

Kontak Admin: ${OWNER_INFO.username} atau klik untuk chat langsung ke nomor WhatsApp ${OWNER_INFO.phone}`;

  await ctx.editMessageText(packageMessage, Markup.inlineKeyboard([
    [
      Markup.button.url('💬 Chat Admin', `https://t.me/${OWNER_INFO.username.replace('@', '')}`),
      Markup.button.url('📱 WhatsApp', `https://wa.me/${OWNER_INFO.phone.replace('+', '')}`)
    ],
    [
      Markup.button.callback('🔙 Kembali ke Pilihan Paket', 'order_bot')
    ]
  ]));
}

// Handler kembali ke menu utama
bot.action('back_to_main', async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  const welcomeMessage = `👋 Hai, ${username}!
Selamat datang kembali di 💎 Crystal AI Agent!

Apa yang ingin kamu eksplorasi hari ini? ✨`;

  await ctx.editMessageText(welcomeMessage, mainMenuKeyboard());
});

// ===== HANDLER FITUR AI =====

// Handler untuk perintah /ai
bot.command('ai', async (ctx) => {
  const question = ctx.message.text.replace('/ai', '').trim();
  
  if (!question) {
    return ctx.reply('Silakan tulis pertanyaan setelah perintah /ai\nContoh: /ai Bagaimana cara membuat bot Telegram?');
  }

  // Kirim pesan "typing"
  await ctx.sendChatAction('typing');

  try {
    const response = await openAIService.generateResponse(question);
    await ctx.reply(`🤖 **Crystal AI Response:**\n\n${response}`);
  } catch (error) {
    await ctx.reply('❌ Maaf, terjadi kesalahan saat memproses permintaan AI. Silakan coba lagi beberapa saat.');
  }
});

// Handler untuk perintah /gemini
bot.command('gemini', async (ctx) => {
  const description = ctx.message.text.replace('/gemini', '').trim();
  
  if (!description) {
    return ctx.reply('Silakan tulis deskripsi setelah perintah /gemini\nContoh: /gemini sunset di pantai dengan pohon kelapa');
  }

  // Kirim pesan "typing"
  await ctx.sendChatAction('typing');

  try {
    const result = await geminiService.generateImage(description);
    
    if (result.type === 'text') {
      await ctx.reply(result.content);
    } else {
      await ctx.replyWithPhoto(result.content, {
        caption: `🎨 **Hasil generasi untuk:** "${description}"`
      });
    }
  } catch (error) {
    await ctx.reply('❌ Maaf, terjadi kesalahan saat memproses permintaan Gemini. Silakan coba lagi beberapa saat.');
  }
});

// Handler untuk pesan teks biasa (fallback)
bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  
  // Jika bukan command, arahkan ke menu utama
  if (!message.startsWith('/')) {
    await ctx.reply(
      'Hai! 👋 Gunakan tombol menu di bawah untuk menjelajahi fitur Crystal AI Agent, atau gunakan perintah:\n\n' +
      '🤖 `/ai <pertanyaan>` - Chat dengan AI\n' +
      '🎨 `/gemini <deskripsi>` - Generate gambar/video\n\n' +
      'Atau pilih opsi dari menu:',
      mainMenuKeyboard()
    );
  }
});

// ===== ERROR HANDLING =====

// Handler error global
bot.catch((err, ctx) => {
  console.error(`Error untuk update ${ctx.update.update_id}:`, err);
  ctx.reply('❌ Maaf, terjadi kesalahan sistem. Silakan coba lagi beberapa saat.');
});

// ===== START BOT =====

// Fungsi untuk memulai bot
async function startBot() {
  try {
    console.log('🚀 Starting Crystal AI Agent Bot...');
    
    // Mulai bot
    await bot.launch();
    console.log('✅ Crystal AI Agent Bot successfully started!');
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Jalankan bot
startBot();

module.exports = bot;
