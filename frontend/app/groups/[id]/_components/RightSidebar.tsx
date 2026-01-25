'use client';

import { ProblemsSection } from "./ProblemsSection";
import { useParams } from "next/navigation";
import { decryptId } from "@/lib/utils/cryptoUtils";

export function RightSidebar({ groupId }: { groupId: string }) {
  return (
    <aside className="bg-slate-950 h-full w-full overflow-hidden flex flex-col">
      <ProblemsSection roomId={groupId} />
    </aside>
  );
}
