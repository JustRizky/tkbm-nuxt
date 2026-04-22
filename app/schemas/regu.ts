import { z } from 'zod'

export const reguSchema = z.object({
  nomor_krk: z.string().min(1, 'Nomor KRK wajib diisi'),
  nama_krk: z.string().min(3, 'Nama minimal 3 karakter'),
  jenis: z.enum(['Kapal', 'Darat']),
  jumlah_anggota: z.number().min(1, 'Minimal 1 orang').max(50)
})
