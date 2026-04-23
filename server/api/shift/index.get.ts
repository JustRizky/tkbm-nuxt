import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: { id: 'asc' }
    })
    return { status: 'success', data: shifts }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
