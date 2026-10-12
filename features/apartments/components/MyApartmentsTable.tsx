"use client"

import { flexRender, useTable } from "@tanstack/react-table"
import { useLocale } from "next-intl"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useApartmentColumns } from "./ApartmentsColumns"
import { MyApartmentsResponse } from "@/lib/api/types/apartments"
import { apartmentsTableFeatures } from "../utils/apartments-table-features"

interface MyApartmentsTableProps {
  data: MyApartmentsResponse[]
  emptyMessage: string
}

export function MyApartmentsTable({
  data,
  emptyMessage,
}: MyApartmentsTableProps) {
  const locale = useLocale()
  const columns = useApartmentColumns(locale)

  const table = useTable({
    features: apartmentsTableFeatures,
    data,
    columns,
    getRowId: (row) => row.id ?? crypto.randomUUID(),
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-medium tracking-wider text-foreground/70 uppercase"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/60">
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-foreground/70"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
