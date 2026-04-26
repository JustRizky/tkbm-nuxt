import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID diperlukan untuk menghapus data.'
    })
  }

  try {
    const checkStatus = await prisma.izinKerja.findUnique({
      where: { id: Number(id) }
    })

    if (!checkStatus) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data tidak ditemukan.'
      })
    }

    if (checkStatus.status !== 'Menunggu Persetujuan') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Tidak bisa menghapus izin yang sudah diproses.'
      })
    }

    await prisma.izinKerja.delete({
      where: { id: Number(id) }
    })

    return {
      statusCode: 200,
      message: 'Pengajuan izin berhasil dibatalkan/dihapus'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan pada server.'
    })
  }
})
