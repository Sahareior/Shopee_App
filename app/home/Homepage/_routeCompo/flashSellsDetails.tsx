import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import buble1 from "../../../../assets/images/flashSells/bubble 01.png";
import buble2 from "../../../../assets/images/flashSells/bubble 02.png";
import JustForYou from "../JustForYou";
import CommonScroller from "../CommonScroller";

const FlashDetails = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  });

  const [selectedDiscount, setSelectedDiscount] = useState("All");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prevTime, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const discounts = ["All", "55%", "10%", "20%", "30%", "40%", "60%", "70%"];

  return (
    <View style={styles.container}>
      {/* Background bubbles */}
      <Image style={styles.image1} source={buble1} />
      <Image style={styles.image2} source={buble2} />

      {/* Header with timer */}
      <View
        style={{
          paddingTop: 40,
          flexDirection: "row",
          justifyContent: "space-between",
          zIndex: 12,
          alignItems: "center",
          paddingHorizontal: 10,
          // paddingBottom:50
        }}
      >
        <View>
          <Text style={styles.title}>Flash Sells</Text>
          <Text style={styles.subtitle}>Choose Your Product</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.endsIn}>Ends in:</Text>
          <View style={styles.timer}>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>
                {timeLeft.hours.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timeLabel}>HRS</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>
                {timeLeft.minutes.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timeLabel}>MIN</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>
                {timeLeft.seconds.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timeLabel}>SEC</Text>
            </View>
          </View>
        </View>
      </View>

    <ScrollView>
          {/* Horizontal ScrollView for discounts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {discounts.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedDiscount(item)}
            style={[
              styles.discountButton,
              selectedDiscount === item && styles.activeDiscount,
            ]}
          >
            <Text
              style={[
                styles.discountText,
                selectedDiscount === item && styles.activeDiscountText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

         <JustForYou />
          <CommonScroller title={'Most Populer'} />
    </ScrollView>

    </View>
  );
};

export default FlashDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image1: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    width: "70%",
    height: 140,
  },
  image2: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "90%",
    height: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  timerContainer: {
    alignItems: "flex-end",
  },
  endsIn: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeUnit: {
    alignItems: "center",
    backgroundColor: "#e6e6e6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
  },
  timeNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  timeLabel: {
    fontSize: 8,
    color: "black",
    fontWeight: "600",
  },
  colon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4444",
    marginHorizontal: 4,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    marginTop:50,
    paddingHorizontal: 10,
    height:80,
    gap: 10,
    zIndex: 795,
  },
  discountButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activeDiscount: {
    backgroundColor: "#FF4444",
    borderColor: "#FF4444",
  },
  activeDiscountText: {
    color: "white",
  },
});
