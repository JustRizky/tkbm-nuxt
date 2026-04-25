import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const data = await prisma.izinKerja.findMany({
      orderBy: {
        tanggal: 'desc'
      },
      include: {
        regu: true
      }
    })

    return {
      status: 'success',
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
