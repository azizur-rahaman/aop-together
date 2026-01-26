import { LiveKitMeetingView } from "./_components/LiveKitMeetingView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <LiveKitMeetingView
      groupId={id}
    />
  );
}
