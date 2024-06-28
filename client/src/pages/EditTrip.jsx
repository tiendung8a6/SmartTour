import {
  Button,
  Select,
  TextInput,
  useMantineColorScheme,
  Grid,
  Switch,
  Autocomplete,
  TagsInput,
  Checkbox,
  Tooltip,
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
import cities from "../assets/cities.json";

// Hàm chuyển đổi chuỗi sang dạng không dấu
const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const optionsFilter = ({ options, search }) => {
  const searchWithoutDiacritics = removeDiacritics(search).toLowerCase().trim();
  const splittedSearch = searchWithoutDiacritics.split(" ");

  return options.filter((option) => {
    const labelWithoutDiacritics = removeDiacritics(option.label)
      .toLowerCase()
      .trim();
    const words = labelWithoutDiacritics.split(" ");

    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord))
    );
  });
};

//Hiển thị số lượng người tham gia
const generateOptions = (num) => {
  const options = [];
  for (let i = 1; i <= 10; i++) {
    options.push(`${i} người lớn`);
    for (let j = 1; j <= 10; j++) {
      options.push(`${i} người lớn và ${j} trẻ em`);
    }
  }
  return options;
};

const EditTrip = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const { colorScheme } = useMantineColorScheme();
  const { user, setIsLoading } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const [file, setFile] = useState("");
  const [tripName, setTripName] = useState(trip?.tripName);
  const [city, setCity] = useState(trip?.city);
  const [status, setStatus] = useState(trip?.status);
  const [total, setTotal] = useState(trip?.total);
  const [startDate, setStartDate] = useState(trip?.startDate);
  const [endDate, setEndDate] = useState(trip?.startDate);
  const [description, setDescription] = useState(trip?.description);
  const [hashtag, setHashtag] = useState(trip?.hashtag);
  const [receivedPoints, setReceivedPoints] = useState(trip?.receivedPoints);
  const [fileURL, setFileURL] = useState(trip?.image);
  const { isPending, mutate } = useUpdateTrip(toast, user?.token);
  const cityOptions = cities.map((cityData) => cityData.city);
  //Biến kiểm tra Điều kiện Token và My Trips
  const isUserValid = user?.user?._id === trip?.user?._id;
  const [isLoadingTrip, setIsLoadingTrip] = useState(true); // Thêm biến state mới

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
      setStatus(data?.status); // Cập nhật giá trị
      setTotal(data?.total); // Cập nhật giá trị
      setDescription(data?.description); // Cập nhật giá trị
      setHashtag(data?.hashtag); // Cập nhật giá trị
      setReceivedPoints(data?.receivedPoints); // Cập nhật giá trị
      let startDateObject = new Date(data?.startDate);
      setStartDate(startDateObject);
      let setEndDateObject = new Date(data?.endDate);
      setEndDate(setEndDateObject);
      setFileURL(data?.image);
      setIsLoadingTrip(false); //Đánh dấu rằng đã tải xong dữ liệu
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
      setIsLoadingTrip(false); // Đánh dấu rằng đã tải xong dữ liệu
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [id]);

  const handTripNameChange = (event) => {
    setTripName(event.target.value);
  };

  const handCityChange = (value) => {
    setCity(value);
  };

  const handTotalChange = (value) => {
    setTotal(value);
  };

  const handStatusChange = (event) => {
    setStatus(event.target.checked);
  };

  const handDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handHashtagChange = (value) => {
    setHashtag(value);
  };

  const handleSubmit = async () => {
    if (!tripName) {
      toast.error("Vui lòng nhập tên chuyến đi.");
      return;
    }
    if (!city) {
      toast.error("Vui lòng nhập tên thành phố.");
      return;
    }
    if (!total) {
      toast.error("Vui lòng nhập số lượng người tham gia.");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu.");
      return;
    }
    if (!endDate) {
      toast.error("Vui lòng chọn ngày kết thúc.");
      return;
    }
    if (endDate < startDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    if (!fileURL) {
      toast.error("Vui lòng tải lên hình ảnh.");
      return;
    }
    if (status) {
      if (!description) {
        toast.error("Vui lòng nhập mô tả cho chuyến đi.");
        return;
      }
      if (!hashtag.length) {
        toast.error("Vui lòng nhập tag nổi bật.");
        return;
      }
    }
    setIsLoading(true);
    mutate({
      id: trip._id,
      tripName,
      image: fileURL,
      city,
      total,
      status,
      startDate,
      endDate,
      description,
      hashtag,
    });
  };

  //Bổ xung check điều kiện Đăng nhập và Đúng kế hoạch của tôi
  if (isLoadingTrip) {
    return null;
  }
  if (!user?.token) {
    return (
      <div className="w-full h-full py-[100px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-500">404</h1>
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Đã có lỗi xảy ra
          </p>
          <p className="mt-4 text-gray-500 font-medium dark:text-gray-300">
            Vui lòng đăng nhập.
          </p>
          <Link
            to="/sign-in"
            className="mt-6 inline-block rounded bg-sky-600 px-5 py-3 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  } else if (!isUserValid) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">
          Đây không phải kế hoạch của bạn
        </span>
      </div>
    );
  }

  return (
    <div className="px-[100px] ">
      <p className="text-slate-700 text-lg pb-1 font-semibold dark:text-white ">
        Chỉnh Sửa Chuyến Đi
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <p className="dark:text-gray-400">
            Lập kế hoạch chuyến đi là bước đầu tiên để khám phá những điều mới
            mẻ và tạo ra những kỷ niệm đáng nhớ.
          </p>

          <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Tên chuyến đi"
              className="w-full flex-1"
              placeholder="Nhập tên chuyến đi"
              value={tripName}
              onChange={handTripNameChange}
            />
          </div>

          <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <Autocomplete
              withAsterisk
              label="Thành phố"
              className="w-full flex-1"
              placeholder="Nhập tên thành Phố"
              data={cityOptions}
              value={city}
              onChange={handCityChange}
              filter={optionsFilter}
            />
          </div>
          <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <Autocomplete
              withAsterisk
              label="Số lượng người tham gia"
              className="w-full flex-1"
              placeholder="Nhập số lượng thành viên tham gia"
              onChange={handTotalChange}
              value={total}
              limit={51}
              data={generateOptions(total)}
            />
          </div>
          <Grid className="mt-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày bắt đầu"
                  className="w-full flex-1"
                  placeholder="Chọn ngày bắt đầu"
                  minDate={new Date()}
                  valueFormat="DD/MM/YYYY"
                  value={startDate}
                  defaultValue={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5">
                <DateInput
                  leftSection={
                    <IconCalendarEvent className="text-[#107ac5]" size={24} />
                  }
                  clearable
                  withAsterisk
                  label="Ngày kết thúc"
                  className="w-full flex-1"
                  placeholder="Chọn ngày kết thúc"
                  valueFormat="DD/MM/YYYY"
                  minDate={startDate}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </Grid.Col>
          </Grid>
          <div className="dark:text-gray-300 w-full flex items-end justify-start mt-2">
            <Switch
              color="indigo"
              label="Công khai chuyển đi"
              checked={status}
              onChange={handStatusChange}
            />
          </div>
          {status && (
            <>
              <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
                <TextInput
                  withAsterisk
                  label="Mô tả"
                  className="w-full flex-1"
                  placeholder="Nhập mô tả cho chuyến đi"
                  value={description}
                  onChange={handDescriptionChange}
                />
              </div>
              <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
                <TagsInput
                  withAsterisk
                  label="Tag nổi bật"
                  className="w-full flex-1"
                  placeholder="Nhấn Enter để xác nhận"
                  splitChars={[",", " ", "|"]}
                  value={hashtag}
                  onChange={handHashtagChange}
                />
              </div>

              <div className="w-full flex flex-col dark:text-gray-300 md:flex-row flex-wrap gap-5 mb-5 mt-6">
                <Tooltip
                  multiline
                  w={220}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label="Tự động cập nhật khi chuyến đi này được công khai"
                >
                  <Checkbox
                    checked={receivedPoints}
                    disabled
                    label="Nhận điểm thưởng công khai chuyến đi"
                  />
                </Tooltip>
              </div>
            </>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3, lg: 3 }} offset={0.5}>
          <div className="w-full  flex-col md:flex-row flex-wrap gap-5 mb-4">
            <div>
              {fileURL && (
                <img src={fileURL || file} alt="" className="w-fit h-[250px]" />
              )}
            </div>
            <label
              className="flex dark:text-gray-300 gap-1 text-sm font-medium cursor-pointer mt-6 "
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
              <span className="dark:text-gray-300">Hình ảnh</span>
              <span className="text-rose-500 mr-[10px]">*</span>
            </label>
          </div>
        </Grid.Col>
      </Grid>

      <div className="flex justify-start gap-3 pt-5 mb-8 mt-[-20px]">
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

export default EditTrip;
