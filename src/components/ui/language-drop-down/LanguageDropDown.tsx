import Flag from "react-flagkit";
import {useLangStore} from "../../../store/store.ts";
import useOutsideClick from "../../../utils/hooks/outside-click.tsx";
import {useState} from "react";
import Notification from "../modals/Notification.tsx";
import Button from "../button/Button.tsx";
import {Lang} from "../../features/language/Lang.ts";
import {Location, useLocation} from "react-router-dom";

const chineseMsg = "The Chinese language is not supported at this time, nor do we have any plans to support it in the future."

interface FlagOption {
  country: string;
  label: string;
  lang?: Lang;
  onClick?: () => void;
  className?: string;
}

const COUNTRY_CODES: Record<Lang, string> = {
  [Lang.AMERICAN]: 'US',
  [Lang.BRITISH]: 'GB',
  [Lang.HEBREW]: 'IL'
}

const filterOptions = (flagOptions: FlagOption[], location: Location) => {
  return location.pathname.includes('cheat-cards')
      ? flagOptions.filter(option => option.lang !== Lang.HEBREW)
      : flagOptions;
}

const LanguageDropDown = () => {
  const [isChinese, setIsChinese] = useState<boolean>(false);
  const {isOpen, setIsOpen, elementRef} = useOutsideClick<HTMLDivElement>();
  const {selectedLang, dispatchToggleLang} = useLangStore();
  const location = useLocation();

  const handleDropDownClicked = () => {
    setIsOpen(prevState => !prevState);
  }

  const handleFlagClicked = (lang: Lang) => {
    dispatchToggleLang(lang);
    setIsOpen(false);
  }

  const handleForbiddenFlagClicked = () => {
    setIsOpen(false);
    setIsChinese(true);
  };

  let flagOptions: FlagOption[] = [
    {
      country: "US",
      label: "American",
      lang: Lang.AMERICAN,
      className: "rounded-t"
    },
    {
      country: "GB",
      label: "British",
      lang: Lang.BRITISH
    }, {
      country: "IL",
      label: "Hebrew",
      lang: Lang.HEBREW
    },
    {
      country: "CN",
      label: "Chinese",
      onClick: handleForbiddenFlagClicked,
      className: "rounded-b border-t-1 border-slate-400/50"
    }
  ];

  flagOptions = filterOptions(flagOptions, location);

  return (
      <div ref={elementRef} className="relative inline-block bg-zinc-800">
        <button
            className="flex items-center px-4 py-2 text-slate-300 bg-zinc-800 rounded transform transform-400 cursor-pointer hover:bg-zinc-700"
            onClick={handleDropDownClicked}>
          <span>Language</span>
          <Flag country={COUNTRY_CODES[selectedLang]} className="mx-2 bg-transparent"/>
        </button>

        {isOpen &&
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-white shadow-lg rounded z-50">
              {flagOptions.map(({country, label, lang, onClick, className}) => (
                  <div key={country} className={`hover:bg-gray-200 ${className || ''}`}>
                    <button
                        className="flex items-center p-2 cursor-pointer w-full"
                        onClick={() => lang ? handleFlagClicked(lang) : onClick?.()}
                    >
                      <Flag country={country} className="mr-2"/>
                      {label}
                    </button>
                  </div>
              ))}
            </div>
        }

        {isChinese &&
            <Notification
                isModalOpen={isChinese}
                onClose={() => setIsChinese(false)}
                title="Not English!"
                text={chineseMsg}>
                <Button buttonType="primary" onClick={() => setIsChinese(false)}>
                    Sorry
                </Button>
            </Notification>
        }

      </div>
  );
};

export default LanguageDropDown;