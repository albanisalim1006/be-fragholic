'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ambil id kategori yang sudah ada
    const kategoris = await queryInterface.sequelize.query(
      'SELECT id, nama_kategori FROM Kategoris',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const getId = (nama) => kategoris.find(k => k.nama_kategori === nama)?.id

    await queryInterface.bulkInsert('Produks', [
      // Niche
      {
        kategori_id: getId('Niche'),
        nama_produk: 'Blackout Parfums',
        deskripsi: 'Aroma woody dan smoky yang kuat, cocok untuk malam hari. Top notes: Black Pepper. Middle: Oud. Base: Musk.',
        harga: 450000, stok: 25, foto: null,
        merek: 'Maison Noir', ukuran_ml: 50, gender: 'pria',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Niche'),
        nama_produk: 'Rose De Mai',
        deskripsi: 'Bunga mawar premium dari Grasse, Prancis. Lembut, feminin, dan tahan lama sepanjang hari.',
        harga: 580000, stok: 15, foto: null,
        merek: 'Fleur Atelier', ukuran_ml: 50, gender: 'wanita',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Niche'),
        nama_produk: 'Santal 33',
        deskripsi: 'Ikon parfum unisex modern. Perpaduan kayu cendana, kulit, dan violet yang ikonik.',
        harga: 750000, stok: 10, foto: null,
        merek: 'Le Labo', ukuran_ml: 100, gender: 'unisex',
        createdAt: new Date(), updatedAt: new Date()
      },

      // Designer
      {
        kategori_id: getId('Designer'),
        nama_produk: 'Bleu de Chanel',
        deskripsi: 'Parfum pria ikonik dari Chanel. Segar, woody, dan elegan untuk segala kesempatan.',
        harga: 920000, stok: 20, foto: null,
        merek: 'Chanel', ukuran_ml: 100, gender: 'pria',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Designer'),
        nama_produk: 'Miss Dior Blooming Bouquet',
        deskripsi: 'Aroma floral segar khas wanita muda. Peony, white musk, dan rose yang ringan dan ceria.',
        harga: 850000, stok: 18, foto: null,
        merek: 'Dior', ukuran_ml: 100, gender: 'wanita',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Designer'),
        nama_produk: 'Hugo Boss The Scent',
        deskripsi: 'Woody oriental yang sensual. Cocok untuk pria aktif dan percaya diri.',
        harga: 350000, stok: 48, foto: null,
        merek: 'Hugo Boss', ukuran_ml: 100, gender: 'pria',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Designer'),
        nama_produk: 'Coco Mademoiselle',
        deskripsi: 'Parfum wanita klasik dengan sentuhan modern. Oriental floral yang timeless.',
        harga: 1100000, stok: 8, foto: null,
        merek: 'Chanel', ukuran_ml: 50, gender: 'wanita',
        createdAt: new Date(), updatedAt: new Date()
      },

      // Lokal
      {
        kategori_id: getId('Lokal'),
        nama_produk: 'Tanah Airku No.3',
        deskripsi: 'Terinspirasi dari alam Indonesia. Aroma pandan, melati, dan kayu manis yang hangat.',
        harga: 185000, stok: 40, foto: null,
        merek: 'Surga Wangi', ukuran_ml: 30, gender: 'unisex',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Lokal'),
        nama_produk: 'Laut Biru',
        deskripsi: 'Segar seperti angin pantai. Aquatic woody yang cocok untuk aktivitas sehari-hari.',
        harga: 145000, stok: 55, foto: null,
        merek: 'Nusantara Scent', ukuran_ml: 30, gender: 'pria',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Lokal'),
        nama_produk: 'Melati Putih',
        deskripsi: 'Bunga melati asli Indonesia yang diracik menjadi parfum feminin yang lembut dan natural.',
        harga: 165000, stok: 35, foto: null,
        merek: 'Kebun Wangi', ukuran_ml: 30, gender: 'wanita',
        createdAt: new Date(), updatedAt: new Date()
      },

      // Timur Tengah
      {
        kategori_id: getId('Timur Tengah'),
        nama_produk: 'Oud Al Layl',
        deskripsi: 'Oud pekat dengan sentuhan mawar dan amber. Ketahanan luar biasa hingga 12 jam.',
        harga: 480000, stok: 12, foto: null,
        merek: 'Al Haramain', ukuran_ml: 50, gender: 'unisex',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Timur Tengah'),
        nama_produk: 'Amber Musk Arabian',
        deskripsi: 'Perpaduan amber hangat dan musk putih. Cocok untuk suasana santai dan romantis.',
        harga: 320000, stok: 30, foto: null,
        merek: 'Arabian Oud', ukuran_ml: 50, gender: 'unisex',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        kategori_id: getId('Timur Tengah'),
        nama_produk: 'Dehn Al Oud',
        deskripsi: 'Oud murni dari Kalimantan yang diolah dengan tradisi Arab. Sangat langka dan prestisius.',
        harga: 850000, stok: 5, foto: null,
        merek: 'Ajmal', ukuran_ml: 12, gender: 'pria',
        createdAt: new Date(), updatedAt: new Date()
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Produks', null, {})
  }
}