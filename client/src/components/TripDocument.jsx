import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../assets/logo.png";
import moment from "moment";

function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();
}

function formatCurrency(value) {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const TripDocument = () => {
  const data = {
    success: true,
    message: "Thành công",
    data: {
      _id: "666c8f071e2004960361e001",
      tripName: "Đi mũi né",
      city: "Phan Thiết",
      startDate: "2024-06-14T17:00:00.000Z",
      endDate: "2024-06-17T17:00:00.000Z",
      image:
        "https://firebasestorage.googleapis.com/v0/b/smarttour-mern.appspot.com/o/17183905073270pmur6o37k81695657447223.jpg?alt=media&token=bce2e597-3af3-4a0e-bffe-7e7bf9277812",
      plans: [
        {
          _id: "666c8f351e2004960361e01d",
          type: "activity",
          planName: "Vui chơi Hòn Rơm",
          estimatedPrice: 50000,
          actualPrice: 15000,
          startDate: "2024-06-14T17:00:00.000Z",
          endDate: "2024-06-14T17:00:00.000Z",
          startTime: "01:42",
          endTime: "13:42",
          startAddress: "Mũi Né, Phan Thiet, Bình Thuận",
          info: "Hòn Rơm là tên một núi nhỏ vẫn còn hoang sơ nằm tại ấp Long Sơn, phường Mũi Né, TP. Phan Thiết. Du khách nên đến Hòn Rơm vào sáng sớm hoặc chiều tà để ngắm bình minh, hoàng hôn. Đây cũng là điểm cắm trại lý tưởng để đốt lửa trại về đêm hoặc ngắm trăng sao. Cụm bãi tắm ở Hòn Rơm sóng êm, không có đá ngầm và nước trong xanh, bạn có thể hỏi đường đến Hòn Rơm 1, Hòn Rơm 2 hoặc bãi Thuỳ Trang để tắm biển.",
          createdAt: "2024-06-14T18:43:01.333Z",
          updatedAt: "2024-09-09T07:40:03.818Z",
          __v: 0,
          endAddress: "Mũi Né, Phan Thiet, Bình Thuận",
        },
        {
          _id: "666c8f821e2004960361e040",
          type: "lodging",
          planName: "Phương Bình House",
          estimatedPrice: 600000,
          actualPrice: 1000000,
          startDate: "2024-06-14T17:00:00.000Z",
          endDate: "2024-06-15T17:00:00.000Z",
          startTime: "01:43",
          endTime: "01:43",
          startAddress:
            "Hẻm 118 Đường Trần Hưng Đạo, Dương Tơ, Phú Quốc, Kiên Giang",
          info: "Bao ăn đầy đủ",
          phone: "036500345",
          web: "https://vnexpress.net/",
          email: "vnexpresszz@gmail.com",
          number: "B6",
          describe: "view biển, sạch sẽ",
          createdAt: "2024-06-14T18:44:18.373Z",
          updatedAt: "2024-06-14T18:44:18.373Z",
          __v: 0,
        },
        {
          _id: "667d8733583e3d29fd8a40c4",
          type: "car",
          planName: "Đại lý Sơn Hà",
          estimatedPrice: 500000,
          actualPrice: 600000,
          startDate: "2024-06-14T17:00:00.000Z",
          endDate: "2024-06-15T17:00:00.000Z",
          startTime: "22:36",
          endTime: "22:36",
          startAddress: "56 ",
          endAddress: "56 ",
          info: null,
          phone: null,
          web: null,
          email: null,
          service: "Thuê xe tự lái",
          describe: "Xe toyota, màu trắng",
          form: "Xe 4 chỗ (Sedan)",
          createdAt: "2024-06-27T15:37:23.197Z",
          updatedAt: "2024-06-27T15:37:23.197Z",
          __v: 0,
        },
      ],
      user: {
        _id: "665c440d3234f9c54aacb73b",
        name: "Dung Ngo",
        image:
          "https://lh3.googleusercontent.com/a/ACg8ocLNRRO4O5myRPbREpseZGatywLwNIP6F81DY89Gbl2-ue66I18=s96-c",
      },
      status: true,
      total: "1 người lớn",
      description: "mô ta",
      hashtag: ["hot", "new"],
      receivedPoints: true,
      createdAt: "2024-06-14T18:42:15.177Z",
      updatedAt: "2025-01-13T08:37:44.291Z",
      __v: 3,
    },
  };

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },
    titleContainer: { flexDirection: "row", marginTop: 24 },
    logo: { width: 90 },
    reportTitle: { fontSize: 16, textAlign: "center" },
    // -----
    addressTitle: { fontSize: 11, fontStyle: "bold" },
    trip: { fontWeight: "bold", fontSize: 20 },
    tripNumber: { fontSize: 10, fontWeight: "bold", paddingTop: 5 },
    address: { fontWeight: 400, fontSize: 10 },
    // -----
    sectionTitle: { fontSize: 12, marginVertical: 10, fontWeight: "bold" },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      padding: 4,
    },
    tableRow: { flexDirection: "row", padding: 4 },
    tableCell: { flex: 1, borderBottom: "1px solid #ddd" },
  });

  const TripTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.reportTitle}>SMARTTOUR</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.trip}>Thong tin chuyen di</Text>
          <Text style={styles.tripNumber}>ID: {data.data._id} </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>
            Ten chuyen di: {removeAccents(data.data.tripName)}
          </Text>
          <Text style={styles.addressTitle}>
            Thanh pho : {removeAccents(data.data.city)}
          </Text>
        </View>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableCell}>Loai ke hoach</Text>
      <Text style={styles.tableCell}>Ten hoat dong</Text>
      <Text style={styles.tableCell}>Chi phi du kien</Text>
      <Text style={styles.tableCell}>Chi phi thuc te</Text>
    </View>
  );

  const TableBody = () =>
    data.data.plans.map((plan) => (
      <View style={styles.tableRow} key={plan._id}>
        <Text style={styles.tableCell}>{plan.type}</Text>
        <Text style={styles.tableCell}>{removeAccents(plan.planName)}</Text>
        <Text style={styles.tableCell}>
          {formatCurrency(plan.estimatedPrice)}
        </Text>
        <Text style={styles.tableCell}>{formatCurrency(plan.actualPrice)}</Text>
      </View>
    ));

  return (
    <Document>
      <Page style={styles.page}>
        <TripTitle />
        <Address />
        <Text style={styles.sectionTitle}>Ke hoach</Text>
        <TableHead />
        <TableBody />
      </Page>
    </Document>
  );
};

export default TripDocument;
