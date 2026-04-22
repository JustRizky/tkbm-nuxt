import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const [totalKapal, totalDarat, totalRegu, totalUser] = await Promise.all([
      prisma.user.count({ where: { role: 'KRK' } }),
      prisma.user.count({ where: { role: 'ANGGOTA' } }),
      prisma.regu.count(),
      prisma.user.count()
    ])

    return {
      totalKapal,
      totalDarat,
      totalRegu,
      totalUser
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil statistik: ' + error.message
    })
  }
})
