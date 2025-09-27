"use client";
import { Event } from "../data/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  LayoutDashboard,
  PencilIcon,
  Calendar1Icon,
  MapPin,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/date";
import { TrashIcon, MoreVerticalIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
export default function EventCard({ event }: { event: Event }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(t("EventPage.message.delete_success"));
        router.refresh();
      } else {
        toast.error(t("EventPage.message.delete_error"));
      }
    } catch (error) {
      toast.error(t("EventPage.message.delete_error"));
    }
  };

  return (
    <div className="border bg-white rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}

        <h3 className="text-xl font-bold mb-2 text-[#FDAE33]">{event.name}</h3>

        {event.type && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-2 capitalize">
            {event.type}
          </span>
        )}

        <p className="text-gray-700 mb-2">
          {event.description || t("EventPage.no_description")}
        </p>

        {(event.location || event.startTime || event.endTime) && (
          <div className="text-sm text-gray-500">
            {event.location && (
              <p>
                <span className="align-middle">
                  <MapPin className="w-4 h-4 inline" />
                </span>{" "}
                <span className="align-middle">{event.location}</span>
              </p>
            )}
            <p>
              <span className="align-middle">
                <Calendar1Icon className="w-4 h-4 inline" />
              </span>{" "}
              <span className="align-middle">
                {formatDate(event.startTime)} - {formatDate(event.endTime)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Edit button */}
      <div className="mt-4 flex justify-end gap-3">
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = `/event/${event.id}`)}
          >
            <LayoutDashboard />
            {t("EventPage.dashboard")}
          </Button>
        </div>
        <div className="mt-4 flex justify-end ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="!bg-gray-200 !border-gray-200 !text-gray-800 hover:!bg-gray-300 hover:!text-gray-900 transition-colors duration-150"
              >
                <MoreVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* Edit */}
              <DropdownMenuItem
                onClick={() =>
                  (window.location.href = `/event/edit/${event.id}`)
                }
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                {t("EventPage.edit")}
              </DropdownMenuItem>

              {/* Delete */}
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} // ⬅️ keep menu open so dialog can show
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                    {t("EventPage.delete")}
                  </DropdownMenuItem>
                }
                title={t("EventPage.message.delete_title")}
                description={t("EventPage.message.delete_description")}
                onConfirm={() => deleteEvent(event.id)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
