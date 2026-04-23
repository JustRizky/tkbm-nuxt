import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const allRegu = await prisma.regu.findMany({
      orderBy: {
        id: 'desc'
      }
    })

    return {
      status: 'success',
      data: allRegu
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal mengambil data regu'
    })
  }
})
