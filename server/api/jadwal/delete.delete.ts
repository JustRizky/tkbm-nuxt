import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID Jadwal wajib diisi untuk menghapus'
      })
    }

    await prisma.jadwal.delete({
      where: {
        id: Number(body.id)
      }
    })

    return {
      success: true,
      message: 'Data jadwal berhasil dihapus'
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data jadwal sudah tidak ada'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Gagal menghapus data'
    })
  }
})
