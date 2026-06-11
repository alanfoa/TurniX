import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("admin123", 10);

  // --- USERS ---
  const admin = await prisma.user.create({
    data: { email: "admin@turnix.com", password, name: "Admin TurniX", role: "ADMIN" },
  });

  const client1 = await prisma.user.create({
    data: { email: "cliente@turnix.com", password, name: "Cliente Demo", role: "CLIENT" },
  });

  const client2 = await prisma.user.create({
    data: { email: "cliente2@turnix.com", password, name: "Juan Pérez", role: "CLIENT" },
  });

  const client3 = await prisma.user.create({
    data: { email: "maria@turnix.com", password, name: "María García", role: "CLIENT" },
  });

  const client4 = await prisma.user.create({
    data: { email: "pedro@turnix.com", password, name: "Pedro López", role: "CLIENT" },
  });

  const clients = [client1, client2, client3, client4];

  // --- PROFESSIONALS ---
  const prof1 = await prisma.professional.create({
    data: {
      name: "Dr. García",
      specialty: "Corte y Barbería",
      imageUrl: "https://ui-avatars.com/api/?name=Dr.+Garcia&background=6366f1&color=fff&size=128",
      userId: client1.id,
    },
  });

  const prof2 = await prisma.professional.create({
    data: {
      name: "Dra. López",
      specialty: "Manicuría",
      imageUrl: "https://ui-avatars.com/api/?name=Dra.+Lopez&background=ec4899&color=fff&size=128",
      userId: client2.id,
    },
  });

  const prof3 = await prisma.professional.create({
    data: {
      name: "Carlos Martínez",
      specialty: "Corte y Barba",
      imageUrl: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=14b8a6&color=fff&size=128",
      userId: client3.id,
    },
  });

  const prof4 = await prisma.professional.create({
    data: {
      name: "Ana Rodríguez",
      specialty: "Tratamientos Capilares",
      imageUrl: "https://ui-avatars.com/api/?name=Ana+Rodriguez&background=f97316&color=fff&size=128",
      userId: client4.id,
    },
  });

  const professionals = [prof1, prof2, prof3, prof4];

  // --- SERVICES ---
  await prisma.service.createMany({
    data: [
      { name: "Corte de cabello", description: "Corte clásico o moderno", durationMinutes: 30, price: 1500 },
      { name: "Manicuría completa", description: "Limpieza, corte y esmaltado", durationMinutes: 60, price: 2500 },
      { name: "Barba y perfilado", description: "Arreglo de barba con navaja", durationMinutes: 20, price: 1000 },
      { name: "Corte + Barba", description: "Combo corte y arreglo de barba", durationMinutes: 50, price: 2200 },
      { name: "Tratamiento Capilar", description: "Hidratación y nutrición profunda", durationMinutes: 45, price: 3000 },
    ],
  });

  const services = await prisma.service.findMany();

  // --- AVAILABILITY ---
  type AvailInput = { professionalId: number; dayOfWeek: number; startTime: string; endTime: string };

  const allAvails: AvailInput[] = [];
  // prof1: Mon-Fri 09-13, 14-18
  for (const day of [1, 2, 3, 4, 5]) {
    allAvails.push({ professionalId: prof1.id, dayOfWeek: day, startTime: "09:00", endTime: "13:00" });
    allAvails.push({ professionalId: prof1.id, dayOfWeek: day, startTime: "14:00", endTime: "18:00" });
  }
  // prof2: Mon-Sat 10-17
  for (const day of [1, 2, 3, 4, 5, 6]) {
    allAvails.push({ professionalId: prof2.id, dayOfWeek: day, startTime: "10:00", endTime: "17:00" });
  }
  // prof3: Mon-Fri 08-12, 15-20
  for (const day of [1, 2, 3, 4, 5]) {
    allAvails.push({ professionalId: prof3.id, dayOfWeek: day, startTime: "08:00", endTime: "12:00" });
    allAvails.push({ professionalId: prof3.id, dayOfWeek: day, startTime: "15:00", endTime: "20:00" });
  }
  // prof4: Tue-Sat 09-16
  for (const day of [2, 3, 4, 5, 6]) {
    allAvails.push({ professionalId: prof4.id, dayOfWeek: day, startTime: "09:00", endTime: "16:00" });
  }
  await prisma.availability.createMany({ data: allAvails });

  // --- HISTORICAL APPOINTMENTS (last 30 days) ---
  const today = new Date();
  const appointmentsToCreate: Array<{
    date: Date;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    price: number;
    status: "CONFIRMED" | "CANCELLED";
    userId: number;
    professionalId: number;
    serviceId: number;
  }> = [];

  for (let daysAgo = 1; daysAgo <= 30; daysAgo++) {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    const dayOfWeek = date.getDay();

    // Find professionals with availability on this day
    const availForDay = allAvails.filter((a) => a.dayOfWeek === dayOfWeek);
    if (availForDay.length === 0) continue;

    // Generate 1-3 appointments per day
    const numAppts = randomInt(1, 3);
    for (let a = 0; a < numAppts; a++) {
      const avail = pick(availForDay);
      const service = pick(services);

      const availStart = timeToMinutes(avail.startTime);
      const availEnd = timeToMinutes(avail.endTime);

      // Ensure service fits within availability
      const maxStart = availEnd - service.durationMinutes;
      if (maxStart < availStart) continue;

      // Pick a random start time aligned to 15-min increments
      const slotsCount = Math.floor((maxStart - availStart) / 15);
      if (slotsCount <= 0) continue;
      const slotStart = availStart + randomInt(0, slotsCount) * 15;
      const startMin = slotStart;
      const endMin = slotStart + service.durationMinutes;

      // Check no overlap with already-planned appointments for this prof on this date
      const hasOverlap = appointmentsToCreate.some(
        (ap) =>
          ap.professionalId === avail.professionalId &&
          ap.date.getTime() === date.getTime() &&
          startMin < timeToMinutes(ap.endTime) &&
          endMin > timeToMinutes(ap.startTime),
      );
      if (hasOverlap) continue;

      const client = pick(clients);
      const status = Math.random() < 0.2 ? "CANCELLED" as const : "CONFIRMED" as const;

      appointmentsToCreate.push({
        date,
        startTime: minutesToTime(startMin),
        endTime: minutesToTime(endMin),
        durationMinutes: service.durationMinutes,
        price: service.price,
        status,
        userId: client.id,
        professionalId: avail.professionalId,
        serviceId: service.id,
      });
    }
  }

  // Batch insert appointments
  for (const apt of appointmentsToCreate) {
    await prisma.appointment.create({ data: apt });
  }

  console.log("Seed completed");
  console.log(`  Admin: admin@turnix.com / admin123`);
  console.log(`  Clients: cliente@turnix.com, cliente2@turnix.com, maria@turnix.com, pedro@turnix.com / admin123`);
  console.log(`  Professionals: ${professionals.length}`);
  console.log(`  Services: ${services.length}`);
  console.log(`  Availability blocks: ${allAvails.length}`);
  console.log(`  Historical appointments: ${appointmentsToCreate.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
