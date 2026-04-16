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
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getAlertHistoryClient, type AlertHistoryWithDevice } from '@/lib/queries/alerts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SeverityBadge } from './severity-badge'
import { formatDateTimeTR, formatNumber } from '@/lib/format'
import { getParameterLabel } from '@/lib/water-quality'
import { ExportButtons } from '@/components/table/export-buttons'

const SEVERITY_ALL = '__all__'

export function AlertHistoryTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['alerts', 'history', 200],
    queryFn: () => getAlertHistoryClient(createClient(), 200),
  })

  const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }])
  const [severity, setSeverity] = useState<string>(SEVERITY_ALL)

  const filtered = useMemo(() => {
    if (severity === SEVERITY_ALL) return data ?? []
    return (data ?? []).filter((a) => a.severity === severity)
  }, [data, severity])

  const columns = useMemo<ColumnDef<AlertHistoryWithDevice>[]>(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Zaman',
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums">{formatDateTimeTR(getValue<string>())}</span>
        ),
      },
      {
        id: 'device',
        accessorFn: (r) => r.devices?.device_name ?? '',
        header: 'Cihaz',
        cell: ({ getValue }) => (
          <span className="text-sm font-medium">{getValue<string>() || '—'}</span>
        ),
      },
      {
        accessorKey: 'parameter',
        header: 'Parametre',
        cell: ({ getValue }) => <span className="text-sm">{getParameterLabel(getValue<string>())}</span>,
      },
      {
        accessorKey: 'value',
        header: 'Değer',
        cell: ({ getValue }) => {
          const v = getValue<number | null>()
          return (
            <span className="tabular-nums text-sm">
              {v != null ? formatNumber(v) : '—'}
            </span>
          )
        },
      },
      {
        accessorKey: 'severity',
        header: 'Şiddet',
        cell: ({ getValue }) => <SeverityBadge severity={getValue<string>()} />,
      },
      {
        accessorKey: 'message',
        header: 'Mesaj',
        cell: ({ getValue }) => (
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {getValue<string | null>() ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'telegram_sent',
        header: 'Telegram',
        cell: ({ getValue }) =>
          getValue<boolean | null>() ? (
            <Check className="size-4 text-emerald-500" />
          ) : (
            <X className="size-4 text-muted-foreground" />
          ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  })

  if (isLoading) return <Skeleton className="h-[400px] rounded-xl" />

  const exportRows = filtered.map((a) => ({
    created_at: a.created_at,
    device: a.devices?.device_name ?? '',
    parameter: a.parameter,
    value: a.value,
    severity: a.severity,
    message: a.message,
    telegram_sent: a.telegram_sent,
  }))

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SEVERITY_ALL}>Tüm Şiddetler</SelectItem>
            <SelectItem value="critical">Kritik</SelectItem>
            <SelectItem value="warning">Uyarı</SelectItem>
            <SelectItem value="info">Bilgi</SelectItem>
          </SelectContent>
        </Select>
        <ExportButtons data={exportRows} filenameBase="aquatrack-alarmlar" />
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
                  Alarm yok
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
          {filtered.length} kayıt
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
