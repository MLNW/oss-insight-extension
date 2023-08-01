import pkg from "../package.json";

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
  icons: {
    16: "icons/circle-on.svg",
    19: "icons/circle-on.svg",
    32: "icons/circle-on.svg",
    38: "icons/circle-on.svg",
    48: "icons/circle-on.svg",
    64: "icons/circle-on.svg",
    96: "icons/circle-on.svg",
    128: "icons/circle-on.svg",
    256: "icons/circle-on.svg",
    512: "icons/circle-on.svg",
  },
  permissions: ["activeTab", "tabs"],
};

const browserAction = {
  default_icon: {
    16: "icons/circle-on.svg",
    19: "icons/circle-on.svg",
    32: "icons/circle-on.svg",
    38: "icons/circle-on.svg",
  },
};

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ["src/entries/background/script.ts"],
    persistent: true,
  },
  browser_action: browserAction,
  //permissions: [...sharedManifest.permissions, "*://*/*"],
  permissions: [...sharedManifest.permissions],
};

const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: "src/entries/background/serviceWorker.ts",
  },
  //host_permissions: ["*://*/*"],
};

export function getManifest(
  manifestVersion: number
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  };

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    };
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    };
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`
  );
}
