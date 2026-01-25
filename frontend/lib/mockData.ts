// Mock subjects data
export const mockSubjects = [
  {
    id: "1",
    name: "Mathematics",
    description: "Study math topics together",
    icon: "📐",
    color: "#FF6B6B"
  },
  {
    id: "2",
    name: "Physics",
    description: "Explore physics concepts",
    icon: "⚛️",
    color: "#4ECDC4"
  },
  {
    id: "3",
    name: "Chemistry",
    description: "Learn chemistry together",
    icon: "🧪",
    color: "#95E1D3"
  },
  {
    id: "4",
    name: "Biology",
    description: "Discover life sciences",
    icon: "🧬",
    color: "#F38181"
  },
  {
    id: "5",
    name: "Computer Science",
    description: "Code and algorithms",
    icon: "💻",
    color: "#AA96DA"
  },
  {
    id: "6",
    name: "English",
    description: "Literature and writing",
    icon: "📚",
    color: "#FCBAD3"
  },
  {
    id: "7",
    name: "History",
    description: "Explore historical events",
    icon: "🏛️",
    color: "#FFFFD2"
  },
  {
    id: "8",
    name: "Geography",
    description: "Study world geography",
    icon: "🌍",
    color: "#A8D8EA"
  }
];

// Mock rooms data
export const mockRooms = [
  {
    id: "room1",
    name: "Calculus Study Group",
    description: "Working on derivatives and integrals",
    subject: "Mathematics",
    subjectId: "1",
    hostId: "user1",
    hostName: "John Doe",
    hostAvatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    maxParticipants: 10,
    currentParticipants: 5,
    isPublic: true,
    createdAt: new Date("2026-01-20T10:00:00"),
    participants: [
      {
        id: "user1",
        name: "John Doe",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-20T10:00:00")
      },
      {
        id: "user2",
        name: "Jane Smith",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-20T10:15:00")
      },
      {
        id: "user3",
        name: "Mike Johnson",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-20T10:30:00")
      }
    ]
  },
  {
    id: "room2",
    name: "Quantum Physics Discussion",
    description: "Exploring quantum mechanics basics",
    subject: "Physics",
    subjectId: "2",
    hostId: "user4",
    hostName: "Sarah Wilson",
    hostAvatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    maxParticipants: 8,
    currentParticipants: 3,
    isPublic: true,
    createdAt: new Date("2026-01-22T14:00:00"),
    participants: [
      {
        id: "user4",
        name: "Sarah Wilson",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-22T14:00:00")
      },
      {
        id: "user5",
        name: "Tom Brown",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-22T14:20:00")
      }
    ]
  },
  {
    id: "room3",
    name: "Organic Chemistry Lab",
    description: "Practicing reaction mechanisms",
    subject: "Chemistry",
    subjectId: "3",
    hostId: "user6",
    hostName: "Emily Davis",
    hostAvatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    maxParticipants: 6,
    currentParticipants: 4,
    isPublic: true,
    createdAt: new Date("2026-01-23T09:00:00"),
    participants: [
      {
        id: "user6",
        name: "Emily Davis",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-23T09:00:00")
      }
    ]
  },
  {
    id: "room4",
    name: "Data Structures & Algorithms",
    description: "Preparing for coding interviews",
    subject: "Computer Science",
    subjectId: "5",
    hostId: "user7",
    hostName: "Alex Chen",
    hostAvatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    maxParticipants: 12,
    currentParticipants: 8,
    isPublic: true,
    createdAt: new Date("2026-01-24T16:00:00"),
    participants: [
      {
        id: "user7",
        name: "Alex Chen",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-24T16:00:00")
      }
    ]
  },
  {
    id: "room5",
    name: "Shakespeare Literature",
    description: "Reading and discussing Hamlet",
    subject: "English",
    subjectId: "6",
    hostId: "user8",
    hostName: "Rachel Green",
    hostAvatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    maxParticipants: 10,
    currentParticipants: 6,
    isPublic: true,
    createdAt: new Date("2026-01-25T11:00:00"),
    participants: [
      {
        id: "user8",
        name: "Rachel Green",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedAt: new Date("2026-01-25T11:00:00")
      }
    ]
  }
];

// Mock user data
export const mockUser = {
  id: "current-user-id",
  name: "Demo User",
  email: "demo@cg4academy.com",
  avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  currentRoomId: null
};

// Mock problems for study rooms
export const mockProblems = [
  {
    id: "prob1",
    title: "Calculate the derivative of x^3 + 2x^2 - 5x + 1",
    description: "Find the first derivative and evaluate at x = 2",
    difficulty: "Medium",
    solved: false
  },
  {
    id: "prob2",
    title: "Solve the quadratic equation",
    description: "x^2 - 5x + 6 = 0",
    difficulty: "Easy",
    solved: true
  },
  {
    id: "prob3",
    title: "Integration problem",
    description: "Find the definite integral of 2x from 0 to 5",
    difficulty: "Medium",
    solved: false
  }
];
