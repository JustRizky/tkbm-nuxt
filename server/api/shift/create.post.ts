import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const newShift = await prisma.shift.create({
      data: {
        nama: body.nama,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        status: body.status || 'AKTIF'
      }
    })
    return { status: 'success', data: newShift }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menambah shift' })
  }
})
