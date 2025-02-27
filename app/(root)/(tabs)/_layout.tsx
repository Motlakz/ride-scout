import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";

// Define types for each icon library's valid names
type IoniconsName = ComponentProps<typeof Ionicons>["name"];
type MaterialIconsName = ComponentProps<typeof MaterialIcons>["name"];
type FontAwesome5Name = ComponentProps<typeof FontAwesome5>["name"];

// Create a union type based on the icon family
type IconProps =
  | {
      iconName: IoniconsName;
      iconFamily?: "Ionicons";
      focused: boolean;
      size?: number;
    }
  | {
      iconName: MaterialIconsName;
      iconFamily: "MaterialIcons";
      focused: boolean;
      size?: number;
    }
  | {
      iconName: FontAwesome5Name;
      iconFamily: "FontAwesome5";
      focused: boolean;
      size?: number;
    };

const TabIcon = ({
  iconName,
  iconFamily = "Ionicons",
  focused,
  size = 24,
}: IconProps) => {
  const gradientColors = focused
    ? (["#2193b0", "#6dd5ed"] as const)
    : (["transparent", "transparent"] as const);

  // Icon color - white for both states but with different opacity
  const iconColor = focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)";

  // Render appropriate icon based on the specified icon family
  const renderIcon = () => {
    switch (iconFamily) {
      case "Ionicons":
        return (
          <Ionicons
            name={iconName as IoniconsName}
            size={size}
            color={iconColor}
          />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons
            name={iconName as MaterialIconsName}
            size={size}
            color={iconColor}
          />
        );
      case "FontAwesome5":
        return (
          <FontAwesome5
            name={iconName as FontAwesome5Name}
            size={size}
            color={iconColor}
          />
        );
      default:
        return (
          <Ionicons
            name={iconName as IoniconsName}
            size={size}
            color={iconColor}
          />
        );
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <LinearGradient
        colors={gradientColors}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          elevation: focused ? 8 : 0,
          shadowColor: focused ? "#2193b0" : "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: focused ? 0.3 : 0,
          shadowRadius: 6,
        }}
      >
        {renderIcon()}

        {/* Subtle indicator dot below the active icon */}
        {focused && (
          <View
            style={{
              position: "absolute",
              bottom: -6,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1E293B", // Darker blue background
          borderRadius: 30,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 10,
          paddingTop: 10,
          paddingBottom: 10,
        },
        headerShown: false,
        tabBarItemStyle: {
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="home" iconFamily="Ionicons" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="car"
              iconFamily="FontAwesome5"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="chatbubble-ellipses"
              iconFamily="Ionicons"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="person-circle"
              iconFamily="Ionicons"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
