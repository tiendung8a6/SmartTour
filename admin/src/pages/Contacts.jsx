import { Pagination, Table, useMantineColorScheme } from "@mantine/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Loading } from "../components";
import { useContacts } from "../hooks/contacts_hook";
import useStore from "../store/store";
import { formatNumber, getInitials, updateURL } from "../utils";

const Contacts = () => {
  const { colorScheme } = useMantineColorScheme();

  // const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, mutate } = useContacts(toast);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const theme = colorScheme === "dark";

  const fetchData = () => {
    updateURL({ page, navigate, location });
    mutate(page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="w-full flex flex-col">
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-lg pb-1 font-semibold `}
      >
        Contacts (
        <span className="text-sm">
          {"Total: " + data?.totalContacts + " records"}
        </span>
        )
      </p>

      <Table highlightOnHover withTableBorder className="flex-1">
        <Table.Thead>
          <Table.Tr className="bg-black text-white">
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Information</Table.Th>
            <Table.Th>Send Date</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data?.data?.map(
            ({ _id, name, email, phone, message, createdAt }) => (
              <Table.Tr
                key={_id}
                className={theme ? "text-gray-400" : `text-slate-600`}
              >
                <Table.Td>{name}</Table.Td>
                <Table.Td>{email}</Table.Td>

                <Table.Td>{phone}</Table.Td>
                <Table.Td>{message}</Table.Td>

                <Table.Td>{moment(createdAt).fromNow()}</Table.Td>
              </Table.Tr>
            )
          )}
        </Table.Tbody>

        {data?.data?.length < 1 && (
          <Table.Caption>No Data Found.</Table.Caption>
        )}
      </Table>

      <div className="w-full mt-5 flex items-center justify-center">
        <Pagination
          total={data?.numOfPage}
          siblings={3}
          defaultValue={data?.page}
          // gap={10}
          color="gray"
          withEdges
          onChange={(value) => setPage(value)}
        />
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Contacts;
