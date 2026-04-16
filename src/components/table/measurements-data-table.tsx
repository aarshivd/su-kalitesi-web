'use client'

import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMeasurements } from '@/hooks/use-measurements'
import { formatDateTimeTR, formatNumber } from '@/lib/format'
import { getSeverity } from '@/lib/water-quality'
import { SEVERITY_CLASSES } from '@/lib/constants/palette'
import { cn } from '@/lib/utils'
import { ExportButtons } from './export-buttons'
import type { MeasurementWithDevice } from '@/lib/queries/measurements'

function Cell({
  value,
  parameter,
  digits = 2,
}: {
  value: number | null
  parameter: string
  digits?: number
}) {
  if (value == null) return <span className="text-muted-foreground">—</span>
  const sev = getSeverity(parameter, value)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tabular-nums',
        SEVERITY_CLASSES[sev].badge
      )}
    >
      {formatNumber(value, { maximumFractionDigits: digits, minimumFractionDigits: digits })}
    </span>
  )
}

export function MeasurementsDataTable() {
  const { data, isLoading } = useMeasurements({ limit: 1000 })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<MeasurementWithDevice>[]>(
    () => [
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Zaman <ArrowUpDown className="size-3" />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums">{formatDateTimeTR(getValue<string>())}</span>
        ),
      },
      {
        id: 'device',
        accessorFn: (row) => row.devices?.device_name ?? '',
        header: 'Cihaz',
        cell: ({ getValue }) => (
          <span className="text-sm font-medium">{getValue<string>() || '—'}</span>
        ),
      },
      {
        accessorKey: 'ph',
        header: 'pH',
        cell: ({ getValue }) => <Cell value={getValue<number | null>()} parameter="ph" />,
      },
      {
        accessorKey: 'tds',
        header: 'TDS',
        cell: ({ getValue }) => (
          <Cell value={getValue<number | null>()} parameter="tds" digits={0} />
        ),
      },
      {
        accessorKey: 'turbidity',
        header: 'Bulanıklık',
        cell: ({ getValue }) => (
          <Cell value={getValue<number | null>()} parameter="turbidity" digits={1} />
        ),
      },
      {
        accessorKey: 'temperature',
        header: 'Sıcaklık',
        cell: ({ getValue }) => (
          <Cell value={getValue<number | null>()} parameter="temperature" digits={1} />
        ),
      },
      {
        accessorKey: 'battery_voltage',
        header: 'Pil',
        cell: ({ getValue }) => (
          <Cell value={getValue<number | null>()} parameter="battery_voltage" digits={2} />
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 100 } },
  })

  const exportRows = useMemo(
    () =>
      (data ?? []).map((m) => ({
        timestamp: m.timestamp,
        device: m.devices?.device_name ?? '',
        ph: m.ph,
        tds: m.tds,
        turbidity: m.turbidity,
        temperature: m.temperature,
        battery_voltage: m.battery_voltage,
      })),
    [data]
  )

  if (isLoading) return <Skeleton className="h-[500px] rounded-xl" />

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cihaz ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <ExportButtons data={exportRows} filenameBase="aquatrack-olcumler" />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1} ·{' '}
          {table.getFilteredRowModel().rows.length} kayıt
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
