const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

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
