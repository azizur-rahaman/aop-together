import { JitsiMeetingView } from "./_components/JitsiMeetingView";
import { RightSidebar } from "./_components/RightSidebar";
import { RoomLayout } from "./_components/RoomLayout";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <RoomLayout
      sidebar={<RightSidebar groupId={id} />}
    >
      <JitsiMeetingView
        groupId={id}
      />
    </RoomLayout>
  );
}
