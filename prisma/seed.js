const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Crea 50 campi con nomi, immagini e luoghi credibili assegnati casualmente agli owner
    const fieldNames = [
      'Arena Centrale', 'Stadio Nord', 'Parco Sud', 'Campo Ovest', 'Green Hills', 'River Side', 'Sunset Arena',
      'City Arena', 'Lakeside', 'Stadium', 'East Park', 'Forest Field', 'Golden Field', 'Blue Arena', 'Red Stadium',
      'Silver Park', 'Mountain Field', 'Village Arena', 'Beach Field', 'Urban Arena', 'Royal Stadium', 'Sunrise Park',
      'West Arena', 'Central Field', 'Liberty Arena', 'Victory Park', 'Dream Field', 'Star Stadium', 'Sky Arena',
      'Ocean Park', 'Sunshine Field', 'Thunder Arena', 'Windy Park', 'Crystal Field', 'Shadow Stadium', 'Fire Arena',
      'Ice Park', 'Emerald Field', 'Diamond Arena', 'Platinum Park', 'Amber Field', 'Pearl Stadium', 'Coral Arena',
      'Ruby Park', 'Sapphire Field', 'Opal Arena', 'Topaz Park', 'Onyx Field', 'Quartz Arena', 'Zenith Park'
    ];
    const locations = [
      'Centro Città', 'Zona Nord', 'Zona Sud', 'Zona Ovest', 'Colline', 'Lungo Fiume', 'Zona Est', 'Centro', 'Lago',
      'Stadio', 'Bosco', 'Quartiere Oro', 'Zona Blu', 'Zona Rossa', 'Zona Argento', 'Montagna', 'Villaggio', 'Spiaggia',
      'Zona Urbana', 'Zona Reale', 'Zona Alba', 'Zona Ovest', 'Centro', 'Quartiere Verde', 'Zona Industriale', 'Zona Antica',
      'Zona Nuova', 'Zona Porto', 'Zona Aeroporto', 'Zona Mercato', 'Zona Fiera', 'Zona Università', 'Zona Sportiva',
      'Zona Residenziale', 'Zona Commerciale', 'Zona Artigiana', 'Zona Marina', 'Zona Collinare', 'Zona Panoramica',
      'Zona Centrale', 'Zona Periferica', 'Zona Monumentale', 'Zona Parco', 'Zona Giardino', 'Zona Piazza', 'Zona Castello',
      'Zona Museo', 'Zona Teatro', 'Zona Biblioteca', 'Zona Torre'
    ];
    const sizes = ['5v5', '7v7', '9v9'];
    const imageUrls = ['/images/field-1.svg', '/images/field-2.svg', '/images/field-3.svg'];

    const owners = await prisma.owner.findMany();
    for (let i = 0; i < 50; i++) {
      const name = fieldNames[i % fieldNames.length];
      const location = locations[i % locations.length];
      const size = sizes[i % sizes.length];
      const imageUrl = imageUrls[i % imageUrls.length];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      // Evita duplicati per nome e ownerId
      const existing = await prisma.field.findFirst({ where: { name, ownerId: owner.id } });
      if (!existing) {
        await prisma.field.create({
          data: {
            name,
            size,
            location,
            imageUrl,
            ownerId: owner.id,
          },
        });
      }
    }
  const password = await bcrypt.hash('Password123!', 10);

  // Crea manualmente 24 proprietari
  const ownerNames = [
    'Giulio', 'Martina', 'Sofia', 'Alessia', 'Davide', 'Sara', 'Lorenzo', 'Chiara', 'Marta', 'Valerio',
    'Elena', 'Fabio', 'Ilaria', 'Giorgio', 'Francesca', 'Alberto', 'Veronica', 'Stefania', 'Claudio', 'Roberta',
    'Michela', 'Stefano', 'Giuliana', 'Alessandro'
  ];

  for (const name of ownerNames) {
    await prisma.user.upsert({
      where: { email: `${name.toLowerCase()}@gmail.com` },
      update: {},
      create: {
        name,
        email: `${name.toLowerCase()}@gmail.com`,
        passwordHash: password,
        role: 'OWNER',
        owner: { create: {} },
      },
      include: { owner: true },
    });
  }

  // Crea manualmente 30 giocatori
  const playerNames = [
    'Luca', 'Giovanni', 'Francesco', 'Matteo', 'Alessandro', 'Andrea', 'Gabriele', 'Leonardo', 'Davide', 'Riccardo',
    'Tommaso', 'Federico', 'Giuseppe', 'Antonio', 'Simone', 'Emanuele', 'Christian', 'Samuele', 'Filippo', 'Alberto',
    'Stefano', 'Michele', 'Daniele', 'Nicola', 'Pietro', 'Salvatore', 'Marco', 'Roberto', 'Paolo', 'Enrico'
  ];

  for (const name of playerNames) {
    await prisma.user.upsert({
      where: { email: `${name.toLowerCase()}@gmail.com` },
      update: {},
      create: {
        name,
        email: `${name.toLowerCase()}@gmail.com`,
        passwordHash: password,
        role: 'PLAYER',
        player: { create: {} },
      },
      include: { player: true },
    });
  }

  const playerUser = await prisma.user.upsert({
    where: { email: 'alex@gmail.com' },
    update: {},
    create: {
      name: 'Alex',
      email: 'alex@gmail.com',
      passwordHash: password,
      role: 'PLAYER',
      player: { create: {} },
    },
    include: { player: true },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'marco.rossi@gmail.com' },
    update: {},
    create: {
      name: 'Marco',
      email: 'marco.rossi@gmail.com',
      passwordHash: password,
      role: 'OWNER',
      owner: { create: {} },
    },
    include: { owner: true },
  });

  await prisma.user.upsert({
    where: { email: 'massimo.rizzi@gmail.com' },
    update: {},
    create: {
      name: 'Massimo Rizzi',
      email: 'massimo.rizzi@gmail.com',
      passwordHash: password,
      role: 'ADMIN',
      admin: { create: {} },
    },
  });

  const field1 = await prisma.field.upsert({
    where: { id: 1 },
    update: {
      name: 'Central Park Field 1',
      size: '5v5',
      location: 'Centro Città',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Central Park Field 1',
      size: '5v5',
      location: 'Centro Città',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  const field2 = await prisma.field.upsert({
    where: { id: 2 },
    update: {
      name: 'River Side Field 2',
      size: '7v7',
      location: 'Zona Nord',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'River Side Field 2',
      size: '7v7',
      location: 'Zona Nord',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 3 },
    update: {
      name: 'Arena Field 3',
      size: '9v9',
      location: 'Zona Sud',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Arena Field 3',
      size: '9v9',
      location: 'Zona Sud',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 4 },
    update: {
      name: 'Green Hills Field 4',
      size: '5v5',
      location: 'Zona Ovest',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Green Hills Field 4',
      size: '5v5',
      location: 'Zona Ovest',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 5 },
    update: {
      name: 'City Arena Field 5',
      size: '7v7',
      location: 'Centro',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'City Arena Field 5',
      size: '7v7',
      location: 'Centro',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 6 },
    update: {
      name: 'Lakeside Field 6',
      size: '9v9',
      location: 'Lago',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Lakeside Field 6',
      size: '9v9',
      location: 'Lago',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 7 },
    update: {
      name: 'Riverside Field 7',
      size: '5v5',
      location: 'Zona Nord',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Riverside Field 7',
      size: '5v5',
      location: 'Zona Nord',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 8 },
    update: {
      name: 'Sunset Field 8',
      size: '7v7',
      location: 'Zona Est',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Sunset Field 8',
      size: '7v7',
      location: 'Zona Est',
      imageUrl: '/images/field-2.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 9 },
    update: {
      name: 'Stadium Field 9',
      size: '9v9',
      location: 'Stadio',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'Stadium Field 9',
      size: '9v9',
      location: 'Stadio',
      imageUrl: '/images/field-3.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.field.upsert({
    where: { id: 10 },
    update: {
      name: 'East Park Field 10',
      size: '5v5',
      location: 'Zona Est',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
    create: {
      name: 'East Park Field 10',
      size: '5v5',
      location: 'Zona Est',
      imageUrl: '/images/field-1.svg',
      ownerId: ownerUser.owner.id,
    },
  });

  await prisma.booking.deleteMany();
  await prisma.booking.createMany({
    data: [
      {
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 26),
        playerId: playerUser.player.id,
        fieldId: field1.id,
      },
      {
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 50),
        playerId: playerUser.player.id,
        fieldId: field2.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
