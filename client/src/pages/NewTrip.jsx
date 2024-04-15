import {
  Button,
  Select,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
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
    <>
      <p
        className={`${
          theme ? "text-white" : "text-slate-700"
        } text-lg pb-1 font-semibold `}
      >
        Create a Trip
      </p>
      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
        <TextInput
          withAsterisk
          label="tripName"
          className="w-full flex-1"
          placeholder="tripName"
          defaultValue={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
        <TextInput
          withAsterisk
          label="city"
          className="w-full flex-1"
          placeholder="city"
          defaultValue={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
        <DateInput
          clearable
          withAsterisk
          label="startDate"
          className="w-full flex-1"
          placeholder="startDate"
          minDate={new Date()}
          valueFormat="DD/MM/YYYY"
          value={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-5">
        <DateInput
          clearable
          withAsterisk
          label="endDate"
          className="w-full flex-1"
          placeholder="endDate"
          valueFormat="DD/MM/YYYY"
          minDate={startDate}
          value={endDate}
          onChange={(date) => setEndDate(date)}
        />
      </div>
      <div className="w-full flex flex-col md:flex-row flex-wrap gap-5 mb-4">
        <label
          className="flex items-center gap-1 text-sm font-medium cursor-pointer"
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
          <div>
            {fileURL && (
              <img src={fileURL || file} alt="" className="w-20 h-20" />
            )}
          </div>
        </label>
      </div>

      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className={theme ? "bg-blue-600" : "bg-black"}
          onClick={() => handleSubmit()}
        >
          Submit Trip
        </Button>
      </div>
      <div className="w-full flex items-end justify-end mt-6">
        <Link to="/trip">
          <Button className={theme ? "bg-blue-600" : "bg-black"}>Cancel</Button>
        </Link>
      </div>
      <LoadingClient visible={isPending} />
      <Toaster richColors />
    </>
  );
};

export default NewTrip;
