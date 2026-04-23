import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const updated = await prisma.shift.update({
      where: { id: Number(body.id) },
      data: {
        nama: body.nama,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        status: body.status
      }
    })
    return { status: 'success', data: updated }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal update shift' })
  }
})
