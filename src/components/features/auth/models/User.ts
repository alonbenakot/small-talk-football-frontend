export enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export default interface User {
  id?: number,
  email: string,
  firstName: string,
  lastName: string,
  priorFootballKnowledge: boolean,
  userIndications: UserIndications,
  role: UserRole,
  jwt?: string
}

interface UserIndications {
  pendingArticles: boolean
}
