import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const defaultRole = "user";

export const statements = {
  ...defaultStatements,
  task: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  [defaultRole]: ac.newRole({
    task: ["create"],
  }),

  editor: ac.newRole({
    task: ["create", "update"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    task: ["create", "update", "delete"],
  }),
};
