import { createContext, useContext, useMemo } from "react";
import { useCurrentUser } from "../queries/auth/auth.queries";
import { useRoleById } from "../queries/roles/roles.queries";

const PermissionContext = createContext({
  isLoading: false,
  permissionsPreview: [],
  permissionMatrix: [],
  can: () => false,
  canAccessModule: () => false,
  allowedModules: new Set(),
});

const isAllowedModuleAccess = (permission) => {
  const access = String(permission?.access || "").trim().toLowerCase();
  const label = String(permission?.accessLabel || "").trim().toLowerCase();

  if (
    !access ||
    access === "none" ||
    access === "no" ||
    access === "no-access" ||
    access === "no_access" ||
    label === "no access" ||
    label.includes("no access")
  ) {
    return false;
  }

  return (
    access === "full" ||
    access === "view" ||
    label.includes("full") ||
    label.includes("view")
  );
};

const buildActionMap = (permissionMatrix = []) => {
  const map = {};

  permissionMatrix.forEach((moduleEntry) => {
    const moduleName = moduleEntry?.moduleName;
    if (!moduleName) return;

    map[moduleName] = {};
    (moduleEntry.actions || []).forEach((action) => {
      const actionName = String(action?.actionName || "").trim().toLowerCase();
      if (!actionName) return;
      // Only show when granted is explicitly true
      map[moduleName][actionName] = action?.granted === true;
    });
  });

  return map;
};

export function PermissionProvider({ children }) {
  const {
    data: currentUserResponse,
    isLoading: isUserLoading,
  } = useCurrentUser();

  const currentUser = currentUserResponse?.data;
  const roleId = currentUser?.roleId || currentUser?.role?._id;

  const {
    data: roleResponse,
    isLoading: isRoleLoading,
  } = useRoleById(roleId);

  const role = roleResponse?.data?.role || roleResponse?.data;
  const permissionsPreview = role?.permissionsPreview || [];
  const permissionMatrix = role?.permissionMatrix || [];

  const isLoading = isUserLoading || (!!roleId && isRoleLoading);

  const actionMap = useMemo(
    () => buildActionMap(permissionMatrix),
    [permissionMatrix]
  );

  const allowedModules = useMemo(
    () =>
      new Set(
        permissionsPreview
          .filter(isAllowedModuleAccess)
          .map((permission) => permission.moduleName)
          .filter(Boolean)
      ),
    [permissionsPreview]
  );

  const value = useMemo(() => {
    const can = (moduleName, actionName) => {
      if (!moduleName || !actionName) return false;
      const moduleActions = actionMap[moduleName];
      if (!moduleActions) return false;
      // Hide anything that is not explicitly granted: true
      return moduleActions[String(actionName).toLowerCase()] === true;
    };

    const canAccessModule = (moduleName) => {
      if (!moduleName) return false;
      return allowedModules.has(moduleName);
    };

    return {
      isLoading,
      permissionsPreview,
      permissionMatrix,
      can,
      canAccessModule,
      allowedModules,
      currentUser,
      role,
    };
  }, [
    actionMap,
    allowedModules,
    currentUser,
    isLoading,
    permissionMatrix,
    permissionsPreview,
    role,
  ]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}

/** Check a single module action from permissionMatrix (create / read / update / delete). */
export function useCan(moduleName, actionName) {
  const { can, isLoading } = usePermissions();
  return {
    allowed: can(moduleName, actionName),
    isLoading,
  };
}

export default PermissionContext;
