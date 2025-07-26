import Flag from "react-flagkit";
import { useLangStore } from "../../../store/store.ts";
import Lang from "../../features/language/Lang.ts";
import useOutsideClick from "../../../utils/hooks/outside-click.tsx";
import { useState } from "react";
import Notification from "../modals/Notification.tsx";
import Button from "../button/Button.tsx";

const chineseMsg = "The Chinese language is not supported at this time, nor do we have any plans to support it in the future."

const LanguageDropDown = () => {
  const [isChinese, setIsChinese] = useState<boolean>(false);
  const {isOpen, setIsOpen, elementRef} = useOutsideClick<HTMLDivElement>();
  const {selectedLang, dispatchToggleLang} = useLangStore();

  const handleDropDownClicked = () => {
    setIsOpen(prevState => !prevState);
  }

  const handleFlagClicked = (lang: Lang) => {
    dispatchToggleLang(lang);
    setIsOpen(false);
  }

  const handleForbiddenFlagClicked = () => {
    console.log('No China');
    setIsOpen(false);
    setIsChinese(true);
  };

  return (
    <div ref={ elementRef } className="relative inline-block bg-zinc-800">
      <button
        className="flex items-center px-4 py-2 text-slate-300 bg-zinc-800 rounded transform transform-400 cursor-pointer hover:bg-zinc-700"
        onClick={ handleDropDownClicked }>
        <span>Language</span>
        <Flag country={ selectedLang === 'american' ? 'US' : 'GB' } className="mx-2 bg-transparent"/>
      </button>

      { isOpen &&
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-white shadow-lg rounded z-50">

          <div className="hover:bg-gray-200 rounded-t">
            <button
              className="flex items-center p-2 cursor-pointer"
              onClick={ () => handleFlagClicked("british") }
            >
              <Flag country="GB" className="mr-2"/>
              British
            </button>
          </div>

          <div className="hover:bg-gray-200">
            <button
              className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
              onClick={ () => handleFlagClicked("american") }
            >
              <Flag country="US" className="mr-2"/>
              American
            </button>
          </div>

          <div className="hover:bg-gray-200 rounded-b border-t-1 border-slate-400/50">
            <button
              className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
              onClick={ handleForbiddenFlagClicked }
            >
              <Flag country="CN" className="mr-2"/>
              Chinese
            </button>
          </div>

        </div> }

      { isChinese &&
        <Notification
          isModalOpen={ isChinese }
          onClose={ () => setIsChinese(false) }
          title="Error - Not English!"
          text={ chineseMsg }>
          <Button buttonType="primary" onClick={ () => setIsChinese(false) }>
            Sorry
          </Button>
        </Notification>
      }

    </div>
  );
};

export default LanguageDropDown;
