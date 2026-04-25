import prisma from '~/../server/utils/prisma'
import { startOfDay, endOfDay, subDays, format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default defineEventHandler(async (event) => {
  try {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    const hariTerakhir = [...Array(7)]
      .map((_, i) => {
        const d = subDays(new Date(), i)
        return {
          start: startOfDay(d),
          end: endOfDay(d),
          label: format(d, 'EEE', { locale: id })
        }
      })
      .reverse()

    const [grafikData, totalKapal, totalDarat, jadwalHariIni, s1, s2, s3, recentJadwal] =
      await Promise.all([
        Promise.all(
          hariTerakhir.map(async (h) => {
            const count = await prisma.jadwal.count({
              where: {
                tanggal: { gte: h.start, lte: h.end }
              }
            })
            return { day: h.label, count }
          })
        ),
        prisma.regu.count({ where: { jenis: 'KAPAL' } }),
        prisma.regu.count({ where: { jenis: 'DARAT' } }),
        prisma.jadwal.findMany({
          where: {
            tanggal: { gte: todayStart, lte: todayEnd }
          },
          select: { reguId: true }
        }),
        prisma.jadwal.count({
          where: {
            shift: { nama: 'Shift 1' },
            tanggal: { gte: todayStart, lte: todayEnd }
          }
        }),
        prisma.jadwal.count({
          where: {
            shift: { nama: 'Shift 2' },
            tanggal: { gte: todayStart, lte: todayEnd }
          }
        }),
        prisma.jadwal.count({
          where: {
            shift: { nama: 'Shift 3' },
            tanggal: { gte: todayStart, lte: todayEnd }
          }
        }),
        prisma.jadwal.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            regu: true,
            shift: true
          }
        })
      ])

    const activities = recentJadwal.map((j) => ({
      title: `Jadwal Regu ${j.regu.nomorKRK} (${j.shift.nama}) dibuat`,
      time: formatDistanceToNow(new Date(j.createdAt), { addSuffix: true, locale: id }),
      status: j.status
    }))

    return {
      totalKapal,
      totalDarat,
      jadwalHariIni,
      grafikData,
      shiftData: {
        shift1: s1,
        shift2: s2,
        shift3: s3,
        total: s1 + s2 + s3
      },
      activities
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil statistik: ' + error.message
    })
  }
})
