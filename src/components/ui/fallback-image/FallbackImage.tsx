import {useState} from "react";
import {Shield, User} from "lucide-react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallback: "crest" | "player";
};

const FallbackImage = ({src, alt, className, fallback}: Props) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const Icon = fallback === "crest" ? Shield : User;
    return <Icon aria-label={alt} className={`${className} text-slate-400`}/>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)}/>;
};

export default FallbackImage;
