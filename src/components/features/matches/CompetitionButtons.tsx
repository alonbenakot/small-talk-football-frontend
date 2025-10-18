type Props = {
  competitions: string[];
}
const CompetitionButtons = ({competitions}: Props) => {
  return (
    <ul>
      { competitions?.map(competition =>
        <li key={competition}>
          { competition }
        </li>
      )
      }
    </ul>
  )
}
export default CompetitionButtons;