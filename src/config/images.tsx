import type { StaticImageData } from "next/image";
import followNextBendersky from "@/public/follow-next-images/bendersky.png";
import followNextComeau from "@/public/follow-next-images/comeau.png";
import followNextSophie from "@/public/follow-next-images/localghost.png";
import followNextMelikechan from "@/public/follow-next-images/melikechan.png";

export const followNextImages: { [key: string]: StaticImageData } = {
  comeau: followNextComeau,
  bendersky: followNextBendersky,
  sophie: followNextSophie,
  melikechan: followNextMelikechan,
};
