import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Regu diperlukan untuk menghapus data'
    })
  }

  try {
    await prisma.regu.delete({
      where: { id: Number(id) }
    })

    return {
      status: 'success',
      message: `Regu dengan ID ${id} berhasil dihapus`
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menghapus data'
    })
  }
})
