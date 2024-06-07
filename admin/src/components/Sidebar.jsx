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
  IconThumbUp,
  IconCategory,
  IconPlaneDeparture,
  IconCreditCard,
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
  { icon: IconDeviceDesktopAnalytics, label: "Thống kê", to: "analytics" },
  { icon: IconCreditCard, label: "Thanh toán", to: "payments" },
  { icon: IconUsers, label: "Người dùng", to: "users" },
  { icon: IconPlaneDeparture, label: "Chuyến đi", to: "trips" },
  { icon: IconCalendarStats, label: "Bài viết", to: "contents" },
  { icon: IconCategory, label: "Danh mục", to: "categories" },
  { icon: IconThumbUp, label: "Người theo dõi", to: "followers" },
  { icon: IconClipboardText, label: "Liên hệ", to: "contacts" },
  { icon: IconLicense, label: "Chính sách", to: "policy" },
  { icon: IconSettings, label: "Cài đặt" },
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
      className="h-full flex flex-col gap-1 md:border-r border-slate-700 px-6 2xl:px-8 bg-cover bg-local"
      // className="h-full flex flex-col gap-1 md:border-r border-slate-700 px-6 2xl:px-14 bg-cover bg-local"
      // style={{
      //   backgroundImage:
      //     'linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url("https://img.freepik.com/free-vector/white-abstract-background-design_23-2148825582.jpg?w=996&t=st=1713022127~exp=1713022727~hmac=fb5f25de56e2b7eb4074283652119e107e7d6089e4a16bac769ae610a8e1b466")',
      // }}
    >
      <p className="py-2 pt-6 text-lg font-semibold ">Quản lý</p>
      <div>
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
