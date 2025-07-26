export interface LoginInput {
  email: string,
  password: string
}

export interface SignUpInput {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  priorFootballKnowledge: boolean,
}

export interface AddArticleInput {
  title: string,
  author: string,
  text: string,
}