export default interface SquadPlayer {
  id: string,
  name: string,
  image: string,
  number: string,
  position: string,
  injured: boolean,
  matchesPlayed: number | null
}
