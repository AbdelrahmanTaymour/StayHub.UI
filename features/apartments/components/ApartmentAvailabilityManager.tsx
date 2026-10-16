"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { useApartmentAvailability } from "@/features/apartments/hooks/useApartmentAvailability"
import { useCreateAvailabilityBlock } from "@/features/apartments/hooks/useCreateAvailabilityBlock"
import { useDeleteAvailabilityBlock } from "@/features/apartments/hooks/useDeleteAvailabilityBlock"
import { isRangeFree } from "@/features/apartments/utils/availability"
import { ActiveAvailabilityBlocksList } from "./ActiveAvailabilityBlocksList"
import { AvailabilityCalendar } from "./AvailabilityCalendar"
import { CreateAvailabilityBlockDialog } from "./CreateAvailabilityBlockDialog"
import { RemoveAvailabilityBlockDialog } from "./RemoveAvailabilityBlockDialog"
import { AvailabilityBlockResponse } from "@/lib/api/types/apartments"

export function ApartmentAvailabilityManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.availability")
  const { data, isPending } = useApartmentAvailability(apartmentId)
  const { mutate: createBlock, isPending: isCreating } =
    useCreateAvailabilityBlock(apartmentId)
  const { mutate: removeBlock, isPending: isRemoving } =
    useDeleteAvailabilityBlock(apartmentId)

  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
  const [blockToRemove, setBlockToRemove] =
    useState<AvailabilityBlockResponse | null>(null)

  const blocks = data?.blocks ?? []
  const bookedRanges = data?.bookedRanges ?? []
  const today = new Date()

  function handleDayClick(date: Date) {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date)
      setSelectedEnd(null)
      return
    }

    const free = isRangeFree(selectedStart, date, blocks, bookedRanges, today)
    if (!free) {
      setSelectedStart(date)
      setSelectedEnd(null)
      return
    }

    const [start, end] =
      date < selectedStart ? [date, selectedStart] : [selectedStart, date]
    setSelectedStart(start)
    setSelectedEnd(end)
  }

  function clearSelection() {
    setSelectedStart(null)
    setSelectedEnd(null)
  }

  const pendingRange =
    selectedStart && selectedEnd
      ? { start: selectedStart, end: selectedEnd }
      : null

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-130 w-full rounded-xl lg:col-span-8" />
        <Skeleton className="h-64 w-full rounded-xl lg:col-span-4" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AvailabilityCalendar
            blocks={blocks}
            bookedRanges={bookedRanges}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            onDayClick={handleDayClick}
            onBlockClick={setBlockToRemove}
          />
        </div>

        <div className="lg:col-span-4">
          <ActiveAvailabilityBlocksList
            blocks={blocks}
            onSelect={setBlockToRemove}
          />
        </div>
      </div>

      <CreateAvailabilityBlockDialog
        range={pendingRange}
        isSaving={isCreating}
        onConfirm={(body) => {
          createBlock(body, {
            onSuccess: clearSelection,
            onError: clearSelection,
          })
        }}
        onCancel={clearSelection}
      />

      <RemoveAvailabilityBlockDialog
        block={blockToRemove}
        isDeleting={isRemoving}
        onConfirm={(blockId) =>
          removeBlock(blockId, { onSuccess: () => setBlockToRemove(null) })
        }
        onCancel={() => setBlockToRemove(null)}
      />
    </div>
  )
}
