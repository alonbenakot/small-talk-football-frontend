export default interface User {
  id?: number,
  email: string,
  firstName: string,
  lastName: string,
  priorFootballKnowledge: boolean,
  jwt?: string
}

export interface LoginInput {
  email: string,
  password: string
}