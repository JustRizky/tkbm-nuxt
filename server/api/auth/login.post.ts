import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Username atau Password salah'
    })
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  }
})
