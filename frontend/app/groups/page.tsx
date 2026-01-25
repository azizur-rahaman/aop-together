'use client';

import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { SubjectList } from "./_components/SubjectList";
import { StudyRoomCard } from "./_components/StudyRoomCard";
import { SubjectListSkeleton } from "./_components/SubjectListSkeleton";
import { StudyRoomCardSkeleton } from "./_components/StudyRoomCardSkeleton";
import { useEffect, useState } from "react";
import { CreateGroupModal } from "./_components/CreateGroupModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { mockSubjects, mockRooms, mockUser } from "@/lib/mockData";

export default function Page() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [isSubjectLoading, setIsSubjectLoading] = useState(true);
    const [isRoomsLoading, setIsRoomsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading subjects
        setTimeout(() => {
            setSubjects(mockSubjects);
            setIsSubjectLoading(false);
        }, 500);

        // Simulate loading rooms
        setTimeout(() => {
            setRooms(mockRooms);
            setIsRoomsLoading(false);
        }, 800);
    }, []);

    const handleCreateRoom = async (data: {
        name: string
        description?: string
        subject: string
        maxParticipants: number
        isPublic: boolean
    }) => {
        setIsCreatingRoom(true);

        try {
            // Simulate room creation
            const newRoom = {
                id: `room${rooms.length + 1}`,
                ...data,
                hostId: mockUser.id,
                hostName: mockUser.name,
                hostAvatar: mockUser.avatar,
                currentParticipants: 1,
                createdAt: new Date(),
                participants: [
                    {
                        id: mockUser.id,
                        name: mockUser.name,
                        avatar: mockUser.avatar,
                        joinedAt: new Date()
                    }
                ]
            };

            setTimeout(() => {
                setRooms([newRoom, ...rooms]);
                toast.success("Room created successfully!");
                setIsCreateModalOpen(false);
                
                const toastId = toast.loading("Setting up your room...");
                
                setTimeout(() => {
                    toast.dismiss(toastId);
                    router.push(`/groups/${newRoom.id}`);
                }, 1500);
                
                setIsCreatingRoom(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
            setIsCreatingRoom(false);
        }
    };
                setIsCreateModalOpen(false);

                // Show loading toast for redirect
                const toastId = toast.loading("Setting up your room...");

                // Short delay to allow Firestore propagation / UX smoothness
                setTimeout(() => {
                    toast.dismiss(toastId);
                    const encryptedId = encryptId(roomId);
                    router.push(`/groups/${encryptedId}`);
                }, 1500);

            } else {
                toast.error("Failed to create room");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsCreatingRoom(false);
        }
    };



    return (
        <main className="bg-grid bg-[#FAF9FE] w-full min-h-screen pb-20">
            <Navbar />
            <section className="flex justify-center py-10">
                <div className="w-full max-w-7xl px-4 md:px-6">
                    <div className="">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h1 className="text-3xl font-bold text-[#4F6EF7]">Study Rooms</h1>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create Room
                            </Button>
                        </div>

                        <div className="mb-10">
                            {isSubjectLoading ? (
                                <SubjectListSkeleton />
                            ) : (
                                <SubjectList
                                    subjects={subjects.map((subject) => ({ name: subject.name, icon: subject.icon }))}
                                    selectedSubject={selectedSubject}
                                    onSelect={setSelectedSubject}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isRoomsLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <StudyRoomCardSkeleton key={index} />
                                ))
                            ) : (
                                (selectedSubject ? rooms.filter(r => r.subject === selectedSubject) : rooms).map((room, index) => (
                                    <StudyRoomCard key={index}
                                        room={room}
                                        currentUser={mockUser}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <CreateGroupModal
                subjects={subjects.map((sub) => ({ name: sub.name, icon: sub.icon }))}
                isOpen={isCreateModalOpen}
                onOpenChange={(open) => {
                    if (!isCreatingRoom) setIsCreateModalOpen(open);
                }}
                isLoading={isCreatingRoom}
                onSubmit={handleCreateRoom}
            />
        </main>
    )
}