import SubjectButtons from "../components/ui/subject-buttons/SubjectButtons.tsx";
import Matches from "../components/features/matches/Matches.tsx";
import {useLoaderData} from "react-router-dom";
import {MatchesLoaderOutput} from "../routes/loaders/MatchesLoader.ts";
import {useEffect, useMemo, useState} from "react";
import {motion} from "motion/react";
import DateNavigator from "../components/ui/date-navigator/DateNavigator.tsx";
import {DateUtils} from "../utils/DateUtils.ts";
import MatchModel from "../components/features/matches/models/MatchModel.ts";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * Extracts unique dates from fixtures for a given competition.
 * Normalizes each matchDateTime to midnight in local timezone.
 * Returns sorted array (ascending).
 */
const extractAvailableDates = (fixtures: MatchModel[], competition: string): Date[] => {
  const datesSet = new Set<number>();
  fixtures
    .filter(match => match.competition.toLowerCase() === competition.toLowerCase())
    .forEach(match => {
      const matchDate = new Date(match.matchDateTime);

      if (!isNaN(matchDate.getTime())) {
        const midnight = DateUtils.toMidnight(matchDate);
        datesSet.add(midnight.getTime());
      } else {
        console.warn(`Invalid matchDateTime for match ${match.id}:`, match.matchDateTime);
      }
    });

  return Array.from(datesSet)
    .sort((a, b) => a - b)
    .map(timestamp => new Date(timestamp));
}

const MatchesPage = () => {
  const { data: matchesResponse } = useLoaderData<MatchesLoaderOutput>();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
      matchesResponse.competitions[0]
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    DateUtils.toMidnight(new Date())
  );

  const availableDates = useMemo(() => {
    return extractAvailableDates(matchesResponse.fixtures, selectedCompetition);
  }, [matchesResponse.fixtures, selectedCompetition]);

  // synchronize selected date when competition changes
  useEffect(() => {
    const dateExists = availableDates.some(date =>
      DateUtils.isSameDay(date, selectedDate)
    );
    
    if (!dateExists && availableDates.length > 0) {
      const nearestDate = DateUtils.findNearestDate(selectedDate, availableDates);
      if (nearestDate) {
        setSelectedDate(nearestDate);
      }
    }
    // if availableDates is empty, keep current selectedDate (edge case handling)
  }, [selectedCompetition, availableDates, selectedDate]);

  return (
      <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
      >
        <motion.div
            className="text-center mb-8"
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.6}}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
            Recent Matches
          </h1>
          <p className="text-slate-400 text-lg">
            Get AI-powered conversation starters for any match
          </p>
        </motion.div>

        <SubjectButtons
            subjects={matchesResponse.competitions}
            selectedSubject={selectedCompetition}
            handleSubjectChange={setSelectedCompetition}
        />

        <DateNavigator
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            availableDates={availableDates}
        />

        <Matches
            matches={matchesResponse.fixtures}
            selectedCompetition={selectedCompetition}
            selectedDate={selectedDate}
        />
      </motion.div>
  );
};

export default MatchesPage;
