"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeStore } from "@/types/theme";
import ThemeCustomiserForm from "@/components/forms/ThemeCustomiserForm";
import ThemeCustomerBreadCrumb from "@/components/widgets/ThemeCustomiserBreadcrumb";
import SavedThemes from "@/components/widgets/SavedThemes";

const CustomiseThemePage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [editingThemeId, setEditingThemeId] = useState<ThemeStore["id"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCurrentThemeToEdit() {
    setIsLoading(true);
    const id = searchParams.get("id");
    if (id) {
      setEditingThemeId(id);
    } else {
      setEditingThemeId(null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCurrentThemeToEdit();
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Theme breadcrumb */}
      <ThemeCustomerBreadCrumb isEditingTheme={editingThemeId} />
      {/* Theme Customiser */}
      <ThemeCustomiserForm
        editingThemeId={editingThemeId}
        onFailedToLoad={() => {
          router.push("/customise-theme");
        }}
        onSaveOrUpdateSuccess={() => {
          setEditingThemeId(null);
          router.push("/dashboard");
        }}
      />
      {/* Saved Themes */}
      {!editingThemeId && !isLoading && <SavedThemes />}
    </div>
  );
};

export default CustomiseThemePage;
