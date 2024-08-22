import { Pressable, TextInput, View, Text } from "react-native"
import * as schema from "@/database/schema"
import { db } from "@/database"
import { useEffect, useState } from "react"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { eq } from "drizzle-orm"

export default function Index() {
	const { data } = useLiveQuery(db.select().from(schema.listItems))
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

	const handleDelete = async (id: string) => {
		await db.delete(schema.listItems).where(eq(schema.listItems.id, id))
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<TextInput
				value={itemText}
				onChangeText={(value) => setItemText(value)}
				style={{ borderColor: "red", borderWidth: 1, width: 200, padding: 10 }}
			/>
			<Pressable onPress={handleAdd}>
				<Text>Add</Text>
			</Pressable>
			{data.map((item) => (
				<View key={item.id} style={{ flexDirection: "row" }}>
					<Text style={{ marginRight: 10 }}>{item.title}</Text>
					<Pressable onPress={() => handleDelete(item.id)}>
						<Text>X</Text>
					</Pressable>
				</View>
			))}
		</View>
	)
}
