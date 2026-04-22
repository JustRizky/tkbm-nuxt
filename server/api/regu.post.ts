export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const newRegu = await prisma.regu.create({
      data: {
        nomor_krk: body.nomor_krk,
        nama_krk: body.nama_krk,
        tipe: body.jenis.toUpperCase() as 'KAPAL' | 'DARAT',
        jumlah_anggota: body.jumlah_anggota
      }
    })
    return newRegu
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
