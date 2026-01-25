import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function GroupsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
