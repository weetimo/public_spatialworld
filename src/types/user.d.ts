import { Gender, UserRole } from '../enums'

export interface User {
  id: string
  ageGroup: string
  email: string
  gender: Gender
  name: string
  postalCode: string
  role: UserRole
}
