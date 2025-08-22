import { z } from "zod";

export const cartItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
});

export const cartSchema = z.array(cartItemSchema);

type CartItem = z.infer<typeof cartItemSchema>;
type Cart = z.infer<typeof cartSchema>;

type AddResult = CartItem | "InvalidItem";
type UpdateResult = CartItem | "NotFound" | "InvalidInput";
type DeleteResult = Cart | "NotFound";

interface CartRepo {
  getAll: () => Cart;
  add: (item: CartItem) => AddResult;
  update: (name: string, quantity: number) => UpdateResult;
  delete: (name: string) => DeleteResult;
}

export const createMockCartRepo = (): CartRepo => {
  const mockCart: Cart = [];

  return {
    getAll: () => [...mockCart] as const,
    add: (item: CartItem) => {
      const parsed = cartItemSchema.safeParse(item);
      if (!parsed.success) return "InvalidItem";
      mockCart.push(parsed.data);
      return parsed.data;
    },
    update: (name: string, quantity: number) => {
      if (quantity < 1) {
        return "InvalidInput";
      }
      const targetIndex = mockCart.findIndex(
        (item: CartItem) => item.name === name
      );

      if (targetIndex !== -1) {
        mockCart[targetIndex].quantity = quantity;
        return mockCart[targetIndex];
      }

      return "NotFound";
    },
    delete: (name: string) => {
      const targetIndex = mockCart.findIndex((item) => item.name === name);
      if (targetIndex === -1) return "NotFound";

      mockCart.splice(targetIndex, 1);
      return [...mockCart] as const;
    },
  };
};
