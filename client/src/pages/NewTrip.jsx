import {
  Button,
  Select,
  TextInput,
  useMantineColorScheme,
  Grid,
  Switch,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BiImages } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { LoadingClient } from "../components";
import { useCreateTrip } from "../hooks/client-hook";
import useStore from "../store";
import { uploadFile } from "../utils";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const NewTrip = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreateTrip(toast, user?.token);
  const [file, setFile] = useState("");
  const [tripName, setTripName] = useState(null);
  const [city, setCity] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fileURL, setFileURL] = useState(null);

  const theme = colorScheme === "dark";

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  const handleSubmit = async () => {
    if (!tripName) {
      toast.error("tripName is required.");
      return;
    }
    if (!city) {
      toast.error("city is required.");
      return;
    }
    if (!startDate) {
      toast.error("startDate is required.");
      return;
    }
    if (!endDate) {
      toast.error("endDate is required.");
      return;
    }
    if (!fileURL) {
      toast.error("Please upload an image.");
      return;
    }

    mutate({
      tripName,
      image: fileURL,
      city,
      startDate,
      endDate,
    });
  };

  return (
    <div className="px-[100px] ">
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-lg pb-1 font-semibold `}
      >
        Thêm Chuyến Đi
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <p>
            Add a trip manually below or forward your confirmation emails to
            plans@tripit.com, and we'll create the trip for you.
          </p>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Tên Chuyến Đi"
              className="w-full flex-1"
              placeholder="Tên Chuyến Đi"
              defaultValue={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Thành Phố"
              className="w-full flex-1"
              placeholder="Thành Phố"
              defaultValue={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <Grid className="mt-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày Bắt Đầu"
                  className="w-full flex-1"
                  placeholder="Ngày Bắt Đầu"
                  minDate={new Date()}
                  valueFormat="DD/MM/YYYY"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày Kết Thúc"
                  className="w-full flex-1"
                  placeholder="Ngày Kết Thúc"
                  valueFormat="DD/MM/YYYY"
                  minDate={startDate}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }} offset={0.5}>
          <div className="w-full  flex-col md:flex-row flex-wrap gap-5 mb-4">
            <div>
              {fileURL && (
                <img src={fileURL || file} alt="" className="w-fit h-[250px]" />
              )}
            </div>
            <label
              className="flex  gap-1 text-sm font-medium cursor-pointer mt-6 "
              htmlFor="imgUpload"
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="imgUpload"
                data-max-size="5120"
                accept=".jpg, .png, .jpeg"
              />
              <BiImages />
              <span>Image</span>
              <span className="text-rose-500 mr-[10px]">*</span>
            </label>
          </div>
        </Grid.Col>
      </Grid>

      <div className="w-full flex items-end justify-start mt-6">
        <Switch color="indigo" label="Công Khai chuyển đi" />
      </div>
      <div className="flex justify-start gap-3">
        <div className=" flex items-end justify-start mt-6">
          <Button
            variant="light"
            color="indigo"
            size="md"
            radius="md"
            onClick={() => handleSubmit()}
          >
            Lưu
          </Button>
        </div>

        <div className=" flex items-end justify-start mt-6">
          <Link to="/trip">
            <Button variant="outline" color="Red" size="md" radius="md">
              Hủy
            </Button>
          </Link>
        </div>
      </div>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default NewTrip;
