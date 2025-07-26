export default interface User {
  id?: number,
  email: string,
  firstName: string,
  lastName: string,
  priorFootballKnowledge: boolean,
  userIndications: UserIndications,
  role: 'MEMBER' | 'ADMIN',
  jwt?: string
}

interface UserIndications {
  pendingArticles: boolean
}
