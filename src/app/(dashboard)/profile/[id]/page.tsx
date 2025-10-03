"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/composable/loading/loading";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/composable/upload/upload-image";
export default function EditProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/admin/profile/${id}`);
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading variant="circle" />;
  if (!profile) return <p>{t("profile.noProfile")}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="p-6 shadow-md">
        <CardHeader>
          <h2 className="text-xl font-bold">{t("profile.editProfile")}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t("profile.Image")}</Label>
              <ImageUpload
                label={t("profile.imageSize")}
                folder="/event/cover"
                value={profile.photoUrl ?? undefined}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProfile({ ...profile, photoUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.name")}</label>
              <Input
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.email")}</label>
              <Input
                type="email"
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.phone")}</label>
              <Input
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.username")}</label>
              <Input
                value={profile.username || ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t("profile.cancel")}
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? t("profile.saving") : t("profile.save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
