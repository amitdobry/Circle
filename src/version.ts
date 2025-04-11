function generateLocalVersion(): string {
  const now = new Date();
  const iso = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `dev-${iso}-${time}`;
}

export const APP_VERSION =
  process.env.NODE_ENV === "development"
    ? generateLocalVersion()
    : "__VERSION_PLACEHOLDER__";
