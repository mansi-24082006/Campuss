import { User, GraduationCap, Shield } from "lucide-react";

export const roleData = [
  {
    key: "student",
    label: "Student",
    icon: User,
    description: "Discover and register for exciting campus events",
    color: "from-blue-500 to-purple-500",
  },
  {
    key: "faculty",
    label: "Faculty",
    icon: GraduationCap,
    description: "Manage events and track student performance",
    color: "from-green-500 to-blue-500",
  },
  {
    key: "admin",
    label: "Admin",
    icon: Shield,
    description: "Full platform control and event management",
    color: "from-purple-500 to-pink-500",
  },
];