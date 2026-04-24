import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const data = await prisma.jadwal.findMany({
    include: {
      regu: true,
      shift: true
    },
    orderBy: {
      tanggal: 'desc'
    },
    where: query.search
      ? {
          OR: [
            { regu: { namaKepala: { contains: String(query.search) } } },
            { namaKapal: { contains: String(query.search) } }
          ]
        }
      : {}
  })

  return { data }
})
