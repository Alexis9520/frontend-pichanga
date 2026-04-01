import type { User } from '@/types'

export interface DemoUser extends User {
  password: string
  venueName?: string
}

export const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'owner@pichanga.pe',
    password: 'demo1234',
    fullName: 'Pedro Ramos',
    phone: '999888777',
    role: 'owner',
    status: 'active',
    venueName: 'Complejo Los Campeones',
    avatarUrl: undefined,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-20T14:30:00.000Z',
  },
  {
    id: '2',
    email: 'carlos@futbol.pe',
    password: 'cancha123',
    fullName: 'Carlos Mendoza',
    phone: '998765432',
    role: 'owner',
    status: 'active',
    venueName: 'Canchas El Triunfo',
    avatarUrl: undefined,
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-03-18T11:00:00.000Z',
  },
  {
    id: '3',
    email: 'admin@pichanga.pe',
    password: 'admin1234',
    fullName: 'Admin Principal',
    phone: '999999999',
    role: 'admin',
    status: 'active',
    avatarUrl: undefined,
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2026-03-25T09:00:00.000Z',
  },
]

export function findDemoUser(email: string, password: string): DemoUser | null {
  return (
    demoUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    ) || null
  )
}

export function getDemoCredentialsText(): string {
  return demoUsers
    .filter((user) => user.role === 'owner')
    .map((user) => `${user.email} / ${user.password}`)
    .join('\n')
}