import { cart } from '../route'
import { z } from 'zod'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const param = await params
    const { quantity } = z.object({ quantity: z.number().min(1) }).parse(data)
    const itemId = param.id
    const itemIndex = cart.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return Response.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    cart[itemIndex].quantity = quantity

    return Response.json(
      { success: true, cart: cart[itemIndex] },
      { status: 200 }
    )
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
      { success: false, error: 'An unexpected error occurred' },
      { status: 501 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id
    const itemIndex = cart.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return Response.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    cart.splice(itemIndex, 1)

    return Response.json(
      { success: true, msg: 'successfully deleted' },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
