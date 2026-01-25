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
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getSubjects } from "@/services/subjects.service";
import { createRoom, getRooms, getUserRoomStatus, leaveRoom } from "@/services/rooms.service";
import { Subject, Room } from "@/lib/types";

export default function Page() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isSubjectLoading, setIsSubjectLoading] = useState(true);
    const [isRoomsLoading, setIsRoomsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    // Listen to auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Fetch subjects from backend
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getSubjects();
                setSubjects(data);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
                toast.error("Failed to load subjects");
            } finally {
                setIsSubjectLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    // Fetch rooms from backend
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getRooms(selectedSubject || undefined);
                setRooms(data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                toast.error("Failed to load rooms");
            } finally {
                setIsRoomsLoading(false);
            }
        };

        fetchRooms();
    }, [selectedSubject]);

    const handleCreateRoom = async (data: {
        name: string
        description?: string
        subject: string
        maxParticipants: number
        isPublic: boolean
    }) => {
        if (!user) {
            toast.error("You must be logged in to create a room");
            return;
        }

        setIsCreatingRoom(true);

        try {
            // Check if user is already in a room and leave it
            const status = await getUserRoomStatus(user.uid);
            if (status.isInRoom && status.roomId) {
                await leaveRoom(status.roomId, user.uid);
            }

            // Create room via backend API
            const newRoom = await createRoom({
                ...data,
                hostId: user.uid,
                description: data.description || ""
            });

            toast.success("Room created successfully!");
            setIsCreateModalOpen(false);
            
            const toastId = toast.loading("Setting up your room...");
            
            // Refresh rooms list
            const updatedRooms = await getRooms(selectedSubject || undefined);
            setRooms(updatedRooms);
            
            setTimeout(() => {
                toast.dismiss(toastId);
                router.push(`/groups/${newRoom.id}`);
            }, 1500);
        } catch (error: any) {
            console.error('Failed to create room:', error);
            toast.error(error.message || "Failed to create room");
        } finally {
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
                                rooms.map((room) => (
                                    <StudyRoomCard 
                                        key={room.id}
                                        room={room}
                                        currentUser={user}
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