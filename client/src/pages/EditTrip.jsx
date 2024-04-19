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
import { useUpdateTrip } from "../hooks/client-hook";
import useStore from "../store";
import { uploadFile } from "../utils";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { getSingleTrip } from "../utils/apiCalls";

const NewTrip = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  const { colorScheme } = useMantineColorScheme();
  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const [file, setFile] = useState("");
  const [tripName, setTripName] = useState(trip?.tripName);
  const [city, setCity] = useState(trip?.city);
  const [startDate, setStartDate] = useState(trip?.startDate);
  const [endDate, setEndDate] = useState(trip?.startDate);

  const [fileURL, setFileURL] = useState(trip?.image);
  const { isPending, mutate } = useUpdateTrip(toast, user?.token);

  const theme = colorScheme === "dark";

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  const fetchTrip = async () => {
    try {
      const data = await getSingleTrip(id);

      setTrip(data || []);
      setTripName(data?.tripName);
      setCity(data?.city); // Cập nhật giá trị
      let startDateObject = new Date(data?.startDate);
      setStartDate(startDateObject);
      let setEndDateObject = new Date(data?.endDate);
      setEndDate(setEndDateObject);
      setFileURL(data?.image);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const handTripNameChange = (event) => {
    setTripName(event.target.value);
  };

  const handCityChange = (event) => {
    setCity(event.target.value);
  };

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
      id: trip._id,
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
        Chỉnh Sửa Chuyến Đi
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <p>
            Lập kế hoạch chuyến đi là bước đầu tiên để khám phá những điều mới
            mẻ và tạo ra những kỷ niệm đáng nhớ.
          </p>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Tên Chuyến Đi"
              className="w-full flex-1"
              placeholder="Tên Chuyến Đi"
              value={tripName}
              onChange={handTripNameChange}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Thành Phố"
              className="w-full flex-1"
              placeholder="Thành Phố"
              value={city}
              onChange={handCityChange}
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
                  defaultValue={startDate}
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
          <Link to="/trip">
            <Button variant="outline" color="Red" size="md" radius="md">
              Hủy
            </Button>
          </Link>
        </div>

        <div className=" flex items-end justify-start mt-6">
          <Button
            variant="filled"
            color="indigo"
            size="md"
            radius="md"
            onClick={() => handleSubmit()}
          >
            Lưu
          </Button>
        </div>
      </div>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default NewTrip;
