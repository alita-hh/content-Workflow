import type { UserRole } from "@/lib/auth";

const NAV_BY_ROLE: Record<UserRole, { href: string; label: string }[]> = {
  product: [
    { href: "/radar", label: "全网财经热点雷达" },
    { href: "/style-gene-hub", label: "风格基因管理后台" },
    { href: "/matrix-gen", label: "财经矩阵化出稿车间" }
  ],
  operations: [
    { href: "/radar", label: "全网财经热点雷达" },
    { href: "/style-gene-hub", label: "风格基因管理后台" },
    { href: "/matrix-gen", label: "财经矩阵化出稿车间" }
  ]
};

export function navItemsByRole(role: UserRole) {
  return NAV_BY_ROLE[role];
}
