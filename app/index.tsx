import { Pressable, TextInput, View, Text, ScrollView } from "react-native"
import * as schema from "@/database/schema"
import { db } from "@/database"
import { useEffect, useMemo, useState } from "react"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import ListItem from "@/components/ListItem"

export default function Index() {
	const { data } = useLiveQuery(db.select().from(schema.listItems)) as { data: schema.listItems[] }
	const [itemText, setItemText] = useState("")
	useEffect(() => {
		const run = async () => {
			const userData = await db.select().from(schema.user)
			if (userData.length === 0) {
				// we don't have a local user setup yet, let's create one
				db.insert(schema.user).values({}).run()
			}
		}
		run()
	}, [])

	const handleAdd = async () => {
		const userData = await db.select().from(schema.user)
		db.insert(schema.listItems).values({ userId: userData[0].id, title: itemText }).run()
		setItemText("")
	}

	const completedTasks = useMemo(() => data.filter((item) => !item.isCompleted), [data])
	const incompleteTasks = useMemo(() => data.filter((item) => item.isCompleted), [data])

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#333",
				paddingTop: 100,
				paddingHorizontal: 20,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
				<TextInput
					value={itemText}
					onChangeText={(value) => setItemText(value)}
					style={{
						flex: 1,
						padding: 10,
						marginRight: 10,
						borderRadius: 10,
						backgroundColor: "white",
						color: "black",
						fontSize: 24,
					}}
				/>
				<Pressable
					onPress={handleAdd}
					style={{ borderRadius: 10, backgroundColor: "#44aabb", padding: 10 }}
				>
					<Text style={{ color: "white", fontSize: 24 }}>Add</Text>
				</Pressable>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{completedTasks.map((item) => (
					<ListItem key={item.id} item={item} />
				))}
				{incompleteTasks.map((item) => (
					<ListItem key={item.id} item={item} />
				))}
			</ScrollView>
		</View>
	)
}
