"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  Plus,
  Edit3,
  Check,
  X,
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Phone,
  Shield,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserPlan, Plan } from "@/interfaces/plan";
import { Role } from "@/enums/roles";
import { Loading } from "@/components/composable/loading/loading";
import { useTranslation } from "react-i18next";
interface UserProfile {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  role: string;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  phone_verified: boolean;
  phone_verified_at?: string | null;
  telegramId?: string | null;
  createdAt: string;
  updatedAt: string;
  events?: any[];
  userPlan?: UserPlan[];
}

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const { t } = useTranslation("common");
  const [planLimits, setPlanLimits] = useState({
    limit_guests: 0,
    limit_template: 0,
    limit_export_excel: false,
  });
  const [editingUserPlan, setEditingUserPlan] = useState<UserPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/admin/user/${id}`);
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userResult = await userRes.json();
        setUser(userResult.data);

        // Fetch available plans
        const plansRes = await fetch("/api/admin/plan");
        if (plansRes.ok) {
          const plansResult = await plansRes.json();
          setPlans(plansResult.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleAssignPlan = async () => {
    if (!selectedPlan || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/user/${user.id}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
          ...planLimits,
        }),
      });

      if (!res.ok) throw new Error("Failed to assign plan");

      // Refresh user data
      const userRes = await fetch(`/api/admin/user/${id}`);
      if (userRes.ok) {
        const userResult = await userRes.json();
        setUser(userResult.data);
      }

      setPlanDialogOpen(false);
      setSelectedPlan("");
      setPlanLimits({
        limit_guests: 0,
        limit_template: 0,
        limit_export_excel: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editingUserPlan || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/user/${user.id}/plan/${editingUserPlan.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(planLimits),
        }
      );

      if (!res.ok) throw new Error("Failed to update plan");

      // Refresh user data
      const userRes = await fetch(`/api/admin/user/${id}`);
      if (userRes.ok) {
        const userResult = await userRes.json();
        setUser(userResult.data);
      }

      setEditPlanDialogOpen(false);
      setEditingUserPlan(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePlan = async (userPlanId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/admin/user/${user.id}/plan/${userPlanId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove plan");

      // Refresh user data
      const userRes = await fetch(`/api/admin/user/${id}`);
      if (userRes.ok) {
        const userResult = await userRes.json();
        setUser(userResult.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditDialog = (userPlan: UserPlan) => {
    setEditingUserPlan(userPlan);
    setPlanLimits({
      limit_guests: userPlan.limit_guests,
      limit_template: userPlan.limit_template,
      limit_export_excel: userPlan.limit_export_excel,
    });
    setEditPlanDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading variant="circle" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("user.detail.notFoundTitle")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("user.detail.notFoundMessage")}
            </p>
            <Link href="/user">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("user.detail.backToUsers")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/user">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("user.detail.back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("user.detail.title")}
            </h1>
            <p className="text-muted-foreground">{t("user.detail.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl || "/placeholder.svg"}
                      alt={
                        user.name || user.username || t("user.detail.noName")
                      }
                      className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {user.name || t("user.detail.noName")}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t("user.detail.contactInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={t("user.detail.username")}
                  value={user.username}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t("user.detail.phone")}
                  value={user.phone}
                />
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={t("user.detail.email")}
                  value={user.email}
                />
                <InfoItem
                  icon={<Shield className="h-4 w-4" />}
                  label={t("user.detail.role")}
                  value={
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("user.detail.accountDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t("user.detail.created")}
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label={t("user.detail.lastUpdated")}
                  value={new Date(user.updatedAt).toLocaleDateString()}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t("user.detail.phoneVerified")}
                  value={
                    <Badge
                      variant={user.phone_verified ? "default" : "secondary"}
                    >
                      {user.phone_verified
                        ? t("user.detail.verified")
                        : t("user.detail.notVerified")}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Plans and Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Management */}

            {user.role == Role.USER && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Plan Management
                    </CardTitle>
                    <Dialog
                      open={planDialogOpen}
                      onOpenChange={setPlanDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("user.detail.assignPlan")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {" "}
                            {t("user.detail.assignPlanTitle")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("user.detail.assignPlanDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan">
                              {t("user.detail.plan")}
                            </Label>
                            <Select
                              value={selectedPlan}
                              onValueChange={setSelectedPlan}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("user.detail.selectPlan")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {plans.map((plan) => (
                                  <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name}{" "}
                                    {plan.price && `($${plan.price})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guests">
                                {t("user.detail.guestLimit")}
                              </Label>
                              <Input
                                id="guests"
                                type="number"
                                value={planLimits.limit_guests}
                                onChange={(e) =>
                                  setPlanLimits({
                                    ...planLimits,
                                    limit_guests:
                                      Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="templates">
                                {t("user.detail.templateLimit")}
                              </Label>
                              <Input
                                id="templates"
                                type="number"
                                value={planLimits.limit_template}
                                onChange={(e) =>
                                  setPlanLimits({
                                    ...planLimits,
                                    limit_template:
                                      Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="excel">
                              {t("user.detail.excelExport")}
                            </Label>
                            <Switch
                              id="excel"
                              checked={planLimits.limit_export_excel}
                              onCheckedChange={(checked) =>
                                setPlanLimits({
                                  ...planLimits,
                                  limit_export_excel: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleAssignPlan}
                            disabled={!selectedPlan || submitting}
                          >
                            {submitting && (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            )}
                            {t("user.detail.assignPlan")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.userPlan && user.userPlan.length > 0 ? (
                    <div className="space-y-4">
                      {user.userPlan.map((userPlan) => (
                        <div
                          key={userPlan.id}
                          className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-semibold text-lg">
                                  {userPlan.plan.name}
                                </h4>
                                {userPlan.plan.price && (
                                  <Badge variant="outline">
                                    ${userPlan.plan.price}
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    <span className="font-medium">
                                      {t("user.detail.guests")}:
                                    </span>{" "}
                                    {userPlan.limit_guests}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    <span className="font-medium">
                                      Templates:
                                    </span>{" "}
                                    {userPlan.limit_template}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {userPlan.limit_export_excel ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm">
                                    <span className="font-medium">
                                      {t("user.detail.excelExport")}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Assigned:{" "}
                                {new Date(
                                  userPlan.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(userPlan)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemovePlan(userPlan.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t("user.detail.noPlans")}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t("user.detail.noPlansDescription")}
                      </p>
                      <Dialog
                        open={planDialogOpen}
                        onOpenChange={setPlanDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            {t("user.detail.assignPlan")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {t("user.detail.assignPlanTitle")}
                            </DialogTitle>
                            <DialogDescription>
                              {t("user.detail.assignPlanDescription")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="plan">
                                {t("user.detail.plan")}
                              </Label>
                              <Select
                                value={selectedPlan}
                                onValueChange={setSelectedPlan}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("user.detail.selectPlan")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                      {plan.name}{" "}
                                      {plan.price && `($${plan.price})`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="guests">
                                  {t("user.detail.guestLimit")}
                                </Label>
                                <Input
                                  id="guests"
                                  type="number"
                                  value={planLimits.limit_guests}
                                  onChange={(e) =>
                                    setPlanLimits({
                                      ...planLimits,
                                      limit_guests:
                                        Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="templates">
                                  {t("user.detail.templateLimit")}
                                </Label>
                                <Input
                                  id="templates"
                                  type="number"
                                  value={planLimits.limit_template}
                                  onChange={(e) =>
                                    setPlanLimits({
                                      ...planLimits,
                                      limit_template:
                                        Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="excel">
                                {t("user.detail.excelExport")}
                              </Label>
                              <Switch
                                id="excel"
                                checked={planLimits.limit_export_excel}
                                onCheckedChange={(checked) =>
                                  setPlanLimits({
                                    ...planLimits,
                                    limit_export_excel: checked,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleAssignPlan}
                              disabled={!selectedPlan || submitting}
                            >
                              {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              )}
                              {t("user.detail.assignPlan")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t("user.detail.recentEvents")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.events && user.events.length > 0 ? (
                  <div className="space-y-4">
                    {user.events.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              event.image ||
                              "/placeholder.svg?height=60&width=60"
                            }
                            alt={event.name}
                            className="w-15 h-15 rounded-lg object-cover border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-base mb-1">
                                  {event.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <span className="capitalize">
                                    {event.type}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      event.startTime
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {event.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge
                                  variant={
                                    event.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {event.status}
                                </Badge>
                                <Link href={`/event/edit/${event.id}`}>
                                  <Button size="sm" variant="outline">
                                    {t("user.detail.viewEvent")}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {" "}
                      {t("user.detail.noEvents")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("user.detail.noEventsDescription")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Plan Dialog */}
        <Dialog open={editPlanDialogOpen} onOpenChange={setEditPlanDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("user.detail.editPlanTitle")}</DialogTitle>
              <DialogDescription>
                {t("user.detail.editPlanDescription", {
                  planName: editingUserPlan ? editingUserPlan.plan.name : "",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-guests">
                    {t("user.detail.guestLimit")}
                  </Label>
                  <Input
                    id="edit-guests"
                    type="number"
                    value={planLimits.limit_guests}
                    onChange={(e) =>
                      setPlanLimits({
                        ...planLimits,
                        limit_guests: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-templates">
                    {t("user.detail.templateLimit")}
                  </Label>
                  <Input
                    id="edit-templates"
                    type="number"
                    value={planLimits.limit_template}
                    onChange={(e) =>
                      setPlanLimits({
                        ...planLimits,
                        limit_template: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-excel">
                  {t("user.detail.excelExport")}
                </Label>
                <Switch
                  id="edit-excel"
                  checked={planLimits.limit_export_excel}
                  onCheckedChange={(checked) =>
                    setPlanLimits({
                      ...planLimits,
                      limit_export_excel: checked,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditPlan} disabled={submitting}>
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {t("user.detail.updatePlan")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium">{value || "—"}</div>
      </div>
    </div>
  );
}
