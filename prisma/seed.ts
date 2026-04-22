import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- Memulai Seeding User ---')

  const users = [
    {
      username: 'admin',
      password: 'password123',
      name: 'admin',
      role: 'ADMIN'
    },
    {
      username: 'pengurus',
      password: 'password123',
      name: 'pengurus',
      role: 'PENGURUS'
    },
    {
      username: 'krk01',
      password: 'password123',
      name: 'krk',
      role: 'KRK'
    },
    {
      username: 'anggota01',
      password: 'password123',
      name: 'anggota',
      role: 'ANGGOTA'
    }
  ]

  for (const user of users) {
    const result = await prisma.user.upsert({
      where: { username: user.username },
      update: {}, // Jika user sudah ada, tidak diubah
      create: {
        username: user.username,
        password: user.password,
        name: user.name,
        role: user.role as any
      }
    })
    console.log(`✅ User created/checked: ${result.username} (${result.role})`)
  }

  console.log('--- Seeding Selesai ---')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
