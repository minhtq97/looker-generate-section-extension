import { Box, Button } from "@looker/components";
import { ExtensionContext40 } from "@looker/extension-sdk-react";
import React, { useCallback, useContext, useEffect, useState } from "react";

// Helper to generate UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to get UUID from filters
function getUUIDFromFilters(
  dashboardFilters: Record<string, any>
): string | null {
  if (
    dashboardFilters &&
    ((dashboardFilters.uuid &&
      dashboardFilters.uuid !== "" &&
      dashboardFilters.uuid !== null &&
      dashboardFilters.uuid !== undefined) ||
      (dashboardFilters.UUID &&
        dashboardFilters.UUID !== "" &&
        dashboardFilters.UUID !== null &&
        dashboardFilters.UUID !== undefined))
  ) {
    return dashboardFilters.uuid || dashboardFilters.UUID;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const urlUuid = urlParams.get("UUID") || urlParams.get("uuid");
  if (
    urlUuid &&
    urlUuid !== "" &&
    urlUuid !== "null" &&
    urlUuid !== "undefined"
  ) {
    return urlUuid;
  }
  return null;
}

// Helper to generate dashboard URL with filters and UUID
function generateDashboardURLWithFiltersAndUUID(
  dashboardId: string,
  dashboardFilters: Record<string, any>,
  uuid: string
): string {
  const baseUrl = "https://lookerdev.zuelligpharma.com";
  const dashboardUrl = `${baseUrl}/dashboards/${dashboardId}`;
  const url = new URL(dashboardUrl);
  Object.entries(dashboardFilters).forEach(([key, value]) => {
    if (key && value && value !== "" && value !== "-NULL") {
      url.searchParams.set(key, String(value));
    }
  });
  url.searchParams.set("UUID", uuid);
  return url.toString();
}

const GenerateNewSectionButton: React.FC = () => {
  const { extensionSDK, tileHostData } = useContext(ExtensionContext40);
  const [hasValidUUID, setHasValidUUID] = useState(false);

  // Check if UUID exists and is valid
  useEffect(() => {
    const dashboardFilters = (tileHostData as any)?.dashboardFilters || {};
    const uuid = getUUIDFromFilters(dashboardFilters);
    const isValid = uuid !== null;
    setHasValidUUID(isValid);
  }, [tileHostData]);

  const handleClick = useCallback(async () => {
    const uuid = generateUUID();
    const currentDashboardId = tileHostData?.dashboardId?.toString();
    if (!currentDashboardId) {
      alert("Unable to determine current dashboard ID. Please try again.");
      return;
    }
    // Get current dashboard filters
    const dashboardFilters: Record<string, any> = {};
    if (tileHostData && (tileHostData as any).dashboardFilters) {
      Object.entries((tileHostData as any).dashboardFilters).forEach(
        ([key, value]) => {
          if (key && value && value !== "" && value !== "-NULL") {
            dashboardFilters[key] = value;
          }
        }
      );
    }
    const newUrl = generateDashboardURLWithFiltersAndUUID(
      currentDashboardId,
      dashboardFilters,
      uuid
    );
    console.log("Generated new section URL:", newUrl);
    try {
      if (
        extensionSDK &&
        typeof extensionSDK.openBrowserWindow === "function"
      ) {
        await extensionSDK.openBrowserWindow(newUrl, "_blank");
      } else {
        throw new Error("openBrowserWindow not available");
      }
    } catch (error) {
      console.error("Failed to open browser window:", error);
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(newUrl);
          alert(
            `URL copied to clipboard. Please open it in a new tab.\n\n${newUrl}`
          );
        } else {
          alert(
            `Please navigate to:\n\n${newUrl}\n\nCopy this URL and open it in a new tab.`
          );
        }
      } catch {
        alert(
          `Please navigate to:\n\n${newUrl}\n\nCopy this URL and open it in a new tab.`
        );
      }
    }
  }, [extensionSDK, tileHostData]);

  if (hasValidUUID) {
    return null;
  }

  return (
    <Box height="100%">
      <Button
        onClick={handleClick}
        width={200}
        mt="xlarge"
        style={{ marginTop: "0" }}
      >
        Generate New Section
      </Button>
    </Box>
  );
};

export default GenerateNewSectionButton;
