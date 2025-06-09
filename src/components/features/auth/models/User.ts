export default interface User {
  id?: number,
  email: string,
  firstName: string,
  lastName: string,
  priorFootballKnowledge: boolean,
  userIndications: UserIndications,
  jwt?: string
}

interface UserIndications {
  pendingArticles: boolean
}
