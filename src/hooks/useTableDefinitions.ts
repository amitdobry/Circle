import { useEffect, useState } from "react";
import socket from "../socket/index";

export type TableDefinition = {
  tableId: string;
  name: string;
  icon: string;
  description: string;
  order: number;
};

export function useTableDefinitions() {
  const [tables, setTables] = useState<TableDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for table definitions from server
  useEffect(() => {
    socket.on("receive:tableDefinitions", (payload: TableDefinition[]) => {
      console.log(
        "[Client] Received tableDefinitions:",
        JSON.stringify(payload, null, 2),
      );
      setTables(payload);
      setLoading(false);
    });

    return () => {
      socket.off("receive:tableDefinitions");
    };
  }, []);

  // Function to request table definitions from server
  const fetchTableDefinitions = () => {
    console.log("[Client] Emitting request:tableDefinitions");
    socket.emit("request:tableDefinitions");
  };

  return { tables, loading, fetchTableDefinitions };
}
