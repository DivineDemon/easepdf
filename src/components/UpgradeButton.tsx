import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function UpgradeButton() {
  return (
    <Button className="w-full">
      Upgrade Now <ArrowRight className="w-5 h-5 ml-1.5" />
    </Button>
  );
}
