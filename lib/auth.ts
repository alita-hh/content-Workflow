export type UserRole = "product" | "operations";

export type AuthUser = {
  username: string;
  password: string;
  role: UserRole;
  label: string;
};

export const AUTH_COOKIE_NAME = "ops_auth_role";

export const AUTH_USERS: AuthUser[] = [
  {
    username: "product",
    password: "product123",
    role: "product",
    label: "产品研发"
  },
  {
    username: "ops",
    password: "ops123",
    role: "operations",
    label: "运营"
  }
];

export function verifyUser(username: string, password: string): AuthUser | null {
  const user = AUTH_USERS.find((item) => item.username === username.trim());
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}

export function normalizeRole(value: string | undefined): UserRole | null {
  if (value === "product" || value === "operations") return value;
  return null;
}

export const ROLE_HOME: Record<UserRole, string> = {
  product: "/radar",
  operations: "/radar"
};

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (!pathname.startsWith("/")) return false;
  if (pathname.startsWith("/api")) return true;
  if (pathname === "/login") return true;
  if (pathname === "/") return true;
  void role;
  return pathname === "/radar" || pathname === "/matrix-gen" || pathname === "/style-gene-hub";
}
