import {useState} from "react";
import {useLoaderData} from "react-router-dom";
import {PlayerLoaderOutput} from "../routes/loaders/PlayerLoader.ts";
import {useLangStore} from "../store/store.ts";
import {getPlayerOneLiner} from "../utils/api/http.ts";
import OneLinerGenerator from "../components/features/one-liners/OneLinerGenerator.tsx";
import PlayerOneLiner, {PlayerFacts as PlayerFactsModel} from "../components/features/players/models/PlayerOneLiner.ts";
import PlayerHeader from "../components/features/players/PlayerHeader.tsx";
import PlayerFacts from "../components/features/players/PlayerFacts.tsx";

const PlayerPage = () => {
  const {teamId, player} = useLoaderData<PlayerLoaderOutput>();
  const {selectedLang} = useLangStore();
  const [facts, setFacts] = useState<PlayerFactsModel | null>(null);

  const fetchOneLiner = () => getPlayerOneLiner({playerId: player.id, lang: selectedLang});

  return (
      <div className="min-h-screen flex justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <PlayerHeader player={player}/>


          <OneLinerGenerator<PlayerOneLiner, never>
              title="Get a line about him"
              options={[]}
              submitLabel="What do I say about him?"
              fetchOneLiner={fetchOneLiner}
              getText={(data) => data.oneLiner.text}
              onResult={(data) => setFacts(data.facts)}
              autoFetch
              backLabel="Back to squad"
              backTo={`/teams/${teamId}`}
          />

          {facts && <PlayerFacts facts={facts}/>}
        </div>
      </div>
  );
};

export default PlayerPage;
