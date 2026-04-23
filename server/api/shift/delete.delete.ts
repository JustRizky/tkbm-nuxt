import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    await prisma.shift.delete({
      where: { id: Number(body.id) }
    })
    return { status: 'success', message: 'Shift dihapus' }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus shift' })
  }
})
