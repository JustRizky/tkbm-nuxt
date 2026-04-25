import { z } from 'zod'
import prisma from '~/../server/utils/prisma'

const reguCreateSchema = z.object({
  nomorKRK: z.string().min(1, 'Nomor KRK wajib diisi'),
  jenis: z.enum(['KAPAL', 'DARAT']),
  namaKepala: z.string().min(3, 'Nama kepala minimal 3 karakter'),
  totalAnggota: z.number().min(0).default(0),
  usernameKRK: z.string().min(3, 'Username minimal 3 karakter'),
  passwordKRK: z.string().min(6, 'Password minimal 6 karakter')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validation = reguCreateSchema.safeParse(body)

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Data yang dikirim tidak valid',
        data: validation.error.flatten().fieldErrors
      })
    }

    const { nomorKRK, jenis, namaKepala, totalAnggota, usernameKRK, passwordKRK } = validation.data

    const result = await prisma.$transaction(async (tx) => {
      const regu = await tx.regu.create({
        data: {
          nomorKRK,
          jenis,
          namaKepala,
          totalAnggota
        }
      })

      const user = await tx.user.create({
        data: {
          username: usernameKRK,
          password: passwordKRK,
          name: namaKepala,
          role: 'KRK',
          reguId: regu.id
        }
      })

      return { regu, user }
    })

    return {
      status: 'success',
      message: 'Regu dan Akun KRK berhasil ditambahkan!',
      data: result.regu
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target || ''
      throw createError({
        statusCode: 409,
        statusMessage: target.includes('username')
          ? 'Username sudah digunakan!'
          : `Nomor KRK sudah terdaftar!`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Terjadi kesalahan pada server'
    })
  }
})
