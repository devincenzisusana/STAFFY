// scripts/generate-mock-staff.js
// Run with: npx tsx scripts/generate-mock-staff.ts

// Load environment variables from .env
// @ts-ignore
import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Karen", "Leo", "Mona", "Nina", "Oscar", "Paul", "Quinn", "Rita", "Sam", "Tina", "Uma", "Vince", "Wendy", "Xander", "Yara", "Zane", "Ava", "Ben", "Cleo", "Derek"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const staff = Array.from({ length: 30 }, (_, i) => {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    return {
      employee_id: `EMP${1000 + i}`,
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`,
      position: ["Manager", "Developer", "Designer", "QA", "Support"][i % 5],
      department: ["HR", "Engineering", "Design", "QA", "Support"][i % 5],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `+1-555-01${(1000 + i).toString().slice(-4)}`,
      hire_date: `2022-${(i % 12 + 1).toString().padStart(2, "0")}-15`,
      status: ["active", "inactive", "on-leave"][i % 3],
      role: ["admin", "user", "staff"][i % 3],
      id_number: `ID${1000 + i}`,
      date_of_birth: `199${i % 10}-0${(i % 9) + 1}-10`,
      address: `${i + 1} Main St`,
      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][i % 5],
      zip_code: `1000${i % 10}`,
      country: "USA",
      emergency_contact_name: `Emergency ${firstName}`,
      emergency_contact_number: `+1-555-99${(1000 + i).toString().slice(-4)}`,
      gdpr_consent_given: i % 2 === 0,
      gdpr_consent_date: `2023-01-${(i % 28 + 1).toString().padStart(2, "0")}`,
    };
  });

  for (const member of staff) {
    const { error } = await supabase.from('staff').insert([member]);
    if (error) {
      console.error('Error inserting staff:', error, member);
    } else {
      console.log('Inserted:', member.email);
    }
  }
  console.log('Done!');
}

main().catch(console.error);
