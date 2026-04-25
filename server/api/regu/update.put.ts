import prisma from '~/../server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 1. Ambil input akun dari body
  const { id, nomorKRK, jenis, namaKepala, totalAnggota, usernameKRK, passwordKRK } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID Regu diperlukan' })
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 2. Update Regu
      const updatedRegu = await tx.regu.update({
        where: { id: Number(id) },
        data: {
          nomorKRK,
          jenis,
          namaKepala,
          totalAnggota: Number(totalAnggota)
        }
      })

      // 3. Update Akun (User) yang terikat dengan Regu ini
      // Kita siapkan data yang mau diupdate
      const userData: any = {
        name: namaKepala,
        username: usernameKRK
      }

      // Hanya update password jika admin mengisi field password di form
      if (passwordKRK && passwordKRK.trim() !== '') {
        userData.password = passwordKRK
      }

      await tx.user.updateMany({
        where: {
          reguId: Number(id),
          role: 'KRK'
        },
        data: userData
      })

      return {
        status: 'success',
        message: 'Data regu dan akun berhasil diperbarui',
        data: updatedRegu
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Nomor KRK atau Username sudah digunakan!'
      })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
