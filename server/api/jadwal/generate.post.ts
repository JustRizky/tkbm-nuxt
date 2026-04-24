import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const jumlahKebutuhan = body.jumlah || 1

    const sekarang = new Date()
    const jamMenitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes()

    const shiftAktif = await prisma.shift.findMany({ where: { status: 'AKTIF' } })
    const shiftSekarang = shiftAktif.find((s) => {
      const [hM, mM] = (s.jamMulai || '00:00').split(':').map(Number)
      const [hS, mS] = (s.jamSelesai || '00:00').split(':').map(Number)
      const mulai = (hM ?? 0) * 60 + (mM ?? 0)
      let selesai = (hS ?? 0) * 60 + (mS ?? 0)
      if (selesai < mulai) return jamMenitSekarang >= mulai || jamMenitSekarang <= selesai
      return jamMenitSekarang >= mulai && jamMenitSekarang <= selesai
    })

    if (!shiftSekarang) {
      throw createError({ statusCode: 400, statusMessage: 'Tidak ada shift berjalan saat ini.' })
    }

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const jadwalEksisting = await prisma.jadwal.findMany({
      where: {
        shiftId: shiftSekarang.id,
        tanggal: {
          gte: startOfToday,
          lte: endOfToday
        }
      },
      select: { reguId: true }
    })

    const idReguSibuk = jadwalEksisting.map((j) => j.reguId)

    const reguKapalTersedia = await prisma.regu.findMany({
      where: {
        jenis: 'KAPAL',
        id: { notIn: idReguSibuk }
      },
      orderBy: { lastUsed: 'asc' }
    })

    const reguDaratTersedia = await prisma.regu.findMany({
      where: {
        jenis: 'DARAT',
        id: { notIn: idReguSibuk }
      },
      orderBy: { lastUsed: 'asc' }
    })

    const limit = Math.min(jumlahKebutuhan, reguKapalTersedia.length, reguDaratTersedia.length)

    if (limit === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Semua regu sudah ditugaskan untuk ${shiftSekarang.nama} hari ini.`
      })
    }

    const createdJadwal = []

    for (let i = 0; i < limit; i++) {
      const rKapal = reguKapalTersedia[i]!
      const rDarat = reguDaratTersedia[i]!

      const jKapal = await prisma.jadwal.create({
        data: {
          reguId: rKapal.id,
          shiftId: shiftSekarang.id,
          jenis: 'KAPAL',
          status: 'Aanvraag',
          tanggal: sekarang
        }
      })
      await prisma.regu.update({ where: { id: rKapal.id }, data: { lastUsed: new Date() } })
      createdJadwal.push(jKapal)

      const jDarat = await prisma.jadwal.create({
        data: {
          reguId: rDarat.id,
          shiftId: shiftSekarang.id,
          jenis: 'DARAT',
          status: 'Aanvraag',
          tanggal: sekarang
        }
      })
      await prisma.regu.update({ where: { id: rDarat.id }, data: { lastUsed: new Date() } })
      createdJadwal.push(jDarat)
    }

    return {
      success: true,
      message: `Berhasil menambahkan ${limit} gang ke ${shiftSekarang.nama}`,
      data: createdJadwal
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message
    })
  }
})
