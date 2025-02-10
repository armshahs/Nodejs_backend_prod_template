export const a = 1;
export const b = 2;

// Roles for authentication
export const ROLES = {
  ADMIN: "admin",
  TEAM_LEAD: "team_lead",
  TEAM_MEMBER: "team_member",
  CLIENT: "client",
} as const;

//(typeof Roles)[keyof typeof Roles] gives the values ("admin" | "team_lead" | "team_member" | "client").
// This means any variable of type RoleType can only have one of these four values.
// const userRole: RoleType = "admin"; // ✅ Valid
// const anotherRole: RoleType = "manager"; // ❌ TypeScript Error: Not in RoleType

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
