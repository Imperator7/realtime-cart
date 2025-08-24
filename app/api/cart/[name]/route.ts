import { z } from 'zod'
import { getCartRepo } from '@/lib/cartRepo'

export async function PUT(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { quantity } = z
      .object({ quantity: z.number().int().min(1) })
      .parse(await request.json())

    const param = await params
    const itemName = param.name
    console.log(param)

    const repo = getCartRepo()
    console.log(itemName)
    const res = repo.update(itemName, quantity)

    if (res === 'NotFound') {
      return Response.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    if (res === 'InvalidQuantity') {
      return Response.json(
        {
          success: false,
          error: 'Quantity has to be more than 0.',
        },
        { status: 400 }
      )
    }

    return Response.json({ success: true, cart: res }, { status: 200 })
  } catch (error) {
    console.error(error)

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
      { success: false, error: 'An unexpected error occurred', details: error },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const itemName = params.name
    const repo = getCartRepo()
    const cart = repo.getAll()
    console.log(cart)
    const itemIndex = cart.findIndex((item) => item.name === itemName)

    if (itemIndex === -1) {
      return Response.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    repo.delete(itemName)

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
