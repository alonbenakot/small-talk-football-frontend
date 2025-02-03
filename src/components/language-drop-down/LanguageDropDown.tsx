import Flag from "react-flagkit";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { toggleLang } from "../../store/lang-slice.ts";

const LanguageDropDown = () => {
  const [displayFlags, setDisplayFlags] = useState<boolean>(false);
  const selectedLang = useSelector((state: RootState) => state.lang.lang);
  const dispatch = useDispatch();

  const handleDropDownClicked = () => {
    setDisplayFlags(prevState => !prevState);
  }

  const handleFlagClicked = (lang: string) => {
    dispatch(toggleLang(lang === 'US' ? {lang: 'american'} : {lang: 'british'}));
    setDisplayFlags(false);
  }
  return (
    <div className="relative inline-block bg-zinc-800">
      <button
        className="flex items-center px-4 py-2 text-slate-300 bg-zinc-800 rounded transform transform-400 cursor-pointer hover:bg-zinc-700"
        onClick={ handleDropDownClicked }>
        <span>Language</span>
        <Flag country={ selectedLang === 'american' ? 'US' : 'GB' } className="mx-2 bg-transparent"/>
      </button>

      { displayFlags &&
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-white shadow-lg rounded">
          <div
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
            onClick={ () => handleFlagClicked("US") }
          >
            <Flag country="US" className="mr-2"/>
            American
          </div>
          <div
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
            onClick={ () => handleFlagClicked("GB") }
          >
            <Flag country="GB" className="mr-2"/>
            British
          </div>
          <div
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200 border-t-1 border-slate-400/50"
            onClick={ () => handleFlagClicked("CN") }
          >
            <Flag country="CN" className="mr-2"/>
            Chinese
          </div>
        </div> }
    </div>
  );
};

export default LanguageDropDown;
