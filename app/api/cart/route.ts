export const runtime = 'nodejs'

import { z } from 'zod'
import { getCartRepo } from '@/lib/cartRepo'
import { cartItemSchema } from '@/repositories/cartRepo.mock'

export async function GET() {
  try {
    const repo = getCartRepo()
    const items = repo.getAll()
    return Response.json({ success: true, cart: items }, { status: 200 })
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

    const repo = getCartRepo()
    const res = repo.add(newItem)

    if (res === 'DuplicateItem') {
      return Response.json(
        { success: false, error: 'Duplicate item added' },
        { status: 409 }
      )
    }

    if (res === 'InvalidItem') {
      return Response.json(
        { success: false, error: 'InvalidItem' },
        { status: 400 }
      )
    }

    return Response.json(
      { success: true, cart: repo.getAll() },
      { status: 201 }
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
      {
        success: false,
        error: 'ServerError',
      },
      { status: 500 }
    )
  }
}
