import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userAuth = getCookie(event, 'user_auth')
  if (!userAuth) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi' })
  }

  const user = JSON.parse(userAuth)

  if (!user.reguId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User tidak terdaftar dalam regu manapun.'
    })
  }

  const body = await readBody(event)
  if (!body.alasan) {
    throw createError({ statusCode: 400, statusMessage: 'Alasan harus diisi' })
  }

  try {
    const newIzin = await prisma.izinKerja.create({
      data: {
        reguId: Number(user.reguId),
        alasan: body.alasan,
        status: 'Menunggu Persetujuan',
        tanggal: new Date()
      }
    })

    return {
      status: 'success',
      data: newIzin
    }
  } catch (error) {
    console.error('Prisma Create Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan data ke database' })
  }
})
