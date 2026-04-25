import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, username, password, reguId } = body

  const regu = await prisma.regu.findUnique({
    where: { id: Number(reguId) },
    include: { _count: { select: { anggota: true } } }
  })

  if (!regu) throw createError({ statusCode: 404, statusMessage: 'Regu tidak ada' })

  if (regu._count.anggota >= regu.totalAnggota) {
    throw createError({
      statusCode: 400,
      statusMessage: `Gagal! Kuota maksimal regu ini adalah ${regu.totalAnggota} orang.`
    })
  }

  const newAnggota = await prisma.user.create({
    data: {
      name,
      username,
      password,
      role: 'ANGGOTA',
      reguId: Number(reguId)
    }
  })

  return { message: 'Anggota berhasil ditambahkan', data: newAnggota }
})
