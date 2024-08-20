import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import { SQLiteProvider } from "../providers/sqlite.provider"
import { expoDb } from "../database"

import { useColorScheme } from "@/hooks/useColorScheme"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { View } from "react-native"

const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const theme = useColorScheme() ?? "light"
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	})

	// TODO: fix this, how to use
	const DrizzleStudio = () => {
		useDrizzleStudio(expoDb)
		return <View></View>
	}

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<>
			{__DEV__ && <DrizzleStudio />}
			<ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
				<SQLiteProvider>
					<QueryClientProvider client={queryClient}>
						<Stack>
							<Stack.Screen name="index" options={{ headerShown: false }} />
						</Stack>
					</QueryClientProvider>
				</SQLiteProvider>
			</ThemeProvider>
		</>
	)
}
