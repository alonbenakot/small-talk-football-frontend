import {ChevronLeft, ChevronRight} from 'lucide-react';
import {motion} from 'motion/react';
import {DateUtils} from '../../../utils/DateUtils';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableDates: Date[];
}

/**
 * DateNavigator component provides UI controls for navigating between dates
 * with available fixtures. Displays relative labels (Today, Yesterday, Tomorrow)
 * or DD/MM/YY format for distant dates.
 */
const DateNavigator = ({ selectedDate, onDateChange, availableDates }: DateNavigatorProps) => {
  const currentIndex = availableDates.findIndex(date =>
    DateUtils.isSameDay(date, selectedDate)
  );

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < availableDates.length - 1 && currentIndex !== -1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onDateChange(availableDates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onDateChange(availableDates[currentIndex + 1]);
    }
  };

  const dateLabel = availableDates.length === 0
    ? 'No Matches' 
    : DateUtils.getRelativeDateLabel(selectedDate);

  return (
    <motion.div
      className="flex justify-center items-center mt-3 mb-1"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl shadow-sm">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || availableDates.length === 0}
          className={`p-1 rounded transition duration-300 ${
            hasPrevious && availableDates.length > 0
              ? 'text-emerald-600 hover:bg-white cursor-pointer'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Previous date"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-sm font-semibold text-gray-900 min-w-[100px] text-center">
          {dateLabel}
        </span>

        <button
          onClick={handleNext}
          disabled={!hasNext || availableDates.length === 0}
          className={`p-1 rounded transition duration-300 ${
            hasNext && availableDates.length > 0
              ? 'text-emerald-600 hover:bg-white cursor-pointer'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Next date"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default DateNavigator;
