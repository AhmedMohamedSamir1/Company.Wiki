export const RoleConst = {
    Admin: "Admin",
    User: "User",
} as const;

// witout as const-->  values "Admin" and "User" are treated as strings
// With as const  --> values "Admin" and "User" are treated as specific constants, not just general strings.


