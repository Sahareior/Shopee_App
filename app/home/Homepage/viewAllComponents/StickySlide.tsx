import StickySlider from "react-native-sticky-range-slider";
import { View } from "react-native";

export default function StickySlide() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StickySlider
        min={0}
        max={100}
        step={1}
        initialLowValue={20}
        initialHighValue={80}
        onLowValueChange={(value) => console.log(value)}
        onHighValueChange={(value) => console.log(value)}
        onChange={(value) => console.log(value)}
      />
    </View>
  );
}
