import React, { useMemo, useState } from "react";
import { Table, Pagination } from "@heroui/react";
import {
  Search,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

function AuditLogs() {
  // =========================================================
  // DATA
  // =========================================================

  const auditLogs = [
    {
      id: 1,
      timestamp: "21 Aug 2026 09:15:22",
      user: "Muhammad Ahmad",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.10",
    },
    {
      id: 2,
      timestamp: "21 Aug 2026 09:02:05",
      user: "Muhammad Ahmad",
      action: "Create",
      module: "Sale",
      entity: "INV-9082",
      entityId: "1012",
      ip: "192.168.1.10",
    },
    {
      id: 3,
      timestamp: "21 Aug 2026 08:45:12",
      user: "Fatima Zahra",
      action: "Update",
      module: "Payment",
      entity: "PAY-0312",
      entityId: "312",
      ip: "192.168.1.15",
    },
    {
      id: 4,
      timestamp: "21 Aug 2026 08:30:00",
      user: "Fatima Zahra",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.15",
    },
    {
      id: 5,
      timestamp: "20 Aug 2026 17:50:33",
      user: "Usman Ali",
      action: "Create",
      module: "BillingBatch",
      entity: "FB-0234",
      entityId: "234",
      ip: "192.168.1.22",
    },
    {
      id: 6,
      timestamp: "20 Aug 2026 17:05:15",
      user: "Usman Ali",
      action: "Update",
      module: "StorageTank",
      entity: "TNK-001",
      entityId: "1",
      ip: "192.168.1.22",
    },
    {
      id: 7,
      timestamp: "20 Aug 2026 16:32:10",
      user: "Zainab Rashid",
      action: "Create",
      module: "Sale",
      entity: "INV-9981",
      entityId: "1981",
      ip: "192.168.1.18",
    },
    {
      id: 8,
      timestamp: "20 Aug 2026 14:35:00",
      user: "Muhammad Ahmad",
      action: "Delete",
      module: "Expense",
      entity: "EXP-4310",
      entityId: "610",
      ip: "192.168.1.10",
    },
    {
      id: 9,
      timestamp: "20 Aug 2026 13:45:00",
      user: "Ayesha Siddiqui",
      action: "Export",
      module: "Customer",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.12",
    },
    {
      id: 10,
      timestamp: "19 Aug 2026 16:00:00",
      user: "System",
      action: "Auto Backup",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "127.0.0.1",
    },

    // Additional records for pagination testing
    {
      id: 11,
      timestamp: "19 Aug 2026 15:45:22",
      user: "Muhammad Ahmad",
      action: "Create",
      module: "Product",
      entity: "PRD-102",
      entityId: "102",
      ip: "192.168.1.10",
    },
    {
      id: 12,
      timestamp: "19 Aug 2026 14:32:11",
      user: "Fatima Zahra",
      action: "Update",
      module: "Customer",
      entity: "CUS-201",
      entityId: "201",
      ip: "192.168.1.15",
    },
    {
      id: 13,
      timestamp: "19 Aug 2026 13:20:45",
      user: "Usman Ali",
      action: "Create",
      module: "Purchase",
      entity: "PUR-442",
      entityId: "442",
      ip: "192.168.1.22",
    },
    {
      id: 14,
      timestamp: "19 Aug 2026 12:10:20",
      user: "Zainab Rashid",
      action: "Update",
      module: "Inventory",
      entity: "INV-120",
      entityId: "120",
      ip: "192.168.1.18",
    },
    {
      id: 15,
      timestamp: "19 Aug 2026 11:02:15",
      user: "Ayesha Siddiqui",
      action: "Export",
      module: "Report",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.12",
    },
    {
      id: 16,
      timestamp: "18 Aug 2026 17:44:12",
      user: "Muhammad Ahmad",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.10",
    },
    {
      id: 17,
      timestamp: "18 Aug 2026 16:31:00",
      user: "Fatima Zahra",
      action: "Delete",
      module: "Product",
      entity: "PRD-101",
      entityId: "101",
      ip: "192.168.1.15",
    },
    {
      id: 18,
      timestamp: "18 Aug 2026 15:20:00",
      user: "Usman Ali",
      action: "Create",
      module: "Sale",
      entity: "INV-8892",
      entityId: "8892",
      ip: "192.168.1.22",
    },
    {
      id: 19,
      timestamp: "18 Aug 2026 14:10:32",
      user: "Zainab Rashid",
      action: "Update",
      module: "Payment",
      entity: "PAY-889",
      entityId: "889",
      ip: "192.168.1.18",
    },
    {
      id: 20,
      timestamp: "18 Aug 2026 13:05:22",
      user: "System",
      action: "Auto Backup",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "127.0.0.1",
    },
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedAction, setSelectedAction] = useState("All Actions");

  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const users = [
    "All Users",
    "Muhammad Ahmad",
    "Fatima Zahra",
    "Usman Ali",
    "Zainab Rashid",
    "Ayesha Siddiqui",
    "System",
  ];

  const modules = [
    "All Modules",
    "System",
    "Sale",
    "Payment",
    "BillingBatch",
    "StorageTank",
    "Expense",
    "Customer",
    "Product",
    "Purchase",
    "Inventory",
    "Report",
  ];

  const actions = [
    "All Actions",
    "Login",
    "Create",
    "Update",
    "Delete",
    "Export",
    "Auto Backup",
  ];

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !query ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query);

      const matchesUser =
        selectedUser === "All Users" ||
        log.user === selectedUser;

      const matchesModule =
        selectedModule === "All Modules" ||
        log.module === selectedModule;

      const matchesAction =
        selectedAction === "All Actions" ||
        log.action === selectedAction;

      return (
        matchesSearch &&
        matchesUser &&
        matchesModule &&
        matchesAction
      );
    });
  }, [
    search,
    selectedUser,
    selectedModule,
    selectedAction,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / rowsPerPage)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredLogs.length
  );

  const currentLogs = filteredLogs.slice(
    startIndex,
    endIndex
  );

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleUserChange = (value) => {
    setSelectedUser(value);
    setPage(1);
  };

  const handleModuleChange = (value) => {
    setSelectedModule(value);
    setPage(1);
  };

  const handleActionChange = (value) => {
    setSelectedAction(value);
    setPage(1);
  };

  // =========================================================
  // ACTION STYLE
  // =========================================================

  const getActionClass = (action) => {
    switch (action) {
      case "Create":
        return "text-emerald-500";

      case "Update":
        return "text-blue-600";

      case "Delete":
        return "text-red-500";

      case "Export":
        return "text-amber-500";

      case "Login":
        return "text-slate-700";

      case "Auto Backup":
        return "text-slate-600";

      default:
        return "text-slate-600";
    }
  };

  // =========================================================
  // PAGINATION ITEMS
  // =========================================================

  const getPaginationItems = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage,
      "...",
      totalPages,
    ];
  };

  const paginationItems = getPaginationItems();

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
    <section >

      <div className="text-xs">
        <span  onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >Dashboard</span>
        <span className="px-1">/</span>
        <span >
          Audit Logs
        </span>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Audit Trail
        </h1>

         <p className="text-sm text-tertiary">
          Complete activity log for compliance and security review
        </p>
      </div>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-2">

          {/* SEARCH */}

          <div className="relative ">

            <Search
              size={11}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              placeholder="Search by entity ID or user..."
              className="
                h-7
                w-100
                rounded
                border
                border-slate-200
                bg-white
                pl-6
                pr-2
                text-[13px]
                text-slate-600
                outline-none
                placeholder:text-slate-400
                focus:border-blue-300
              "
            />
          </div>

          {/* USER */}

          <div className="relative">

            <select
              value={selectedUser}
              onChange={(e) =>
                handleUserChange(e.target.value)
              }
              className="
                h-7
                min-w-[92px]
                appearance-none
                rounded
                border
                border-slate-200
                bg-white
                pl-2
                pr-6
                text-[8px]
                text-slate-600
                outline-none
                focus:border-blue-300
              "
            >
              {users.map((user) => (
                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>
              ))}
            </select>

            <ChevronDown
              size={10}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* MODULE */}

          <div className="relative">

            <select
              value={selectedModule}
              onChange={(e) =>
                handleModuleChange(e.target.value)
              }
              className="
                h-7
                min-w-[92px]
                appearance-none
                rounded
                border
                border-slate-200
                bg-white
                pl-2
                pr-6
                text-[8px]
                text-slate-600
                outline-none
                focus:border-blue-300
              "
            >
              {modules.map((module) => (
                <option
                  key={module}
                  value={module}
                >
                  {module}
                </option>
              ))}
            </select>

            <ChevronDown
              size={10}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* ACTION */}

          <div className="relative">

            <select
              value={selectedAction}
              onChange={(e) =>
                handleActionChange(e.target.value)
              }
              className="
                h-7
                min-w-[88px]
                appearance-none
                rounded
                border
                border-slate-200
                bg-white
                pl-2
                pr-6
                text-[8px]
                text-slate-600
                outline-none
                focus:border-blue-300
              "
            >
              {actions.map((action) => (
                <option
                  key={action}
                  value={action}
                >
                  {action}
                </option>
              ))}
            </select>

            <ChevronDown
              size={10}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* DATE */}

          <button
            type="button"
            className="
              flex
              h-7
              items-center
              gap-1.5
              rounded
              border
              border-slate-200
              bg-white
              px-2
              text-[8px]
              text-slate-600
              hover:bg-slate-50
            "
          >
            <CalendarDays
              size={10}
              className="text-slate-500"
            />

            <span>
              Aug 19, 2026 - Aug 21, 2026
            </span>

            <ChevronDown
              size={9}
              className="text-slate-400"
            />
          </button>
        </div>

        {/* ===================================================
            TABLE
        ==================================================== */}

        <Table
          variant="secondary"
          className="w-full"
        >
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Audit logs"
              className="w-full"
            >

              {/* HEADER */}

              <Table.Header>

                <Table.Column
                  id="timestamp"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Timestamp
                </Table.Column>

                <Table.Column
                  id="user"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  User
                </Table.Column>

                <Table.Column
                  id="action"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Action
                </Table.Column>

                <Table.Column
                  id="module"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Module
                </Table.Column>

                <Table.Column
                  id="entity"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Entity Description
                </Table.Column>

                <Table.Column
                  id="entityId"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  Entity ID
                </Table.Column>

                <Table.Column
                  id="ip"
                  className="
                    bg-white
                    px-3
                    py-2
                    text-left
                    text-[8px]
                    font-semibold
                    text-slate-500
                  "
                >
                  IP Address
                </Table.Column>

              </Table.Header>

              {/* BODY */}

              <Table.Body
                items={currentLogs}
                renderEmptyState={() => (
                  <div className="py-8 text-center text-[10px] text-slate-400">
                    No audit logs found
                  </div>
                )}
              >
                {(log) => (
                  <Table.Row
                    id={String(log.id)}
                    key={log.id}
                    className="
                      border-b
                      border-slate-100
                      hover:bg-slate-50
                    "
                  >

                    {/* TIMESTAMP */}

                    <Table.Cell
                      className="
                        whitespace-nowrap
                        px-3
                        py-2
                        text-[8px]
                        text-slate-500
                      "
                    >
                      {log.timestamp}
                    </Table.Cell>

                    {/* USER */}

                    <Table.Cell
                      className="
                        whitespace-nowrap
                        px-3
                        py-2
                        text-[8px]
                        font-medium
                        text-slate-700
                      "
                    >
                      {log.user}
                    </Table.Cell>

                    {/* ACTION */}

                    <Table.Cell
                      className="
                        px-3
                        py-2
                        text-[8px]
                      "
                    >
                      <span
                        className={`
                          font-semibold
                          ${getActionClass(log.action)}
                        `}
                      >
                        {log.action}
                      </span>
                    </Table.Cell>

                    {/* MODULE */}

                    <Table.Cell
                      className="
                        px-3
                        py-2
                        text-[8px]
                        text-slate-600
                      "
                    >
                      {log.module}
                    </Table.Cell>

                    {/* ENTITY */}

                    <Table.Cell
                      className="
                        px-3
                        py-2
                        text-[8px]
                        text-slate-500
                      "
                    >
                      {log.entity}
                    </Table.Cell>

                    {/* ENTITY ID */}

                    <Table.Cell
                      className="
                        px-3
                        py-2
                        text-[8px]
                      "
                    >
                      {log.entityId === "—" ? (
                        <span className="text-slate-400">
                          —
                        </span>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {log.entityId}
                        </span>
                      )}
                    </Table.Cell>

                    {/* IP */}

                    <Table.Cell
                      className="
                        whitespace-nowrap
                        px-3
                        py-2
                        text-[8px]
                        text-slate-500
                      "
                    >
                      {log.ip}
                    </Table.Cell>

                  </Table.Row>
                )}
              </Table.Body>

            </Table.Content>
          </Table.ScrollContainer>

          {/* =================================================
              FOOTER / PAGINATION
          ================================================== */}

          <Table.Footer
            className="
              border-t
              border-slate-100
              bg-white
              px-3
              py-2
            "
          >
            <Pagination
              size="sm"
              className="w-full"
            >

              {/* SUMMARY */}

              <Pagination.Summary
                className="
                  text-[8px]
                  text-slate-400
                "
              >
                {filteredLogs.length === 0
                  ? "Showing 0 of 0 entries"
                  : `Showing ${startIndex + 1}-${endIndex} of ${filteredLogs.length} entries`}
              </Pagination.Summary>

              {/* PAGINATION */}

              <Pagination.Content
                className="ml-auto gap-1"
              >

                {/* PREVIOUS */}

                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={currentPage === 1}
                    onPress={() => {
                      if (currentPage > 1) {
                        setPage(currentPage - 1);
                      }
                    }}
                    className="
                      h-6
                      min-w-6
                      rounded
                      border
                      border-slate-200
                      px-2
                      text-[8px]
                      text-slate-500
                    "
                  >
                    <span>Previous</span>
                  </Pagination.Previous>
                </Pagination.Item>

                {/* PAGE NUMBERS */}

                {paginationItems.map((item, index) => {

                  if (item === "...") {
                    return (
                      <Pagination.Item
                        key={`ellipsis-${index}`}
                      >
                        <Pagination.Ellipsis
                          className="
                            h-6
                            min-w-5
                            text-[8px]
                            text-slate-400
                          "
                        />
                      </Pagination.Item>
                    );
                  }

                  return (
                    <Pagination.Item
                      key={item}
                    >
                      <Pagination.Link
                        isActive={currentPage === item}
                        onPress={() => setPage(item)}
                        className={`
                          h-6
                          min-w-6
                          rounded
                          border
                          text-[8px]
                          ${
                            currentPage === item
                              ? "border-blue-700 bg-blue-700 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        {item}
                      </Pagination.Link>
                    </Pagination.Item>
                  );
                })}

                {/* NEXT */}

                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={currentPage === totalPages}
                    onPress={() => {
                      if (currentPage < totalPages) {
                        setPage(currentPage + 1);
                      }
                    }}
                    className="
                      h-6
                      min-w-6
                      rounded
                      border
                      border-slate-200
                      px-2
                      text-[8px]
                      text-slate-500
                    "
                  >
                    <span>Next</span>
                  </Pagination.Next>
                </Pagination.Item>

              </Pagination.Content>
            </Pagination>
          </Table.Footer>

        </Table>
      </div>
    </section>
    </main>
  );
}

export default AuditLogs;