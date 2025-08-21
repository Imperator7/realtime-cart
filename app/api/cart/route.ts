import { cart, cartItemSchema } from '@/lib/cart'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    return Response.json({ success: true, cart: cart }, { status: 200 })
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newItem = cartItemSchema.parse(data)

    cart.push(newItem)

    return Response.json({ success: true, cart: cart }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: 'Invalid data provided',
          details: error,
        },
        { status: 400 }
      )
    }

    return Response.json(
      {
        success: false,
        error: 'Failed to add item to the cart',
      },
      { status: 500 }
    )
  }
}
