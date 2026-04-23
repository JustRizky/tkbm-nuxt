import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, nomorKRK, jenis, namaKepala, totalAnggota } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Regu diperlukan untuk update'
    })
  }

  try {
    const updatedRegu = await prisma.regu.update({
      where: { id: Number(id) },
      data: {
        nomorKRK,
        jenis,
        namaKepala,
        totalAnggota: Number(totalAnggota)
      }
    })

    return {
      status: 'success',
      message: 'Data regu berhasil diperbarui',
      data: updatedRegu
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal mengupdate data'
    })
  }
})
