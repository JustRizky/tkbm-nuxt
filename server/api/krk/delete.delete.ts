import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Anggota harus disertakan'
    })
  }

  try {
    await prisma.user.delete({
      where: { id: Number(id) }
    })

    return { message: 'Anggota berhasil dihapus' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menghapus data dari database'
    })
  }
})
