import { z } from 'zod'

export const cartItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
})

export const cartSchema = z.array(cartItemSchema)

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = ReadonlyArray<CartItem>

type AddResult = CartItem | 'InvalidItem' | 'DuplicateItem'
type UpdateResult = CartItem | 'NotFound' | 'InvalidQuantity'
type DeleteResult = CartItem | 'NotFound'

interface CartRepo {
  getAll: () => Cart
  add: (item: CartItem) => AddResult
  update: (name: string, quantity: number) => UpdateResult
  delete: (name: string) => DeleteResult
}

export const createMockCartRepo = (): CartRepo => {
  const mockCart: CartItem[] = []
  const deepClone = (i: CartItem): CartItem => ({ ...i })

  return {
    getAll: () => mockCart.map(deepClone),
    add: (item: CartItem) => {
      const parsed = cartItemSchema.safeParse(item)
      if (!parsed.success) return 'InvalidItem'
      if (
        mockCart.filter((itemCart) => itemCart.name === item.name).length !== 0
      )
        return 'DuplicateItem'
      mockCart.push(parsed.data)
      return deepClone(parsed.data)
    },
    update: (name: string, quantity: number) => {
      if (quantity < 1) {
        return 'InvalidQuantity'
      }
      console.log(name)
      const targetIndex = mockCart.findIndex(
        (item: CartItem) => item.name === name
      )

      if (targetIndex === -1) {
        return 'NotFound'
      }

      mockCart[targetIndex].quantity = quantity
      return deepClone(mockCart[targetIndex])
    },
    delete: (name: string) => {
      const targetIndex = mockCart.findIndex((item) => item.name === name)
      if (targetIndex === -1) return 'NotFound'

      const removedItem = mockCart.splice(targetIndex, 1)[0]
      return removedItem
    },
  }
}
