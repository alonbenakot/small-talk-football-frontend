import {Check, Copy} from "lucide-react";
import Button from "../../ui/button/Button.tsx";
import {useState} from "react";

type Props = {
  oneLinerText: string;
  handleStartOver: () => void;
}


const OneLinerResult = ({oneLinerText, handleStartOver}: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!oneLinerText) return;
    await navigator.clipboard.writeText(oneLinerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-emerald-600">
        {/* Success indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-5 h-5 text-white"/>
          </div>
        </div>

        <blockquote className="text-zinc-800 text-xl sm:text-2xl font-medium text-center leading-relaxed mb-6 italic">
          "{oneLinerText}"
        </blockquote>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Button
              buttonType='primary'
              type='button'
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2"
          >
            {copied ? (
                <>
                  <Check className="w-4 h-4"/>
                  Copied!
                </>
            ) : (
                <>
                  <Copy className="w-4 h-4"/>
                  Copy
                </>
            )}
          </Button>
        </div>

        <button
            type="button"
            onClick={handleStartOver}
            className="w-full text-slate-600 hover:text-slate-800 text-sm py-2 transition-colors duration-200"
        >
          Start over
        </button>
      </div>
  );
}

export default OneLinerResult;