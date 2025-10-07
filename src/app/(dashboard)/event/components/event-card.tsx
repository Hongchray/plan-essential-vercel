"use client";
import { Event } from "@/interfaces/event";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  LayoutDashboard,
  PencilIcon,
  Calendar1Icon,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
        <div className="relative mb-4">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-40 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 15l-5-5L5 21"
                />
              </svg>
            </div>
          )}

          {event.type && (
            <span className="absolute top-2 left-2 bg-rose-300 text-black text-xs font-semibold rounded-2xl px-2.5 py-1.5 mb-2 capitalize  shadow-sm">
              {event.type}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 text-[#FDAE33]">{event.name}</h3>

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
                {formatDate(event.startTime)} {t("EventPage.at")}{" "}
                {event.eating_time}
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
