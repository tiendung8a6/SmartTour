import {
  Button,
  Select,
  TextInput,
  useMantineColorScheme,
  Grid,
  Switch,
  Autocomplete,
  TagsInput,
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
import cities from "../assets/cities.json";
import { getUser } from "../utils/apiCalls";

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

const NewTrip = () => {
  const { colorScheme } = useMantineColorScheme();

  const { user, setIsLoading } = useStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { isPending, mutate } = useCreateTrip(toast, user?.token);
  const [file, setFile] = useState("");
  const [tripName, setTripName] = useState(null);
  const [city, setCity] = useState("");
  const [total, setTotal] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState(false);
  const [description, setDescription] = useState(null);
  const [hashtag, setHashtag] = useState([]);
  const [fileURL, setFileURL] = useState(null);
  const theme = colorScheme === "dark";
  //Gọi Danh sách city từ Json
  const cityOptions = cities.map((cityData) => cityData.city);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  //TRUY VẤN DỮ NGƯỜI DÙNG --> Cập nhật Real-Time POINT
  const fetchUser = async () => {
    try {
      const data = await getUser(user?.user?._id);

      setUserInfo(data || []);
    } catch (error) {
      console.error("Error fetching trip or popular content:", error);
    } finally {
    }
  };
  useEffect(() => {
    if (user?.user?._id) {
      fetchUser();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [user?.user?._id]);

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
    if (userInfo?.points < 20) {
      toast.error("Bạn không có đủ điểm để tạo chuyến đi.");
      return;
    }
    setIsLoading(true);
    mutate({
      tripName,
      image: fileURL,
      city,
      startDate,
      endDate,
      status,
      total,
      description,
      hashtag,
    });
  };

  return (
    <div className="px-[100px] ">
      <p className="text-slate-700 text-lg pb-1 font-semibold dark:text-white ">
        Thêm Chuyến Đi
      </p>
      <br />

      <Grid className="">
        <Grid.Col span={{ base: 12, md: 7, lg: 7 }}>
          <p className="dark:text-gray-400">
            Lập kế hoạch chuyến đi là bước đầu tiên để khám phá những điều mới
            mẻ và tạo ra những kỷ niệm đáng nhớ.
          </p>

          <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <TextInput
              withAsterisk
              label="Tên chuyến đi"
              className="w-full flex-1"
              placeholder="Nhập tên chuyến đi"
              defaultValue={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <Autocomplete
              withAsterisk
              label="Thành phố"
              className="w-full flex-1"
              placeholder="Nhập tên thành Phố"
              data={cityOptions}
              value={city}
              onChange={(value) => setCity(value)}
              filter={optionsFilter}
            />
          </div>
          <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
            <Autocomplete
              withAsterisk
              label="Số lượng người tham gia"
              className="w-full flex-1"
              placeholder="Nhập số lượng thành viên tham gia"
              value={total}
              onChange={(value) => setTotal(value)}
              limit={51}
              data={generateOptions(total)}
            />
          </div>
          <Grid className="mt-6">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
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
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
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
              onChange={(e) => setStatus(e.target.checked ? true : false)}
            />
          </div>
          {status && (
            <>
              <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
                <TextInput
                  withAsterisk
                  label="Mô tả"
                  className="w-full flex-1"
                  placeholder="Nhập mô tả cho chuyến đi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="dark:text-gray-300 w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5 mt-6">
                <TagsInput
                  withAsterisk
                  label="Tag nổi bật"
                  className="w-full flex-1"
                  placeholder="Nhấn Enter để xác nhận"
                  splitChars={[",", " ", "|"]}
                  value={hashtag}
                  onChange={setHashtag}
                />
              </div>
            </>
          )}

          <div className=" justify-start items-center text-sm text-gray-500 pt-6">
            <span className="mr-1 font-medium text-red-600  items-center">
              Điều khoản:
            </span>
            <span className="dark:text-gray-400 items-center">
              Việc lập kế hoạch chuyến đi sẽ khiến bạn bị trừ 20 điểm thưởng,
              nhưng bạn sẽ nhận lại được 5 điểm thưởng khi công khai chuyến đi.
              Để biết rõ hơn hãy xem{" "}
            </span>
            <span className="ml-auto text-sm font-semibold text-sky-600 underline decoration-2">
              <Link to="/policy" target="_blank">
                {" "}
                Chính sách và Điều khoản
              </Link>
            </span>
            <span className=" items-center"> của chúng tôi.</span>
          </div>
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
            Tạo
          </Button>
        </div>
      </div>

      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default NewTrip;
