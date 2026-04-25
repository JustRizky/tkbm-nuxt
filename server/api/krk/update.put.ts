import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)
  const { id, name, username, password } = body

  if (!user || !user.reguId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak.'
    })
  }

  try {
    const existingMember = await prisma.user.findFirst({
      where: {
        id: Number(id),
        reguId: Number(user.reguId)
      }
    })

    if (!existingMember) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Anggota tidak ditemukan di regu Anda.'
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: name || existingMember.name,
        username: username || existingMember.username,
        ...(password && { password: password })
      }
    })

    return {
      status: 'success',
      message: 'Data anggota berhasil diperbarui',
      data: updatedUser
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal memperbarui data'
    })
  }
})
