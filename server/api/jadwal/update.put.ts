import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID Jadwal wajib diisi'
      })
    }

    const updatedJadwal = await prisma.jadwal.update({
      where: {
        id: Number(body.id)
      },
      data: {
        namaKapal: body.namaKapal,
        status: body.status
      }
    })

    return {
      success: true,
      message: 'Jadwal berhasil diperbarui',
      data: updatedJadwal
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data jadwal tidak ditemukan'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Terjadi kesalahan pada server'
    })
  }
})
