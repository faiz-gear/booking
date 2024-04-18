import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  // getPaginationRowModel,
  useReactTable,
  type TableOptions,
  type PaginationState
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import {} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowCount: number
  defaultPagination?: PaginationState
  onPaginationChange: TableOptions<TData>['onPaginationChange']
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  defaultPagination,
  onPaginationChange
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>(
    defaultPagination ?? {
      pageIndex: 0, //initial page index
      pageSize: 2 //default page size
    }
  )

  const table = useReactTable({
    data,
    columns,
    rowCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: (pagination) => {
      setPagination(pagination)
      onPaginationChange?.(pagination)
    }
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="text-xs text-muted-foreground">
          正在显示
          <strong>
            {pagination.pageIndex * pagination.pageSize + 1}-{pagination.pageSize * pagination.pageIndex + data.length}
          </strong>
          条 共<strong> {rowCount} </strong> 条
        </div>
        <div className="!ml-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table.getCanPreviousPage() && table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table.getCanPreviousPage() && table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table.getCanNextPage() && table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table.getCanNextPage() && table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
