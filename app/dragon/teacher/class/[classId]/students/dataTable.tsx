"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuArrowUpDown, LuChevronDown } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentsByClassId } from "../../../../teacher/queries";
import Image from "next/image";
import { FiTrash } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClassDialog } from "../../../components/class-dialog";
import { removeStudentFromClass } from "./mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type StudentData = NonNullable<StudentsByClassId>[0];

export const columns: ColumnDef<StudentData>[] = [
  {
    id: "serialNumber",
    accessorKey: "",
    header: "S.No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: "userImage",
    accessorKey: "User.image",
    header: "",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original?.User.image!} />
        <AvatarFallback>
          <Image src="/chubbi.png" alt="User" width={30} height={30} />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "name",
    accessorKey: "User.name",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-inherit px-0 hover:bg-transparent hover:text-base-content"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.original?.User.name}</div>;
    },
  },
  {
    id: "email",
    accessorKey: "User.email",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-inherit px-0 hover:bg-transparent hover:text-base-content"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.original?.User.email}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original?.id;
      const classId = row.original?.classId;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <ClassDialog
                title="Delete Student"
                description="are you sure you want to delete this student?"
                action={() => removeStudentFromClass(id, classId!)}
                trigger={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-slate-600"
                  >
                    <FiTrash />
                  </Button>
                }
              />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-600 text-black">
              Delete Student
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

export function DataTable({ students }: { students: StudentData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Students by Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="pl-5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pl-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
