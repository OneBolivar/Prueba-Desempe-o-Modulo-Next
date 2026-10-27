import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Iniciando la siembra de datos (seed)...");

  // Limpiar datos existentes para evitar duplicados al reejecutar
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuario Administrador con contraseña cifrada
  const hashedPasswordAdmin = await bcrypt.hash("Admin123*", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Administrador CoSpace",
      email: "admin@cospace.com",
      password: hashedPasswordAdmin,
      role: Role.ADMIN,
    },
  });
  console.log(`Usuario Administrador creado: ${adminUser.email}`);

  // Crear usuario regular de prueba
  const hashedPasswordUser = await bcrypt.hash("User123*", 10);
  const regularUser = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      email: "usuario@cospace.com",
      password: hashedPasswordUser,
      role: Role.USER,
    },
  });
  console.log(`Usuario estándar creado: ${regularUser.email}`);

  // Crear catálogo inicial de espacios
  const spacesData = [
    {
      name: "Escritorio Individual Focus A",
      description: "Puesto de trabajo ergonómico individual en zona silenciosa con conexión de alta velocidad.",
      type: "Escritorio",
      capacity: 1,
      pricePerHour: 15000,
      imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      name: "Escritorio Compartido Colab B",
      description: "Espacio amplio para trabajo individual en mesa compartida, ideal para networking.",
      type: "Escritorio",
      capacity: 1,
      pricePerHour: 12000,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      name: "Sala de Juntas Boardroom Alpha",
      description: "Sala ejecutiva con pantalla 4K para presentaciones, pizarra de cristal y mesa para 8 personas.",
      type: "Sala de reuniones",
      capacity: 8,
      pricePerHour: 60000,
      imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      name: "Sala de Ideación Creativa",
      description: "Sala dinámica pensada para sesiones de brainstorming y talleres en equipo.",
      type: "Sala de reuniones",
      capacity: 6,
      pricePerHour: 45000,
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      name: "Cabina Acústica Privada Silence 1",
      description: "Cabina insonorizada individual para videollamadas, entrevistas y podcasts.",
      type: "Cabina",
      capacity: 1,
      pricePerHour: 20000,
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      name: "Cabina Dúo Conferencia 2",
      description: "Cabina cerrada con aislamiento de ruido diseñada para llamadas de hasta 2 personas.",
      type: "Cabina",
      capacity: 2,
      pricePerHour: 28000,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
  ];

  for (const space of spacesData) {
    await prisma.space.create({ data: space });
  }

  console.log(`Se han sembrado ${spacesData.length} espacios de coworking.`);
}

main()
  .catch((e) => {
    console.error("Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });