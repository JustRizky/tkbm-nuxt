import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status } = body

  if (!id || !status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID dan Status harus diisi'
    })
  }

  try {
    const updatedIzin = await prisma.izinKerja.update({
      where: { id: id },
      data: {
        status: status // 'Disetujui' atau 'Ditolak'
      }
    })

    return {
      status: 'success',
      message: `Izin berhasil ${status}`,
      data: updatedIzin
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memperbarui status izin'
    })
  }
})
