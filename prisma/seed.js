const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {

  // Generazione 50 campi sportivi
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


  // --- GENERAZIONE 80 PRENOTAZIONI CASUALI, EQUAMENTE DISTRIBUITE, SENZA SOVRAPPOSIZIONI ---
  await prisma.booking.deleteMany();

  // Prendi tutti i player e tutti i campi
  const players = await prisma.player.findMany();
  const fields = await prisma.field.findMany();
  if (players.length === 0 || fields.length === 0) {
    console.log('Nessun player o campo trovato, impossibile generare prenotazioni.');
    return;
  }

  // Parametri orari
  const startHour = 8;
  const endHour = 21.5; // 21:30
  const durations = [60, 90]; // minuti
  const minuteOptions = [0, 30];

  // Mappa per evitare sovrapposizioni: { [fieldId_date]: [ {start, end} ] }
  const bookingsMap = {};
  const bookings = [];
  const today = new Date();
  // Genera prenotazioni su 10 giorni futuri
  for (let i = 0; i < 80; i++) {
    let tries = 0;
    let created = false;
    while (!created && tries < 100) {
      tries++;
      // Scegli player e campo in modo equo
      const player = players[i % players.length];
      const field = fields[i % fields.length];
      // Giorno random tra oggi e 10 giorni dopo
      const dayOffset = Math.floor(Math.random() * 10);
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);
      // Ora e minuti random validi
      const hour = startHour + Math.floor(Math.random() * ((endHour - startHour) * 2 + 1)) / 2;
      const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const start = new Date(date);
      start.setHours(Math.floor(hour), minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + duration);
      // Non superare le 23:00
      if (end.getHours() > 23 || (end.getHours() === 23 && end.getMinutes() > 0)) continue;
      // Chiave per mappa sovrapposizioni
      const key = `${field.id}_${date.toISOString().slice(0, 10)}`;
      if (!bookingsMap[key]) bookingsMap[key] = [];
      // Controlla sovrapposizioni
      const overlap = bookingsMap[key].some(b =>
        (start < b.end && end > b.start)
      );
      if (overlap) continue;
      // Ok, aggiungi
      bookingsMap[key].push({ start, end });
      bookings.push({
        startDate: start,
        endDate: end,
        playerId: player.id,
        fieldId: field.id,
      });
      created = true;
    }
    if (!created) {
      console.log(`Impossibile creare la prenotazione ${i + 1} senza sovrapposizioni.`);
    }
  }
  await prisma.booking.createMany({ data: bookings });
  console.log(`Prenotazioni create: ${bookings.length}`);

  // --- GENERAZIONE 40 PRENOTAZIONI DAL 3 FEBBRAIO IN POI, SENZA SOVRAPPOSIZIONI ---
  const bookingsMapFeb = {};
  const bookingsFeb = [];
  const startDateFeb = new Date('2026-02-03T00:00:00');
  for (let i = 0; i < 40; i++) {
    let tries = 0;
    let created = false;
    while (!created && tries < 100) {
      tries++;
      // Player e campo casuali
      const player = players[Math.floor(Math.random() * players.length)];
      const field = fields[Math.floor(Math.random() * fields.length)];
      // Giorno random dal 3 febbraio in poi (entro 10 giorni)
      const dayOffset = Math.floor(Math.random() * 10);
      const date = new Date(startDateFeb);
      date.setDate(startDateFeb.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);
      // Ora e minuti random validi
      const hour = startHour + Math.floor(Math.random() * ((endHour - startHour) * 2 + 1)) / 2;
      const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const start = new Date(date);
      start.setHours(Math.floor(hour), minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + duration);
      // Non superare le 23:00
      if (end.getHours() > 23 || (end.getHours() === 23 && end.getMinutes() > 0)) continue;
      // Chiave per mappa sovrapposizioni
      const key = `${field.id}_${date.toISOString().slice(0, 10)}`;
      if (!bookingsMapFeb[key]) bookingsMapFeb[key] = [];
      // Controlla sovrapposizioni
      const overlap = bookingsMapFeb[key].some(b =>
        (start < b.end && end > b.start)
      );
      if (overlap) continue;
      // Ok, aggiungi
      bookingsMapFeb[key].push({ start, end });
      bookingsFeb.push({
        startDate: start,
        endDate: end,
        playerId: player.id,
        fieldId: field.id,
      });
      created = true;
    }
    if (!created) {
      console.log(`Impossibile creare la prenotazione extra ${i + 1} senza sovrapposizioni.`);
    }
  }
  await prisma.booking.createMany({ data: bookingsFeb });
  console.log(`Prenotazioni extra create dal 3 febbraio: ${bookingsFeb.length}`);
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
