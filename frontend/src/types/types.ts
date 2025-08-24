export type Role = "applicant" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
