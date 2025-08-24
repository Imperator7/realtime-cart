import { createMockCartRepo } from '@/repositories/cartRepo.mock'

const g = globalThis as unknown as {
  __cartRepo?: ReturnType<typeof createMockCartRepo>
}

const isProd = process.env.NODE_ENV === 'production'

const repo = isProd
  ? createMockCartRepo()
  : (g.__cartRepo ??= createMockCartRepo())

export function getCartRepo() {
  return repo
}

export function resetCartRepoForTests() {
  delete g.__cartRepo
}
