import { LiveKitMeetingView } from "./_components/LiveKitMeetingView";
import { RightSidebar } from "./_components/RightSidebar";
import { RoomLayout } from "./_components/RoomLayout";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <RoomLayout
      sidebar={<RightSidebar groupId={id} />}
    >
      <LiveKitMeetingView
        groupId={id}
      />
    </RoomLayout>
  );
}
