import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
  Settings,
  UserPlus,
  Wrench,
  Truck,
  Receipt,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../../queries/Notification/notificationQueries";
import { useToast } from "../../utils/GlobalToast";

function formatRelativeTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFullDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotificationMeta(type) {
  const normalized = String(type || "").toLowerCase();

  if (["inventory", "stock", "alert", "warning"].includes(normalized)) {
    return { styleType: "warning", icon: AlertTriangle, category: "alerts" };
  }

  if (normalized === "maintenance") {
    return { styleType: "maintenance", icon: Wrench, category: "alerts" };
  }

  if (normalized === "payment") {
    return { styleType: "success", icon: CreditCard, category: "transactions" };
  }

  if (["lpg", "receipt", "shipment"].includes(normalized)) {
    return { styleType: "info", icon: Truck, category: "transactions" };
  }

  if (["sale", "invoice"].includes(normalized)) {
    return { styleType: "info", icon: Receipt, category: "transactions" };
  }

  if (["account", "user"].includes(normalized)) {
    return { styleType: "system", icon: UserPlus, category: "system" };
  }

  if (["filling", "batch"].includes(normalized)) {
    return { styleType: "success", icon: CheckCircle, category: "system" };
  }

  return { styleType: "system", icon: Settings, category: "system" };
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 border-b border-slate-100 last:border-0">
      <dt className="text-[11px] font-semibold text-slate-400">{label}</dt>
      <dd className="text-[12px] text-BLUE-dark break-all">{value || "—"}</dd>
    </div>
  );
}

function NotificationDetailsModal({ notification, onClose }) {
  if (!notification) return null;

  const meta = getNotificationMeta(notification.notificationType);
  const Icon = meta.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  {notification.notificationTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                  {notification.notificationType || "notification"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {notification.notificationMessage}
            </p>
            <dl>
              <DetailRow
                label="Status"
                value={notification.isRead ? "Read" : "Unread"}
              />
              <DetailRow label="Type" value={notification.notificationType} />
              <DetailRow label="Reference" value={notification.referenceType} />
              <DetailRow label="Reference ID" value={notification.referenceId} />
              <DetailRow label="Created" value={formatFullDate(notification.createdAt)} />
              <DetailRow label="Updated" value={formatFullDate(notification.updatedAt)} />
            </dl>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const limit = 10;
  const incomingNotification = location.state?.selectedNotification || null;
  const selectedNotification = selectedFromList || incomingNotification;

  const { data, isLoading, isError } = useNotifications(page, limit);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notificationData = data?.data || {};
  const notifications = notificationData.items || [];
  const pagination = notificationData.pagination || {
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
  };
  const unreadCount = notificationData.unreadCount || 0;

  const tabs = [
    { key: "all", label: "All Notifications" },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "alerts", label: "Stock Alerts" },
    { key: "transactions", label: "Transactions" },
    { key: "system", label: "System Logs" },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const { category } = getNotificationMeta(notification.notificationType);

    if (selectedTab === "all") return true;
    if (selectedTab === "unread") return !notification.isRead;
    return category === selectedTab;
  });

  const getNotificationStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          border: "border-l-orange-500",
          dot: "bg-orange-500",
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600",
        };
      case "success":
        return {
          border: "border-l-emerald-500",
          dot: "bg-emerald-500",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        };
      case "maintenance":
        return {
          border: "border-l-red-500",
          dot: "bg-red-500",
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
        };
      case "info":
        return {
          border: "border-l-blue-500",
          dot: "bg-blue-500",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
        };
      case "system":
      default:
        return {
          border: "border-l-slate-400",
          dot: "bg-slate-400",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-600",
        };
    }
  };

  const handleTabChange = (tabKey) => {
    setSelectedTab(tabKey);
    setPage(1);
  };

  const handleMarkAsRead = (notification) => {
    if (notification.isRead) return;

    markAsReadMutation.mutate(notification._id, {
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to mark notification as read."
        );
      },
    });
  };

  const handleNotificationClick = (notification) => {
    setSelectedFromList({ ...notification, isRead: true });
    handleMarkAsRead(notification);
  };

  const handleCloseDetails = () => {
    setSelectedFromList(null);
    if (incomingNotification) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  };

  const handleMarkAllAsRead = () => {
    if (!unreadCount) return;

    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read.");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to mark all notifications as read."
        );
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full px-5 py-4 md:px-7 lg:px-8">
        <div className="mb-1 text-[11px] text-slate-400">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="mx-1">/</span> Notifications
        </div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[18px] md:text-[20px] font-bold text-slate-800">
              Notification Center
            </h1>

            <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
              Critical storage warnings, transaction logs, and inventory
              triggers
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={!unreadCount || markAllMutation.isPending}
            className="
              px-3 py-1.5
              text-[10px] font-medium
              text-slate-600
              bg-white
              border border-slate-200
              rounded
              hover:bg-slate-50
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {markAllMutation.isPending ? "Marking..." : "Mark All as Read"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const active = selectedTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`
                  flex items-center gap-1.5
                  whitespace-nowrap
                  px-3 py-1.5
                  rounded-md
                  text-[11px]
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {tab.label}

                {tab.count > 0 && (
                  <span
                    className={`
                      min-w-4.5
                      h-4.5
                      px-1.5
                      flex
                      items-center
                      justify-center
                      rounded-full
                      text-[9px]
                      font-bold
                      ${
                        active
                          ? "bg-white text-blue-600"
                          : "bg-red-500 text-white"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <p className="py-12 text-center text-xs text-slate-500">
            Loading notifications...
          </p>
        )}

        {isError && !isLoading && (
          <p className="py-12 text-center text-xs text-red-500">
            Unable to load notifications.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {filteredNotifications.map((notification, index) => {
                const meta = getNotificationMeta(notification.notificationType);
                const styles = getNotificationStyles(meta.styleType);
                const Icon = meta.icon;

                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      relative
                      bg-white
                      border
                      border-slate-200
                      border-l-4
                      ${styles.border}
                      rounded
                      px-4
                      py-3
                      hover:bg-slate-50
                      transition
                      shadow-sm
                      cursor-pointer
                      ${!notification.isRead ? "bg-blue-50/40" : ""}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1 shrink-0">
                        <div
                          className={`
                            w-2
                            h-2
                            rounded-full
                            ${notification.isRead ? "bg-slate-300" : styles.dot}
                          `}
                        />
                      </div>

                      <div
                        className={`
                          flex
                          w-8
                          h-8
                          rounded-lg
                          items-center
                          justify-center
                          shrink-0
                          ${styles.iconBg}
                        `}
                      >
                        <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs md:text-sm font-semibold text-BLUE-dark leading-tight">
                              {notification.notificationTitle}
                            </h3>

                            <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed mt-1">
                              {notification.notificationMessage}
                            </p>
                          </div>

                          <span
                            className="
                              shrink-0
                              text-[10px]
                              text-slate-400
                              whitespace-nowrap
                              pt-0.5
                            "
                          >
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {filteredNotifications.length === 0 && (
              <div className="border border-slate-200 rounded-sm py-12 text-center">
                <Info className="w-7 h-7 text-slate-300 mx-auto mb-2" />

                <p className="text-xs font-medium text-slate-500">
                  No notifications found
                </p>
              </div>
            )}

            {pagination.totalPages > 1 && selectedTab === "all" && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="px-3 py-1.5 text-[10px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="px-3 py-1.5 text-[10px] font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default Notifications;
