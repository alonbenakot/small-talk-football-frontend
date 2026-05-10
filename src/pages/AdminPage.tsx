import {motion} from "motion/react";
import Button from "../components/ui/button/Button.tsx";
import {useState} from "react";
import useApi from "../utils/hooks/use-api.ts";
import {
  deleteFixtures,
  deleteTeams,
  fetchFixtures,
  initArticles,
  initCheatCards,
  initTeams
} from "../utils/api/http.ts";
import ConfirmationNotification from "../components/ui/modals/ConfirmationNotification.tsx";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const titleVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

type AdminButton = {
  label: string;
  confirmText: string;
  apiCall: () => Promise<unknown>;
};

const AdminPage = () => {
  const [activeNotification, setActiveNotification] = useState<AdminButton | null>(null);
  const { invokeApi: callInitArticles, isLoading: isInitArticlesLoading } = useApi(initArticles);
  const { invokeApi: callInitCheatCards, isLoading: isInitCheatCardsLoading } = useApi(initCheatCards);
  const { invokeApi: callInitTeams, isLoading: isInitTeamsLoading } = useApi(initTeams);
  const { invokeApi: callFetchFixtures, isLoading: isFetchFixturesLoading } = useApi(fetchFixtures);
  const { invokeApi: callDeleteTeams, isLoading: isDeleteTeamsLoading } = useApi(deleteTeams);
  const { invokeApi: callDeleteFixtures, isLoading: isDeleteFixturesLoading } = useApi(deleteFixtures);

  const isLoading = isInitArticlesLoading || isInitCheatCardsLoading || isInitTeamsLoading || 
                    isFetchFixturesLoading || isDeleteTeamsLoading || isDeleteFixturesLoading;

  const buttonList: AdminButton[] = [
    {
      label: "Initialize Articles",
      confirmText: "Are you sure you want to initialize articles? This will populate the database with default articles.",
      apiCall: callInitArticles
    },
    {
      label: "Initialize Cheat Cards",
      confirmText: "Are you sure you want to initialize cheat cards? This will populate the database with default cheat cards.",
      apiCall: callInitCheatCards
    },
    {
      label: "Initialize Teams",
      confirmText: "Are you sure you want to initialize teams? This will populate the database with team data.",
      apiCall: callInitTeams
    },
    {
      label: "Fetch Fixtures",
      confirmText: "Are you sure you want to fetch fixtures? This will retrieve the latest fixture data from the external API.",
      apiCall: callFetchFixtures
    },
    {
      label: "Delete Teams",
      confirmText: "Are you sure you want to delete all teams? This action cannot be undone.",
      apiCall: callDeleteTeams
    },
    {
      label: "Delete Fixtures",
      confirmText: "Are you sure you want to delete all fixtures? This action cannot be undone.",
      apiCall: callDeleteFixtures
    },
  ];

  const handleButtonClick = (button: AdminButton) => {
    setActiveNotification(button);
  };

  const handleConfirm = async () => {
    if (activeNotification) {
      await activeNotification.apiCall();
      setActiveNotification(null);
    }
  };

  const handleCancel = () => {
    setActiveNotification(null);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-slate-300 text-center mb-6"
        variants={titleVariants}
      >
        Admin Dashboard
      </motion.h2>

      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {buttonList.map((button, index) => (
            <motion.div
              key={button.label}
              variants={buttonVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                buttonType="primary"
                onClick={() => handleButtonClick(button)}
                className="w-full"
              >
                {button.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {activeNotification && (
        <ConfirmationNotification
          isOpen={!!activeNotification}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={activeNotification.label}
          text={activeNotification.confirmText}
          isLoading={isLoading}
        />
      )}
    </motion.div>
  );
};

export default AdminPage;
