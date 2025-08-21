import { z } from 'zod'

export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive(),
})

export const cartSchema = z.array(cartItemSchema)

export let cart: z.infer<typeof cartSchema> = [
  { id: '1', name: 'burger', quantity: 1, price: 20 },
]
