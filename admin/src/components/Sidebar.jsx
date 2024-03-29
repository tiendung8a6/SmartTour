import {
  ActionIcon,
  Stack,
  Tooltip,
  UnstyledButton,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
  IconUsers,
  IconClipboardText,
  IconLicense,
  IconUserPlus,
  IconThumbUp,
} from "@tabler/icons-react";
import { BsPencilSquare } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
          active ? "bg-black text-white" : ""
        }`}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        {label}
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  // { icon: IconGauge, label: "Dashboard", to: "dashboard" },
  // { icon: IconDeviceDesktopAnalytics, label: "Analytics", to: "analytics" },
  { icon: IconUsers, label: "Users", to: "users" },
  { icon: IconUserPlus, label: "Add Admin", to: "create-admin" },
  { icon: IconCalendarStats, label: "Content", to: "contents" },
  { icon: BsPencilSquare, label: "Create Post", to: "write" },
  { icon: IconThumbUp, label: "Followers", to: "followers" },
  { icon: IconClipboardText, label: "Contacts", to: "contacts" },
  { icon: IconLicense, label: "Policy", to: "policy" },
  { icon: IconSettings, label: "Settings" },
];

const Sidebar = ({ close = () => {} }) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname?.slice(1);

  const handleClick = (to) => {
    close();
    navigate(to);
  };

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label + index}
      active={link.to === path}
      onClick={() => handleClick(link.to)}
    />
  ));

  return (
    <nav
      className={
        "h-full flex flex-col gap-1 md:border-r border-slate-700 px-6 2xl:px-14"
      }
    >
      <p className="py-2 pt-6 text-lg font-semibold ">NAVIGATION</p>
      <div className={""}>
        <Stack justify="center" gap={10}>
          {links}
        </Stack>
      </div>

      <ActionIcon
        onClick={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
        className="w-full rounded-full mt-10"
      >
        {colorScheme === "dark" ? (
          <IconSun stroke={1.5} />
        ) : (
          <IconMoon stroke={1.5} />
        )}
      </ActionIcon>
    </nav>
  );
};

export default Sidebar;
