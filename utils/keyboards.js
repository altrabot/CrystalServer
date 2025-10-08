// Utility untuk membuat inline keyboard
const { Markup } = require('telegraf');

// Keyboard menu utama
const mainMenuKeyboard = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🛠️ Order Bot', 'order_bot'),
      Markup.button.callback('💖 Donasi', 'donasi')
    ],
    [
      Markup.button.callback('👥 Join Group', 'join_group'),
      Markup.button.callback('📢 Join Channel', 'join_channel')
    ]
  ]);
};

// Keyboard pilihan paket bot
const packageSelectionKeyboard = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('💎 Paket Basic - Rp15.000', 'package_basic'),
      Markup.button.callback('🔮 Paket Pro - Rp30.000', 'package_pro')
    ],
    [
      Markup.button.callback('🚀 Paket Premium - Rp50.000', 'package_premium')
    ],
    [
      Markup.button.callback('🔙 Kembali ke Menu Utama', 'back_to_main')
    ]
  ]);
};

// Keyboard untuk donasi
const donationKeyboard = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.url('💳 Donasi via QRIS', 'https://i.postimg.cc/Pq300qFJ/Screenshot-20251008-195611.jpg')
    ],
    [
      Markup.button.callback('🔙 Kembali ke Menu Utama', 'back_to_main')
    ]
  ]);
};

// Keyboard untuk join group/channel
const socialKeyboard = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.url('👥 Join Group', 'https://t.me/+IyZGky3EYoVlMWVl'),
      Markup.button.url('📢 Join Channel', 'https://t.me/CrystalAiAgent')
    ],
    [
      Markup.button.callback('🔙 Kembali ke Menu Utama', 'back_to_main')
    ]
  ]);
};

module.exports = {
  mainMenuKeyboard,
  packageSelectionKeyboard,
  donationKeyboard,
  socialKeyboard
};
