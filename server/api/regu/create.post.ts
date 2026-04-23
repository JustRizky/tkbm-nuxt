import { z } from 'zod'
import prisma from '~/../server/utils/prisma'

const reguCreateSchema = z.object({
  nomorKRK: z.string().min(1, 'Nomor KRK wajib diisi'),
  jenis: z.enum(['KAPAL', 'DARAT']),
  namaKepala: z.string().min(3, 'Nama kepala minimal 3 karakter'),
  totalAnggota: z.number().min(0).default(0)
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

    const { nomorKRK, jenis, namaKepala, totalAnggota } = validation.data

    const newRegu = await prisma.regu.create({
      data: {
        nomorKRK,
        jenis,
        namaKepala,
        totalAnggota
      }
    })

    return {
      status: 'success',
      message: 'Regu berhasil ditambahkan!',
      data: newRegu
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: `Nomor KRK ${error.meta?.target} sudah terdaftar!`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Terjadi kesalahan pada server'
    })
  }
})
