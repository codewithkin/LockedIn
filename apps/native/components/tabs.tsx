import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { MotiView } from "moti";
import { TabView, SceneMap } from "react-native-tab-view";
import type { NavigationState, SceneRendererProps, Route } from "react-native-tab-view";
import { useThemeColor } from "heroui-native";

interface TabRoute extends Route {
  title: string;
  iconElement?: React.ReactNode;
}

interface TwitterTabsProps {
  routes: TabRoute[];
  scenes: { [key: string]: React.ComponentType<any> };
  initialIndex?: number;
  onTabChange?: (index: number, route: TabRoute) => void;
  tabBarStyle?: "underline" | "pill";
}

export function TwitterTabs({
  routes,
  scenes,
  initialIndex = 0,
  onTabChange,
  tabBarStyle = "underline",
}: TwitterTabsProps) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setIndex(newIndex);
      onTabChange?.(newIndex, routes[newIndex]);
    },
    [onTabChange, routes]
  );

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }
  ) => {
    if (tabBarStyle === "pill") {
      return (
        <View style={[styles.pillTabBar, { backgroundColor: mutedColor + "20" }]}>
          {routes.map((route, i) => {
            const isActive = index === i;
            return (
              <Pressable
                key={route.key}
                onPress={() => handleIndexChange(i)}
                style={styles.pillTab}
              >
                <MotiView
                  animate={{
                    backgroundColor: isActive ? backgroundColor : "transparent",
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ type: "timing", duration: 200 }}
                  style={styles.pillTabInner}
                >
                  {route.iconElement && <View style={styles.tabIcon}>{route.iconElement}</View>}
                  <Text
                    style={[
                      styles.pillTabText,
                      { color: isActive ? foregroundColor : mutedColor },
                    ]}
                  >
                    {route.title}
                  </Text>
                </MotiView>
              </Pressable>
            );
          })}
        </View>
      );
    }

    // Underline style (Twitter-like)
    return (
      <View style={styles.underlineTabBar}>
        {routes.map((route, i) => {
          const isActive = index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => handleIndexChange(i)}
              style={styles.underlineTab}
            >
              <View style={styles.underlineTabContent}>
                {route.iconElement && <View style={styles.tabIcon}>{route.iconElement}</View>}
                <Text
                  style={[
                    styles.underlineTabText,
                    {
                      color: isActive ? foregroundColor : mutedColor,
                      fontWeight: isActive ? "600" : "400",
                    },
                  ]}
                >
                  {route.title}
                </Text>
              </View>
              
              <MotiView
                animate={{
                  scaleX: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ type: "spring", damping: 20 }}
                style={[
                  styles.underlineIndicator,
                  { backgroundColor: accentColor },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderScene = SceneMap(scenes);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      style={styles.tabView}
    />
  );
}

// Simple tab bar component for inline use
interface SimpleTabBarProps {
  tabs: string[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  style?: "underline" | "pill";
}

export function SimpleTabBar({
  tabs,
  activeIndex,
  onTabChange,
  style = "pill",
}: SimpleTabBarProps) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");

  if (style === "pill") {
    return (
      <View style={[styles.pillTabBar, { backgroundColor: mutedColor + "20" }]}>
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(index)}
              style={styles.pillTab}
            >
              <MotiView
                animate={{
                  backgroundColor: isActive ? backgroundColor : "transparent",
                }}
                transition={{ type: "timing", duration: 200 }}
                style={styles.pillTabInner}
              >
                <Text
                  style={[
                    styles.pillTabText,
                    { color: isActive ? foregroundColor : mutedColor },
                  ]}
                >
                  {tab}
                </Text>
              </MotiView>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.underlineTabBar}>
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(index)}
            style={styles.underlineTab}
          >
            <Text
              style={[
                styles.underlineTabText,
                {
                  color: isActive ? foregroundColor : mutedColor,
                  fontWeight: isActive ? "600" : "400",
                },
              ]}
            >
              {tab}
            </Text>
            
            <MotiView
              animate={{
                scaleX: isActive ? 1 : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ type: "spring", damping: 20 }}
              style={[
                styles.underlineIndicator,
                { backgroundColor: accentColor },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  // Pill style
  pillTabBar: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  pillTab: {
    flex: 1,
  },
  pillTabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pillTabText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  // Underline style (Twitter)
  underlineTabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  underlineTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  underlineTabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  underlineTabText: {
    fontSize: 15,
  },
  underlineIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 2,
  },
  tabIcon: {
    marginRight: 6,
  },
});

export default TwitterTabs;
