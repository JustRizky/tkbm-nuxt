import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user || !user.reguId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Anda tidak terdaftar dalam regu manapun.'
    })
  }

  try {
    const regu = await prisma.regu.findUnique({
      where: {
        id: Number(user.reguId)
      },
      include: {
        _count: {
          select: { anggota: true }
        },
        anggota: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true
          }
        }
      }
    })

    if (!regu) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Data regu tidak ditemukan di database.'
      })
    }

    return {
      data: regu
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan pada server.'
    })
  }
})
