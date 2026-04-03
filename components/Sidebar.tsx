"use client";

import { useState } from "react";

// ── Figma icon assets ─────────────────────────────────────────────────────────
const imgVector   = "https://www.figma.com/api/mcp/asset/3e37995e-711c-4a5c-b0a5-ff4127b02355"; // chevron
const imgFord     = "https://www.figma.com/api/mcp/asset/f7fc584d-af15-4365-9ed8-4691b224847b"; // ford wordmark
const imgLogos    = "https://www.figma.com/api/mcp/asset/aaeecc8b-8f2b-44a0-b7ed-df5f71aca70f"; // avatar
const imgUnion    = "https://www.figma.com/api/mcp/asset/6ef5c3b2-2d27-4cf4-ba23-fa241d81ff38"; // search icon
const imgUnion1   = "https://www.figma.com/api/mcp/asset/63ba1f93-d880-4d5a-84b8-4396b8a71092"; // overview
const imgVector2  = "https://www.figma.com/api/mcp/asset/f27947f4-0d2b-462e-b22f-5fa617142a01"; // prompts part1
const imgVector3  = "https://www.figma.com/api/mcp/asset/bfe4b8d9-d71e-4a90-8f3d-1ae817376d9a"; // prompts part2
const imgVector4  = "https://www.figma.com/api/mcp/asset/f4259132-d558-4663-b193-7d1637e9a607"; // prompts part3
const imgVector5  = "https://www.figma.com/api/mcp/asset/3f216c07-311e-405c-9d25-037c895f1180"; // prompts part4
const imgVector8  = "https://www.figma.com/api/mcp/asset/b8895bd6-1726-414b-acbe-98b191d67e0e"; // globe/domains
const imgUnion2   = "https://www.figma.com/api/mcp/asset/f989de6f-00df-44d5-b67a-719bcc642412"; // urls/link
const imgEllipse9 = "https://www.figma.com/api/mcp/asset/0f78209a-fd9f-4cda-b54f-ebc5068c7c98"; // url dot
const imgVector9  = "https://www.figma.com/api/mcp/asset/ca7f6799-12f4-4a6d-9a85-4d5c64da72f3"; // insights part1
const imgVector10 = "https://www.figma.com/api/mcp/asset/a064245b-1a32-4281-9832-6b6644d5d043"; // insights part2
const imgUnion3   = "https://www.figma.com/api/mcp/asset/defec53b-1595-4321-bfa2-de951b64cd32"; // perception/owned
const imgVector11 = "https://www.figma.com/api/mcp/asset/717d79ec-175b-4914-81b7-b969214805f2"; // preferences part1
const imgVector12 = "https://www.figma.com/api/mcp/asset/d78c9e3b-35e2-44a8-a6df-d42914cfe2e0"; // preferences part2
const imgUnion4   = "https://www.figma.com/api/mcp/asset/ca751bbd-0e8d-4e83-94b0-0d1c725eb7d5"; // impact
const imgVector13 = "https://www.figma.com/api/mcp/asset/0b9b93d0-b537-4ddd-a180-b0e689282609"; // crawl insights
const imgVector14 = "https://www.figma.com/api/mcp/asset/7b87cb9b-4ab3-4e83-bf66-ff3ac0d9be5c"; // crawlability part1
const imgVector15 = "https://www.figma.com/api/mcp/asset/0c692fc2-a5d5-4bb3-a903-c0c24faf4cb1"; // crawlability part2
const imgVector16 = "https://www.figma.com/api/mcp/asset/f653ae65-bed5-437a-a19d-505a14560d94"; // crawlability part3
const imgVector17 = "https://www.figma.com/api/mcp/asset/d1fdd115-aeee-499d-936d-19c15dd05004"; // tags
const imgVector18 = "https://www.figma.com/api/mcp/asset/b2ac48ed-144b-45ff-a1db-0361e294d659"; // knowledge base
const imgVector6  = "https://www.figma.com/api/mcp/asset/f16eeca3-e38b-4764-9577-6fd115acf27e"; // earned part1
const imgVector7  = "https://www.figma.com/api/mcp/asset/8f5338f2-3d95-48ad-90b6-5f4e29a0821d"; // earned part2

// ── Icon component ─────────────────────────────────────────────────────────────
function Icon({ src, size = 16 }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

// Composite icons (multi-vector)
function PromptIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <img src={imgVector2} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector3} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector4} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector5} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

function InsightIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <img src={imgVector9}  width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector10} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

function PreferencesIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <img src={imgVector11} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector12} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

function EarnedIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <img src={imgVector6} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector7} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

function CrawlabilityIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <img src={imgVector14} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector15} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
      <img src={imgVector16} width={16} height={16} alt="" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

// ── Nav data ──────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: React.ReactNode;
  dot?: boolean;
}
interface NavSection {
  title: string;
  beta?: boolean;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "General",
    items: [
      { label: "Overview",  icon: <Icon src={imgUnion1} /> },
      { label: "Prompts",   icon: <PromptIcon /> },
    ],
  },
  {
    title: "Sources",
    items: [
      { label: "Domains", icon: <Icon src={imgVector8} /> },
      { label: "URLs",    icon: <Icon src={imgUnion2} />, dot: true },
    ],
  },
  {
    title: "Brand",
    items: [
      { label: "Insights",    icon: <InsightIcon /> },
      { label: "Perception",  icon: <Icon src={imgUnion3} /> },
      { label: "Preferences", icon: <PreferencesIcon /> },
    ],
  },
  {
    title: "Actions",
    beta: true,
    items: [
      { label: "Earned", icon: <EarnedIcon /> },
      { label: "Owned",  icon: <Icon src={imgUnion3} /> },
      { label: "Impact", icon: <Icon src={imgUnion4} /> },
    ],
  },
  {
    title: "Agent analytics",
    items: [
      { label: "Crawl insights", icon: <Icon src={imgVector13} /> },
      { label: "Crawlability",   icon: <CrawlabilityIcon /> },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Tags", icon: <Icon src={imgVector17} /> },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function SidebarTop() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8 }}>
      {/* Company row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 8px", borderRadius: 8 }}>
        {/* Ford logo */}
        <div
          style={{
            width: 16, height: 16, borderRadius: 4.8,
            backgroundColor: "#00357d",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}
        >
          <img src={imgFord} width={16} height={16} alt="Ford" style={{ display: "block" }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#171717", letterSpacing: "-0.112px", flex: 1, lineHeight: 1 }}>
          Ford
        </span>
        {/* Chevron rotated -90° */}
        <img
          src={imgVector}
          width={16} height={16}
          alt=""
          style={{ display: "block", transform: "rotate(-90deg)", opacity: 0.4, flexShrink: 0 }}
        />
      </div>

      {/* Search bar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 4,
          height: 28, padding: "6px 8px", borderRadius: 8,
          backgroundColor: "#fdfdfd",
          boxShadow: "0px 1px 3px 0px rgba(23,23,23,0.05), 0px 0px 0px 1px rgba(23,23,23,0.08)",
        }}
      >
        <img src={imgUnion} width={16} height={16} alt="" style={{ display: "block", flexShrink: 0, opacity: 0.4 }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(23,23,23,0.4)", flex: 1, lineHeight: "20px", letterSpacing: "-0.112px" }}>
          Search...
        </span>
        <kbd
          style={{
            fontSize: 11, fontWeight: 500, color: "rgba(23,23,23,0.4)",
            backgroundColor: "rgba(23,23,23,0.03)",
            border: "1px solid rgba(23,23,23,0.08)",
            borderRadius: 4, padding: "0 4px", lineHeight: "16px",
            fontFamily: "inherit",
          }}
        >
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function NavGroup({
  section,
  activeItem,
  onSelect,
}: {
  section: NavSection;
  activeItem: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Section label row */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 4,
          height: 28, padding: "0 8px", borderRadius: 8,
        }}
      >
        <span
          style={{
            fontSize: 13, fontWeight: 500, color: "rgba(23,23,23,0.4)",
            letterSpacing: "-0.065px", lineHeight: "18px", flex: 1,
          }}
        >
          {section.title}
        </span>
        {section.beta && (
          <span
            style={{
              fontSize: 11, fontWeight: 500, color: "rgba(23,23,23,0.64)",
              backgroundColor: "rgba(23,23,23,0.05)",
              border: "1px solid rgba(23,23,23,0.08)",
              borderRadius: 5, height: 18, padding: "0 4px",
              display: "inline-flex", alignItems: "center", lineHeight: "16px",
            }}
          >
            Beta
          </span>
        )}
      </div>

      {/* Nav items */}
      {section.items.map((item) => {
        const isActive = activeItem === item.label;
        return (
          <NavItem
            key={item.label}
            item={item}
            isActive={isActive}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

function NavItem({
  item,
  isActive,
  onSelect,
}: {
  item: NavItem;
  isActive: boolean;
  onSelect: (label: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(item.label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        height: 32, padding: "0 8px", borderRadius: 10,
        width: "100%", textAlign: "left", border: "none", cursor: "pointer",
        backgroundColor: isActive
          ? "rgba(23,23,23,0.06)"
          : hovered
          ? "rgba(23,23,23,0.04)"
          : "transparent",
        transition: "background-color 0.1s ease",
      }}
    >
      {item.icon}
      <span
        style={{
          fontSize: 14, fontWeight: 500, color: "#171717",
          letterSpacing: "-0.112px", lineHeight: "20px", flex: 1,
        }}
      >
        {item.label}
      </span>
      {item.dot && (
        <img src={imgEllipse9} width={6} height={6} alt="" style={{ display: "block", flexShrink: 0 }} />
      )}
    </button>
  );
}

function GetSetUpWidget() {
  return (
    <div
      style={{
        backgroundColor: "#fdfdfd",
        borderRadius: 16,
        padding: "8px 6px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxShadow:
          "0px 0px 0px 1px rgba(23,23,23,0.08), 0px 4px 6px -1px rgba(23,23,23,0.08), 0px 2px 4px -2px rgba(23,23,23,0.1)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 8px" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#171717", letterSpacing: "-0.112px", lineHeight: 1 }}>
          Get set up
        </span>
        <span style={{ fontSize: 16, fontWeight: 600, color: "rgba(23,23,23,0.28)", letterSpacing: "-0.176px", lineHeight: "24px" }}>
          ·
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(23,23,23,0.4)", letterSpacing: "-0.065px", lineHeight: "18px" }}>
          0/5
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 8px" }}>
        <div
          style={{
            height: 6, backgroundColor: "rgba(23,23,23,0.05)",
            borderRadius: 80, overflow: "hidden",
          }}
        >
          <div style={{ height: "100%", width: "0%", backgroundColor: "#2b7fff", borderRadius: 80 }} />
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0, padding: "0 8px",
          fontSize: 13, fontWeight: 500, color: "rgba(23,23,23,0.4)",
          letterSpacing: "-0.065px", lineHeight: "18px",
        }}
      >
        Include 3 topics with 3 prompts in each.
      </p>
    </div>
  );
}

function SidebarBottom() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const footerLinks = [
    { label: "Knowledge base", icon: <Icon src={imgVector18} /> },
    { label: "Settings",       icon: <PreferencesIcon /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Footer nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "0 8px" }}>
        {footerLinks.map((link) => (
          <button
            key={link.label}
            onMouseEnter={() => setHoveredItem(link.label)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 32, padding: "0 8px", borderRadius: 8,
              width: "100%", textAlign: "left", border: "none", cursor: "pointer",
              backgroundColor: hoveredItem === link.label ? "rgba(23,23,23,0.04)" : "transparent",
              transition: "background-color 0.1s ease",
            }}
          >
            {link.icon}
            <span style={{ fontSize: 14, fontWeight: 500, color: "#171717", letterSpacing: "-0.112px", lineHeight: "20px" }}>
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Get set up widget */}
      <div style={{ padding: "0 8px" }}>
        <GetSetUpWidget />
      </div>

      {/* Divider + user row */}
      <div style={{ borderTop: "1px solid rgba(23,23,23,0.05)" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 48, padding: "0 16px",
          }}
        >
          <img
            src={imgLogos}
            width={16} height={16}
            alt="Avatar"
            style={{ display: "block", borderRadius: "50%", flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#171717", letterSpacing: "-0.112px", lineHeight: 1 }}>
            John Doe
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <div
      style={{
        width: 224,
        height: "100%",
        backgroundColor: "rgba(23,23,23,0.03)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <SidebarTop />

      {/* Nav body */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            display: "flex", flexDirection: "column", gap: 8,
            padding: "4px 8px",
            overflowY: "auto", height: "100%",
          }}
        >
          {navSections.map((section) => (
            <NavGroup
              key={section.title}
              section={section}
              activeItem={activeItem}
              onSelect={setActiveItem}
            />
          ))}
        </div>

        {/* Bottom fade gradient */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 48, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(248,248,248,0), #f8f8f8)",
          }}
        />
      </div>

      {/* Footer */}
      <SidebarBottom />
    </div>
  );
}
