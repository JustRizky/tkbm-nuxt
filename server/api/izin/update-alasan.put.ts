import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, alasan } = body

  if (!id || !alasan) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID dan Alasan harus diisi.'
    })
  }

  const existingIzin = await prisma.izinKerja.findUnique({
    where: { id: Number(id) }
  })

  if (!existingIzin) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Data izin tidak ditemukan.'
    })
  }

  if (existingIzin.status !== 'Menunggu Persetujuan') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Izin yang sudah diproses tidak dapat diubah.'
    })
  }

  try {
    const updatedIzin = await prisma.izinKerja.update({
      where: { id: Number(id) },
      data: { alasan }
    })

    return {
      statusCode: 200,
      message: 'Alasan berhasil diperbarui',
      data: updatedIzin
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memperbarui database.'
    })
  }
})
