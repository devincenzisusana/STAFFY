// This file provides mock data for 30 staff members for testing purposes.
import { StaffMember } from "../components/StaffTable";

export const mockStaffMembers: StaffMember[] = Array.from({ length: 30 }, (_, i) => {
  const id = (1000 + i).toString();
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Karen", "Leo", "Mona", "Nina", "Oscar", "Paul", "Quinn", "Rita", "Sam", "Tina", "Uma", "Vince", "Wendy", "Xander", "Yara", "Zane", "Ava", "Ben", "Cleo", "Derek"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen"];
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  return {
    id,
    employeeId: `EMP${id}`,
    name: `${firstName} ${lastName}`,
    position: ["Manager", "Developer", "Designer", "QA", "Support"][i % 5],
    department: ["HR", "Engineering", "Design", "QA", "Support"][i % 5],
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+1-555-01${(1000 + i).toString().slice(-4)}`,
    hireDate: `2022-${(i % 12 + 1).toString().padStart(2, "0")}-15`,
    status: (["active", "inactive", "on-leave"] as const)[i % 3],
    role: ["admin", "user", "staff"][i % 3],
    photoUrl: undefined,
    firstName,
    lastName,
    idNumber: `ID${id}`,
    dateOfBirth: `199${i % 10}-0${(i % 9) + 1}-10`,
    address: `${i + 1} Main St`,
    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][i % 5],
    zipCode: `1000${i % 10}`,
    country: "USA",
    emergencyContactName: `Emergency ${firstName}`,
    emergencyContactNumber: `+1-555-99${(1000 + i).toString().slice(-4)}`,
    gdprConsentGiven: i % 2 === 0,
    gdprConsentDate: `2023-01-${(i % 28 + 1).toString().padStart(2, "0")}`,
  };
});
