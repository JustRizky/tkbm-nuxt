import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const [totalJadwal, totalKapal, totalDarat] = await Promise.all([
    prisma.jadwal.count({
      where: { tanggal: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    }),
    prisma.regu.count({ where: { jenis: 'KAPAL' } }),
    prisma.regu.count({ where: { jenis: 'DARAT' } })
  ])

  return {
    totalJadwal,
    totalKapal,
    totalDarat,
    totalReguAktif: await prisma.jadwal
      .groupBy({
        by: ['reguId'],
        where: { tanggal: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      })
      .then((res) => res.length)
  }
})
