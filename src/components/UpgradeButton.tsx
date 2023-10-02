"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function UpgradeButton() {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });

  return (
    <Button onClick={() => createStripeSession()} className="w-full">
      Upgrade Now <ArrowRight className="w-5 h-5 ml-1.5" />
    </Button>
  );
}
